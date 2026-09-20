import SwiftUI

/// Identity screen for Guideline 4.3 uniqueness: this is an original Koh Tao
/// community guide, not a white-label destination template.
struct AboutGuideView: View {
    let store: DataStore
    /// When true, show a Continue button (first-run sheet). Plan navigation omits it.
    var showsContinue: Bool = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 10) {
                    Image(systemName: "mountain.2.fill")
                        .font(.title)
                        .foregroundStyle(.teal)
                        .accessibilityHidden(true)
                    Text("Koh Tao Climbing")
                        .font(.largeTitle.weight(.bold))
                    Text("An original community guide for one island in the Gulf of Thailand.")
                        .font(.title3)
                        .foregroundStyle(.secondary)
                    Text("Crags, routes, topos and trip notes — all on your phone, no signal needed.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 10)
                .accessibilityElement(children: .combine)
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 8, leading: 4, bottom: 8, trailing: 16))
            }

            Section {
                Text("This iOS app is an original community-built climbing guide for Koh Tao, Thailand. It is not a white-label guidebook template and it is not a reskin of another destination.")
                    .font(.body)
                Text("It covers this island only: \(store.crags.count) documented crags, \(store.routes.count) routes and problems, \(store.reports.count) community trip reports, and a bundled offline map of Koh Tao and Nang Yuan.")
                    .font(.body)
            } header: {
                GuideHeader(title: "What this is")
            }

            Section {
                LabeledContent("Data", value: "On this device only")
                LabeledContent("Accounts", value: "None")
                LabeledContent("Ads & analytics", value: "None")
                LabeledContent("Network", value: "Not required to browse the guide")
                Text("The compiled database, photos and OpenStreetMap tiles ship inside the app bundle. The store never contacts a server. Tapping a source or operator link is the only reason Safari opens.")
                    .font(.callout)
                    .foregroundStyle(.secondary)
            } header: {
                GuideHeader(title: "How it works")
            }

            Section {
                Text("The database was compiled from public references — Mountain Project, 27crags, theCrag, the Goodtime Adventures guidebook, and the other entries on the Sources screen — and fact-checked. Grades and access change; cross-check before you climb.")
                    .font(.body)
                Text("Photos are contributed by members of the Koh Tao climbing community. Credits and licenses live on the Sources screen.")
                    .font(.body)
            } header: {
                GuideHeader(title: "Sources & photos")
            }


            Section {
                let books = (store.info?.guidebooks ?? []).filter { $0.url != nil }
                if books.isEmpty {
                    Text("No downloadable paper guides are listed yet.")
                        .font(.callout)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(books, id: \.self) { book in
                        if let urlString = book.url, let url = URL(string: urlString) {
                            Link(destination: url) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Label(
                                        urlString.lowercased().contains(".pdf") ? "Download \(book.title)" : book.title,
                                        systemImage: urlString.lowercased().contains(".pdf") ? "arrow.down.doc" : "safari"
                                    )
                                    .font(.subheadline.weight(.medium))
                                    Text("\(book.author) · \(book.year)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .accessibilityHint(urlString.lowercased().contains(".pdf") ? "Downloads the PDF guidebook" : "Opens the guidebook page")
                        }
                    }
                }
            } header: {
                GuideHeader(title: "Paper guides")
            } footer: {
                Text("Historic and current paper/digital guides used while compiling this database. Prefer the current edition on the rock.")
                    .font(.caption)
            }

            Section {
                if let url = URL(string: "https://capyreadonly.github.io/koh-tao-climbing/support.html") {
                    Link(destination: url) {
                        Label("Support page", systemImage: "questionmark.circle")
                    }
                }
                if let url = URL(string: "https://capyreadonly.github.io/koh-tao-climbing/privacy.html") {
                    Link(destination: url) {
                        Label("Privacy — data not collected", systemImage: "hand.raised")
                    }
                }
                if let url = URL(string: "https://github.com/capyreadonly/koh-tao-climbing/issues") {
                    Link(destination: url) {
                        Label("Report a problem on GitHub", systemImage: "chevron.left.forwardslash.chevron.right")
                    }
                }
                if let url = URL(string: "https://capyreadonly.github.io/koh-tao-climbing/") {
                    Link(destination: url) {
                        Label("Web guide (same database)", systemImage: "safari")
                    }
                }
            } header: {
                GuideHeader(title: "Help")
            }
        }
        .navigationTitle("About this guide")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if showsContinue {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Continue") { dismiss() }
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            if showsContinue {
                Button {
                    dismiss()
                } label: {
                    Text("Start exploring")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                }
                .buttonStyle(.borderedProminent)
                .tint(.teal)
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(.bar)
                .accessibilityHint("Closes this introduction and opens the map")
            }
        }
    }
}

/// First-run wrapper so the identity copy is visible on launch (reviewers see it).
struct AboutGuideSheet: View {
    let store: DataStore

    var body: some View {
        NavigationStack {
            AboutGuideView(store: store, showsContinue: true)
        }
    }
}
