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
    @State private var mapFocus = MapFocus()
    @State private var routesFilter = RoutesFilterModel()
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
                MapTabView(store: store, mapFocus: mapFocus)
            }
            Tab("Crags", systemImage: "mountain.2", value: .crags) {
                CragsTabView(store: store, initialCragSlug: initialCragSlug)
            }
            Tab("Routes", systemImage: "figure.climbing", value: .routes) {
                RoutesTabView(store: store, filter: routesFilter)
            }
            Tab("Community", systemImage: "person.3", value: .community) {
                CommunityTabView(store: store)
            }
            Tab("Plan", systemImage: "ferry", value: .plan) {
                PlanTabView(store: store)
            }
        }
        .environment(mapFocus)
        .environment(routesFilter)
        .onChange(of: mapFocus.token) { _, token in
            if token > 0, mapFocus.slug != nil {
                selection = .map
            }
        }
        .onChange(of: routesFilter.tabJumpToken) { _, token in
            if token > 0 {
                selection = .routes
            }
        }
        .overlay(alignment: .top) {
            // Decode/load problems surface here instead of crashing. Calm banner,
            // expandable to the full messages so the cause is still visible.
            if !store.loadErrors.isEmpty {
                LoadErrorBanner(errors: store.loadErrors)
                    .padding(.horizontal, 12)
                    .padding(.top, 4)
                    .safeAreaPadding(.top)
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

/// Non-alarming banner for bundle load problems: one-line summary on a material
/// card, tap to expand the detailed messages, dismissable for the session.
private struct LoadErrorBanner: View {
    let errors: [String]
    @State private var expanded = false
    @State private var dismissed = false

    var body: some View {
        if !dismissed {
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .firstTextBaseline, spacing: 10) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(GuideTheme.warning)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Part of the guide didn’t load")
                            .font(.subheadline.weight(.semibold))
                        Text(errors.count == 1
                             ? "One data file couldn’t be read. Tap for details."
                             : "\(errors.count) data files couldn’t be read. Tap for details.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer(minLength: 0)
                    Button("Dismiss", systemImage: "xmark") {
                        withAnimation(.snappy) { dismissed = true }
                    }
                    .labelStyle(.iconOnly)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .buttonStyle(.plain)
                }
                if expanded {
                    ForEach(errors, id: \.self) { error in
                        Text(error)
                            .font(.caption2.monospaced())
                            .foregroundStyle(.secondary)
                            .textSelection(.enabled)
                    }
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous)
                    .strokeBorder(GuideTheme.warning.opacity(0.35), lineWidth: 1)
            }
            .contentShape(RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous))
            .onTapGesture {
                withAnimation(.snappy) { expanded.toggle() }
            }
            .accessibilityAddTraits(.isButton)
            .accessibilityHint(expanded ? "Collapses the details" : "Shows which files failed to load")
            .transition(.move(edge: .top).combined(with: .opacity))
        }
    }
}
