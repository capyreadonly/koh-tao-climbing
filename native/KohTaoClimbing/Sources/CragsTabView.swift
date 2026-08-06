import SwiftUI

/// Crags tab: searchable native list of all crags with photo thumbnails and badges.
struct CragsTabView: View {
    let store: DataStore
    /// Testing/screenshot hook: push this crag's detail when the view first appears.
    var initialCragSlug: String? = nil

    @State private var path = NavigationPath()
    @State private var searchText = ""

    private var filtered: [Crag] {
        let query = searchText.trimmingCharacters(in: .whitespaces).lowercased()
        guard !query.isEmpty else { return store.crags }
        return store.crags.filter {
            $0.name.lowercased().contains(query)
                || $0.area.lowercased().contains(query)
                || $0.styles.contains { $0.lowercased().contains(query) }
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            List(filtered) { crag in
                NavigationLink(value: crag) {
                    CragRow(crag: crag, store: store)
                }
            }
            .navigationTitle("Crags")
            .navigationDestination(for: Crag.self) { crag in
                CragDetailView(crag: crag, store: store)
            }
            .searchable(text: $searchText, prompt: "Name, area or style")
            .onAppear {
                guard path.isEmpty, let slug = initialCragSlug, let crag = store.crag(slug: slug) else { return }
                path.append(crag)
            }
        }
    }
}

struct CragRow: View {
    let crag: Crag
    let store: DataStore

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            if let photo = store.thumbnail(forCrag: crag) {
                BundledPhoto(file: photo.file, maxPixel: 240, cropToFill: !photo.isNdLicense)
                    .frame(width: 56, height: 56)
                    .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
            } else {
                RoundedRectangle(cornerRadius: 8, style: .continuous)
                    .fill(.quaternary)
                    .frame(width: 56, height: 56)
                    .overlay { Image(systemName: "mountain.2").foregroundStyle(.secondary) }
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(crag.name)
                    .font(.headline)
                Text(crag.area)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                HStack(spacing: 4) {
                    ForEach(crag.styles, id: \.self) { style in
                        StyleBadge(text: style, color: CragStyle.color(style))
                    }
                }
                HStack(spacing: 4) {
                    StyleBadge(text: crag.grades)
                    if crag.accessFee != nil {
                        StyleBadge(text: "entry fee", color: .orange)
                    }
                    if crag.accessWarning != nil {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.caption2)
                            .foregroundStyle(.yellow)
                    }
                }
            }
        }
        .padding(.vertical, 2)
    }
}
