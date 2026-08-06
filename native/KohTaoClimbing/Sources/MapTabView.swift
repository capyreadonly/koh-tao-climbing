import MapKit
import SwiftUI

/// Serves the bundled OSM tiles (Resources/Tiles/{z}/{x}/{y}.png, zooms 10–15) to MapKit.
/// loadTile reads straight from the bundle, so the base map works with zero network.
final class OfflineTileOverlay: MKTileOverlay {
    private let baseURL: URL

    /// The bundled tiles cover Koh Tao + Nang Yuan (lat 10.03–10.16, lng 99.79–99.90).
    static let coverageRect: MKMapRect = {
        let nw = MKMapPoint(CLLocationCoordinate2D(latitude: 10.16, longitude: 99.79))
        let se = MKMapPoint(CLLocationCoordinate2D(latitude: 10.03, longitude: 99.90))
        return MKMapRect(x: nw.x, y: nw.y, width: se.x - nw.x, height: se.y - nw.y)
    }()

    init() {
        let base = Bundle.main.resourceURL!.appendingPathComponent("AppResources/Tiles", isDirectory: true)
        baseURL = base
        super.init(urlTemplate: base.appendingPathComponent("{z}/{x}/{y}.png").absoluteString)
        tileSize = CGSize(width: 256, height: 256)
        minimumZ = 10
        // Bundled tiles only exist to z15, but declare a higher maximumZ so MapKit
        // keeps requesting tiles when zooming deeper; loadTile clamps those to the
        // z15 ancestor (upscaled) instead of showing an empty grid.
        maximumZ = 20
        // Our tiles fully cover the island — never fetch Apple's base map underneath.
        canReplaceMapContent = true
    }

    /// Tells MapKit tiles exist only here, so it doesn't even request outside cells.
    override var boundingMapRect: MKMapRect { Self.coverageRect }

    override func loadTile(at path: MKTileOverlayPath, result: @escaping (Data?, (any Error)?) -> Void) {
        // Tiles exist only to z15 — clamp deeper zooms to the z15 ancestor so deep
        // zoom shows upscaled tiles rather than 404ing into an empty grid.
        var z = path.z, x = path.x, y = path.y
        if z > 15 {
            let shift = z - 15
            x >>= shift
            y >>= shift
            z = 15
        } else if z < minimumZ {
            result(nil, NSError(domain: "KohTaoClimbing.OfflineTiles", code: 404))
            return
        }
        let url = baseURL.appendingPathComponent("\(z)/\(x)/\(y).png")
        if let data = try? Data(contentsOf: url) {
            result(data, nil)
        } else {
            // Outside the tile set (region) — MapKit leaves those cells empty.
            result(nil, NSError(domain: "KohTaoClimbing.OfflineTiles", code: 404))
        }
    }
}

final class CragAnnotation: NSObject, MKAnnotation {
    let crag: Crag
    dynamic var coordinate: CLLocationCoordinate2D
    var title: String? { crag.name }
    var subtitle: String? { crag.grades }

    init(crag: Crag, coordinate: CLLocationCoordinate2D) {
        self.crag = crag
        self.coordinate = coordinate
        super.init()
    }
}

/// MKMapView wrapped for SwiftUI: bundled offline tiles, island-constrained camera,
/// crag markers tinted by climbing style. Marker callouts carry an info button that
/// pushes the crag detail; camera moves stream back so the tab can persist them.
struct OfflineMapView: UIViewRepresentable {
    /// Island center; tiles cover lat 10.03–10.16, lng 99.79–99.90.
    static let islandCenter = CLLocationCoordinate2D(latitude: 10.095, longitude: 99.840)
    static let defaultDistance: CLLocationDistance = 17_000

    struct CameraState: Equatable {
        var center: CLLocationCoordinate2D
        var distance: CLLocationDistance
        static func == (a: CameraState, b: CameraState) -> Bool {
            a.center.latitude == b.center.latitude && a.center.longitude == b.center.longitude && a.distance == b.distance
        }
    }

    let crags: [Crag]
    /// Restored camera from the last session; nil means the default whole-island view.
    var initialCamera: CameraState?
    /// Testing/screenshot hook: pre-select this crag's annotation (shows its callout).
    var selectSlug: String?
    /// Testing hook: force this camera on creation (also exercises persistence
    /// write-back, since region-change callbacks persist whatever is applied).
    var debugCameraOverride: CameraState?
    var onSelectCrag: (Crag) -> Void
    var onCameraChange: (CameraState) -> Void
    /// True while the visible area reaches beyond the bundled tiles.
    var onCoverageChange: (Bool) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onSelectCrag: onSelectCrag, onCameraChange: onCameraChange, onCoverageChange: onCoverageChange)
    }

    func makeUIView(context: Context) -> MKMapView {
        let mapView = MKMapView()
        mapView.delegate = context.coordinator
        mapView.mapType = .standard
        mapView.showsCompass = true
        mapView.showsScale = true
        mapView.pointOfInterestFilter = .excludingAll
        mapView.isRotateEnabled = false
        mapView.isPitchEnabled = false

        mapView.addOverlay(OfflineTileOverlay(), level: .aboveLabels)

        let camera = debugCameraOverride ?? initialCamera ?? CameraState(center: Self.islandCenter, distance: Self.defaultDistance)
        mapView.setCamera(
            MKMapCamera(lookingAtCenter: camera.center, fromDistance: camera.distance, pitch: 0, heading: 0),
            animated: false
        )
        // Keep the camera on the island — tiles don't exist beyond it.
        mapView.cameraBoundary = MKMapView.CameraBoundary(
            coordinateRegion: MKCoordinateRegion(center: Self.islandCenter, latitudinalMeters: 20_000, longitudinalMeters: 20_000)
        )
        mapView.cameraZoomRange = MKMapView.CameraZoomRange(minCenterCoordinateDistance: 1_500, maxCenterCoordinateDistance: 25_000)

        mapView.addAnnotations(crags.compactMap { crag in
            guard let coords = crag.coords else { return nil }
            return CragAnnotation(crag: crag, coordinate: CLLocationCoordinate2D(latitude: coords.lat, longitude: coords.lng))
        })
        if let selectSlug,
           let match = mapView.annotations.compactMap({ $0 as? CragAnnotation }).first(where: { $0.crag.slug == selectSlug }) {
            // Selection needs the view laid out first, so defer one runloop turn.
            DispatchQueue.main.async {
                mapView.selectAnnotation(match, animated: false)
            }
        }
        return mapView
    }

    func updateUIView(_ mapView: MKMapView, context: Context) {
        context.coordinator.onSelectCrag = onSelectCrag
        context.coordinator.onCameraChange = onCameraChange
        context.coordinator.onCoverageChange = onCoverageChange
    }

    @MainActor
    final class Coordinator: NSObject, MKMapViewDelegate {
        var onSelectCrag: (Crag) -> Void
        var onCameraChange: (CameraState) -> Void
        var onCoverageChange: (Bool) -> Void
        private var lastOutside = false

        init(onSelectCrag: @escaping (Crag) -> Void,
             onCameraChange: @escaping (CameraState) -> Void,
             onCoverageChange: @escaping (Bool) -> Void) {
            self.onSelectCrag = onSelectCrag
            self.onCameraChange = onCameraChange
            self.onCoverageChange = onCoverageChange
        }

        func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
            MKTileOverlayRenderer(overlay: overlay)
        }

        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            guard let cragAnnotation = annotation as? CragAnnotation else { return nil }
            let identifier = "crag"
            let view = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) as? MKMarkerAnnotationView
                ?? MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            view.annotation = annotation
            view.markerTintColor = UIColor(CragStyle.color(for: cragAnnotation.crag))
            view.glyphImage = UIImage(systemName: "figure.climbing")
            view.canShowCallout = true
            view.rightCalloutAccessoryView = UIButton(type: .detailDisclosure)
            return view
        }

        func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView,
                     calloutAccessoryControlTapped control: UIControl) {
            guard let cragAnnotation = view.annotation as? CragAnnotation else { return }
            mapView.deselectAnnotation(view.annotation, animated: true)
            onSelectCrag(cragAnnotation.crag)
        }

        func mapViewDidChangeVisibleRegion(_ mapView: MKMapView) {
            let camera = mapView.camera
            onCameraChange(CameraState(center: camera.centerCoordinate, distance: camera.centerCoordinateDistance))
            // Edge state: part of the screen shows beyond the bundled tiles.
            let padded = OfflineTileOverlay.coverageRect.insetBy(dx: -800, dy: -800)
            let outside = !padded.contains(mapView.visibleMapRect)
            if outside != lastOutside {
                lastOutside = outside
                onCoverageChange(outside)
            }
        }
    }
}

/// Map tab: full-bleed offline map. Marker callouts push the crag detail; a glass
/// button lists the crags that have no coordinates (and thus no map marker).
struct MapTabView: View {
    let store: DataStore
    @State private var path = NavigationPath()
    @State private var showingUnmappedCrags = MapTabView.debugShowUnmapped
    @State private var outsideCoverage = false
    // Camera persistence: 0/0/0 means "never moved — use the default view".
    @AppStorage("mapCameraLatitude") private var savedLatitude = 0.0
    @AppStorage("mapCameraLongitude") private var savedLongitude = 0.0
    @AppStorage("mapCameraDistance") private var savedDistance = 0.0

    // Testing/screenshot hooks: `-selectCrag meks-mountain` opens its callout,
    // `-showUnmapped` presents the no-marker crag list,
    // `-debugCamera <lat> <lng> <distance>` forces the initial camera.
    private static let debugSelectSlug: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-selectCrag"), i + 1 < args.count else { return nil }
        return args[i + 1]
    }()
    private static let debugShowUnmapped = ProcessInfo.processInfo.arguments.contains("-showUnmapped")
    private static let debugCamera: OfflineMapView.CameraState? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-debugCamera"), i + 3 < args.count,
              let lat = Double(args[i + 1]), let lng = Double(args[i + 2]), let dist = Double(args[i + 3])
        else { return nil }
        return OfflineMapView.CameraState(center: CLLocationCoordinate2D(latitude: lat, longitude: lng), distance: dist)
    }()

    private var unmappedCrags: [Crag] {
        store.crags.filter { $0.coords == nil }.sorted { $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending }
    }

    private var restoredCamera: OfflineMapView.CameraState? {
        let center = CLLocationCoordinate2D(latitude: savedLatitude, longitude: savedLongitude)
        guard savedDistance > 0, CLLocationCoordinate2DIsValid(center) else { return nil }
        return OfflineMapView.CameraState(center: center, distance: savedDistance)
    }

    var body: some View {
        NavigationStack(path: $path) {
            OfflineMapView(
                crags: store.crags,
                initialCamera: restoredCamera,
                selectSlug: Self.debugSelectSlug,
                debugCameraOverride: Self.debugCamera,
                onSelectCrag: { crag in path.append(crag) },
                onCameraChange: { camera in
                    savedLatitude = camera.center.latitude
                    savedLongitude = camera.center.longitude
                    savedDistance = camera.distance
                },
                onCoverageChange: { outside in outsideCoverage = outside }
            )
            .ignoresSafeArea()
            .toolbarVisibility(.hidden, for: .navigationBar)
            .navigationDestination(for: Crag.self) { crag in
                CragDetailView(crag: crag, store: store)
            }
            .overlay(alignment: .top) {
                if outsideCoverage {
                    Label("Offline tiles cover Koh Tao only", systemImage: "map")
                        .font(.caption.weight(.medium))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(.regularMaterial, in: Capsule())
                        .padding(.top, 4)
                        .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
            .overlay(alignment: .topTrailing) {
                Button {
                    showingUnmappedCrags = true
                } label: {
                    Image(systemName: "list.bullet")
                        .font(.body.weight(.semibold))
                        .padding(10)
                }
                .buttonStyle(.glass)
                .padding([.top, .trailing], 10)
                .accessibilityLabel("Crags without a map marker")
            }
            .animation(.easeInOut(duration: 0.2), value: outsideCoverage)
            .sheet(isPresented: $showingUnmappedCrags) {
                UnmappedCragsSheet(crags: unmappedCrags, store: store)
            }
        }
    }
}

/// Sheet listing crags that have no coordinates, so they're reachable from the map too.
private struct UnmappedCragsSheet: View {
    let crags: [Crag]
    let store: DataStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(crags) { crag in
                NavigationLink(value: crag) {
                    CragRow(crag: crag, store: store)
                }
            }
            .navigationTitle("No map marker (\(crags.count))")
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: Crag.self) { crag in
                CragDetailView(crag: crag, store: store)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done", systemImage: "xmark") { dismiss() }
                }
            }
        }
    }
}
