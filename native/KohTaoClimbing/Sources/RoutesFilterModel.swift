import Foundation
import Observation

/// Photo presence for Routes filter chips (uses crag-linked PhotoEntry data only).
enum PhotoPresenceFilter: String, CaseIterable, Identifiable, Sendable {
    case all
    case hasPhoto = "has-photo"
    case noPhoto = "no-photo"

    var id: String { rawValue }

    var chipLabel: String {
        switch self {
        case .all: return "photo"
        case .hasPhoto: return "has-photo"
        case .noPhoto: return "no-photo"
        }
    }

    static func fromLaunchArg(_ arg: String) -> PhotoPresenceFilter? {
        switch arg.lowercased() {
        case "has-photo", "hasphoto", "has": return .hasPhoto
        case "no-photo", "nophoto", "no": return .noPhoto
        case "all", "any": return .all
        default: return nil
        }
    }
}

/// Shared Routes filter state so Map/Crag detail can deep-link into Routes
/// with a crag chip (and optional style/grade band) already applied.
@Observable
@MainActor
final class RoutesFilterModel {
    var searchText: String = ""
    var selectedStyle: String?
    var verifiedOnly: Bool = false
    var gradeBand: GradeBand?
    /// When set, Routes list is limited to `route.crag == selectedCragName`.
    var selectedCragName: String?
    /// has-photo | no-photo alongside grade/style (crag photo membership).
    var photoFilter: PhotoPresenceFilter = .all
    /// Bumped when Map/CragDetail asks to show the Routes tab.
    private(set) var tabJumpToken: Int = 0

    var hasActiveFilters: Bool {
        selectedStyle != nil || gradeBand != nil || verifiedOnly
            || selectedCragName != nil || photoFilter != .all
    }

    func clearFilters(keepingSearch: Bool = false) {
        selectedStyle = nil
        gradeBand = nil
        verifiedOnly = false
        selectedCragName = nil
        photoFilter = .all
        if !keepingSearch { searchText = "" }
    }

    /// Map/CragDetail → Routes: scope to this crag and jump tabs.
    func openCrag(_ name: String, style: String? = nil) {
        selectedCragName = name
        searchText = ""
        if let style { selectedStyle = style }
        tabJumpToken += 1
    }
}
