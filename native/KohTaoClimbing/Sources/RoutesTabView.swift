import SwiftUI

/// Routes tab: all 624 routes, grouped by crag, searchable.
struct RoutesTabView: View {
    let store: DataStore
    @State private var searchText = ""

    private var filtered: [RouteRecord] {
        let query = searchText.trimmingCharacters(in: .whitespaces).lowercased()
        guard !query.isEmpty else { return store.routes }
        return store.routes.filter {
            $0.name.lowercased().contains(query)
                || $0.crag.lowercased().contains(query)
                || $0.grade.lowercased().contains(query)
                || ($0.sector?.lowercased().contains(query) ?? false)
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

    var body: some View {
        NavigationStack {
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
            .navigationTitle("Routes")
            .navigationDestination(for: RouteRecord.self) { route in
                RouteDetailView(route: route)
            }
            .searchable(text: $searchText, prompt: "Route, crag, sector or grade")
            .overlay {
                if filtered.isEmpty {
                    ContentUnavailableView.search(text: searchText)
                }
            }
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
struct RouteDetailView: View {
    let route: RouteRecord

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
                LabeledContent("Crag", value: route.crag)
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
