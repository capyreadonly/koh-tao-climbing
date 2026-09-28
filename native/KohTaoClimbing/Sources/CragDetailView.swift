import SwiftUI

/// Crag detail: photo hero, access note, about copy, facts, sectors, photo-topo
/// gallery and the route list.
struct CragDetailView: View {
    let crag: Crag
    let store: DataStore
    @Environment(MapFocus.self) private var mapFocus
    @Environment(RoutesFilterModel.self) private var routesFilter

    // Full-screen photo viewer selection. Testing/screenshot hook: `-showViewer [index]`
    // pre-opens the viewer, optionally at a page index. The hero photo opens page 0.
    @State private var viewer: ViewerSelection? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-showViewer") else { return nil }
        if i + 1 < args.count, let index = Int(args[i + 1]) { return ViewerSelection(index: index) }
        return ViewerSelection(index: 0)
    }()

    private var routes: [RouteRecord] { store.routes(forCrag: crag) }
    private var photos: [PhotoEntry] { store.photos(forCrag: crag) }
    /// Best lead image: real photos before drawn topos before maps.
    private var heroPhoto: PhotoEntry? { store.thumbnail(forCrag: crag) }

    private struct Fact: Identifiable {
        let label: String
        let value: String
        var id: String { label }
    }

    /// Short facts shown in the two-column grid; approach and access get full-width rows.
    private var shortFacts: [Fact] {
        var facts = [Fact(label: "Area", value: crag.area),
                     Fact(label: "Grades", value: crag.grades),
                     Fact(label: "Sun", value: crag.sun)]
        if let season = crag.bestSeason { facts.append(Fact(label: "Best season", value: season)) }
        if let routeCount = crag.routeCount { facts.append(Fact(label: "Routes", value: routeCount)) }
        if let fee = crag.accessFee { facts.append(Fact(label: "Entry fee", value: fee)) }
        return facts
    }

    var body: some View {
        List {
            if let hero = heroPhoto {
                Section {
                    CragHeroPhoto(photo: hero, area: crag.area, photoCount: photos.count) {
                        viewer = ViewerSelection(index: photos.firstIndex(of: hero) ?? 0)
                    }
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                }
            }

            if let warning = crag.accessWarning {
                Section {
                    GuideCallout(text: warning, title: "Access")
                        .listRowInsets(EdgeInsets())
                        .listRowBackground(Color.clear)
                }
            }

            // Primary actions side by side: routes (prominent) and the map (secondary).
            // Replaces a lone "Show on map" row that sat further down between sections.
            if !routes.isEmpty || crag.coords != nil {
                Section {
                    HStack(spacing: 10) {
                        if !routes.isEmpty {
                            Button {
                                routesFilter.openCrag(crag.name)
                            } label: {
                                // Explicit HStack, not Label: inside a List row a Label's icon
                                // takes the list icon column (a wide gap) and the tint colour
                                // (it vanished into the prominent fill).
                                HStack(spacing: 6) {
                                    Image(systemName: "figure.climbing")
                                    Text("Open \(routes.count) routes")
                                }
                                    .font(.body.weight(.semibold))
                                    .foregroundStyle(.white)
                                    .frame(maxWidth: .infinity, minHeight: GuideTheme.minTapTarget - 10)
                            }
                            .buttonStyle(.borderedProminent)
                            .accessibilityLabel("Open \(routes.count) routes")
                            .accessibilityHint("Switches to the Routes tab filtered to this crag")
                            .accessibilityIdentifier("openInRoutesProminent")
                        }
                        if crag.coords != nil {
                            Button {
                                mapFocus.show(cragSlug: crag.slug)
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: "map")
                                    Text("Map")
                                }
                                    .font(.body.weight(.medium))
                                    .frame(maxWidth: routes.isEmpty ? .infinity : nil,
                                           minHeight: GuideTheme.minTapTarget - 10)
                            }
                            .buttonStyle(.bordered)
                            .accessibilityLabel("Show on map")
                            .accessibilityHint("Switches to the Map tab and focuses this area")
                        }
                    }
                    .buttonBorderShape(.capsule)
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            }

            Section {
                Text(crag.summary)
                    .font(.body)
                if let highlight = crag.highlight {
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "star.fill")
                            .font(.caption)
                            .foregroundStyle(GuideTheme.star)
                            .padding(.top, 3)
                        Text(highlight)
                            .font(.callout.weight(.medium))
                    }
                    .accessibilityElement(children: .combine)
                }
                ForEach(crag.details, id: \.self) { detail in
                    Text(detail)
                        .font(.callout)
                        .foregroundStyle(.secondary)
                }
            } header: {
                GuideHeader(title: "About")
            }

            Section {
                VStack(alignment: .leading, spacing: 14) {
                    LazyVGrid(columns: [GridItem(.flexible(), alignment: .topLeading),
                                        GridItem(.flexible(), alignment: .topLeading)],
                              alignment: .leading, spacing: 14) {
                        ForEach(shortFacts) { fact in
                            FactCell(label: fact.label, value: fact.value)
                        }
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Styles")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        HStack(spacing: 5) {
                            ForEach(crag.styles, id: \.self) { style in
                                StyleBadge(text: style, color: CragStyle.color(style))
                            }
                        }
                    }
                    FactCell(label: "Approach", value: crag.approach)
                    FactCell(label: "Access", value: crag.access)
                }
                .padding(.vertical, 4)
            } header: {
                GuideHeader(title: "Facts")
            }

            if let sectors = crag.sectors, !sectors.isEmpty {
                Section {
                    ForEach(sectors, id: \.name) { sector in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(sector.name)
                                .font(.subheadline.weight(.medium))
                            if let note = sector.note {
                                Text(note)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding(.vertical, 2)
                    }
                } header: {
                    GuideHeader(title: "Sectors")
                }
            }

            if !photos.isEmpty {
                Section {
                    PhotoGalleryRow(photos: photos)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 10, trailing: 0))
                        .listRowBackground(Color.clear)
                } header: {
                    GuideHeader(title: "Photos & topos", subtitle: "Tap a photo to view it full screen")
                }
            }

            if !routes.isEmpty {
                Section {
                    ForEach(routes) { route in
                        NavigationLink(value: route) {
                            RouteRow(route: route)
                        }
                    }
                } header: {
                    GuideHeader(title: "Routes", subtitle: "\(routes.count) documented here")
                }
            }

            if let verified = crag.verified {
                Section {
                    Text(verified)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                } header: {
                    Text("Verification")
                }
            }
        }
        .navigationTitle(crag.name)
        .toolbarVisibility(.visible, for: .navigationBar)
        .accessibilityIdentifier("cragDetail")
        .reviewPromptDetail("crag:\(crag.slug)")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Open in Routes", systemImage: "figure.climbing") {
                    routesFilter.openCrag(crag.name)
                }
                .accessibilityHint("Switches to the Routes tab filtered to this crag")
                .accessibilityIdentifier("openInRoutes")
            }
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
        .sheet(item: $viewer) { selection in
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

/// Full-width lead photo with a soft bottom gradient carrying the area name and
/// photo count. Tapping opens the full-screen viewer.
private struct CragHeroPhoto: View {
    let photo: PhotoEntry
    let area: String
    let photoCount: Int
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Color.clear
                .frame(height: 230)
                .overlay {
                    BundledPhoto(file: photo.file, maxPixel: 1400, cropToFill: !photo.isNdLicense)
                }
                .background(.quaternary)
                .overlay(alignment: .bottom) {
                    PhotoScrim()
                }
                .overlay(alignment: .bottomLeading) {
                    HStack(alignment: .bottom) {
                        Text(area)
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(.white)
                            .shadow(color: .black.opacity(0.4), radius: 3)
                        Spacer()
                        HStack(spacing: 5) {
                            Image(systemName: "photo.on.rectangle")
                            Text(photoCount == 1 ? "1 photo" : "\(photoCount) photos")
                        }
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(.ultraThinMaterial, in: Capsule())
                            // Photo backdrop, not app theme: keep the chip dark in both modes.
                            .environment(\.colorScheme, .dark)
                    }
                    .padding(12)
                }
                .overlay(alignment: .topTrailing) {
                    if photo.isNdLicense {
                        NdBadge().padding(8)
                    }
                }
                .clipShape(RoundedRectangle(cornerRadius: GuideTheme.heroCornerRadius, style: .continuous))
                .contentShape(RoundedRectangle(cornerRadius: GuideTheme.heroCornerRadius, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(photo.caption). \(area)")
        .accessibilityHint("Opens the photo full screen")
    }
}

/// Horizontally scrolling photo-topo gallery with captions; tap for a full-screen paging viewer.
struct PhotoGalleryRow: View {
    let photos: [PhotoEntry]
    @State private var viewer: ViewerSelection?

    private static let tileWidth: CGFloat = 264
    private static let tileHeight: CGFloat = 186

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(alignment: .top, spacing: 12) {
                ForEach(Array(photos.enumerated()), id: \.element.id) { index, photo in
                    Button {
                        viewer = ViewerSelection(index: index)
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            BundledPhoto(file: photo.file, maxPixel: 720, cropToFill: !photo.isNdLicense)
                                .frame(width: Self.tileWidth, height: Self.tileHeight)
                                .background(.quaternary)
                                .clipShape(RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous))
                                .overlay(alignment: .bottomTrailing) {
                                    if photo.isNdLicense {
                                        NdBadge()
                                            .padding(6)
                                    }
                                }
                            HStack(alignment: .top, spacing: 6) {
                                Text(photo.caption)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                    .multilineTextAlignment(.leading)
                                    .lineLimit(2)
                                Spacer(minLength: 0)
                                Text(photo.kind.replacingOccurrences(of: "-", with: " "))
                                    .font(.caption2)
                                    .foregroundStyle(.tertiary)
                                    .lineLimit(1)
                            }
                            .frame(width: Self.tileWidth, alignment: .leading)
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(photo.caption)
                    .accessibilityHint("Opens the photo full screen")
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

/// Credit, licence and source link under a photo in the viewer. Guide images get
/// the Goodtime guidebook credit with the PDF page and a link to the PDF.
struct PhotoCreditLine: View {
    let credit: PhotoCredit
    var isNd: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                if !credit.text.isEmpty {
                    Text(credit.text)
                        .fixedSize(horizontal: false, vertical: true)
                        .accessibilityIdentifier("photoCredit")
                }
                if let license = credit.license {
                    Text(license)
                        .accessibilityIdentifier("photoLicense")
                }
                if isNd {
                    NdBadge()
                }
            }
            .font(.caption2)
            .foregroundStyle(.secondary)
            if let url = credit.link, let label = credit.linkLabel {
                Link(destination: url) {
                    Label(label, systemImage: credit.isGuide ? "doc.richtext" : "safari")
                        .font(.caption.weight(.medium))
                }
                .accessibilityHint(credit.isGuide ? "Opens the guidebook PDF in Safari" : "Opens the photo's source page in Safari")
                .accessibilityIdentifier("photoSourceLink")
            }
        }
    }
}

/// Full-screen paging photo viewer: pinch-to-zoom + pan per page, caption,
/// credit/licence line with a source link, ND badge where the license forbids derivatives.
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
                if photos.count > 1 {
                    ToolbarItem(placement: .topBarTrailing) {
                        Text("\(min(index, photos.count - 1) + 1) of \(photos.count)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .monospacedDigit()
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                let photo = photos[min(index, photos.count - 1)]
                VStack(alignment: .leading, spacing: 4) {
                    Text(photo.caption)
                        .font(.footnote)
                    if let credit = PhotoCredit.forPhoto(photo) {
                        PhotoCreditLine(credit: credit, isNd: photo.isNdLicense)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(.bar)
            }
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        // Photos read best on black whatever the system appearance, so the viewer
        // (its bars, caption panel and controls) is always dark — like Photos.
        .environment(\.colorScheme, .dark)
    }
}
