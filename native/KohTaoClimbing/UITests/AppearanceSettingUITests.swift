import XCTest

/// The Appearance setting (System / Light / Dark) lives at the foot of Plan → About.
final class AppearanceSettingUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    @MainActor
    func testAboutScreenOffersAppearancePicker() throws {
        let app = XCUIApplication()
        // No `-appearance` launch arg: an argument-domain value would pin the setting
        // and hide whether the picker's write actually lands in UserDefaults.
        app.launchArguments += ["-initialTab", "plan", "-planSection", "about"]
        app.launch()

        let picker = app.descendants(matching: .any)["appearancePicker"].firstMatch
        for _ in 0..<8 where !picker.exists {
            app.swipeUp()
        }
        XCTAssertTrue(picker.waitForExistence(timeout: 5), "About should offer an Appearance setting")

        choose("Dark", in: picker, app: app)
        XCTAssertTrue(shows("Dark", picker), "The picker should show Dark after choosing it; got \(describe(picker))")

        // Leave the simulator's app state as the default for later runs.
        choose("System", in: picker, app: app)
        XCTAssertTrue(shows("System", picker), "The picker should return to System; got \(describe(picker))")
    }

    @MainActor
    private func choose(_ option: String, in picker: XCUIElement, app: XCUIApplication) {
        picker.tap()
        let item = app.buttons[option].firstMatch
        XCTAssertTrue(item.waitForExistence(timeout: 5), "Appearance options should include \(option)")
        item.tap()
    }

    /// A menu-style Picker row exposes its current choice in its value (or label).
    @MainActor
    private func shows(_ option: String, _ picker: XCUIElement) -> Bool {
        let predicate = NSPredicate { _, _ in
            (picker.value as? String)?.contains(option) == true || picker.label.contains(option)
        }
        let expectation = XCTNSPredicateExpectation(predicate: predicate, object: nil)
        return XCTWaiter.wait(for: [expectation], timeout: 5) == .completed
    }

    @MainActor
    private func describe(_ picker: XCUIElement) -> String {
        "label=\(picker.label) value=\(String(describing: picker.value))"
    }
}
