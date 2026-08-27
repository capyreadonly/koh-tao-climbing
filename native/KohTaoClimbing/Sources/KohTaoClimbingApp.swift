import SwiftUI

@main
struct KohTaoClimbingApp: App {
    var body: some Scene {
        WindowGroup {
            RootTabView(store: DataStore.shared)
        }
    }
}

enum AppTab: String {
    case map, crags, routes, community, plan
}

/// Root iOS 26 TabView — Liquid Glass tab bar is the system default.
struct RootTabView: View {
    let store: DataStore
    @State private var selection: AppTab
    @AppStorage("didShowAboutGuide") private var didShowAboutGuide = false
    @State private var showAboutGuide = false
    private let initialCragSlug: String?

    init(store: DataStore) {
        self.store = store
        // Testing/screenshot hook: `xcrun simctl launch booted <bundle-id> -initialTab crags -initialCrag meks-mountain`
        let args = ProcessInfo.processInfo.arguments
        var tab: AppTab = .map
        if let i = args.firstIndex(of: "-initialTab"), i + 1 < args.count {
            tab = AppTab(rawValue: args[i + 1]) ?? .map
        }
        var slug: String? = nil
        if let i = args.firstIndex(of: "-initialCrag"), i + 1 < args.count {
            slug = args[i + 1]
        }
        initialCragSlug = slug
        _selection = State(initialValue: tab)
        _showAboutGuide = State(initialValue: false)
        _didShowAboutGuide = AppStorage(wrappedValue: false, "didShowAboutGuide")
    }

    var body: some View {
        TabView(selection: $selection) {
            Tab("Map", systemImage: "map", value: .map) {
                MapTabView(store: store)
            }
            Tab("Crags", systemImage: "mountain.2", value: .crags) {
                CragsTabView(store: store, initialCragSlug: initialCragSlug)
            }
            Tab("Routes", systemImage: "figure.climbing", value: .routes) {
                RoutesTabView(store: store)
            }
            Tab("Community", systemImage: "person.3", value: .community) {
                CommunityTabView(store: store)
            }
            Tab("Plan", systemImage: "ferry", value: .plan) {
                PlanTabView(store: store)
            }
        }
        .overlay(alignment: .top) {
            // Decode/load problems surface here instead of crashing — phase-A diagnostics.
            if !store.loadErrors.isEmpty {
                Text(store.loadErrors.joined(separator: "\n"))
                    .font(.caption2)
                    .foregroundStyle(.white)
                    .padding(8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(.red.opacity(0.9))
            }
        }
        .sheet(isPresented: $showAboutGuide, onDismiss: {
            didShowAboutGuide = true
        }) {
            AboutGuideSheet(store: store)
        }
        .onAppear {
            // Screenshot/debug launch args skip the first-run sheet so existing hooks still land.
            let args = ProcessInfo.processInfo.arguments
            let skip = args.contains("-skipAbout")
                || args.contains("-initialTab")
                || args.contains("-initialCrag")
                || args.contains("-planSection")
                || args.contains("-initialRoute")
                || args.contains("-initialReport")
            if !didShowAboutGuide && !skip {
                showAboutGuide = true
            }
        }
    }
}
