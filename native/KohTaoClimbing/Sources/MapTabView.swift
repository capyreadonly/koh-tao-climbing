import MapKit
import SwiftUI

/// Serves the bundled OSM tiles (AppResources/Tiles/{z}/{x}/{y}.png, zooms 10–15) to MapKit.
/// loadTile reads straight from the bundle, so the base map works with zero network.
final class OfflineTileOverlay: MKTileOverlay {
    private let baseURL: URL

    /// Deepest bundled zoom. The grid is a complete rectangle at every zoom 10–15.
    static let maxTileZ = 15

    /// Exact extent of the bundled z15 grid (x 25467–25477, y 15454–15466). z10–z14
    /// each cover at least this much, so a tile is guaranteed here at every bundled
    /// zoom — which is what makes it safe to derive the camera limits from this rect.
    static let coverageRect: MKMapRect = {
        let nw = MKMapPoint(CLLocationCoordinate2D(latitude: 10.163560, longitude: 99.788818))
        let se = MKMapPoint(CLLocationCoordinate2D(latitude: 10.022948, longitude: 99.909668))
        return MKMapRect(x: nw.x, y: nw.y, width: se.x - nw.x, height: se.y - nw.y)
    }()

    /// Map points covered by one screen point when a z15 tile is drawn at its native
    /// 256-point size (world width / 2^15 tiles / 256 points = 32). Camera limits are
    /// expressed in these units because they map directly onto tile sharpness.
    static let nativeScale = MKMapSize.world.width / pow(2, Double(maxTileZ)) / 256

    /// The open-sea colour of the bundled OSM raster (#AAD3DF), used to back the map
    /// so anything beyond the grid reads as more sea instead of an empty void.
    static let seaColor = UIColor(red: 170 / 255, green: 211 / 255, blue: 223 / 255, alpha: 1)

    init() {
        let base = Bundle.main.resourceURL!.appendingPathComponent("AppResources/Tiles", isDirectory: true)
        baseURL = base
        super.init(urlTemplate: base.appendingPathComponent("{z}/{x}/{y}.png").absoluteString)
        tileSize = CGSize(width: 256, height: 256)
        minimumZ = 10
        // maximumZ is a hard cutoff, not an upscale hint: MapKit draws nothing at all
        // above it. So keep it past the bundled z15 (the camera can't reach beyond z16)
        // and synthesise those tiles in loadTile by cropping the z15 ancestor.
        maximumZ = 17
        // Our tiles fully cover the island — never fetch Apple's base map underneath.
        canReplaceMapContent = true
    }

    /// Tells MapKit tiles exist only here, so it doesn't even request outside cells.
    override var boundingMapRect: MKMapRect { Self.coverageRect }

    override func loadTile(at path: MKTileOverlayPath, result: @escaping (Data?, (any Error)?) -> Void) {
        let data = path.z > Self.maxTileZ
            ? croppedAncestor(for: path)
            : try? Data(contentsOf: tileURL(z: path.z, x: path.x, y: path.y))
        if let data {
            result(data, nil)
        } else {
            // Outside the tile set — the sea backdrop shows through instead.
            result(nil, NSError(domain: "KohTaoClimbing.OfflineTiles", code: 404))
        }
    }

    private func tileURL(z: Int, x: Int, y: Int) -> URL {
        baseURL.appendingPathComponent("\(z)/\(x)/\(y).png")
    }

    /// Past z15 there is no bundled tile, so cut the matching quadrant out of the z15
    /// ancestor and blow it up to a full tile. Cropping is the part the old code missed:
    /// it handed MapKit the whole ancestor for every child path, so each quarter-size
    /// cell drew the entire parent and the coastline repeated and shattered on zoom-in.
    private func croppedAncestor(for path: MKTileOverlayPath) -> Data? {
        let shift = path.z - Self.maxTileZ
        let ancestorX = path.x >> shift, ancestorY = path.y >> shift
        guard let image = ancestorImage(x: ancestorX, y: ancestorY) else { return nil }

        let scale = CGFloat(1 << shift)
        // Draw the ancestor at `scale`× and slide the wanted quadrant to the origin.
        let offsetX = CGFloat(path.x - (ancestorX << shift)) * tileSize.width
        let offsetY = CGFloat(path.y - (ancestorY << shift)) * tileSize.height
        return UIGraphicsImageRenderer(size: tileSize).pngData { _ in
            image.draw(in: CGRect(x: -offsetX, y: -offsetY,
                                  width: tileSize.width * scale, height: tileSize.height * scale))
        }
    }

    /// Decoded z15 tiles, kept around because each one is cropped into 4+ children.
    private let ancestorCache = NSCache<NSString, UIImage>()

    private func ancestorImage(x: Int, y: Int) -> UIImage? {
        let key = "\(x)/\(y)" as NSString
        if let cached = ancestorCache.object(forKey: key) { return cached }
        guard let data = try? Data(contentsOf: tileURL(z: Self.maxTileZ, x: x, y: y)),
              let image = UIImage(data: data) else { return nil }
        ancestorCache.setObject(image, forKey: key)
        return image
    }
}

/// Persisted map camera. Kept out of SwiftUI state on purpose: `@AppStorage` writes on
/// every region-change callback re-rendered the whole Map tab mid-gesture, which is what
/// made pinch-zoom stutter. The coordinator writes here once a gesture settles instead.
enum MapCameraStore {
    private static let latitudeKey = "mapCameraLatitude"
    private static let longitudeKey = "mapCameraLongitude"
    private static let distanceKey = "mapCameraDistance"

    static func load() -> OfflineMapView.CameraState? {
        let defaults = UserDefaults.standard
        let latitude = defaults.double(forKey: latitudeKey)
        let longitude = defaults.double(forKey: longitudeKey)
        let distance = defaults.double(forKey: distanceKey)
        // 0/0/0 means "never moved" — the caller falls back to the default framing.
        guard distance > 0, latitude != 0 || longitude != 0 else { return nil }
        return OfflineMapView.CameraState(
            center: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
            distance: distance
        )
    }

    static func save(_ camera: OfflineMapView.CameraState) {
        let defaults = UserDefaults.standard
        defaults.set(camera.center.latitude, forKey: latitudeKey)
        defaults.set(camera.center.longitude, forKey: longitudeKey)
        defaults.set(camera.distance, forKey: distanceKey)
    }
}

/// Flat fill drawn under the tile grid in the raster's own open-sea colour, so the
/// area beyond the bundled tiles reads as more ocean instead of an empty void.
final class SeaBackdrop: NSObject, MKOverlay {
    /// The tile grid grown by its own size on every side — far more than the camera
    /// limits allow the screen to reach.
    static let rect = OfflineTileOverlay.coverageRect.insetBy(
        dx: -OfflineTileOverlay.coverageRect.width,
        dy: -OfflineTileOverlay.coverageRect.height
    )
    var boundingMapRect: MKMapRect { Self.rect }
    var coordinate: CLLocationCoordinate2D { MKMapPoint(x: Self.rect.midX, y: Self.rect.midY).coordinate }
}

final class SeaBackdropRenderer: MKOverlayRenderer {
    override func draw(_ mapRect: MKMapRect, zoomScale: MKZoomScale, in context: CGContext) {
        context.setFillColor(OfflineTileOverlay.seaColor.cgColor)
        context.fill(rect(for: mapRect))
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

/// MKMapView subclass that reports every layout pass. `makeUIView` runs while the view
/// is still 0×0, and applying a camera boundary then made MapKit clamp the centre to a
/// corner of the boundary rect (a sea corner, at a nonsense 220 km distance) — the
/// "map opens somewhere in the ocean" glitch. Camera setup waits for a real size.
final class OfflineMKMapView: MKMapView {
    var onLayout: ((OfflineMKMapView) -> Void)?

    override func layoutSubviews() {
        super.layoutSubviews()
        guard bounds.width > 0, bounds.height > 0 else { return }
        onLayout?(self)
    }

    /// Map points spanned by one screen point — MapKit's zoom scale, in the same units
    /// as `OfflineTileOverlay.nativeScale`. Independent of the view's size.
    var mapScale: Double {
        guard bounds.width > 0 else { return 0 }
        return visibleMapRect.width / Double(bounds.width)
    }
}

/// MKMapView wrapped for SwiftUI: bundled offline tiles, island-constrained camera,
/// crag markers tinted by climbing style. Pin taps call back so the tab can present
/// the crag sheet; the camera is persisted once a gesture settles.
struct OfflineMapView: UIViewRepresentable {
    /// Zoom floor, as map points per screen point: half `nativeScale`, i.e. a z15 tile
    /// stretched to at most 2× its native size. The bundled raster carries no detail
    /// past this, and the old 1 km floor sat at roughly a 23× stretch.
    static let deepestScale = OfflineTileOverlay.nativeScale / 2
    /// Zoom ceiling as a fraction of "the tile grid exactly fills the screen". The 8%
    /// margin leaves the camera a little room to pan at full zoom-out rather than
    /// pinning it to the centre of the grid.
    static let widestCoverageFraction = 0.92
    /// Zoom used by "Show on map": tight enough to read one crag and its surroundings
    /// (~1.2 km across on a phone), still well inside the tiles.
    static let focusScale = OfflineTileOverlay.nativeScale * 0.625
    /// Breathing room around the crag pins in the default framing.
    static let fitPadMeters: CLLocationDistance = 200
    /// Screen-edge inset for the default framing, so pins clear the map chrome.
    static let fitEdgePadding = UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)

    /// Default framing: every crag pin plus `fitPadMeters` of surroundings. Derived from
    /// the data rather than a hand-tuned distance, so it stays correct on any screen —
    /// the old fixed 14.5 km camera showed a 3.7 km-wide strip and cut the outer pins off.
    static func fitRect(for crags: [Crag]) -> MKMapRect {
        let points = crags.compactMap(\.coords).map {
            MKMapPoint(CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lng))
        }
        guard let first = points.first else { return OfflineTileOverlay.coverageRect }
        var rect = points.dropFirst().reduce(MKMapRect(origin: first, size: .init(width: 0, height: 0))) {
            $0.union(MKMapRect(origin: $1, size: .init(width: 0, height: 0)))
        }
        let pad = fitPadMeters / MKMetersPerMapPointAtLatitude(rect.origin.coordinate.latitude)
        rect = rect.insetBy(dx: -pad, dy: -pad)
        // Never frame anything the tiles can't draw.
        return rect.intersection(OfflineTileOverlay.coverageRect).isNull
            ? OfflineTileOverlay.coverageRect
            : rect.intersection(OfflineTileOverlay.coverageRect)
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
    /// Testing/screenshot hook: pre-select this crag's annotation.
    var selectSlug: String?
    /// Testing hook: force this camera on first layout (also exercises persistence
    /// write-back, since the settled-camera callback persists whatever is applied).
    var debugCameraOverride: CameraState?
    /// Bump to re-fit the crag pins (handled in updateUIView).
    var recenterToken: Int = 0
    /// Slug + token from MapFocus — camera + selected pin for “Show on map”.
    var focusSlug: String? = nil
    var focusToken: Int = 0
    var onSelectCrag: (Crag) -> Void
    /// True while a meaningful part of the screen reaches beyond the bundled tiles.
    var onCoverageChange: (Bool) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(fitRect: Self.fitRect(for: crags),
                    debugCameraOverride: debugCameraOverride,
                    onSelectCrag: onSelectCrag,
                    onCoverageChange: onCoverageChange)
    }

    func makeUIView(context: Context) -> MKMapView {
        let mapView = OfflineMKMapView()
        mapView.delegate = context.coordinator
        mapView.mapType = .standard
        mapView.showsCompass = true
        mapView.showsScale = true
        mapView.pointOfInterestFilter = .excludingAll
        mapView.isRotateEnabled = false
        mapView.isPitchEnabled = false

        // Sea backdrop under the tiles: the bundled raster is opaque OSM ocean at its
        // edges, so painting the same colour behind it means panning past the grid
        // shows more sea instead of a black void, with no visible seam. Both sit at
        // .aboveLabels — that also hides Apple's own labels out there — and overlays
        // added first draw first, so the tiles stay on top.
        mapView.addOverlay(SeaBackdrop(), level: .aboveLabels)
        mapView.addOverlay(OfflineTileOverlay(), level: .aboveLabels)

        mapView.addAnnotations(crags.compactMap { crag in
            guard let coords = crag.coords else { return nil }
            return CragAnnotation(crag: crag, coordinate: CLLocationCoordinate2D(latitude: coords.lat, longitude: coords.lng))
        })

        // Camera limits and the opening camera both need the real view size.
        mapView.onLayout = { [weak coordinator = context.coordinator] map in
            coordinator?.viewDidLayout(map, selectSlug: selectSlug)
        }
        return mapView
    }

    func updateUIView(_ mapView: MKMapView, context: Context) {
        context.coordinator.onSelectCrag = onSelectCrag
        context.coordinator.onCoverageChange = onCoverageChange
        if context.coordinator.lastRecenterToken != recenterToken {
            context.coordinator.lastRecenterToken = recenterToken
            context.coordinator.fitIsland(mapView, animated: true)
        }
        if focusToken > 0, context.coordinator.lastFocusToken != focusToken, let slug = focusSlug {
            context.coordinator.lastFocusToken = focusToken
            context.coordinator.focus(mapView, slug: slug)
        }
    }

    @MainActor
    final class Coordinator: NSObject, MKMapViewDelegate {
        var onSelectCrag: (Crag) -> Void
        var onCoverageChange: (Bool) -> Void
        var lastRecenterToken = 0
        var lastFocusToken = 0
        private let fitRect: MKMapRect
        private let debugCameraOverride: CameraState?
        private var lastOutside = false
        /// MapKit's zoom scale is exactly linear in camera distance, so a single live
        /// sample converts any scale to a distance. Calibrated on the first real layout
        /// rather than hardcoded, which keeps the limits right on every screen size and
        /// latitude. Nil until then.
        private var distancePerScale: Double?
        private var lastLayoutSize: CGSize = .zero
        private var didApplyOpeningCamera = false
        private var isCalibrating = false
        /// Crag to select once the camera that frames it has settled.
        private var pendingSelection: String?
        /// Pin we are selecting ourselves; the delegate must not mistake it for a tap
        /// and push the crag sheet back over the map we were asked to show.
        private var silentSelection: String?

        init(fitRect: MKMapRect,
             debugCameraOverride: CameraState?,
             onSelectCrag: @escaping (Crag) -> Void,
             onCoverageChange: @escaping (Bool) -> Void) {
            self.fitRect = fitRect
            self.debugCameraOverride = debugCameraOverride
            self.onSelectCrag = onSelectCrag
            self.onCoverageChange = onCoverageChange
        }

        // MARK: - Camera set-up

        /// Derive the zoom limits from the view's real size, then place the opening
        /// camera. Re-runs on a size change (rotation, split view) keeping the camera.
        func viewDidLayout(_ mapView: OfflineMKMapView, selectSlug: String?) {
            guard !isCalibrating, mapView.bounds.size != lastLayoutSize else { return }
            lastLayoutSize = mapView.bounds.size

            let previous = didApplyOpeningCamera ? currentCamera(mapView) : nil
            isCalibrating = true
            calibrate(mapView)
            isCalibrating = false

            if let previous {
                apply(previous, to: mapView, animated: false)
            } else {
                didApplyOpeningCamera = true
                applyOpeningCamera(mapView, selectSlug: selectSlug)
            }
        }

        private func calibrate(_ mapView: OfflineMKMapView) {
            // Measure against a known camera with no limits in the way.
            mapView.cameraBoundary = nil
            mapView.cameraZoomRange = nil
            let coverage = OfflineTileOverlay.coverageRect
            mapView.setVisibleMapRect(coverage, animated: false)
            let scale = mapView.mapScale
            let fitted = mapView.visibleMapRect
            guard scale > 0, fitted.width > 0, fitted.height > 0 else { return }
            let perScale = mapView.camera.centerCoordinateDistance / scale
            distancePerScale = perScale

            // Widest view that still keeps the whole screen on tiles. `fitted` is the
            // grid *fitted into* the viewport, so it overshoots on one axis; shrinking
            // it by the smaller axis ratio turns that into the grid *covering* the
            // viewport. Working in map rects avoids guessing the viewport's size in
            // points — MapKit measures the visible rect inside the safe area, which is
            // ~145 pt shorter than the full-bleed view's bounds.
            let widestScale = scale
                * min(coverage.width / fitted.width, coverage.height / fitted.height)
                * OfflineMapView.widestCoverageFraction
            mapView.cameraZoomRange = MKMapView.CameraZoomRange(
                minCenterCoordinateDistance: perScale * OfflineMapView.deepestScale,
                maxCenterCoordinateDistance: perScale * widestScale
            )
            // Centre stays on the grid, so MapKit ends the gesture at the edge of the
            // tiles instead of letting the map drift off them.
            mapView.cameraBoundary = MKMapView.CameraBoundary(mapRect: coverage)
        }

        private func applyOpeningCamera(_ mapView: OfflineMKMapView, selectSlug: String?) {
            if let debugCameraOverride {
                apply(debugCameraOverride, to: mapView, animated: false)
            } else if let restored = MapCameraStore.load(), isRestorable(restored, in: mapView) {
                apply(restored, to: mapView, animated: false)
            } else {
                fitIsland(mapView, animated: false)
            }
            if let selectSlug { select(slug: selectSlug, in: mapView, animated: false) }
        }

        /// Only restore a camera still on the tiles at a distance this screen allows.
        /// Older builds could persist the corner-of-the-boundary camera MapKit produced
        /// while the view was 0×0; those now fall back to the island fit.
        private func isRestorable(_ camera: CameraState, in mapView: MKMapView) -> Bool {
            guard CLLocationCoordinate2DIsValid(camera.center),
                  let range = mapView.cameraZoomRange,
                  camera.distance >= range.minCenterCoordinateDistance,
                  camera.distance <= range.maxCenterCoordinateDistance
            else { return false }
            return OfflineTileOverlay.coverageRect.contains(MKMapPoint(camera.center))
        }

        /// MapKit does the region maths and applies the zoom/boundary limits itself.
        func fitIsland(_ mapView: MKMapView, animated: Bool) {
            mapView.setVisibleMapRect(fitRect, edgePadding: OfflineMapView.fitEdgePadding, animated: animated)
        }

        func focus(_ mapView: MKMapView, slug: String) {
            guard let match = annotation(for: slug, in: mapView) else { return }
            let target = distance(for: OfflineMapView.focusScale, in: mapView)
            let camera = mapView.camera
            // A camera that is already there never reports a settled region, so the
            // pending selection would otherwise hang until the user next panned.
            guard abs(camera.centerCoordinate.latitude - match.coordinate.latitude) > 1e-6
                    || abs(camera.centerCoordinate.longitude - match.coordinate.longitude) > 1e-6
                    || abs(camera.centerCoordinateDistance - target) > 1
            else {
                select(slug: slug, in: mapView, animated: true)
                return
            }
            // Select when the camera settles rather than after a guessed delay.
            pendingSelection = slug
            mapView.setCamera(
                MKMapCamera(lookingAtCenter: match.coordinate, fromDistance: target, pitch: 0, heading: 0),
                animated: true
            )
        }

        private func currentCamera(_ mapView: MKMapView) -> CameraState {
            CameraState(center: mapView.camera.centerCoordinate,
                        distance: mapView.camera.centerCoordinateDistance)
        }

        private func apply(_ camera: CameraState, to mapView: MKMapView, animated: Bool) {
            mapView.setCamera(
                MKMapCamera(lookingAtCenter: camera.center, fromDistance: camera.distance, pitch: 0, heading: 0),
                animated: animated
            )
        }

        /// Convert a zoom scale (map points per screen point) to a camera distance,
        /// clamped into whatever range this screen allows.
        private func distance(for scale: Double, in mapView: MKMapView) -> CLLocationDistance {
            guard let perScale = distancePerScale else { return mapView.camera.centerCoordinateDistance }
            let distance = perScale * scale
            guard let range = mapView.cameraZoomRange else { return distance }
            return min(max(distance, range.minCenterCoordinateDistance), range.maxCenterCoordinateDistance)
        }

        private func annotation(for slug: String, in mapView: MKMapView) -> CragAnnotation? {
            mapView.annotations.compactMap { $0 as? CragAnnotation }.first { $0.crag.slug == slug }
        }

        private func select(slug: String, in mapView: MKMapView, animated: Bool) {
            guard let match = annotation(for: slug, in: mapView) else { return }
            silentSelection = slug
            mapView.selectAnnotation(match, animated: animated)
        }

        // MARK: - Delegate

        func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
            if overlay is SeaBackdrop { return SeaBackdropRenderer(overlay: overlay) }
            return MKTileOverlayRenderer(overlay: overlay)
        }

        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            if let clusterAnnotation = annotation as? MKClusterAnnotation {
                let identifier = "crag-cluster"
                let view = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) as? MKMarkerAnnotationView
                    ?? MKMarkerAnnotationView(annotation: clusterAnnotation, reuseIdentifier: identifier)
                view.annotation = clusterAnnotation
                view.markerTintColor = .systemGray
                view.glyphText = "\(clusterAnnotation.memberAnnotations.count)"
                view.accessibilityLabel = "\(clusterAnnotation.memberAnnotations.count) clustered areas"
                view.accessibilityHint = "Double-tap to expand"
                view.canShowCallout = false
                view.displayPriority = .required
                view.clusteringIdentifier = "crag"
                return view
            }
            guard let cragAnnotation = annotation as? CragAnnotation else { return nil }
            let identifier = "crag"
            let view = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) as? MKMarkerAnnotationView
                ?? MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            view.annotation = annotation
            view.markerTintColor = UIColor(CragStyle.color(for: cragAnnotation.crag))
            view.glyphImage = UIImage(systemName: "figure.climbing")
            // Callout disabled: pin tap opens crag UI directly (TF 1.0.2 callout-only felt dead).
            view.canShowCallout = false
            view.displayPriority = .required
            // No clustering — at island fit every pin stays independently tappable.
            view.clusteringIdentifier = nil
            if #available(iOS 16.0, *) {
                view.titleVisibility = .adaptive
                view.subtitleVisibility = .adaptive
            }
            view.rightCalloutAccessoryView = nil
            view.accessibilityLabel = cragAnnotation.crag.name
            view.accessibilityHint = "Opens climbs and routes for this area"
            return view
        }

        func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView,
                     calloutAccessoryControlTapped control: UIControl) {
            guard let cragAnnotation = view.annotation as? CragAnnotation else { return }
            mapView.deselectAnnotation(view.annotation, animated: true)
            onSelectCrag(cragAnnotation.crag)
        }

        func mapView(_ mapView: MKMapView, didSelect annotation: MKAnnotation) {
            if let cluster = annotation as? MKClusterAnnotation {
                mapView.deselectAnnotation(cluster, animated: false)
                mapView.showAnnotations(cluster.memberAnnotations, animated: true)
                return
            }
            // Pin tap must open climb/routes UI. NavigationPath over MKMapView failed in TF 1.0.2;
            // coordinator calls into SwiftUI which presents a sheet (see MapTabView.selectedCrag).
            guard let cragAnnotation = annotation as? CragAnnotation else { return }
            // A pin we selected ourselves ("Show on map") is not a tap: opening the sheet
            // here would cover the very map the user asked to be shown.
            if silentSelection == cragAnnotation.crag.slug {
                silentSelection = nil
                return
            }
            let crag = cragAnnotation.crag
            onSelectCrag(crag)
            DispatchQueue.main.async {
                mapView.deselectAnnotation(annotation, animated: false)
            }
        }

        /// Camera has settled — persist it and finish any pending "Show on map".
        /// Persisting here rather than on every frame is what keeps zoom smooth.
        func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {
            guard didApplyOpeningCamera else { return }
            MapCameraStore.save(currentCamera(mapView))
            if let slug = pendingSelection {
                pendingSelection = nil
                select(slug: slug, in: mapView, animated: true)
            }
        }

        func mapViewDidChangeVisibleRegion(_ mapView: MKMapView) {
            if OfflineMapView.debugPrintVisible {
                let camera = mapView.camera
                let rect = mapView.visibleMapRect
                let mpp = MKMetersPerMapPointAtLatitude(camera.centerCoordinate.latitude)
                print(String(
                    format: "MAPDBG center=%.5f,%.5f dist=%.0f visibleH=%.0f visibleW=%.0f boundsW=%.0f boundsH=%.0f mapPtPerPt=%.2f",
                    camera.centerCoordinate.latitude, camera.centerCoordinate.longitude,
                    camera.centerCoordinateDistance, rect.size.height * mpp, rect.size.width * mpp,
                    mapView.bounds.width, mapView.bounds.height,
                    rect.size.width / max(mapView.bounds.width, 1)
                ))
            }
            // Edge state: a real slice of the screen has left the bundled tiles. The old
            // check padded the coverage rect by 800 *map points* (~120 m, not 800 m) and
            // demanded the whole visible rect fit inside, so it fired at the default
            // framing; a fraction-covered test only fires when the map is genuinely off.
            let visible = mapView.visibleMapRect
            let onTiles = visible.intersection(OfflineTileOverlay.coverageRect)
            let covered = onTiles.isNull || visible.width <= 0 || visible.height <= 0
                ? 0
                : (onTiles.width * onTiles.height) / (visible.width * visible.height)
            let outside = covered < 0.65
            if outside != lastOutside {
                lastOutside = outside
                onCoverageChange(outside)
            }
        }
    }
}

/// Map tab: full-bleed offline map. Pin tap presents crag/routes in a sheet; a glass
/// button lists the crags that have no coordinates (and thus no map marker).
struct MapTabView: View {
    let store: DataStore
    let mapFocus: MapFocus
    /// Presented as a sheet — NavigationPath push over full-bleed MKMapView did not reliably
    /// show CragDetail in TestFlight 1.0.2 (build 5). Sheet survives tab switches too.
    @State private var selectedCrag: Crag?
    @State private var showingUnmappedCrags = MapTabView.debugShowUnmapped
    @State private var outsideCoverage = false
    @State private var recenterToken = 0
    // Camera persistence lives in MapCameraStore, not @AppStorage: storing it in SwiftUI
    // state re-rendered this whole view on every region-change callback, which is what
    // made pinch-zoom stutter.

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

    var body: some View {
        NavigationStack {
            OfflineMapView(
                crags: store.crags,
                selectSlug: Self.debugSelectSlug,
                debugCameraOverride: Self.debugCamera,
                recenterToken: recenterToken,
                focusSlug: mapFocus.slug,
                focusToken: mapFocus.token,
                onSelectCrag: { crag in
                    // Always assign on main; sheet(item:) is the reliable map→climb path.
                    selectedCrag = crag
                },
                onCoverageChange: { outside in outsideCoverage = outside }
            )
            .ignoresSafeArea()
            .accessibilityIdentifier("mapTab")
            .toolbarVisibility(.hidden, for: .navigationBar)
            // Testing hook: `-selectCrag` opens the same sheet as a pin tap.
            .onAppear {
                guard selectedCrag == nil, let slug = Self.debugSelectSlug,
                      let crag = store.crags.first(where: { $0.slug == slug }) else { return }
                selectedCrag = crag
            }
            .overlay(alignment: .top) {
                if outsideCoverage {
                    Button {
                        recenterToken += 1
                    } label: {
                        Label("The offline map ends here — tap to return to the island", systemImage: "arrow.uturn.backward")
                            .font(.caption.weight(.medium))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(.regularMaterial, in: Capsule())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Fit the map to Koh Tao")
                    .padding(.top, 4)
                    // Clear the Unmapped / Fit island glass buttons on the right.
                    .padding(.trailing, 110)
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
            .sheet(item: $selectedCrag) { crag in
                NavigationStack {
                    CragDetailView(crag: crag, store: store)
                        .toolbarVisibility(.visible, for: .navigationBar)
                        .toolbar {
                            ToolbarItem(placement: .cancellationAction) {
                                Button("Done") { selectedCrag = nil }
                                    .accessibilityIdentifier("cragDetailDone")
                            }
                        }
                }
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .accessibilityIdentifier("cragDetailSheet")
            }
            .onChange(of: mapFocus.token) { _, token in
                // Show on map from another tab: dismiss climb sheet so the pin is visible.
                if token > 0 {
                    selectedCrag = nil
                }
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
