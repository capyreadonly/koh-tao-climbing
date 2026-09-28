import SwiftUI
import XCTest
@testable import KohTaoClimbing

/// Threshold rules for the App Store rating prompt, on a private defaults suite
/// wiped before and after every test so nothing leaks into the app's own defaults.
final class ReviewPromptTrackerTests: XCTestCase {
    private let suiteName = "ReviewPromptTrackerTests"
    private var defaults: UserDefaults!

    override func setUp() {
        super.setUp()
        UserDefaults().removePersistentDomain(forName: suiteName)
        defaults = UserDefaults(suiteName: suiteName)
    }

    override func tearDown() {
        UserDefaults().removePersistentDomain(forName: suiteName)
        defaults = nil
        super.tearDown()
    }

    private func tracker(version: String = "1.0.5") -> ReviewPromptTracker {
        ReviewPromptTracker(defaults: defaults, appVersion: version)
    }

    private func viewDetails(_ ids: [String], on tracker: ReviewPromptTracker) {
        ids.forEach(tracker.recordDetailViewed)
    }

    func testFewerThanThreeDistinctDetailsDoesNotPrompt() {
        let t = tracker()
        t.recordSession()
        t.recordSession()
        viewDetails(["crag:meks-mountain", "route:Mek's Mountain|Moguls"], on: t)
        XCTAssertFalse(t.shouldRequestReview())
    }

    func testThreeDetailsInOnlyOneSessionDoesNotPrompt() {
        let t = tracker()
        t.recordSession()
        viewDetails(["crag:a", "crag:b", "route:a|x"], on: t)
        XCTAssertEqual(t.distinctDetailCount, 3)
        XCTAssertFalse(t.shouldRequestReview(), "Never in the first session")
    }

    func testReopeningTheSameDetailCountsOnce() {
        let t = tracker()
        t.recordSession()
        t.recordSession()
        viewDetails(["crag:a", "crag:a", "crag:a", "crag:b", "crag:b"], on: t)
        XCTAssertEqual(t.distinctDetailCount, 2)
        XCTAssertFalse(t.shouldRequestReview())
    }

    func testThreeDistinctDetailsAcrossTwoSessionsPrompts() {
        let t = tracker()
        t.recordSession()
        viewDetails(["crag:a", "route:a|x"], on: t)
        t.recordSession()
        viewDetails(["crag:b"], on: t)
        XCTAssertTrue(t.shouldRequestReview())
    }

    func testAfterMarkPromptedSameVersionDoesNotPromptAgain() {
        let t = tracker()
        t.recordSession()
        t.recordSession()
        viewDetails(["crag:a", "crag:b", "crag:c"], on: t)
        XCTAssertTrue(t.shouldRequestReview())
        t.markPrompted()
        XCTAssertEqual(t.lastPromptedVersion, "1.0.5")
        XCTAssertFalse(t.shouldRequestReview())
        // More use in the same version still doesn't re-arm it.
        t.recordSession()
        viewDetails(["crag:d", "route:e|f"], on: t)
        XCTAssertFalse(t.shouldRequestReview())
    }

    /// Policy: counts carry over, so a new version asks again once (Apple caps it at 3 a year).
    func testNewVersionWithConditionsStillMetPromptsAgain() {
        let old = tracker(version: "1.0.5")
        old.recordSession()
        old.recordSession()
        viewDetails(["crag:a", "crag:b", "crag:c"], on: old)
        old.markPrompted()

        let updated = tracker(version: "1.0.6")
        updated.recordSession()
        XCTAssertTrue(updated.shouldRequestReview())
        updated.markPrompted()
        XCTAssertFalse(updated.shouldRequestReview())
        XCTAssertEqual(updated.lastPromptedVersion, "1.0.6")
    }

    func testStatePersistsAcrossTrackerInstancesSharingTheSuite() {
        let first = tracker()
        first.recordSession()
        viewDetails(["crag:a", "crag:b"], on: first)

        let second = tracker()
        XCTAssertEqual(second.sessionCount, 1)
        XCTAssertEqual(second.distinctDetailCount, 2)
        second.recordSession()
        second.recordDetailViewed("crag:a")  // already counted by the first instance
        XCTAssertFalse(second.shouldRequestReview())
        second.recordDetailViewed("route:a|x")
        XCTAssertTrue(second.shouldRequestReview())
        second.markPrompted()

        let third = tracker()
        XCTAssertEqual(third.sessionCount, 2)
        XCTAssertEqual(third.distinctDetailCount, 3)
        XCTAssertEqual(third.lastPromptedVersion, "1.0.5")
        XCTAssertFalse(third.shouldRequestReview())
    }

    func testDisabledByLaunchArgumentOrHostedTests() {
        XCTAssertTrue(ReviewPromptTracker.isDisabled(arguments: ["app", "-disableReviewPrompt"], environment: [:]))
        XCTAssertTrue(ReviewPromptTracker.isDisabled(arguments: ["app"],
                                                     environment: ["XCTestConfigurationFilePath": "/tmp/x"]))
        XCTAssertFalse(ReviewPromptTracker.isDisabled(arguments: ["app", "-skipAbout"], environment: [:]))
        // This very process is a hosted XCTest run, so the shared app coordinator is off.
        XCTAssertTrue(ReviewPromptTracker.isDisabled())
    }

    // MARK: - Coordinator: when the prompt may appear

    @MainActor
    private func readyCoordinator(enabled: Bool = true) -> ReviewPromptCoordinator {
        let c = ReviewPromptCoordinator(tracker: tracker(), isEnabled: enabled)
        c.sceneDidChange(to: .active)       // session 1
        c.sceneDidChange(to: .background)
        c.sceneDidChange(to: .active)       // session 2
        for id in ["crag:a", "crag:b", "route:a|x"] {
            c.detailDidAppear(id)
            c.detailDidDisappear()
        }
        return c
    }

    @MainActor
    func testCoordinatorPromptsOnceAfterDetailDismissed() {
        let c = readyCoordinator()
        XCTAssertTrue(c.claimPrompt())
        XCTAssertEqual(tracker().lastPromptedVersion, "1.0.5")
        c.detailDidAppear("crag:d")
        c.detailDidDisappear()
        XCTAssertFalse(c.claimPrompt(), "Once per version")
    }

    @MainActor
    func testCoordinatorHoldsOffOverDetailSheetOrInactiveScene() {
        let c = readyCoordinator()
        XCTAssertTrue(tracker().shouldRequestReview())
        c.detailDidAppear("crag:a")
        XCTAssertFalse(c.claimPrompt(), "Never over a detail view")
        c.detailDidDisappear()
        c.isBlockingSheetPresented = true
        XCTAssertFalse(c.claimPrompt(), "Never while the About sheet is up")
        c.isBlockingSheetPresented = false
        c.sceneDidChange(to: .inactive)
        XCTAssertFalse(c.claimPrompt(), "Never while the scene isn't active")
        c.sceneDidChange(to: .active)
        XCTAssertTrue(c.claimPrompt())
    }

    @MainActor
    func testCoordinatorNeedsADetailDismissalFirst() {
        let c = ReviewPromptCoordinator(tracker: tracker(), isEnabled: true)
        let t = tracker()
        t.recordSession()
        viewDetails(["crag:a", "crag:b", "crag:c"], on: t)
        c.sceneDidChange(to: .active)       // session 2, thresholds met
        XCTAssertTrue(t.shouldRequestReview())
        XCTAssertFalse(c.claimPrompt(), "Resting on launch, with no detail just closed, is not a trigger")
        c.detailDidAppear("crag:a")
        c.detailDidDisappear()
        XCTAssertTrue(c.claimPrompt())
    }

    @MainActor
    func testCoordinatorStaysQuietAfterShowOnMapOrOpenInRoutes() {
        let c = readyCoordinator()
        c.didNavigateProgrammatically()     // detail closed by a jump, not by coming back
        XCTAssertFalse(c.claimPrompt())
        XCTAssertNil(tracker().lastPromptedVersion, "A suppressed check must not use up the version")
    }

    @MainActor
    func testProbeCountsOnlyWhenEnabled() {
        let off = ReviewPromptCoordinator(tracker: tracker(), isEnabled: true, isProbeEnabled: false)
        off.didRequestReview()
        XCTAssertEqual(off.probeRequestCount, 0)
        let on = ReviewPromptCoordinator(tracker: tracker(), isEnabled: true, isProbeEnabled: true)
        on.didRequestReview()
        XCTAssertEqual(on.probeRequestCount, 1)
        // This test process has no -reviewPromptProbe argument, so the default is off.
        XCTAssertFalse(ReviewPromptCoordinator(tracker: tracker()).isProbeEnabled)
    }

    @MainActor
    func testCoordinatorInactiveBlipIsNotANewSession() {
        let c = ReviewPromptCoordinator(tracker: tracker(), isEnabled: true)
        c.sceneDidChange(to: .active)
        c.sceneDidChange(to: .inactive)     // Control Center / app switcher
        c.sceneDidChange(to: .active)
        XCTAssertEqual(tracker().sessionCount, 1)
        c.sceneDidChange(to: .background)
        c.sceneDidChange(to: .active)
        XCTAssertEqual(tracker().sessionCount, 2)
    }

    @MainActor
    func testDisabledCoordinatorNeverPromptsOrRecords() {
        let c = readyCoordinator(enabled: false)
        XCTAssertFalse(c.claimPrompt())
        XCTAssertEqual(tracker().sessionCount, 0)
        XCTAssertEqual(tracker().distinctDetailCount, 0)
    }
}
