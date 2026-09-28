import Observation
import StoreKit
import SwiftUI

/// Picks a calm moment for the rating prompt; `ReviewPromptTracker` decides whether
/// the user has earned it. The prompt is only asked for from a resting screen (map
/// with no sheet up, Crags or Routes list root), shortly after a crag/route detail
/// was dismissed, with no detail or blocking sheet on screen and the scene active.
@Observable
@MainActor
final class ReviewPromptCoordinator {
    /// Lets sheet and navigation animations finish before the prompt can appear.
    /// Testing hook: `-reviewPromptSettleDelay <seconds>` lengthens it.
    static let settleDelay: Duration = {
        let args = ProcessInfo.processInfo.arguments
        if let i = args.firstIndex(of: "-reviewPromptSettleDelay"), i + 1 < args.count,
           let seconds = Double(args[i + 1]) {
            return .seconds(seconds)
        }
        return .milliseconds(1500)
    }()
    /// A detail dismissal older than this no longer counts as "just came back".
    static let dismissalWindow: TimeInterval = 10
    /// After an in-app jump ("Show on map", "Open in Routes") the destination is still
    /// animating (camera flight, tab change), so no prompt for this long.
    static let navigationQuietPeriod: TimeInterval = 4

    @ObservationIgnored private let tracker: ReviewPromptTracker
    @ObservationIgnored private let isEnabled: Bool
    @ObservationIgnored private var visibleDetails = 0
    @ObservationIgnored private var lastDetailDismissal: Date?
    @ObservationIgnored private var isSceneActive = false
    @ObservationIgnored private var wasBackgrounded = true
    @ObservationIgnored private var lastProgrammaticNavigation: Date?
    /// Set by the root while a sheet it owns (first-run About) is up.
    @ObservationIgnored var isBlockingSheetPresented = false

    /// UI-test hook: `-reviewPromptProbe` shows a tiny accessibility marker counting
    /// `requestReview()` calls, because Apple's sheet can't be detected reliably from
    /// XCUITest. Inert (never rendered, never counted) without the argument.
    static let probeArgument = "-reviewPromptProbe"
    @ObservationIgnored let isProbeEnabled: Bool
    /// How many times `requestReview()` was called this process (probe mode only).
    private(set) var probeRequestCount = 0
    /// Outcome of the last check, "asked" or why not (probe mode only).
    private(set) var probeLastDecision = "none"

    init(tracker: ReviewPromptTracker = ReviewPromptTracker(),
         isEnabled: Bool = !ReviewPromptTracker.isDisabled(),
         isProbeEnabled: Bool = ProcessInfo.processInfo.arguments.contains(ReviewPromptCoordinator.probeArgument)) {
        self.tracker = tracker
        self.isEnabled = isEnabled
        self.isProbeEnabled = isProbeEnabled
    }

    /// Probe-only trace of the resting-screen steps, shown as the marker's value.
    func probeNote(_ note: String) {
        if isProbeEnabled { probeLastDecision = note }
    }

    /// Called right after `requestReview()`; only the probe listens.
    func didRequestReview() {
        if isProbeEnabled { probeRequestCount += 1 }
    }

    /// A session starts when the scene becomes active after launch or after being in
    /// the background; the inactive↔active blips of Control Center or the app switcher
    /// don't count as new sessions.
    func sceneDidChange(to phase: ScenePhase) {
        isSceneActive = phase == .active
        switch phase {
        case .active where wasBackgrounded:
            wasBackgrounded = false
            if isEnabled { tracker.recordSession() }
        case .background:
            wasBackgrounded = true
        default:
            break
        }
    }

    func detailDidAppear(_ id: String) {
        visibleDetails += 1
        if isEnabled { tracker.recordDetailViewed(id) }
    }

    func detailDidDisappear() {
        visibleDetails = max(0, visibleDetails - 1)
        lastDetailDismissal = .now
    }

    /// A detail asked to jump elsewhere ("Show on map", "Open in Routes"). Closing the
    /// detail that way is navigation, not coming back to rest.
    func didNavigateProgrammatically() {
        lastProgrammaticNavigation = .now
    }

    /// Called by a resting screen `settleDelay` after its own detail/sheet closed. True
    /// means: ask now — the prompt is already recorded against this version.
    func claimPrompt() -> Bool {
        let refusal = refusalReason()
        if isProbeEnabled { probeLastDecision = refusal ?? "asked" }
        guard refusal == nil else { return false }
        lastDetailDismissal = nil
        tracker.markPrompted()
        return true
    }

    /// Why the prompt can't be asked for right now, or nil if it can.
    private func refusalReason() -> String? {
        if !isEnabled { return "disabled" }
        if !isSceneActive { return "scene not active" }
        if isBlockingSheetPresented { return "About sheet up" }
        if visibleDetails > 0 { return "\(visibleDetails) detail(s) on screen" }
        guard let dismissed = lastDetailDismissal,
              Date.now.timeIntervalSince(dismissed) < Self.dismissalWindow
        else { return "no recent detail dismissal" }
        if let jumped = lastProgrammaticNavigation,
           Date.now.timeIntervalSince(jumped) < Self.navigationQuietPeriod {
            return "just navigated programmatically"
        }
        if !tracker.shouldRequestReview() { return "thresholds not met or already asked" }
        return nil
    }
}

extension View {
    /// Counts this crag/route detail towards the rating threshold and marks it as on
    /// screen, so no prompt appears over it.
    func reviewPromptDetail(_ id: String) -> some View {
        modifier(ReviewPromptDetailModifier(id: id))
    }

    /// A screen the rating prompt may appear over while `isResting` (no sheet, pushed
    /// detail or search on it). Only a return to rest on this screen — `isResting` going
    /// false → true — can trigger it; merely appearing (launch, tab switch) never does.
    /// Leaving the rest state or the screen within the delay cancels it.
    func reviewPromptRestingScreen(isResting: Bool) -> some View {
        modifier(ReviewPromptRestingModifier(isResting: isResting))
    }
}

private struct ReviewPromptDetailModifier: ViewModifier {
    let id: String
    @Environment(ReviewPromptCoordinator.self) private var coordinator

    func body(content: Content) -> some View {
        content
            .reviewPromptProbeMarker()
            .onAppear { coordinator.detailDidAppear(id) }
            .onDisappear { coordinator.detailDidDisappear() }
    }
}

private struct ReviewPromptRestingModifier: ViewModifier {
    let isResting: Bool
    @Environment(ReviewPromptCoordinator.self) private var coordinator
    @Environment(\.requestReview) private var requestReview
    /// Bumped each time this screen comes back to rest.
    @State private var returnCount = 0
    /// Last return already acted on, so re-appearing after a tab switch doesn't re-run it.
    @State private var handledReturn = 0

    private struct TaskKey: Equatable {
        let returnCount: Int
        let isResting: Bool
    }

    func body(content: Content) -> some View {
        content
            .onChange(of: isResting) { wasResting, resting in
                coordinator.probeNote("resting \(wasResting)→\(resting)")
                if !wasResting && resting { returnCount += 1 }
            }
            .task(id: TaskKey(returnCount: returnCount, isResting: isResting)) {
                guard isResting, returnCount > handledReturn else { return }
                coordinator.probeNote("waiting to settle")
                // Cancelled if isResting flips or the screen goes away. The return is
                // only marked handled once the wait completes: SwiftUI also restarts
                // `.task` on the appear/disappear that follows a sheet dismissal or pop,
                // and that restart must wait again rather than be dropped.
                try? await Task.sleep(for: ReviewPromptCoordinator.settleDelay)
                guard !Task.isCancelled else {
                    coordinator.probeNote("cancelled")
                    return
                }
                handledReturn = returnCount
                guard coordinator.claimPrompt() else { return }
                requestReview()
                coordinator.didRequestReview()
            }
    }
}

extension View {
    /// Probe marker for UI tests (see `ReviewPromptCoordinator.probeArgument`). Put on
    /// the root and on every detail, so it is readable whether or not a sheet is up.
    func reviewPromptProbeMarker() -> some View {
        modifier(ReviewPromptProbeMarker())
    }
}

private struct ReviewPromptProbeMarker: ViewModifier {
    @Environment(ReviewPromptCoordinator.self) private var coordinator

    func body(content: Content) -> some View {
        content.overlay(alignment: .bottomTrailing) {
            if coordinator.isProbeEnabled {
                Color.clear
                    .frame(width: 1, height: 1)
                    .allowsHitTesting(false)
                    .accessibilityElement()
                    .accessibilityLabel("\(coordinator.probeRequestCount)")
                    .accessibilityValue(coordinator.probeLastDecision)
                    .accessibilityIdentifier("reviewPromptRequested")
            }
        }
    }
}
