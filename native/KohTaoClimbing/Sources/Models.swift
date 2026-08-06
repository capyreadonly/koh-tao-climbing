import Foundation

// Codable models matching the JSON exported by work/export-data.mjs from the
// web app's app/src/data/*.ts. Field-for-field ports of the TypeScript interfaces.

struct Crag: Codable, Identifiable, Hashable, Sendable {
    var id: String { slug }
    let slug: String
    let name: String
    let area: String
    let styles: [String]
    let grades: String
    let sun: String
    let approach: String
    let access: String
    let accessFee: String?
    let accessWarning: String?
    let summary: String
    let details: [String]
    let sectors: [Sector]?
    let highlight: String?
    let tags: [String]
    let coords: Coords?
    let routeCount: String?
    let bestSeason: String?
    let verified: String?

    struct Sector: Codable, Hashable, Sendable {
        let name: String
        let note: String?
    }

    struct Coords: Codable, Hashable, Sendable {
        let lat: Double
        let lng: Double
    }
}

struct RouteRecord: Codable, Identifiable, Hashable, Sendable {
    var id: String { "\(crag)|\(name)" }
    let name: String
    let crag: String
    let sector: String?
    let grade: String
    let gradeSystem: String
    let style: String
    let stars: Double?
    let bolts: Int?
    let lengthM: Double?
    let fa: String?
    let protection: String?
    let description: String?
    let ticks: Int?
    let source: String
    let sourceUrl: String?
    let verified: Bool
    let note: String?
}

struct PhotoEntry: Codable, Identifiable, Hashable, Sendable {
    var id: String { file }
    /// Bundle-relative path under Resources/, e.g. "Images/guide/p12-0-X30.jpg".
    let file: String
    let kind: String
    let caption: String
    let crag: String?
    let credit: String?
    let license: String?
    let sourceUrl: String?
    let page: Int?

    /// Guide images the classifier marked unusable keep their label with an "-unusable" suffix.
    var isUsable: Bool { !kind.hasSuffix("-unusable") }
    /// NoDerivatives licenses forbid cropping — display scaled but unmodified.
    var isNdLicense: Bool { (license ?? "").contains("ND") }
}

/// Wrapper matching photos.json: { "guide": [...], "community": [...] }.
struct PhotosFile: Codable, Sendable {
    let guide: [PhotoEntry]
    let community: [PhotoEntry]
}

struct CommunityReport: Codable, Identifiable, Hashable, Sendable {
    var id: String { url }
    let title: String
    let author: String
    let date: String
    let url: String
    let type: String
    let summary: String
    /// Bundle-relative paths under Resources/Images/community/.
    let photos: [String]?
}

struct Service: Codable, Identifiable, Hashable, Sendable {
    var id: String { name }
    let name: String
    let role: String
    let since: String
    let summary: String
    let bullets: [String]
    let contact: String
    let url: String
    let verified: String?
}

struct SourceLink: Codable, Identifiable, Hashable, Sendable {
    var id: String { url }
    let name: String
    let url: String
    let used: String
}

// MARK: - info.json (trip-planning content)

struct GuideInfo: Codable, Sendable {
    let gettingThere: GettingThere
    let seasons: Seasons
    let gearAndSafety: GearAndSafety
    let ethics: Ethics
    let itineraries: [Itinerary]
    let guidebooks: [Guidebook]
}

struct GettingThere: Codable, Sendable {
    let toIsland: [String]
    let ferries: [FerryRoute]
    let conflicts: [String]
    let onIsland: [String]
    let withGear: [String]
}

struct FerryRoute: Codable, Hashable, Sendable {
    let route: String
    let operators: String
    let duration: String
    let fare: String?
    let notes: String?
}

struct Seasons: Codable, Sendable {
    let climate: String
    let table: [Season]
    let dailyRhythm: [String]
    let notes: [String]
}

struct Season: Codable, Hashable, Sendable {
    let period: String
    let conditions: String
    let note: String
}

struct GearAndSafety: Codable, Sendable {
    let rockDemands: [String]
    let kitList: [String]
    let bolts: String
    let hazards: [String]
    let shops: [GearShop]
}

struct GearShop: Codable, Hashable, Sendable {
    let name: String
    let location: String
    let services: [String]
    let verified: String?
}

struct Ethics: Codable, Sendable {
    let officialLine: [String]
    let officialLineSource: String
    let rules: [String]
    let fullerPicture: [String]
}

struct Itinerary: Codable, Identifiable, Hashable, Sendable {
    var id: String { slug }
    let slug: String
    let name: String
    let days: [ItineraryDay]
}

struct ItineraryDay: Codable, Hashable, Sendable {
    let label: String
    let steps: [String]
}

struct Guidebook: Codable, Hashable, Sendable {
    let title: String
    let author: String
    let year: String
    let note: String
    let url: String?
    let current: Bool
}
