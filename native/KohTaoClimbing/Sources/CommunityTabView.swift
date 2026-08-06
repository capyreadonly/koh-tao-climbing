import SwiftUI

/// Community tab: trip reports with attribution, plus the community photo library.
struct CommunityTabView: View {
    let store: DataStore
    @State private var searchText = ""

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
        NavigationStack {
            List {
                Section("Trip reports (\(filteredReports.count))") {
                    ForEach(filteredReports) { report in
                        NavigationLink(value: report) {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(report.title)
                                    .font(.subheadline.weight(.medium))
                                Text("\(report.author) · \(report.date)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            .padding(.vertical, 1)
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
        }
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
struct ReportDetailView: View {
    let report: CommunityReport
    let store: DataStore

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
            Section {
                LabeledContent("Author", value: report.author)
                LabeledContent("Date", value: report.date)
                LabeledContent("Type", value: report.type)
            }

            Section("Summary") {
                Text(report.summary).font(.callout)
            }

            if !photoEntries.isEmpty {
                Section("Photos") {
                    PhotoGalleryRow(photos: photoEntries)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                }
            }

            Section {
                if let url = URL(string: report.url) {
                    Link(destination: url) {
                        Label("Read the original", systemImage: "safari")
                    }
                }
            }
        }
        .navigationTitle(report.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}
