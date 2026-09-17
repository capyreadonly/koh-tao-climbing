import SwiftUI

/// Plan tab: a grouped menu of trip-planning sub-screens (getting there, seasons,
/// gear & safety, ethics, itineraries, guidebooks) plus the Services and Sources
/// directories — native list navigation instead of one long scroll.
struct PlanTabView: View {
    let store: DataStore
    @State private var path = NavigationPath()

    enum PlanSection: String, Hashable, CaseIterable {
        case about, gettingThere, seasons, gear, ethics, itineraries, guidebooks, services, sources
    }

    // Testing/screenshot hook: `-planSection gettingThere` pushes that sub-screen.
    private static let debugSection: PlanSection? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-planSection"), i + 1 < args.count else { return nil }
        return PlanSection(rawValue: args[i + 1])
    }()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                if store.info != nil {
                    Section {
                        PlanRow(section: .gettingThere, title: "Getting There",
                                subtitle: "Ferries, transfers and moving around", systemImage: "ferry", tint: .blue)
                        PlanRow(section: .seasons, title: "Seasons",
                                subtitle: "When to go and the daily rhythm", systemImage: "sun.max", tint: .orange)
                        PlanRow(section: .gear, title: "Gear & Safety",
                                subtitle: "Kit list, bolts and hazards", systemImage: "backpack", tint: .green)
                        PlanRow(section: .ethics, title: "Ethics & Access",
                                subtitle: "The official line and the rules", systemImage: "leaf", tint: .teal)
                        PlanRow(section: .itineraries, title: "Itineraries",
                                subtitle: "Suggested days on the rock", systemImage: "map", tint: .purple)
                        PlanRow(section: .guidebooks, title: "Guidebooks",
                                subtitle: "Print and online guides", systemImage: "book", tint: .brown)
                    } header: {
                        GuideHeader(title: "Plan your trip", subtitle: "Everything you need before the ferry.")
                    }
                }
                Section {
                    PlanRow(section: .services, title: "Services & Operators",
                            subtitle: "Operators listed in this guide", systemImage: "person.2", tint: .indigo)
                    PlanRow(section: .sources, title: "Sources",
                            subtitle: "Where this guide's facts come from", systemImage: "link", tint: .secondary)
                } header: {
                    GuideHeader(title: "Directory")
                }
                Section {
                    PlanRow(section: .about, title: "About this guide",
                            subtitle: "An original community guide, offline", systemImage: "info.circle", tint: .secondary)
                } header: {
                    GuideHeader(title: "This guide")
                }
            }
            .navigationTitle("Plan")
            .navigationDestination(for: PlanSection.self) { section in
                destination(for: section)
            }
            .onAppear {
                guard path.isEmpty, let section = Self.debugSection else { return }
                path.append(section)
            }
        }
    }

    @ViewBuilder
    private func destination(for section: PlanSection) -> some View {
        switch section {
        case .about:
            AboutGuideView(store: store)
        case .gettingThere:
            if let info = store.info { GettingThereScreen(gettingThere: info.gettingThere) }
        case .seasons:
            if let info = store.info { SeasonsScreen(seasons: info.seasons) }
        case .gear:
            if let info = store.info { GearSafetyScreen(gear: info.gearAndSafety) }
        case .ethics:
            if let info = store.info { EthicsScreen(ethics: info.ethics) }
        case .itineraries:
            if let info = store.info { ItinerariesScreen(itineraries: info.itineraries) }
        case .guidebooks:
            if let info = store.info { GuidebooksScreen(guidebooks: info.guidebooks) }
        case .services:
            ServicesScreen(services: store.services)
        case .sources:
            SourcesScreen(sources: store.sources)
        }
    }
}

/// Plan hub row: tinted symbol, title and a one-line teaser of what the screen holds.
private struct PlanRow: View {
    let section: PlanTabView.PlanSection
    let title: String
    let subtitle: String
    let systemImage: String
    var tint: Color = .accentColor

    var body: some View {
        NavigationLink(value: section) {
            HStack(spacing: 14) {
                Image(systemName: systemImage)
                    .font(.body.weight(.medium))
                    .foregroundStyle(tint)
                    .frame(width: 34, height: 34)
                    .background(tint.opacity(0.12), in: RoundedRectangle(cornerRadius: 9, style: .continuous))
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body.weight(.medium))
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            .padding(.vertical, 3)
        }
    }
}

/// Plain prose paragraphs inside a section — the body of most Plan screens.
private struct ProseRows: View {
    let paragraphs: [String]

    var body: some View {
        ForEach(paragraphs, id: \.self) { paragraph in
            Text(paragraph)
                .font(.body)
                .padding(.vertical, 2)
        }
    }
}

/// Stack of tinted callouts (hazards, conflicting sources) in one clear-backed row.
private struct CalloutRows: View {
    let items: [String]
    var systemImage: String = "exclamationmark.triangle.fill"
    var tint: Color = GuideTheme.warning

    var body: some View {
        VStack(spacing: 8) {
            ForEach(items, id: \.self) { item in
                GuideCallout(text: item, systemImage: systemImage, tint: tint)
            }
        }
        .listRowInsets(EdgeInsets())
        .listRowBackground(Color.clear)
    }
}

// MARK: - Getting there

private struct GettingThereScreen: View {
    let gettingThere: GettingThere

    var body: some View {
        List {
            Section {
                ProseRows(paragraphs: gettingThere.toIsland)
            } header: {
                GuideHeader(title: "Getting to the island")
            }
            Section {
                ForEach(gettingThere.ferries, id: \.self) { ferry in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(ferry.route)
                            .font(.headline)
                        Text(ferry.operators)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        HStack(spacing: 10) {
                            Label(ferry.duration, systemImage: "clock")
                            if let fare = ferry.fare {
                                Label(fare, systemImage: "banknote")
                            }
                        }
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .padding(.top, 1)
                        if let notes = ferry.notes {
                            Text(notes)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 3)
                }
            } header: {
                GuideHeader(title: "Ferries")
            }
            if !gettingThere.conflicts.isEmpty {
                Section {
                    CalloutRows(items: gettingThere.conflicts, systemImage: "arrow.triangle.branch")
                } header: {
                    GuideHeader(title: "Conflicting sources", subtitle: "References disagree here. Check before you travel.")
                }
            }
            Section {
                ProseRows(paragraphs: gettingThere.onIsland)
            } header: {
                GuideHeader(title: "On the island")
            }
            Section {
                ProseRows(paragraphs: gettingThere.withGear)
            } header: {
                GuideHeader(title: "Travelling with gear")
            }
        }
        .navigationTitle("Getting There")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Seasons

private struct SeasonsScreen: View {
    let seasons: Seasons

    var body: some View {
        List {
            Section {
                Text(seasons.climate)
                    .font(.body)
                    .padding(.vertical, 2)
            } header: {
                GuideHeader(title: "When to go")
            }
            Section {
                ForEach(seasons.table, id: \.self) { season in
                    VStack(alignment: .leading, spacing: 3) {
                        Text(season.period)
                            .font(.headline)
                        Text(season.conditions)
                            .font(.subheadline)
                        Text(season.note)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 3)
                }
            } header: {
                GuideHeader(title: "Through the year")
            }
            Section {
                ProseRows(paragraphs: seasons.dailyRhythm)
            } header: {
                GuideHeader(title: "Daily rhythm")
            }
            if !seasons.notes.isEmpty {
                Section {
                    ProseRows(paragraphs: seasons.notes)
                } header: {
                    GuideHeader(title: "Season notes")
                }
            }
        }
        .navigationTitle("Seasons")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Gear & safety

private struct GearSafetyScreen: View {
    let gear: GearAndSafety

    var body: some View {
        List {
            Section {
                ProseRows(paragraphs: gear.rockDemands)
            } header: {
                GuideHeader(title: "What the rock demands")
            }
            Section {
                ForEach(gear.kitList, id: \.self) { item in
                    Label {
                        Text(item).font(.body)
                    } icon: {
                        Image(systemName: "checkmark.circle")
                            .foregroundStyle(.green)
                    }
                    .padding(.vertical, 1)
                }
            } header: {
                GuideHeader(title: "Kit list")
            }
            Section {
                Text(gear.bolts)
                    .font(.body)
                    .padding(.vertical, 2)
            } header: {
                GuideHeader(title: "Bolts & fixed gear")
            }
            Section {
                CalloutRows(items: gear.hazards, tint: .red)
            } header: {
                GuideHeader(title: "Hazards", subtitle: "Worth reading before your first day out.")
            }
            Section {
                ForEach(gear.shops, id: \.self) { shop in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(shop.name)
                            .font(.headline)
                        Text(shop.location)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Text(shop.services.joined(separator: " · "))
                            .font(.caption)
                            .padding(.top, 1)
                        if let verified = shop.verified {
                            Text(verified)
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 3)
                }
            } header: {
                GuideHeader(title: "Gear shops & rental")
            }
        }
        .navigationTitle("Gear & Safety")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Ethics

private struct EthicsScreen: View {
    let ethics: Ethics

    var body: some View {
        List {
            Section {
                ProseRows(paragraphs: ethics.officialLine)
            } header: {
                GuideHeader(title: "The official line")
            } footer: {
                Text(ethics.officialLineSource)
            }
            Section {
                ForEach(ethics.rules, id: \.self) { rule in
                    Label {
                        Text(rule).font(.body)
                    } icon: {
                        Image(systemName: "leaf")
                            .foregroundStyle(.teal)
                    }
                    .padding(.vertical, 1)
                }
            } header: {
                GuideHeader(title: "Rules")
            }
            Section {
                ProseRows(paragraphs: ethics.fullerPicture)
            } header: {
                GuideHeader(title: "The fuller picture")
            }
        }
        .navigationTitle("Ethics & Access")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Itineraries

private struct ItinerariesScreen: View {
    let itineraries: [Itinerary]

    var body: some View {
        List {
            Section {
                ForEach(itineraries) { itinerary in
                    DisclosureGroup {
                        ForEach(itinerary.days, id: \.self) { day in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(day.label)
                                    .font(.subheadline.weight(.semibold))
                                ForEach(day.steps, id: \.self) { step in
                                    HStack(alignment: .top, spacing: 8) {
                                        Circle()
                                            .fill(.tertiary)
                                            .frame(width: 5, height: 5)
                                            .padding(.top, 7)
                                        Text(step)
                                            .font(.callout)
                                    }
                                }
                            }
                            .padding(.vertical, 3)
                        }
                    } label: {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(itinerary.name)
                                .font(.headline)
                            Text(itinerary.days.count == 1 ? "1 day" : "\(itinerary.days.count) days")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 2)
                    }
                }
            } header: {
                GuideHeader(title: "Suggested itineraries", subtitle: "Expand one to see the day-by-day plan.")
            }
        }
        .navigationTitle("Itineraries")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Guidebooks

private struct GuidebooksScreen: View {
    let guidebooks: [Guidebook]

    var body: some View {
        List {
            Section {
                ForEach(guidebooks, id: \.self) { book in
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(alignment: .firstTextBaseline, spacing: 8) {
                            Text(book.title)
                                .font(.headline)
                            if book.current {
                                StyleBadge(text: "current", color: .green)
                            }
                        }
                        Text("\(book.author) · \(book.year)")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Text(book.note)
                            .font(.callout)
                            .padding(.top, 1)
                        if let urlString = book.url, let url = URL(string: urlString) {
                            Link(destination: url) {
                                Label("Open", systemImage: "safari")
                                    .font(.subheadline)
                            }
                            .padding(.top, 2)
                        }
                    }
                    .padding(.vertical, 3)
                }
            } header: {
                GuideHeader(title: "Guidebooks")
            }
        }
        .navigationTitle("Guidebooks")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Services

private struct ServicesScreen: View {
    let services: [Service]

    var body: some View {
        List {
            Section {
                ForEach(services) { service in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(service.name)
                            .font(.headline)
                        Text("\(service.role) · since \(service.since)")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        Text(service.summary)
                            .font(.callout)
                            .padding(.top, 1)
                        ForEach(service.bullets, id: \.self) { bullet in
                            HStack(alignment: .top, spacing: 8) {
                                Circle()
                                    .fill(.tertiary)
                                    .frame(width: 5, height: 5)
                                    .padding(.top, 6)
                                Text(bullet)
                                    .font(.caption)
                            }
                        }
                        Text(service.contact)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .padding(.top, 2)
                        if let url = URL(string: service.url) {
                            Link(destination: url) {
                                Label("Website", systemImage: "safari")
                                    .font(.subheadline)
                            }
                            .padding(.top, 2)
                        }
                        if let verified = service.verified {
                            Text(verified)
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }
            } header: {
                GuideHeader(title: "Services & operators")
            }
        }
        .navigationTitle("Services")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Sources

private struct SourcesScreen: View {
    let sources: [SourceLink]

    var body: some View {
        List {
            Section {
                Text("This guide is an original compilation for Koh Tao — not a white-label template. Every entry below was used while fact-checking the on-device database.")
                    .font(.body)
                    .padding(.vertical, 2)
            }
            Section {
                ForEach(sources) { source in
                    VStack(alignment: .leading, spacing: 3) {
                        if let url = URL(string: source.url) {
                            Link(destination: url) {
                                Label(source.name, systemImage: "safari")
                                    .font(.subheadline.weight(.medium))
                            }
                        } else {
                            Text(source.name)
                                .font(.subheadline.weight(.medium))
                        }
                        Text("Used for: \(source.used)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 2)
                }
            } header: {
                GuideHeader(title: "Sources")
            }
        }
        .navigationTitle("Sources")
        .navigationBarTitleDisplayMode(.inline)
    }
}
