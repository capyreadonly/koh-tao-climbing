import XCTest

/// The photo viewer credits every photo with a source link: the Goodtime guidebook
/// (with PDF page) for guide images, author + licence + host for the others.
final class PhotoCreditUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    @MainActor
    private func launchViewer(at index: Int) -> XCUIApplication {
        let app = XCUIApplication()
        app.launchArguments += ["-disableReviewPrompt", "-initialTab", "crags",
                                "-initialCrag", "meks-mountain", "-showViewer", "\(index)"]
        app.launch()
        return app
    }

    @MainActor
    func testGuideImageShowsGoodtimeCreditAndPdfLink() throws {
        // Mek's Mountain lists its guide images first, so page 0 is a Goodtime image.
        let app = launchViewer(at: 0)
        let credit = app.staticTexts["photoCredit"]
        XCTAssertTrue(credit.waitForExistence(timeout: 10), "Viewer should show a credit line")
        XCTAssertTrue(credit.label.hasPrefix("From Koh Tao Rock Climbing & Bouldering Guide by Goodtime Adventures (v1/14), p."),
                      "Unexpected guide credit: \(credit.label)")
        let link = app.descendants(matching: .any)["photoSourceLink"].firstMatch
        XCTAssertTrue(link.waitForExistence(timeout: 5), "Viewer should link the guidebook PDF")
        XCTAssertTrue(link.label.contains("Guidebook PDF"), "Unexpected link label: \(link.label)")
    }

    @MainActor
    func testCommunityPhotoShowsAuthorLicenceAndSourceLink() throws {
        // An out-of-range index clamps to the last page: Mek's Mountain's Mountain Project photo.
        let app = launchViewer(at: 999)
        let credit = app.staticTexts["photoCredit"]
        XCTAssertTrue(credit.waitForExistence(timeout: 10), "Viewer should show a credit line")
        XCTAssertEqual(credit.label, "© Brian Ways")
        XCTAssertEqual(app.staticTexts["photoLicense"].label, "All rights reserved")
        let link = app.descendants(matching: .any)["photoSourceLink"].firstMatch
        XCTAssertTrue(link.waitForExistence(timeout: 5), "Viewer should link the photo's source page")
        XCTAssertTrue(link.label.contains("Mountain Project"), "Unexpected link label: \(link.label)")
    }

    @MainActor
    func testSourcesScreenListsPhotoCredits() throws {
        let app = XCUIApplication()
        app.launchArguments += ["-disableReviewPrompt", "-initialTab", "plan", "-planSection", "sources"]
        app.launch()
        XCTAssertTrue(app.descendants(matching: .any)["goodtimePdfLink"].firstMatch.waitForExistence(timeout: 10),
                      "Sources should credit Goodtime with a PDF link")
        let mp = app.staticTexts.containing(NSPredicate(format: "label BEGINSWITH 'Mountain Project ·'")).firstMatch
        for _ in 0..<6 where !mp.exists { app.swipeUp() }
        XCTAssertTrue(mp.waitForExistence(timeout: 5), "Photo credits should group a Mountain Project source")
    }
}
