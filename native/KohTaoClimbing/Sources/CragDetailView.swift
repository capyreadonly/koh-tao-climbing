import SwiftUI

/// Crag detail: facts, access warnings, sectors, photo-topo gallery and the route list.
struct CragDetailView: View {
    let crag: Crag
    let store: DataStore

    private var routes: [RouteRecord] { store.routes(forCrag: crag) }
    private var photos: [PhotoEntry] { store.photos(forCrag: crag) }

    var body: some View {
        List {
            if let warning = crag.accessWarning {
                Section {
                    Label(warning, systemImage: "exclamationmark.triangle.fill")
                        .font(.callout)
                        .foregroundStyle(.yellow)
                        .listRowBackground(Color.yellow.opacity(0.12))
                }
            }

            Section("About") {
                Text(crag.summary)
                if let highlight = crag.highlight {
                    Label(highlight, systemImage: "star.fill")
                        .font(.callout)
                        .foregroundStyle(.secondary)
                }
                ForEach(crag.details, id: \.self) { detail in
                    Text(detail)
                        .font(.callout)
                        .foregroundStyle(.secondary)
                }
            }

            Section("Facts") {
                LabeledContent("Area", value: crag.area)
                LabeledContent("Grades", value: crag.grades)
                LabeledContent("Styles") {
                    HStack(spacing: 4) {
                        ForEach(crag.styles, id: \.self) { style in
                            StyleBadge(text: style, color: CragStyle.color(style))
                        }
                    }
                }
                LabeledContent("Sun", value: crag.sun)
                LabeledContent("Approach", value: crag.approach)
                LabeledContent("Access", value: crag.access)
                if let fee = crag.accessFee {
                    LabeledContent("Entry fee", value: fee)
                }
                if let season = crag.bestSeason {
                    LabeledContent("Best season", value: season)
                }
                if let routeCount = crag.routeCount {
                    LabeledContent("Route count", value: routeCount)
                }
            }

            if let sectors = crag.sectors, !sectors.isEmpty {
                Section("Sectors") {
                    ForEach(sectors, id: \.name) { sector in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(sector.name)
                            if let note = sector.note {
                                Text(note)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }

            if !photos.isEmpty {
                Section("Photos & topos") {
                    PhotoGalleryRow(photos: photos)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                }
            }

            if !routes.isEmpty {
                Section("Routes (\(routes.count))") {
                    ForEach(routes) { route in
                        NavigationLink(value: route) {
                            RouteRow(route: route)
                        }
                    }
                }
            }

            if let verified = crag.verified {
                Section("Verification") {
                    Text(verified)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .navigationTitle(crag.name)
        .navigationDestination(for: RouteRecord.self) { route in
            RouteDetailView(route: route)
        }
    }
}

/// Identifiable wrapper so sheet(item:) can present at a photo index.
private struct ViewerSelection: Identifiable {
    let index: Int
    var id: Int { index }
}

/// Horizontally scrolling photo-topo gallery; tap for a full-screen paging viewer.
struct PhotoGalleryRow: View {
    let photos: [PhotoEntry]
    @State private var viewer: ViewerSelection?

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 10) {
                ForEach(Array(photos.enumerated()), id: \.element.id) { index, photo in
                    Button {
                        viewer = ViewerSelection(index: index)
                    } label: {
                        BundledPhoto(file: photo.file, maxPixel: 640, cropToFill: !photo.isNdLicense)
                            .frame(width: 240, height: 170)
                            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 16)
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.viewAligned)
        .sheet(item: $viewer) { selection in
            PhotoViewerSheet(photos: photos, startIndex: selection.index)
        }
    }
}

/// Full-screen paging photo viewer with caption and credit/license line.
struct PhotoViewerSheet: View {
    let photos: [PhotoEntry]
    let startIndex: Int
    @Environment(\.dismiss) private var dismiss
    @State private var index: Int

    init(photos: [PhotoEntry], startIndex: Int) {
        self.photos = photos
        self.startIndex = startIndex
        _index = State(initialValue: startIndex)
    }

    var body: some View {
        NavigationStack {
            TabView(selection: $index) {
                ForEach(Array(photos.enumerated()), id: \.element.id) { i, photo in
                    BundledPhoto(file: photo.file, maxPixel: 1600)
                        .tag(i)
                }
            }
            .tabViewStyle(.page)
            .background(.black)
            .ignoresSafeArea(edges: .bottom)
            .navigationTitle(photos[min(index, photos.count - 1)].kind.replacingOccurrences(of: "-", with: " "))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close", systemImage: "xmark") { dismiss() }
                }
            }
            .safeAreaInset(edge: .bottom) {
                let photo = photos[min(index, photos.count - 1)]
                VStack(alignment: .leading, spacing: 4) {
                    Text(photo.caption)
                        .font(.caption)
                    HStack {
                        if let credit = photo.credit {
                            Text("© \(credit)")
                        }
                        if let license = photo.license {
                            Text(license)
                        }
                    }
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(.bar)
            }
        }
    }
}
