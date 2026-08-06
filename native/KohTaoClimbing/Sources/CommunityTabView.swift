import SwiftUI

/// Coarse category for a report's free-form `type` string — drives the badge.
enum ReportCategory {
    case video, blog, forum, review, crowdSourced, article, other

    init(_ type: String) {
        let t = type.lowercased()
        if t.contains("video") { self = .video }
        else if t.hasPrefix("blog") { self = .blog }
        else if t.contains("forum") { self = .forum }
        else if t.contains("review") { self = .review }
        else if t.contains("crowd-sourced") || t.contains("logbook") || t.contains("wiki") || t.contains("ascent log") { self = .crowdSourced }
        else if t.contains("article") || t.contains("info") { self = .article }
        else { self = .other }
    }

    var label: String {
        switch self {
        case .video: return "video"
        case .blog: return "blog"
        case .forum: return "forum"
        case .review: return "reviews"
        case .crowdSourced: return "community beta"
        case .article: return "article"
        case .other: return "report"
        }
    }

    var color: Color {
        switch self {
        case .video: return .red
        case .blog: return .blue
        case .forum: return .orange
        case .review: return .green
        case .crowdSourced: return .purple
        case .article: return .teal
        case .other: return .secondary
        }
    }

    var systemImage: String {
        switch self {
        case .video: return "play.fill"
        case .blog: return "text.quote"
        case .forum: return "bubble.left.and.bubble.right"
        case .review: return "star"
        case .crowdSourced: return "person.3"
        case .article: return "newspaper"
        case .other: return "doc.text"
        }
    }
}

/// Community tab: trip reports with attribution and type badges, plus the
/// community photo library.
struct CommunityTabView: View {
    let store: DataStore
    @State private var searchText = ""
    @State private var path = NavigationPath()

    // Testing/screenshot hook: `-initialReport video` pushes the first report
    // whose type contains that substring.
    private static let debugReportKeyword: String? = {
        let args = ProcessInfo.processInfo.arguments
        guard let i = args.firstIndex(of: "-initialReport"), i + 1 < args.count else { return nil }
        return args[i + 1].lowercased()
    }()

    private var filteredReports: [CommunityReport] {
        let query = searchText.trimmingCharacters(in: .whitespaces).lowercased()
        guard !query.isEmpty else { return store.reports }
        return store.reports.filter {
            $0.title.lowercased().contains(query)
                || $0.author.lowercased().contains(query)
                || $0.summary.lowercased().contains(query)
        }
    }

    var body: some View {
        NavigationStack(path: $path) {
            List {
                Section("Trip reports (\(filteredReports.count))") {
                    ForEach(filteredReports) { report in
                        NavigationLink(value: report) {
                            ReportRow(report: report)
                        }
                    }
                }

                Section("Community photos (\(store.communityPhotos.count))") {
                    CommunityPhotoGrid(photos: store.communityPhotos)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                }
            }
            .navigationTitle("Community")
            .navigationDestination(for: CommunityReport.self) { report in
                ReportDetailView(report: report, store: store)
            }
            .searchable(text: $searchText, prompt: "Search reports")
            .onAppear {
                guard path.isEmpty, let keyword = Self.debugReportKeyword,
                      let match = store.reports.first(where: { $0.type.lowercased().contains(keyword) })
                else { return }
                path.append(match)
            }
        }
    }
}

/// Report list row: title, author/date, type badge (+ play badge for videos,
/// photo count where the report ships bundled photos).
struct ReportRow: View {
    let report: CommunityReport

    private var category: ReportCategory { ReportCategory(report.type) }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(report.title)
                .font(.subheadline.weight(.medium))
            Text("\(report.author) · \(report.date)")
                .font(.caption)
                .foregroundStyle(.secondary)
            HStack(spacing: 4) {
                StyleBadge(text: category.label, color: category.color)
                if category == .video {
                    Image(systemName: "play.circle.fill")
                        .font(.caption)
                        .foregroundStyle(.red)
                        .accessibilityLabel("Video report")
                }
                if let count = report.photos?.count, count > 0 {
                    Label("\(count)", systemImage: "photo.stack")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(.vertical, 1)
    }
}

/// Three-column thumbnail grid of community photos; tap for the full-screen viewer.
struct CommunityPhotoGrid: View {
    let photos: [PhotoEntry]
    @State private var selected: PhotoEntry?

    private let columns = [
        GridItem(.flexible(), spacing: 4),
        GridItem(.flexible(), spacing: 4),
        GridItem(.flexible(), spacing: 4),
    ]

    var body: some View {
        LazyVGrid(columns: columns, spacing: 4) {
            ForEach(photos) { photo in
                Button {
                    selected = photo
                } label: {
                    BundledPhoto(file: photo.file, maxPixel: 300, cropToFill: !photo.isNdLicense)
                        .aspectRatio(1, contentMode: .fit)
                        .clipped()
                        .overlay(alignment: .bottomTrailing) {
                            if photo.isNdLicense {
                                NdBadge()
                                    .padding(4)
                            }
                        }
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
        .sheet(item: $selected) { photo in
            // Start the paging viewer on the tapped photo.
            let start = photos.firstIndex(of: photo) ?? 0
            PhotoViewerSheet(photos: photos, startIndex: start)
        }
    }
}

/// Report detail: full summary, downloaded photos, link to the original page.
/// Video reports lead with a prominent watch link.
struct ReportDetailView: View {
    let report: CommunityReport
    let store: DataStore

    private var category: ReportCategory { ReportCategory(report.type) }

    /// The report's photos, resolved to full PhotoEntry records where possible.
    private var photoEntries: [PhotoEntry] {
        (report.photos ?? []).map { file in
            store.communityPhotos.first(where: { $0.file == file })
                ?? PhotoEntry(file: file, kind: "community-photo", caption: "", crag: nil,
                              credit: nil, license: nil, sourceUrl: nil, page: nil)
        }
    }

    var body: some View {
        List {
            if category == .video, let url = URL(string: report.url) {
                Section {
                    Link(destination: url) {
                        Label("Watch the video", systemImage: "play.rectangle.fill")
                            .font(.callout.weight(.medium))
                            .foregroundStyle(.red)
                    }
                }
            }

            Section {
                LabeledContent("Author", value: report.author)
                LabeledContent("Date", value: report.date)
                LabeledContent("Type") {
                    StyleBadge(text: report.type, color: category.color)
                }
            }

            Section("Summary") {
                Text(report.summary).font(.callout)
            }

            if !photoEntries.isEmpty {
                Section("Photos (\(photoEntries.count))") {
                    PhotoGalleryRow(photos: photoEntries)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                }
            }

            Section {
                if let url = URL(string: report.url) {
                    Link(destination: url) {
                        Label(category == .video ? "Open video page" : "Read the original",
                              systemImage: category == .video ? "play.rectangle" : "safari")
                    }
                }
            }
        }
        .navigationTitle(report.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}
