import SwiftUI

/// Crag detail: facts, access warnings, sectors, photo-topo gallery and the route list.
struct CragDetailView: View {
    let crag: Crag
    let store: DataStore
    @Environment(MapFocus.self) private var mapFocus

    // Testing/screenshot hook: `-showViewer [index]` pre-opens the full-screen
    // photo viewer, optionally at a page index.
    @State private var debugViewer: ViewerSelection? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-showViewer") else { return nil }
        if i + 1 < args.count, let index = Int(args[i + 1]) { return ViewerSelection(index: index) }
        return ViewerSelection(index: 0)
    }()

    private var routes: [RouteRecord] { store.routes(forCrag: crag) }
    private var photos: [PhotoEntry] { store.photos(forCrag: crag) }

    var body: some View {
        List {
            if crag.coords != nil {
                Section {
                    Button {
                        mapFocus.show(cragSlug: crag.slug)
                    } label: {
                        Label("Show on map", systemImage: "map")
                    }
                    .accessibilityHint("Switches to the Map tab and focuses this area")
                }
            }

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
        .toolbar {
            if crag.coords != nil {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Show on map", systemImage: "map") {
                        mapFocus.show(cragSlug: crag.slug)
                    }
                    .accessibilityHint("Switches to the Map tab and focuses this area")
                }
            }
        }
        .navigationDestination(for: RouteRecord.self) { route in
            RouteDetailView(route: route, store: store)
        }
        .sheet(item: $debugViewer) { selection in
            if !photos.isEmpty {
                PhotoViewerSheet(photos: photos, startIndex: min(selection.index, photos.count - 1))
            }
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
                            .overlay(alignment: .bottomTrailing) {
                                if photo.isNdLicense {
                                    NdBadge()
                                        .padding(6)
                                }
                            }
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

/// Small "ND" badge marking NoDerivatives-licensed photos (must be shown unmodified).
struct NdBadge: View {
    var body: some View {
        Text("ND")
            .font(.caption2.weight(.bold))
            .padding(.horizontal, 5)
            .padding(.vertical, 2)
            .background(.black.opacity(0.65), in: Capsule())
            .foregroundStyle(.white)
    }
}

/// Full-screen paging photo viewer: pinch-to-zoom + pan per page, caption and
/// credit/license line, ND badge where the license forbids derivatives.
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
                    Group {
                        if let uiImage = BundledImageStore.image(photo.file, maxPixel: 2400) {
                            ZoomableImageView(uiImage: uiImage)
                        } else {
                            ContentUnavailableView("Photo unavailable", systemImage: "photo",
                                                   description: Text(photo.file))
                        }
                    }
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
                    HStack(spacing: 6) {
                        if let credit = photo.credit {
                            Text("© \(credit)")
                        }
                        if let license = photo.license {
                            Text(license)
                        }
                        if photo.isNdLicense {
                            NdBadge()
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
