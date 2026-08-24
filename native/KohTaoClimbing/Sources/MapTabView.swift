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

/// Human callout line: styles + grade range, stripping source jargon in parentheses.
fileprivate func calloutSubtitle(for crag: Crag) -> String {
    let styles = crag.styles.prefix(2).map { $0.capitalized }.joined(separator: ", ")
    var grades = crag.grades
    if let idx = grades.firstIndex(of: "(") {
        grades = String(grades[..<idx]).trimmingCharacters(in: .whitespaces)
    }
    if styles.isEmpty { return grades }
    if grades.isEmpty { return styles }
    return "\(styles) · \(grades)"
}

final class CragAnnotation: NSObject, MKAnnotation {
    let crag: Crag
    dynamic var coordinate: CLLocationCoordinate2D
    var title: String? { crag.name }
    var subtitle: String? { calloutSubtitle(for: crag) }

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
    /// Center of the tile coverage bbox (lat 10.03–10.16, lng 99.79–99.90).
    static let islandCenter = CLLocationCoordinate2D(latitude: 10.095, longitude: 99.845)
    /// Camera distance that fits the whole tile strip on screen (island + small margin).
    static let fitDistance: CLLocationDistance = 14_500
    /// Zoom clamp. Max distance keeps max-zoom-out inside the bundled tiles;
    /// min distance stays shallow enough for z15 tiles (upscaled beyond that).
    static let minDistance: CLLocationDistance = 1_000
    static let maxDistance: CLLocationDistance = 15_000

    /// Hard camera clamp: the tile bbox plus 100 m. The bundled z15 tiles actually
    /// extend ~130 m–1 km past the declared bbox on every side, so even with the
    /// camera pushed against the clamp the screen is still inside real tiles.
    static let clampRect: MKMapRect = {
        let pad = 100 / MKMetersPerMapPointAtLatitude(islandCenter.latitude)
        return OfflineTileOverlay.coverageRect.insetBy(dx: -pad, dy: -pad)
    }()

    /// A persisted camera is only restored when it sits inside the clamp rect at a
    /// sane distance — anything else (e.g. a street-level view saved by an older
    /// build) falls back to the whole-island fit.
    static func isRestorable(_ camera: CameraState) -> Bool {
        guard CLLocationCoordinate2DIsValid(camera.center),
              camera.distance >= minDistance, camera.distance <= maxDistance else { return false }
        return clampRect.contains(MKMapPoint(camera.center))
    }

    /// Testing hook: `-debugPrintVisible` logs camera distance vs visible size.
    static let debugPrintVisible = ProcessInfo.processInfo.arguments.contains("-debugPrintVisible")

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
    /// Bump to re-fit the whole island (handled in updateUIView).
    var recenterToken: Int = 0
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

        // Hard clamp first so the initial camera below is already constrained:
        // the camera can never leave the tile coverage, so Apple's base map can
        // never show (the overlay replaces map content inside its bounding rect).
        mapView.cameraBoundary = MKMapView.CameraBoundary(mapRect: Self.clampRect)
        mapView.cameraZoomRange = MKMapView.CameraZoomRange(
            minCenterCoordinateDistance: Self.minDistance,
            maxCenterCoordinateDistance: Self.maxDistance
        )

        // First launch (or a stale out-of-coverage restore) shows the whole island.
        let restored = initialCamera.flatMap { Self.isRestorable($0) ? $0 : nil }
        let camera = debugCameraOverride ?? restored ?? CameraState(center: Self.islandCenter, distance: Self.fitDistance)
        mapView.setCamera(
            MKMapCamera(lookingAtCenter: camera.center, fromDistance: camera.distance, pitch: 0, heading: 0),
            animated: false
        )

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
        if context.coordinator.lastRecenterToken != recenterToken {
            context.coordinator.lastRecenterToken = recenterToken
            mapView.setCamera(
                MKMapCamera(lookingAtCenter: Self.islandCenter, fromDistance: Self.fitDistance, pitch: 0, heading: 0),
                animated: true
            )
        }
    }

    @MainActor
    final class Coordinator: NSObject, MKMapViewDelegate {
        var onSelectCrag: (Crag) -> Void
        var onCameraChange: (CameraState) -> Void
        var onCoverageChange: (Bool) -> Void
        var lastRecenterToken = 0
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
            view.displayPriority = .defaultHigh
            if #available(iOS 16.0, *) {
                view.titleVisibility = .adaptive
                view.subtitleVisibility = .adaptive
            }
            // Single labeled accessory — avoid Open + detailDisclosure doing the same push.
            let open = UIButton(type: .system)
            open.setTitle("Open", for: .normal)
            open.accessibilityLabel = "Open crag"
            view.rightCalloutAccessoryView = open
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
            if OfflineMapView.debugPrintVisible {
                let rect = mapView.visibleMapRect
                let mpp = MKMetersPerMapPointAtLatitude(camera.centerCoordinate.latitude)
                print(String(
                    format: "MAPDBG center=%.5f,%.5f dist=%.0f visibleH=%.0f visibleW=%.0f",
                    camera.centerCoordinate.latitude, camera.centerCoordinate.longitude,
                    camera.centerCoordinateDistance, rect.size.height * mpp, rect.size.width * mpp
                ))
            }
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
    @State private var recenterToken = 0
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
        let camera = OfflineMapView.CameraState(
            center: CLLocationCoordinate2D(latitude: savedLatitude, longitude: savedLongitude),
            distance: savedDistance
        )
        // Discard anything saved outside the tile coverage (e.g. by an older build
        // without the clamp) — those restores produced a street-level patchwork view.
        return OfflineMapView.isRestorable(camera) ? camera : nil
    }

    var body: some View {
        NavigationStack(path: $path) {
            OfflineMapView(
                crags: store.crags,
                initialCamera: restoredCamera,
                selectSlug: Self.debugSelectSlug,
                debugCameraOverride: Self.debugCamera,
                recenterToken: recenterToken,
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
                    Button {
                        recenterToken += 1
                    } label: {
                        Label("Offline tiles cover Koh Tao only — tap to fit", systemImage: "map")
                            .font(.caption.weight(.medium))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(.regularMaterial, in: Capsule())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Fit the map to Koh Tao")
                    .padding(.top, 4)
                    .safeAreaPadding(.top)
                    .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
            .overlay(alignment: .topTrailing) {
                VStack(spacing: 10) {
                    Button {
                        showingUnmappedCrags = true
                    } label: {
                        VStack(spacing: 2) {
                            Image(systemName: "list.bullet")
                                .font(.body.weight(.semibold))
                            Text("Unmapped")
                                .font(.caption2.weight(.semibold))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                        .overlay(alignment: .topTrailing) {
                            if !unmappedCrags.isEmpty {
                                Text("\(unmappedCrags.count)")
                                    .font(.caption2.weight(.bold))
                                    .foregroundStyle(.white)
                                    .padding(.horizontal, 5)
                                    .padding(.vertical, 2)
                                    .background(Color.orange, in: Capsule())
                                    .offset(x: 6, y: -6)
                            }
                        }
                    }
                    .accessibilityLabel(
                        unmappedCrags.isEmpty
                            ? "Areas without a map pin"
                            : "Areas without a map pin, \(unmappedCrags.count)"
                    )
                    Button {
                        recenterToken += 1
                    } label: {
                        VStack(spacing: 2) {
                            Image(systemName: "map.fill")
                                .font(.body.weight(.semibold))
                            Text("Fit island")
                                .font(.caption2.weight(.semibold))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                    }
                    .accessibilityLabel("Show the whole island")
                }
                .buttonStyle(.glass)
                .padding([.top, .trailing], 10)
                // Map ignoresSafeArea (full-bleed); lift chrome below status bar / Dynamic Island.
                .safeAreaPadding(.top)
            }
            .overlay(alignment: .bottomLeading) {
                HStack(spacing: 10) {
                    legendDot("Sport", color: CragStyle.color("sport"))
                    legendDot("Boulder", color: CragStyle.color("boulder"))
                    legendDot("Trad", color: CragStyle.color("trad"))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(.regularMaterial, in: Capsule())
                .padding(.leading, 10)
                .padding(.bottom, 10)
                // Map ignoresSafeArea (full-bleed under tab bar); lift legend above it.
                .safeAreaPadding(.bottom)
                .allowsHitTesting(false)
            }
            .animation(.easeInOut(duration: 0.2), value: outsideCoverage)
            .sheet(isPresented: $showingUnmappedCrags) {
                UnmappedCragsSheet(crags: unmappedCrags, store: store)
            }
        }
    }
}


private func legendDot(_ label: String, color: Color) -> some View {
    HStack(spacing: 4) {
        Circle()
            .fill(color)
            .frame(width: 8, height: 8)
        Text(label)
            .font(.caption2.weight(.medium))
            .foregroundStyle(.primary)
    }
}

/// Sheet listing crags that have no coordinates, so they're reachable from the map too.
private struct UnmappedCragsSheet: View {
    let crags: [Crag]
    let store: DataStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Group {
                if crags.isEmpty {
                    ContentUnavailableView(
                        "All areas have a map pin",
                        systemImage: "mappin.and.ellipse",
                        description: Text("Nothing left to list here.")
                    )
                } else {
                    List {
                        Section("\(crags.count) areas") {
                            ForEach(crags) { crag in
                                NavigationLink(value: crag) {
                                    CragRow(crag: crag, store: store)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Areas without a map pin")
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
