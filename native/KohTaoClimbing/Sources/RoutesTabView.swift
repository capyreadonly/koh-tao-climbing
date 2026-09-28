import SwiftUI

/// Routes tab: all 624 routes with search, style + grade + photo filters, a verified-only
/// toggle and optional grade sorting. Grouped by crag in the default order.
struct RoutesTabView: View {
    let store: DataStore
    @Bindable var filter: RoutesFilterModel
    @State private var gradeSort: GradeSortOrder = RoutesTabView.debugSort

    // Testing/screenshot hooks: `-routesStyle boulder -routesSort asc|desc`.
    private static let debugStyle: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-routesStyle"), i + 1 < args.count else { return nil }
        return args[i + 1]
    }()
    /// Testing hook: `-routesGradeBand easy|mid|hard|project` pre-selects that band.
    private static let debugGradeBand: GradeBand? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-routesGradeBand"), i + 1 < args.count else { return nil }
        return GradeBand.fromLaunchArg(args[i + 1])
    }()
    private static let debugSort: GradeSortOrder = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-routesSort"), i + 1 < args.count else { return .off }
        return args[i + 1] == "asc" ? .ascending : args[i + 1] == "desc" ? .descending : .off
    }()

    enum GradeSortOrder: String, CaseIterable, Identifiable {
        case off = "By crag"
        case ascending = "Grade ↑"
        case descending = "Grade ↓"
        var id: String { rawValue }
    }

    @State private var path = NavigationPath()
    @FocusState private var isSearchFocused: Bool

    /// Testing hook: `-routesPhotoFilter has-photo|no-photo` pre-selects photo filter.
    private static let debugPhotoFilter: PhotoPresenceFilter? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-routesPhotoFilter"), i + 1 < args.count else { return nil }
        return PhotoPresenceFilter.fromLaunchArg(args[i + 1])
    }()

    private func applyDebugHooks() {
        if let s = Self.debugStyle { filter.selectedStyle = s }
        if let b = Self.debugGradeBand { filter.gradeBand = b }
        if let p = Self.debugPhotoFilter { filter.photoFilter = p }
        if let i = ProcessInfo.processInfo.arguments.firstIndex(of: "-routesCrag"),
           i + 1 < ProcessInfo.processInfo.arguments.count {
            filter.selectedCragName = ProcessInfo.processInfo.arguments[i + 1]
        }
    }

    // Testing/screenshot hook: `-initialRoute <name substring>` pushes that route.
    private static let debugRoute: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-initialRoute"), i + 1 < args.count else { return nil }
        return args[i + 1].lowercased()
    }()


    private var trimmedQuery: String {
        filter.searchText.trimmingCharacters(in: .whitespaces)
    }

    private var hasActiveFilters: Bool { filter.hasActiveFilters }

    /// Style chips rebuild from the active crag's routes when a crag chip is set.
    private var stylesPresent: [String] {
        let pool: [RouteRecord]
        if let name = filter.selectedCragName {
            pool = store.routes.filter { $0.crag == name }
        } else {
            pool = store.routes
        }
        var set = Set(pool.map { CragStyle.primaryStyle($0.style) })
        let known = ["boulder", "sport", "toprope", "trad", "multipitch", "dws"]
        let ordered = known.filter { set.remove($0) != nil }
        return ordered + set.sorted()
    }

    private var filtered: [RouteRecord] {
        let query = trimmedQuery.lowercased()
        return store.routes.filter { route in
            if filter.verifiedOnly && !route.verified { return false }
            if let style = filter.selectedStyle, CragStyle.primaryStyle(route.style) != style { return false }
            if let band = filter.gradeBand, !band.matches(route) { return false }
            if let cragName = filter.selectedCragName, route.crag != cragName { return false }
            switch filter.photoFilter {
            case .all: break
            case .hasPhoto:
                if !store.hasPhotos(forRoute: route) { return false }
            case .noPhoto:
                if store.hasPhotos(forRoute: route) { return false }
            }
            guard !query.isEmpty else { return true }
            return route.name.lowercased().contains(query)
                || route.crag.lowercased().contains(query)
                || route.grade.lowercased().contains(query)
                || (route.sector?.lowercased().contains(query) ?? false)
        }
    }

    /// Group by crag preserving the JSON's route order within each group.
    private var groups: [(crag: String, routes: [RouteRecord])] {
        var order: [String] = []
        var byCrag: [String: [RouteRecord]] = [:]
        for route in filtered {
            if byCrag[route.crag] == nil { order.append(route.crag) }
            byCrag[route.crag, default: []].append(route)
        }
        return order.map { (crag: $0, routes: byCrag[$0] ?? []) }
    }

    private var gradeSorted: [RouteRecord] {
        let direction: Double = gradeSort == .descending ? -1 : 1
        return filtered.sorted { a, b in
            let ka = GradeSort.key(for: a), kb = GradeSort.key(for: b)
            if ka.system != kb.system {
                return Double(ka.system - kb.system) * direction < 0
            }
            if ka.value != kb.value {
                return (ka.value - kb.value) * direction < 0
            }
            return a.name.localizedCaseInsensitiveCompare(b.name) == .orderedAscending
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            VStack(spacing: 0) {
                filterBar
                Divider()
                routeList
            }
            .navigationTitle("Routes")
            .navigationDestination(for: RouteRecord.self) { route in
                RouteDetailView(route: route, store: store)
            }
            .navigationDestination(for: Crag.self) { crag in
                CragDetailView(crag: crag, store: store)
            }
            .searchable(text: $filter.searchText, prompt: "Route, crag, sector or grade")
            .searchFocused($isSearchFocused)
            .reviewPromptRestingScreen(isResting: path.isEmpty && !isSearchFocused)
            .overlay {
                if filtered.isEmpty {
                    emptyState
                }
            }
            .onAppear {
                applyDebugHooks()
                guard path.isEmpty, let keyword = Self.debugRoute,
                      let match = store.routes.first(where: { $0.name.lowercased().contains(keyword) })
                else { return }
                path.append(match)
            }
        }
    }

    // MARK: - Empty state

    @ViewBuilder
    private var emptyState: some View {
        if !trimmedQuery.isEmpty {
            GuideEmptyState(
                title: "No routes match",
                message: hasActiveFilters
                    ? "Nothing called “\(trimmedQuery)” with these filters. Try another spelling, or clear the filters to search every route."
                    : "Nothing called “\(trimmedQuery)” yet. Try a crag, sector or grade instead.",
                systemImage: "figure.climbing",
                actionTitle: hasActiveFilters ? "Clear filters" : nil,
                action: hasActiveFilters ? { clearFilters() } : nil
            )
        } else {
            GuideEmptyState(
                title: "No routes match",
                message: "Try another grade or style, or clear the filters to browse every route on the island.",
                systemImage: "line.3.horizontal.decrease.circle",
                actionTitle: "Clear filters",
                action: clearFilters
            )
        }
    }

    private func clearFilters() {
        withAnimation(.snappy) {
            filter.clearFilters()
        }
    }

    // MARK: - Filter bar

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // First, so "clear" is on screen whenever a filter is active; always
                // present (just disabled when there's nothing to clear) so the chips
                // don't shift sideways under the finger as filters toggle.
                FilterChip(
                    text: "clear",
                    color: .secondary,
                    systemImage: "xmark",
                    isSelected: false,
                    action: clearFilters
                )
                .disabled(!hasActiveFilters)
                .opacity(hasActiveFilters ? 1 : 0.4)
                .accessibilityLabel("Clear filters")
                if let cragName = filter.selectedCragName {
                    FilterChip(
                        text: "Crag: \(cragName)",
                        color: GuideTheme.brand,
                        systemImage: "xmark",
                        isSelected: true
                    ) {
                        withAnimation(.snappy) { filter.selectedCragName = nil }
                    }
                    .accessibilityLabel("Crag filter, \(cragName), tap to clear")
                }
                // Grade and photo menus lead: their selections used to sit off-screen
                // to the right of five or six style chips, so an active filter was
                // invisible without scrolling the bar.
                Menu {
                    Button("Any grade") {
                        withAnimation(.snappy) { filter.gradeBand = nil }
                    }
                    Divider()
                    ForEach(GradeBand.allCases) { band in
                        Button(band.rawValue) {
                            withAnimation(.snappy) {
                                filter.gradeBand = filter.gradeBand == band ? nil : band
                            }
                        }
                    }
                } label: {
                    FilterChipLabel(
                        text: filter.gradeBand?.rawValue ?? "grade",
                        color: .indigo,
                        systemImage: "number",
                        isSelected: filter.gradeBand != nil
                    )
                }
                .accessibilityLabel(filter.gradeBand.map { "Grade filter, \($0.rawValue)" } ?? "Grade filter")
                .accessibilityIdentifier("routesGradeFilter")
                Menu {
                    Button(PhotoPresenceFilter.all.menuTitle) {
                        withAnimation(.snappy) { filter.photoFilter = .all }
                    }
                    Divider()
                    Button(PhotoPresenceFilter.hasPhoto.menuTitle) {
                        withAnimation(.snappy) {
                            filter.photoFilter = filter.photoFilter == .hasPhoto ? .all : .hasPhoto
                        }
                    }
                    Button(PhotoPresenceFilter.noPhoto.menuTitle) {
                        withAnimation(.snappy) {
                            filter.photoFilter = filter.photoFilter == .noPhoto ? .all : .noPhoto
                        }
                    }
                } label: {
                    FilterChipLabel(
                        text: filter.photoFilter.chipLabel,
                        color: .pink,
                        systemImage: "photo",
                        isSelected: filter.photoFilter != .all
                    )
                }
                .accessibilityLabel(filter.photoFilter.accessibilityLabel)
                .accessibilityIdentifier("routesPhotoFilter")
                ForEach(stylesPresent, id: \.self) { style in
                    FilterChip(
                        text: style,
                        color: CragStyle.color(style),
                        isSelected: filter.selectedStyle == style
                    ) {
                        withAnimation(.snappy) {
                            filter.selectedStyle = filter.selectedStyle == style ? nil : style
                        }
                    }
                }
                FilterChip(
                    text: "verified",
                    color: .green,
                    systemImage: "checkmark.seal.fill",
                    isSelected: filter.verifiedOnly
                ) {
                    withAnimation(.snappy) { filter.verifiedOnly.toggle() }
                }
                Menu {
                    Picker("Sort", selection: $gradeSort) {
                        ForEach(GradeSortOrder.allCases) { order in
                            Text(order.rawValue).tag(order)
                        }
                    }
                } label: {
                    FilterChipLabel(
                        text: gradeSort.rawValue,
                        color: .secondary,
                        systemImage: "arrow.up.arrow.down",
                        isSelected: gradeSort != .off
                    )
                }
                .accessibilityLabel("Sort routes, \(gradeSort.rawValue)")
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
        .animation(.snappy, value: hasActiveFilters)
    }

    // MARK: - Route list

    @ViewBuilder
    private var routeList: some View {
        if gradeSort == .off {
            List {
                ForEach(groups, id: \.crag) { group in
                    Section {
                        ForEach(group.routes) { route in
                            NavigationLink(value: route) {
                                RouteRow(route: route, hasPhoto: store.hasPhotos(forRoute: route))
                            }
                        }
                    } header: {
                        RouteGroupHeader(title: group.crag, count: group.routes.count)
                    }
                }
            }
        } else {
            List {
                Section {
                    ForEach(gradeSorted) { route in
                        NavigationLink(value: route) {
                            RouteRow(route: route, hasPhoto: store.hasPhotos(forRoute: route))
                        }
                    }
                } header: {
                    RouteGroupHeader(
                        title: gradeSort == .ascending ? "Easiest first" : "Hardest first",
                        count: filtered.count
                    )
                }
            }
        }
    }
}

/// Editorial crag-group header for the route list: sentence-case title with a quiet count.
private struct RouteGroupHeader: View {
    let title: String
    let count: Int

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.headline)
                .foregroundStyle(.primary)
            Spacer()
            Text(count == 1 ? "1 route" : "\(count) routes")
                .font(.caption)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
        .textCase(nil)
        .padding(.top, 2)
        .accessibilityElement(children: .combine)
    }
}

/// Tappable capsule used for the route filter bar.
struct FilterChip: View {
    let text: String
    var color: Color = .secondary
    var systemImage: String? = nil
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            FilterChipLabel(text: text, color: color, systemImage: systemImage, isSelected: isSelected)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

/// Filter chip appearance: neutral fill capsule at rest; when selected, a tinted fill
/// with a tinted border and label, so the state reads without relying on hue alone.
/// The capsule is drawn 36 pt tall but the tappable area is a full 44 pt.
struct FilterChipLabel: View {
    let text: String
    var color: Color = .secondary
    var systemImage: String? = nil
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 5) {
            if let systemImage {
                Image(systemName: systemImage)
                    .font(.caption.weight(.semibold))
            }
            Text(text)
        }
        .font(.subheadline.weight(isSelected ? .semibold : .medium))
        .lineLimit(1)
        .padding(.horizontal, 13)
        .padding(.vertical, 7)
        .frame(minHeight: 36)
        .background {
            Capsule().fill(isSelected ? AnyShapeStyle(color.opacity(0.2)) : AnyShapeStyle(.fill.tertiary))
        }
        .overlay {
            Capsule().strokeBorder(isSelected ? color.opacity(0.6) : .clear, lineWidth: 1)
        }
        .foregroundStyle(isSelected ? GuideTheme.readable(color) : Color.primary)
        .frame(minHeight: GuideTheme.minTapTarget)
        .contentShape(Rectangle())
    }
}

/// Route row: grade leads (climbers scan grades first), then name and quiet meta.
struct RouteRow: View {
    let route: RouteRecord
    /// Crag-linked bundled photo presence (PhotoEntry.crag) — not a per-route image field.
    var hasPhoto: Bool = false

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            Text(route.grade)
                .font(.title3.weight(.bold))
                .monospacedDigit()
                .lineLimit(1)
                .minimumScaleFactor(0.7)
                .frame(minWidth: 52, alignment: .leading)
                .foregroundStyle(.primary)

            VStack(alignment: .leading, spacing: 3) {
                Text(route.name)
                    .font(.body)
                    .lineLimit(2)
                // Style and photo label keep their full width (they used to squeeze
                // "sport/toprope" to "sport/t…" and wrap the photo label onto two lines).
                // The sector sits beside them when it fits, else on its own line.
                ViewThatFits(in: .horizontal) {
                    HStack(spacing: 6) {
                        metaTags
                        // Full width here, so a long sector fails this layout and
                        // ViewThatFits falls through to the two-line one.
                        sectorText.fixedSize()
                    }
                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 6) { metaTags }
                        sectorText
                    }
                    // Last resort (accessibility text sizes): one item per line, and
                    // the badge may truncate rather than spill into the stars column.
                    VStack(alignment: .leading, spacing: 3) {
                        StyleBadge(text: route.style, color: CragStyle.color(forStyleString: route.style))
                        photoLabel
                        sectorText
                    }
                }
            }

            Spacer(minLength: 4)

            VStack(alignment: .trailing, spacing: 4) {
                if let stars = route.stars, stars > 0 {
                    StarsView(stars: stars)
                }
                VerifiedMark(verified: route.verified)
                    .font(.caption2)
            }
        }
        .padding(.vertical, 3)
    }

    @ViewBuilder
    private var metaTags: some View {
        StyleBadge(text: route.style, color: CragStyle.color(forStyleString: route.style))
            .fixedSize()
        photoLabel
            .fixedSize()
    }

    /// Crag-level, not per-route (DQ-003-F2): photos have no route link. Shown only
    /// when true; "No crag photos" on the rest would add noise without adding truth.
    @ViewBuilder
    private var photoLabel: some View {
        if hasPhoto {
            Text("Crag photos")
                .font(.caption2.weight(.medium))
                .foregroundStyle(GuideTheme.readable(.pink))
                .lineLimit(1)
        }
    }

    @ViewBuilder
    private var sectorText: some View {
        if let sector = route.sector {
            Text(sector)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
        }
    }
}

/// Route detail: grade/style/stars hero, facts, protection and description, source link.
/// The crag name links across to that crag's detail screen.
struct RouteDetailView: View {
    let route: RouteRecord
    let store: DataStore
    @Environment(MapFocus.self) private var mapFocus

    private var mappedCrag: Crag? {
        guard let crag = store.crag(named: route.crag), crag.coords != nil else { return nil }
        return crag
    }

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(alignment: .firstTextBaseline, spacing: 14) {
                        Text(route.grade)
                            .font(.system(.largeTitle, design: .rounded, weight: .bold))
                            .monospacedDigit()
                            .lineLimit(1)
                            .minimumScaleFactor(0.6)
                        Text(route.gradeSystem)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Spacer()
                        if let stars = route.stars, stars > 0 {
                            StarsView(stars: stars)
                        }
                    }
                    HStack(spacing: 8) {
                        StyleBadge(text: route.style, color: CragStyle.color(forStyleString: route.style))
                        if let length = route.lengthM {
                            Text(String(format: "%.0f m", length))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        if let bolts = route.bolts {
                            Text(bolts == 1 ? "1 bolt" : "\(bolts) bolts")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    Label(route.verified ? "Verified against the sources" : "Unverified — sources conflict or unconfirmed",
                          systemImage: route.verified ? "checkmark.seal.fill" : "exclamationmark.circle")
                        .font(.footnote)
                        .foregroundStyle(GuideTheme.readable(route.verified ? .green : GuideTheme.warning))
                }
                .padding(.vertical, 6)
                .accessibilityElement(children: .combine)
            }

            if let crag = mappedCrag {
                Section {
                    Button {
                        mapFocus.show(cragSlug: crag.slug)
                    } label: {
                        Label("Show \(crag.name) on map", systemImage: "map")
                            .font(.body.weight(.medium))
                    }
                    .accessibilityHint("Switches to the Map tab and focuses this route’s area")
                }
            }

            Section {
                if let crag = store.crag(named: route.crag) {
                    NavigationLink(value: crag) {
                        LabeledContent("Crag", value: route.crag)
                    }
                } else {
                    LabeledContent("Crag", value: route.crag)
                }
                if let sector = route.sector {
                    LabeledContent("Sector", value: sector)
                }
                if let fa = route.fa {
                    LabeledContent("First ascent", value: fa)
                }
                if let ticks = route.ticks {
                    LabeledContent("27crags ticks", value: "\(ticks)")
                }
            } header: {
                GuideHeader(title: "Where")
            }

            if let description = route.description {
                Section {
                    Text(description)
                        .font(.body)
                } header: {
                    GuideHeader(title: "The climb")
                }
            }

            if let protection = route.protection {
                Section {
                    Text(protection)
                        .font(.body)
                } header: {
                    GuideHeader(title: "Protection")
                }
            }

            if let note = route.note {
                Section {
                    GuideCallout(text: note, systemImage: "info.circle.fill", tint: GuideTheme.note)
                        .listRowInsets(EdgeInsets())
                        .listRowBackground(Color.clear)
                }
            }

            Section {
                LabeledContent("Database", value: RouteSourceLabel.label(for: route.source))
                    .accessibilityIdentifier("routeSourceLabel")
                if let sourceUrl = route.sourceUrl, let url = URL(string: sourceUrl) {
                    Link(destination: url) {
                        Label(sourceUrl.lowercased().hasSuffix(".pdf") ? "Open the guidebook PDF" : "Open original page",
                              systemImage: sourceUrl.lowercased().hasSuffix(".pdf") ? "doc.richtext" : "safari")
                    }
                }
            } header: {
                Text("Source")
            }
        }
        .navigationTitle(route.name)
        .navigationBarTitleDisplayMode(.inline)
        .reviewPromptDetail("route:\(route.id)")
        .toolbar {
            if let crag = mappedCrag {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Show on map", systemImage: "map") {
                        mapFocus.show(cragSlug: crag.slug)
                    }
                    .accessibilityHint("Switches to the Map tab and focuses this route’s area")
                }
            }
        }
    }
}
