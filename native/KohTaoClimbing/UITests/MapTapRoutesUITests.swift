import XCTest

/// Journey: launch → Map → select crag pin → crag/routes detail (not a dead end).
final class MapTapRoutesUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    /// `-selectCrag` drives the same navigation as a pin tap (path push + didSelect).
    @MainActor
    func testMapCragSelectionOpensCragRoutesDetail() throws {
        let app = XCUIApplication()
        app.launchArguments += [
            "-skipAbout",
            "-selectCrag", "meks-mountain",
        ]
        app.launch()

        let mapTab = app.tabBars.buttons["Map"]
        if mapTab.waitForExistence(timeout: 12) {
            mapTab.tap()
        }

        let nav = app.navigationBars["Mek's Mountain"]
        let detail = app.otherElements["cragDetail"]
        let opened = nav.waitForExistence(timeout: 20) || detail.waitForExistence(timeout: 5)
        XCTAssertTrue(opened, "Selecting a map crag must open crag/routes detail")

        XCTAssertTrue(
            app.staticTexts["Routes"].waitForExistence(timeout: 8),
            "Crag detail should show the Routes section"
        )
    }

    /// Grade band + style filters are both available on Routes.
    @MainActor
    func testRoutesGradeAndStyleFiltersExist() throws {
        let app = XCUIApplication()
        app.launchArguments += [
            "-skipAbout",
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
}
