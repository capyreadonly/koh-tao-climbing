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
                VStack(alignment: .leading, spacing: 6) {
                    Text("Koh Tao Climbing")
                        .font(.title2.weight(.semibold))
                    Text("An original community guide for one island in the Gulf of Thailand.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 4)
                .accessibilityElement(children: .combine)
            }

            Section("What this is") {
                Text("This iOS app is an original community-built climbing guide for Koh Tao, Thailand. It is not a white-label guidebook template and it is not a reskin of another destination.")
                Text("It covers this island only: \(store.crags.count) documented crags, \(store.routes.count) routes and problems, \(store.reports.count) community trip reports, and a bundled offline map of Koh Tao and Nang Yuan.")
            }

            Section("How it works") {
                LabeledContent("Data", value: "On this device only")
                LabeledContent("Accounts", value: "None")
                LabeledContent("Ads & analytics", value: "None")
                LabeledContent("Network", value: "Not required to browse the guide")
                Text("The compiled database, photos and OpenStreetMap tiles ship inside the app bundle. The store never contacts a server. Tapping a source or operator link is the only reason Safari opens.")
                    .font(.callout)
            }

            Section("Sources & photos") {
                Text("The database was compiled from public references — Mountain Project, 27crags, theCrag, the Goodtime Adventures guidebook, and the other entries on the Sources screen — and fact-checked. Grades and access change; cross-check before you climb.")
                Text("Photos are contributed by members of the Koh Tao climbing community. Credits and licenses live on the Sources screen.")
            }

            Section("Help") {
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
