import SwiftUI

/// Routes tab: all 624 routes with search, style chips, a verified-only toggle
/// and optional grade sorting. Grouped by crag in the default order.
struct RoutesTabView: View {
    let store: DataStore
    @State private var searchText = ""
    @State private var selectedStyle: String? = RoutesTabView.debugStyle
    @State private var verifiedOnly = false
    @State private var gradeSort: GradeSortOrder = RoutesTabView.debugSort

    // Testing/screenshot hooks: `-routesStyle boulder -routesSort asc|desc`.
    private static let debugStyle: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-routesStyle"), i + 1 < args.count else { return nil }
        return args[i + 1]
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

    // Testing/screenshot hook: `-initialRoute <name substring>` pushes that route.
    private static let debugRoute: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-initialRoute"), i + 1 < args.count else { return nil }
        return args[i + 1].lowercased()
    }()

    /// Style categories present in the data, well-known ones first.
    private var stylesPresent: [String] {
        var set = Set(store.routes.map { CragStyle.primaryStyle($0.style) })
        let known = ["boulder", "sport", "toprope", "trad", "multipitch", "dws"]
        let ordered = known.filter { set.remove($0) != nil }
        return ordered + set.sorted()
    }

    private var trimmedQuery: String {
        searchText.trimmingCharacters(in: .whitespaces)
    }

    private var hasActiveFilters: Bool {
        selectedStyle != nil || verifiedOnly
    }

    private var filtered: [RouteRecord] {
        let query = trimmedQuery.lowercased()
        return store.routes.filter { route in
            if verifiedOnly && !route.verified { return false }
            if let selectedStyle, CragStyle.primaryStyle(route.style) != selectedStyle { return false }
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
            .searchable(text: $searchText, prompt: "Route, crag, sector or grade")
            .overlay {
                if filtered.isEmpty {
                    emptyState
                }
            }
            .onAppear {
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
                message: "Try another style, or clear the filters to browse every route on the island.",
                systemImage: "line.3.horizontal.decrease.circle",
                actionTitle: "Clear filters",
                action: clearFilters
            )
        }
    }

    private func clearFilters() {
        withAnimation(.snappy) {
            selectedStyle = nil
            verifiedOnly = false
        }
    }

    // MARK: - Filter bar

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(stylesPresent, id: \.self) { style in
                    FilterChip(
                        text: style,
                        color: CragStyle.color(style),
                        isSelected: selectedStyle == style
                    ) {
                        withAnimation(.snappy) {
                            selectedStyle = selectedStyle == style ? nil : style
                        }
                    }
                }
                FilterChip(
                    text: "verified",
                    color: .green,
                    systemImage: "checkmark.seal.fill",
                    isSelected: verifiedOnly
                ) {
                    withAnimation(.snappy) { verifiedOnly.toggle() }
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
                if hasActiveFilters {
                    FilterChip(
                        text: "clear",
                        color: .secondary,
                        systemImage: "xmark",
                        isSelected: false,
                        action: clearFilters
                    )
                    .accessibilityLabel("Clear filters")
                    .transition(.opacity.combined(with: .scale(scale: 0.9)))
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
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
                                RouteRow(route: route)
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
                            RouteRow(route: route)
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

/// Filter chip appearance: soft neutral capsule at rest, tinted fill + heavier text when selected.
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
        .frame(minHeight: 34)
        .background(isSelected ? color.opacity(0.18) : Color.secondary.opacity(0.10), in: Capsule())
        .foregroundStyle(isSelected ? color : .secondary)
        .contentShape(Capsule())
    }
}

/// Route row: grade leads (climbers scan grades first), then name and quiet meta.
struct RouteRow: View {
    let route: RouteRecord

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
                HStack(spacing: 6) {
                    StyleBadge(text: route.style, color: CragStyle.color(forStyleString: route.style))
                    if let sector = route.sector {
                        Text(sector)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
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
                        .foregroundStyle(route.verified ? Color.green : GuideTheme.warning)
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
                LabeledContent("Database", value: route.source)
                if let sourceUrl = route.sourceUrl, let url = URL(string: sourceUrl) {
                    Link(destination: url) {
                        Label("Open original page", systemImage: "safari")
                    }
                }
            } header: {
                Text("Source")
            }
        }
        .navigationTitle(route.name)
        .navigationBarTitleDisplayMode(.inline)
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
