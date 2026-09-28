import XCTest

/// Journey: launch → Map → select crag pin → crag/routes detail (not a dead end).
final class MapTapRoutesUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    /// `-selectCrag` drives the same sheet as a pin tap (TF 1.0.2 NavigationPath push was insufficient).
    @MainActor
    func testMapCragSelectionOpensCragRoutesDetail() throws {
        let app = XCUIApplication()
        app.launchArguments += [
            "-skipAbout",
            "-disableReviewPrompt",
            "-selectCrag", "meks-mountain",
        ]
        app.launch()

        let mapTab = app.tabBars.buttons["Map"]
        if mapTab.waitForExistence(timeout: 12) {
            mapTab.tap()
        }

        // Sheet presentation (not nav push) — look for detail chrome + Done.
        let nav = app.navigationBars["Mek's Mountain"]
        let detail = app.otherElements["cragDetail"]
        let done = app.buttons["cragDetailDone"]
        let sheet = app.otherElements["cragDetailSheet"]
        let opened = nav.waitForExistence(timeout: 20)
            || detail.waitForExistence(timeout: 5)
            || done.waitForExistence(timeout: 5)
            || sheet.waitForExistence(timeout: 5)
        XCTAssertTrue(opened, "Selecting a map crag must open crag/routes detail sheet")

        XCTAssertTrue(
            app.staticTexts["Routes"].waitForExistence(timeout: 8)
                || app.buttons["openInRoutesProminent"].waitForExistence(timeout: 3),
            "Crag detail should show the Routes section or Open-in-Routes CTA"
        )
    }

    /// Grade band + style filters are both available on Routes.
    @MainActor
    func testRoutesGradeAndStyleFiltersExist() throws {
        let app = XCUIApplication()
        app.launchArguments += [
            "-skipAbout",
            "-disableReviewPrompt",
            "-initialTab", "routes",
            "-routesStyle", "boulder",
            "-routesGradeBand", "mid",
        ]
        app.launch()

        let gradeFilter = app.descendants(matching: .any)["routesGradeFilter"]
        XCTAssertTrue(
            gradeFilter.waitForExistence(timeout: 12),
            "Grade filter control should be in the Routes filter bar"
        )
        let clear = app.buttons["Clear filters"]
        let clearChip = app.staticTexts["clear"]
        XCTAssertTrue(
            clear.waitForExistence(timeout: 8) || clearChip.waitForExistence(timeout: 2),
            "Active grade+style filters should offer a clear control"
        )
    }

    /// Crag photo filter chip + "Crag photos" row labels (crag-level signal, DQ-003-F2).
    @MainActor
    func testRoutesPhotoFilterExists() throws {
        let app = XCUIApplication()
        app.launchArguments += [
            "-skipAbout",
            "-disableReviewPrompt",
            "-initialTab", "routes",
            "-routesPhotoFilter", "has-photo",
        ]
        app.launch()

        let photoFilter = app.descendants(matching: .any)["routesPhotoFilter"]
        XCTAssertTrue(
            photoFilter.waitForExistence(timeout: 12),
            "Crag photo filter control should be in the Routes filter bar"
        )
        XCTAssertEqual(
            photoFilter.label, "Crag photo filter, crag has photos",
            "Chip should say the filter is crag-level"
        )
        let cragPhotos = app.staticTexts["Crag photos"]
        XCTAssertTrue(
            cragPhotos.waitForExistence(timeout: 10),
            "Filtered routes should show Crag photos labels"
        )
        XCTAssertFalse(
            app.staticTexts["Has photo"].exists,
            "Rows must not claim the route itself has a photo"
        )
    }
}
