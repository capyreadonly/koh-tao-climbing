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
                Section("This guide") {
                    NavigationLink(value: PlanSection.about) {
                        Label("About this guide", systemImage: "info.circle")
                    }
                }
                if store.info != nil {
                    Section("Trip planning") {
                        NavigationLink(value: PlanSection.gettingThere) {
                            Label("Getting There", systemImage: "ferry")
                        }
                        NavigationLink(value: PlanSection.seasons) {
                            Label("Seasons", systemImage: "sun.max")
                        }
                        NavigationLink(value: PlanSection.gear) {
                            Label("Gear & Safety", systemImage: "backpack")
                        }
                        NavigationLink(value: PlanSection.ethics) {
                            Label("Ethics & Access", systemImage: "leaf")
                        }
                        NavigationLink(value: PlanSection.itineraries) {
                            Label("Itineraries", systemImage: "map")
                        }
                        NavigationLink(value: PlanSection.guidebooks) {
                            Label("Guidebooks", systemImage: "book")
                        }
                    }
                }
                Section("Directory") {
                    NavigationLink(value: PlanSection.services) {
                        Label("Services & Operators", systemImage: "person.2")
                    }
                    NavigationLink(value: PlanSection.sources) {
                        Label("Sources", systemImage: "link")
                    }
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

// MARK: - Getting there

private struct GettingThereScreen: View {
    let gettingThere: GettingThere

    var body: some View {
        List {
            Section("Getting to the island") {
                ForEach(gettingThere.toIsland, id: \.self) { Text($0).font(.callout) }
            }
            Section("Ferries") {
                ForEach(gettingThere.ferries, id: \.self) { ferry in
                    VStack(alignment: .leading, spacing: 3) {
                        Text(ferry.route).font(.subheadline.weight(.medium))
                        Text(ferry.operators).font(.caption).foregroundStyle(.secondary)
                        HStack(spacing: 8) {
                            Text(ferry.duration)
                            if let fare = ferry.fare { Text(fare) }
                        }
                        .font(.caption)
                        if let notes = ferry.notes {
                            Text(notes).font(.caption).foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 1)
                }
            }
            if !gettingThere.conflicts.isEmpty {
                Section {
                    ForEach(gettingThere.conflicts, id: \.self) { conflict in
                        Label(conflict, systemImage: "exclamationmark.triangle.fill")
                            .font(.callout)
                            .foregroundStyle(.yellow)
                    }
                } header: {
                    Text("Conflicting sources")
                }
            }
            Section("On the island") {
                ForEach(gettingThere.onIsland, id: \.self) { Text($0).font(.callout) }
            }
            Section("Travelling with gear") {
                ForEach(gettingThere.withGear, id: \.self) { Text($0).font(.callout) }
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
            Section("When to go") {
                Text(seasons.climate).font(.callout)
                ForEach(seasons.table, id: \.self) { season in
                    VStack(alignment: .leading, spacing: 2) {
                        HStack {
                            Text(season.period).font(.subheadline.weight(.medium))
                            Spacer()
                            Text(season.conditions).font(.caption).foregroundStyle(.secondary)
                        }
                        Text(season.note).font(.caption).foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 1)
                }
            }
            Section("Daily rhythm") {
                ForEach(seasons.dailyRhythm, id: \.self) { Text($0).font(.callout) }
            }
            if !seasons.notes.isEmpty {
                Section("Season notes") {
                    ForEach(seasons.notes, id: \.self) { Text($0).font(.callout) }
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
            Section("What the rock demands") {
                ForEach(gear.rockDemands, id: \.self) { Text($0).font(.callout) }
            }
            Section("Kit list") {
                ForEach(gear.kitList, id: \.self) { Text($0).font(.callout) }
            }
            Section("Bolts & fixed gear") {
                Text(gear.bolts).font(.callout)
            }
            Section {
                ForEach(gear.hazards, id: \.self) { hazard in
                    Label(hazard, systemImage: "exclamationmark.triangle.fill")
                        .font(.callout)
                        .foregroundStyle(.red)
                }
            } header: {
                Text("Hazards")
            }
            Section("Gear shops & rental") {
                ForEach(gear.shops, id: \.self) { shop in
                    VStack(alignment: .leading, spacing: 3) {
                        Text(shop.name).font(.subheadline.weight(.medium))
                        Text(shop.location).font(.caption).foregroundStyle(.secondary)
                        ForEach(shop.services, id: \.self) { service in
                            Text("• \(service)").font(.caption)
                        }
                        if let verified = shop.verified {
                            Text(verified).font(.caption2).foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 1)
                }
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
                ForEach(ethics.officialLine, id: \.self) { Text($0).font(.callout) }
            } header: {
                Text("Access — the official line")
            } footer: {
                Text(ethics.officialLineSource)
            }
            Section("Rules") {
                ForEach(ethics.rules, id: \.self) { Text($0).font(.callout) }
            }
            Section("The fuller picture") {
                ForEach(ethics.fullerPicture, id: \.self) { Text($0).font(.callout) }
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
            Section("Suggested itineraries") {
                ForEach(itineraries) { itinerary in
                    DisclosureGroup {
                        ForEach(itinerary.days, id: \.self) { day in
                            VStack(alignment: .leading, spacing: 3) {
                                Text(day.label).font(.subheadline.weight(.medium))
                                ForEach(day.steps, id: \.self) { step in
                                    Text("• \(step)").font(.caption)
                                }
                            }
                            .padding(.vertical, 2)
                        }
                    } label: {
                        Text(itinerary.name).font(.subheadline.weight(.medium))
                    }
                }
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
            Section("Guidebooks") {
                ForEach(guidebooks, id: \.self) { book in
                    VStack(alignment: .leading, spacing: 3) {
                        HStack {
                            Text(book.title).font(.subheadline.weight(.medium))
                            if book.current {
                                StyleBadge(text: "current", color: .green)
                            }
                        }
                        Text("\(book.author) · \(book.year)").font(.caption).foregroundStyle(.secondary)
                        Text(book.note).font(.caption)
                        if let urlString = book.url, let url = URL(string: urlString) {
                            Link(destination: url) {
                                Label("Open", systemImage: "safari").font(.caption)
                            }
                        }
                    }
                    .padding(.vertical, 1)
                }
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
            Section("Services & operators") {
                ForEach(services) { service in
                    VStack(alignment: .leading, spacing: 3) {
                        Text(service.name).font(.subheadline.weight(.medium))
                        Text("\(service.role) · since \(service.since)").font(.caption).foregroundStyle(.secondary)
                        Text(service.summary).font(.callout)
                        ForEach(service.bullets, id: \.self) { bullet in
                            Text("• \(bullet)").font(.caption)
                        }
                        Text(service.contact).font(.caption).foregroundStyle(.secondary)
                        if let url = URL(string: service.url) {
                            Link(destination: url) {
                                Label("Website", systemImage: "safari").font(.caption)
                            }
                        }
                        if let verified = service.verified {
                            Text(verified).font(.caption2).foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 2)
                }
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
                    .font(.callout)
            }
            Section("Sources") {
                ForEach(sources) { source in
                    VStack(alignment: .leading, spacing: 2) {
                        if let url = URL(string: source.url) {
                            Link(destination: url) {
                                Text(source.name).font(.subheadline)
                            }
                        } else {
                            Text(source.name).font(.subheadline)
                        }
                        Text("Used for: \(source.used)").font(.caption).foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 1)
                }
            }
        }
        .navigationTitle("Sources")
        .navigationBarTitleDisplayMode(.inline)
    }
}
