import SwiftUI

/// Plan tab: trip-planning info (getting there, seasons, gear, ethics, itineraries,
/// guidebooks) plus the Services and Sources directories.
struct PlanTabView: View {
    let store: DataStore

    var body: some View {
        NavigationStack {
            List {
                if let info = store.info {
                    gettingThereSections(info.gettingThere)
                    seasonsSections(info.seasons)
                    gearSections(info.gearAndSafety)
                    ethicsSections(info.ethics)
                    itinerarySections(info.itineraries)
                    guidebookSections(info.guidebooks)
                }
                servicesSection
                sourcesSection
            }
            .navigationTitle("Plan")
        }
    }

    // MARK: - Getting there

    @ViewBuilder
    private func gettingThereSections(_ gettingThere: GettingThere) -> some View {
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

    // MARK: - Seasons

    @ViewBuilder
    private func seasonsSections(_ seasons: Seasons) -> some View {
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

    // MARK: - Gear & safety

    @ViewBuilder
    private func gearSections(_ gear: GearAndSafety) -> some View {
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

    // MARK: - Ethics

    @ViewBuilder
    private func ethicsSections(_ ethics: Ethics) -> some View {
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

    // MARK: - Itineraries

    @ViewBuilder
    private func itinerarySections(_ itineraries: [Itinerary]) -> some View {
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

    // MARK: - Guidebooks

    @ViewBuilder
    private func guidebookSections(_ guidebooks: [Guidebook]) -> some View {
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

    // MARK: - Services & sources

    private var servicesSection: some View {
        Section("Services & operators") {
            ForEach(store.services) { service in
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

    private var sourcesSection: some View {
        Section("Sources") {
            ForEach(store.sources) { source in
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
}
