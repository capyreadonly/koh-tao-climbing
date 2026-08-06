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

    private var filtered: [RouteRecord] {
        let query = searchText.trimmingCharacters(in: .whitespaces).lowercased()
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
                    ContentUnavailableView.search(text: searchText)
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
                        selectedStyle = selectedStyle == style ? nil : style
                    }
                }
                FilterChip(
                    text: "verified",
                    color: .green,
                    systemImage: "checkmark.seal.fill",
                    isSelected: verifiedOnly
                ) {
                    verifiedOnly.toggle()
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
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
    }

    // MARK: - Route list

    @ViewBuilder
    private var routeList: some View {
        if gradeSort == .off {
            List {
                ForEach(groups, id: \.crag) { group in
                    Section(group.crag) {
                        ForEach(group.routes) { route in
                            NavigationLink(value: route) {
                                RouteRow(route: route)
                            }
                        }
                    }
                }
            }
        } else {
            List {
                Section("\(filtered.count) routes") {
                    ForEach(gradeSorted) { route in
                        NavigationLink(value: route) {
                            RouteRow(route: route)
                        }
                    }
                }
            }
        }
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
    }
}

struct FilterChipLabel: View {
    let text: String
    var color: Color = .secondary
    var systemImage: String? = nil
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 4) {
            if let systemImage {
                Image(systemName: systemImage)
            }
            Text(text)
        }
        .font(.caption.weight(.medium))
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(isSelected ? color.opacity(0.25) : color.opacity(0.1), in: Capsule())
        .foregroundStyle(isSelected ? color : .secondary)
        .overlay {
            Capsule().strokeBorder(isSelected ? color : .clear, lineWidth: 1)
        }
    }
}

struct RouteRow: View {
    let route: RouteRecord

    var body: some View {
        HStack(spacing: 8) {
            VStack(alignment: .leading, spacing: 3) {
                Text(route.name)
                    .font(.subheadline.weight(.medium))
                HStack(spacing: 4) {
                    StyleBadge(text: route.grade, color: .primary)
                    StyleBadge(text: route.style, color: CragStyle.color(forStyleString: route.style))
                    if let sector = route.sector {
                        Text(sector)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
            }
            Spacer(minLength: 4)
            if let stars = route.stars, stars > 0 {
                StarsView(stars: stars)
            }
            VerifiedMark(verified: route.verified)
                .font(.caption)
        }
        .padding(.vertical, 1)
    }
}

/// Route detail: grade/style facts, protection and description, source link.
/// The crag name links across to that crag's detail screen.
struct RouteDetailView: View {
    let route: RouteRecord
    let store: DataStore

    var body: some View {
        List {
            Section {
                HStack {
                    Label(route.verified ? "Verified" : "Unverified — sources conflict or unconfirmed",
                          systemImage: route.verified ? "checkmark.seal.fill" : "exclamationmark.circle")
                        .foregroundStyle(route.verified ? Color.green : Color.orange)
                        .font(.callout)
                    Spacer()
                    if let stars = route.stars, stars > 0 {
                        StarsView(stars: stars)
                    }
                }
            }

            Section("Facts") {
                LabeledContent("Grade", value: "\(route.grade) (\(route.gradeSystem))")
                LabeledContent("Style", value: route.style)
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
                if let length = route.lengthM {
                    LabeledContent("Length", value: String(format: "%.0f m", length))
                }
                if let bolts = route.bolts {
                    LabeledContent("Bolts", value: "\(bolts)")
                }
                if let fa = route.fa {
                    LabeledContent("First ascent", value: fa)
                }
                if let ticks = route.ticks {
                    LabeledContent("27crags ticks", value: "\(ticks)")
                }
            }

            if let protection = route.protection {
                Section("Protection") {
                    Text(protection).font(.callout)
                }
            }

            if let description = route.description {
                Section("Description") {
                    Text(description).font(.callout)
                }
            }

            if let note = route.note {
                Section {
                    Label(note, systemImage: "info.circle")
                        .font(.callout)
                        .foregroundStyle(.blue)
                }
            }

            Section("Source") {
                LabeledContent("Database", value: route.source)
                if let sourceUrl = route.sourceUrl, let url = URL(string: sourceUrl) {
                    Link(destination: url) {
                        Label("Open original page", systemImage: "safari")
                    }
                }
            }
        }
        .navigationTitle(route.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
