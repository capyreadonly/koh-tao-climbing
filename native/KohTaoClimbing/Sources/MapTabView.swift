import MapKit
import SwiftUI

/// Serves the bundled OSM tiles (Resources/Tiles/{z}/{x}/{y}.png, zooms 10–15) to MapKit.
/// loadTile reads straight from the bundle, so the base map works with zero network.
final class OfflineTileOverlay: MKTileOverlay {
    private let baseURL: URL

    init() {
        let base = Bundle.main.resourceURL!.appendingPathComponent("AppResources/Tiles", isDirectory: true)
        baseURL = base
        super.init(urlTemplate: base.appendingPathComponent("{z}/{x}/{y}.png").absoluteString)
        tileSize = CGSize(width: 256, height: 256)
        minimumZ = 10
        maximumZ = 15
        // Our tiles fully cover the island — never fetch Apple's base map underneath.
        canReplaceMapContent = true
    }

    override func loadTile(at path: MKTileOverlayPath, result: @escaping (Data?, (any Error)?) -> Void) {
        let url = baseURL.appendingPathComponent("\(path.z)/\(path.x)/\(path.y).png")
        if let data = try? Data(contentsOf: url) {
            result(data, nil)
        } else {
            // Outside the tile set (zoom/region) — MapKit leaves those cells empty.
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
/// crag markers tinted by climbing style. Tap a marker to open the crag detail.
struct OfflineMapView: UIViewRepresentable {
    /// Island center; tiles cover lat 10.03–10.16, lng 99.79–99.90.
    static let islandCenter = CLLocationCoordinate2D(latitude: 10.095, longitude: 99.840)

    let crags: [Crag]
    var onSelectCrag: (Crag) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onSelectCrag: onSelectCrag)
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

        mapView.setCamera(
            MKMapCamera(lookingAtCenter: Self.islandCenter, fromDistance: 17_000, pitch: 0, heading: 0),
            animated: false
        )
        // Keep the camera on the island — tiles don't exist beyond it.
        mapView.cameraBoundary = MKMapView.CameraBoundary(
            coordinateRegion: MKCoordinateRegion(center: Self.islandCenter, latitudinalMeters: 20_000, longitudinalMeters: 20_000)
        )
        mapView.cameraZoomRange = MKMapView.CameraZoomRange(minCenterCoordinateDistance: 1_500, maxCenterCoordinateDistance: 40_000)

        mapView.addAnnotations(crags.compactMap { crag in
            guard let coords = crag.coords else { return nil }
            return CragAnnotation(crag: crag, coordinate: CLLocationCoordinate2D(latitude: coords.lat, longitude: coords.lng))
        })
        return mapView
    }

    func updateUIView(_ mapView: MKMapView, context: Context) {
        context.coordinator.onSelectCrag = onSelectCrag
    }

    @MainActor
    final class Coordinator: NSObject, MKMapViewDelegate {
        var onSelectCrag: (Crag) -> Void

        init(onSelectCrag: @escaping (Crag) -> Void) {
            self.onSelectCrag = onSelectCrag
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
            view.canShowCallout = false
            return view
        }

        func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
            guard let cragAnnotation = view.annotation as? CragAnnotation else { return }
            mapView.deselectAnnotation(view.annotation, animated: false)
            onSelectCrag(cragAnnotation.crag)
        }
    }
}

/// Map tab: full-bleed offline map; tapping a crag marker opens the detail in a sheet.
struct MapTabView: View {
    let store: DataStore
    @State private var selectedCrag: Crag?

    var body: some View {
        OfflineMapView(crags: store.crags) { crag in
            selectedCrag = crag
        }
        .ignoresSafeArea()
        .sheet(item: $selectedCrag) { crag in
            NavigationStack {
                CragDetailView(crag: crag, store: store)
                    .toolbar {
                        ToolbarItem(placement: .topBarTrailing) {
                            Button("Done", systemImage: "xmark") { selectedCrag = nil }
                        }
                    }
            }
        }
    }
}
