import XCTest

/// End-to-end checks of when the app asks for a rating. Apple's own sheet can't be
/// detected reliably from XCUITest (out of process, and StoreKit may suppress it),
/// so `-reviewPromptProbe` makes the app show a tiny marker, `reviewPromptRequested`,
/// whose label counts its `requestReview()` calls. The marker sits on the root and on
/// every detail, so it is readable with or without a sheet up.
///
/// The thresholds are met through argument-domain defaults, which override the app's
/// stored values on every read, so each run starts eligible. The app's own writes
/// (lastPromptedVersion, sessionCount) still land in this simulator's defaults, so a
/// manual run there won't prompt again for this version.
final class ReviewPromptUITests: XCTestCase {
    private static let eligible = [
        "-reviewPromptProbe",
        "-reviewPrompt.sessionCount", "5",
        "-reviewPrompt.viewedDetails", "(crag:a, crag:b, crag:c)",
        "-reviewPrompt.lastPromptedVersion", "0.0",
    ]

    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    /// The main path: map pin → CragDetail sheet → Done → prompt over the map.
    @MainActor
    func testRatingPromptRequestedAfterClosingMapCragSheet() throws {
        let app = XCUIApplication()
        app.launchArguments += ["-skipAbout", "-selectCrag", "meks-mountain"] + Self.eligible
        app.launch()

        let done = app.buttons["cragDetailDone"]
        XCTAssertTrue(done.waitForExistence(timeout: 20), "Crag sheet should open from the map")
        assertNoRequest(in: app, for: 4, "No prompt while the sheet is up")
        done.tap()
        assertRequestCount(1, in: app, within: 10, "Closing the sheet should ask for a rating")
        assertNoFurtherRequest(in: app, expected: 1, for: 3)
    }

    /// Leaving a pushed detail by switching tabs is navigation, not a return to rest.
    @MainActor
    func testNoRatingPromptWhenSwitchingTabsAwayFromDetail() throws {
        let app = XCUIApplication()
        app.launchArguments += ["-initialTab", "crags", "-initialCrag", "meks-mountain"] + Self.eligible
        app.launch()

        XCTAssertTrue(app.navigationBars["Mek's Mountain"].waitForExistence(timeout: 15))
        app.tabBars.buttons["Map"].tap()
        XCTAssertTrue(app.buttons["Show the whole island"].waitForExistence(timeout: 10), "Map tab should show")
        assertNoRequest(in: app, for: 6, "A tab switch must not trigger the prompt")
    }

    /// Back to the Crags list starts an attempt, but opening another detail during the
    /// settle delay cancels it; the next return asks instead.
    @MainActor
    func testNewDetailDuringDelayCancelsPromptUntilNextReturn() throws {
        let app = XCUIApplication()
        app.launchArguments += ["-initialTab", "crags", "-initialCrag", "meks-mountain",
                                "-reviewPromptSettleDelay", "6"] + Self.eligible
        app.launch()

        let detail = app.navigationBars["Mek's Mountain"]
        XCTAssertTrue(detail.waitForExistence(timeout: 15))
        detail.buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Crags"].waitForExistence(timeout: 5))

        let row = app.buttons["cragRow-meks-mountain"]
        XCTAssertTrue(row.waitForExistence(timeout: 5), "Mek's Mountain row should be in the Crags list")
        row.tap()                          // within the 6 s delay
        XCTAssertTrue(detail.waitForExistence(timeout: 5), "Mek's Mountain detail should be pushed")
        assertNoRequest(in: app, for: 9, "The cancelled attempt must not fire over the new detail")

        detail.buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Crags"].waitForExistence(timeout: 5))
        assertRequestCount(1, in: app, within: 14, "The next return to the list should ask")
    }

    // MARK: - Probe marker

    @MainActor
    private func requestCount(in app: XCUIApplication) -> Int? {
        let marker = app.descendants(matching: .any)["reviewPromptRequested"].firstMatch
        guard marker.exists else { return nil }
        return Int(marker.label)
    }

    /// The marker must be readable and stay at 0 for the whole window.
    @MainActor
    private func assertNoRequest(in app: XCUIApplication, for seconds: TimeInterval, _ message: String) {
        assertNoFurtherRequest(in: app, expected: 0, for: seconds, message)
    }

    @MainActor
    private func assertNoFurtherRequest(in app: XCUIApplication, expected: Int, for seconds: TimeInterval,
                                        _ message: String = "No further prompt") {
        var sawMarker = false
        let deadline = Date.now.addingTimeInterval(seconds)
        repeat {
            if let count = requestCount(in: app) {
                sawMarker = true
                XCTAssertEqual(count, expected, message)
            }
            Thread.sleep(forTimeInterval: 0.5)
        } while Date.now < deadline
        XCTAssertTrue(sawMarker, "Probe marker never found — is -reviewPromptProbe wired?")
    }

    @MainActor
    private func assertRequestCount(_ expected: Int, in app: XCUIApplication, within seconds: TimeInterval,
                                    _ message: String) {
        let deadline = Date.now.addingTimeInterval(seconds)
        var last: Int?
        repeat {
            last = requestCount(in: app)
            if last == expected { return }
            Thread.sleep(forTimeInterval: 0.5)
        } while Date.now < deadline
        let marker = app.descendants(matching: .any)["reviewPromptRequested"].firstMatch
        let decision = marker.exists ? (marker.value as? String ?? "?") : "missing"
        XCTFail("\(message) (marker = \(last.map(String.init) ?? "missing"), last check: \(decision))")
    }
}
