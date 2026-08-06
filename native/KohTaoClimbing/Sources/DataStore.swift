import Foundation
import Observation

/// Loads the bundled JSON (Resources/Data/*.json) once at launch and provides lookups.
/// Everything ships inside the app bundle — the store never touches the network.
@Observable
@MainActor
final class DataStore {
    static let shared = DataStore()

    private(set) var crags: [Crag] = []
    private(set) var routes: [RouteRecord] = []
    private(set) var guidePhotos: [PhotoEntry] = []
    private(set) var communityPhotos: [PhotoEntry] = []
    private(set) var reports: [CommunityReport] = []
    private(set) var info: GuideInfo?
    private(set) var services: [Service] = []
    private(set) var sources: [SourceLink] = []
    /// Non-fatal load problems, surfaced as a banner in the UI instead of crashing.
    private(set) var loadErrors: [String] = []

    private var cragsBySlug: [String: Crag] = [:]
    private var routesByCragName: [String: [RouteRecord]] = [:]

    private init() {
        if let v: [Crag] = load("crags") { crags = v }
        if let v: [RouteRecord] = load("routes") { routes = v }
        if let v: PhotosFile = load("photos") {
            guidePhotos = v.guide
            communityPhotos = v.community
        }
        if let v: [CommunityReport] = load("reports") { reports = v }
        if let v: GuideInfo = load("info") { info = v }
        if let v: [Service] = load("services") { services = v }
        if let v: [SourceLink] = load("sources") { sources = v }

        cragsBySlug = Dictionary(crags.map { ($0.slug, $0) }, uniquingKeysWith: { first, _ in first })
        routesByCragName = Dictionary(grouping: routes, by: \.crag)
    }

    private func load<T: Decodable>(_ file: String) -> T? {
        guard let url = Bundle.main.url(forResource: file, withExtension: "json", subdirectory: "AppResources/Data") else {
            loadErrors.append("Missing bundle resource: AppResources/Data/\(file).json")
            return nil
        }
        do {
            return try JSONDecoder().decode(T.self, from: Data(contentsOf: url))
        } catch {
            loadErrors.append("\(file).json decode failed: \(error)")
            return nil
        }
    }

    // MARK: - Lookups

    func crag(slug: String) -> Crag? { cragsBySlug[slug] }

    /// RouteRecord.crag holds the crag NAME (not the slug), matching routes.ts routesForCrag().
    func routes(forCrag crag: Crag) -> [RouteRecord] {
        routesByCragName[crag.name] ?? []
    }

    /// Port of photos.ts cragMatches(): exact name, or "Crag Name (qualifier)" variants.
    private func photoBelongs(_ photo: PhotoEntry, toCragName cragName: String) -> Bool {
        guard let c = photo.crag else { return false }
        return c == cragName || c.hasPrefix(cragName + " (")
    }

    func guidePhotos(forCrag crag: Crag) -> [PhotoEntry] {
        guidePhotos.filter { $0.isUsable && photoBelongs($0, toCragName: crag.name) }
    }

    func communityPhotos(forCrag crag: Crag) -> [PhotoEntry] {
        communityPhotos.filter { photoBelongs($0, toCragName: crag.name) }
    }

    func photos(forCrag crag: Crag) -> [PhotoEntry] {
        guidePhotos(forCrag: crag) + communityPhotos(forCrag: crag)
    }

    /// Best list-row thumbnail for a crag: real photos before drawn topos before maps.
    func thumbnail(forCrag crag: Crag) -> PhotoEntry? {
        let kindRank = ["photo-topo": 0, "crag-photo": 1, "action-photo": 2, "community-photo": 3,
                        "topo-diagram": 4, "scenic": 5, "map": 6, "other": 7]
        return photos(forCrag: crag).min {
            (kindRank[$0.kind] ?? 99) < (kindRank[$1.kind] ?? 99)
        }
    }
}
