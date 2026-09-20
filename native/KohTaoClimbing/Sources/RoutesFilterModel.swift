import Foundation
import Observation

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
    /// Bumped when Map/CragDetail asks to show the Routes tab.
    private(set) var tabJumpToken: Int = 0

    var hasActiveFilters: Bool {
        selectedStyle != nil || gradeBand != nil || verifiedOnly || selectedCragName != nil
    }

    func clearFilters(keepingSearch: Bool = false) {
        selectedStyle = nil
        gradeBand = nil
        verifiedOnly = false
        selectedCragName = nil
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
