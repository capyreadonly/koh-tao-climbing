import SwiftUI

/// Crags tab: searchable native list of all crags with photo thumbnails and badges.
struct CragsTabView: View {
    let store: DataStore
    /// Testing/screenshot hook: push this crag's detail when the view first appears.
    var initialCragSlug: String? = nil

    @State private var path = NavigationPath()
    @State private var searchText = ""

    private var trimmedQuery: String {
        searchText.trimmingCharacters(in: .whitespaces)
    }

    private var filtered: [Crag] {
        let query = trimmedQuery.lowercased()
        guard !query.isEmpty else { return store.crags }
        return store.crags.filter {
            $0.name.lowercased().contains(query)
                || $0.area.lowercased().contains(query)
                || $0.styles.contains { $0.lowercased().contains(query) }
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            List {
                Section {
                    ForEach(filtered) { crag in
                        NavigationLink(value: crag) {
                            CragRow(crag: crag, store: store)
                        }
                        .listRowInsets(EdgeInsets(top: 10, leading: 16, bottom: 10, trailing: 16))
                    }
                } header: {
                    if trimmedQuery.isEmpty {
                        GuideHeader(
                            title: "Around the island",
                            subtitle: "\(store.crags.count) documented areas · \(store.routes.count) routes and problems"
                        )
                    } else if !filtered.isEmpty {
                        Text("\(filtered.count) of \(store.crags.count) areas")
                            .textCase(nil)
                    }
                }
            }
            .navigationTitle("Crags")
            .navigationDestination(for: Crag.self) { crag in
                CragDetailView(crag: crag, store: store)
            }
            .searchable(text: $searchText, prompt: "Name, area or style")
            .overlay {
                if filtered.isEmpty {
                    GuideEmptyState(
                        title: "Nothing by that name",
                        message: "No area on the island matches “\(trimmedQuery)”. Try a nearby beach, a shorter spelling, or a style like sport or boulder.",
                        systemImage: "mountain.2",
                        actionTitle: "Show all areas"
                    ) {
                        searchText = ""
                    }
                }
            }
            .onAppear {
                guard path.isEmpty, let slug = initialCragSlug, let crag = store.crag(slug: slug) else { return }
                path.append(crag)
            }
        }
    }
}

/// Magazine-style crag row: large photo, strong title, quiet meta line, style badges.
struct CragRow: View {
    let crag: Crag
    let store: DataStore

    private static let thumbSize: CGFloat = 92

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            thumbnail
                .frame(width: Self.thumbSize, height: Self.thumbSize)
                .clipShape(RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous))
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 5) {
                Text(crag.name)
                    .font(.title3.weight(.semibold))
                    .lineLimit(2)
                    .minimumScaleFactor(0.9)

                Text(crag.area)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)

                Text(crag.grades)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)

                HStack(spacing: 5) {
                    ForEach(crag.styles, id: \.self) { style in
                        StyleBadge(text: style, color: CragStyle.color(style))
                    }
                    if crag.accessFee != nil {
                        StyleBadge(text: "entry fee", color: GuideTheme.warning)
                    }
                    if crag.accessWarning != nil {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.caption2)
                            .foregroundStyle(GuideTheme.warning)
                            .accessibilityLabel("Access warning")
                    }
                }
                .padding(.top, 1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(minHeight: Self.thumbSize)
    }

    @ViewBuilder
    private var thumbnail: some View {
        if let photo = store.thumbnail(forCrag: crag) {
            BundledPhoto(file: photo.file, maxPixel: 320, cropToFill: !photo.isNdLicense)
                .frame(width: Self.thumbSize, height: Self.thumbSize)
                .background(.quaternary)
        } else {
            PhotoPlaceholder()
        }
    }
}
