import XCTest
@testable import KohTaoClimbing

/// Photo credits, route-source labels and the bundled-image inventory.
/// The counts are the ones recorded before the attribution pass (2026-09-28):
/// no image and no photos.json entry may be removed while Goodtime's reply is pending.
@MainActor
final class AttributionTests: XCTestCase {
    let store = DataStore.shared

    static let expectedGuideImages = 179
    static let expectedCommunityImages = 72
    static let expectedCcEntries = 43
    static let expectedAllRightsReservedEntries = 29

    // MARK: Route source labels

    func testRouteSourceLabelsForKnownValues() {
        XCTAssertEqual(RouteSourceLabel.label(for: "guidebook"), "Goodtime Adventures guidebook (PDF)")
        XCTAssertEqual(RouteSourceLabel.label(for: "27crags"), "27crags / The Topo")
        XCTAssertEqual(RouteSourceLabel.label(for: "mountainproject"), "Mountain Project")
        XCTAssertEqual(RouteSourceLabel.label(for: "thecrag"), "theCrag")
        XCTAssertEqual(RouteSourceLabel.label(for: "vault"), "Vault note")
    }

    func testRouteSourceLabelFallsBackToRawValue() {
        XCTAssertEqual(RouteSourceLabel.label(for: "somewhere-new"), "somewhere-new")
    }

    func testEveryRouteSourceInDataHasAPlainLabel() {
        let unlabelled = Set(store.routes.map(\.source)).filter { RouteSourceLabel.label(for: $0) == $0 }
        XCTAssertTrue(unlabelled.isEmpty, "Route sources without a label: \(unlabelled)")
    }

    // MARK: Goodtime credit

    func testGoodtimeCreditWithPage() {
        let credit = PhotoCredit.goodtime(page: 12)
        XCTAssertEqual(credit.text,
                       "From Koh Tao Rock Climbing & Bouldering Guide by Goodtime Adventures (v1/14), p.12")
        XCTAssertEqual(credit.link?.absoluteString, GoodtimeGuide.pdfURLString)
        XCTAssertTrue(credit.isGuide)
        XCTAssertNil(credit.license)
    }

    func testGoodtimeCreditWithoutPage() {
        let credit = PhotoCredit.goodtime(page: nil)
        XCTAssertEqual(credit.text, "From Koh Tao Rock Climbing & Bouldering Guide by Goodtime Adventures (v1/14)")
        XCTAssertFalse(credit.text.contains("p."))
        XCTAssertNotNil(credit.link)
    }

    func testGuidePageFallsBackToFilenamePrefix() {
        let photo = PhotoEntry(file: "Images/guide/p07-2-X16.jpg", kind: "photo-topo", caption: "", crag: nil,
                               credit: nil, license: nil, sourceUrl: nil, page: nil)
        XCTAssertEqual(photo.guidePage, 7)
        XCTAssertEqual(PhotoCredit.forPhoto(photo)?.text.hasSuffix(", p.7"), true)
    }

    /// The Goodtime constants must match the guidebook entry shipped in info.json.
    func testGoodtimeConstantsMatchInfoJson() throws {
        let book = try XCTUnwrap(store.info?.guidebooks.first { $0.url == GoodtimeGuide.pdfURLString },
                                 "info.json has no guidebook with the Goodtime PDF url")
        XCTAssertTrue(book.title.hasPrefix(GoodtimeGuide.title), book.title)
        XCTAssertTrue(book.author.hasPrefix(GoodtimeGuide.publisher), book.author)
        XCTAssertEqual(book.year, GoodtimeGuide.edition)
    }

    // MARK: Credits for every bundled photo

    func testEveryGuideImageGetsTheGoodtimeCreditWithAPage() {
        XCTAssertEqual(store.guidePhotos.count, Self.expectedGuideImages)
        for photo in store.guidePhotos {
            let credit = PhotoCredit.forPhoto(photo)
            XCTAssertEqual(credit?.isGuide, true, photo.file)
            XCTAssertEqual(credit?.link, GoodtimeGuide.pdfURL, photo.file)
            XCTAssertNotNil(photo.guidePage, "No page for \(photo.file)")
            // The page field and the p{page} filename prefix agree.
            let name = (photo.file as NSString).lastPathComponent
            let prefix = Int(name.dropFirst().prefix { $0.isNumber })
            XCTAssertEqual(photo.page, prefix, photo.file)
        }
    }

    func testEveryPhotoWithASourceUrlGetsACreditWithALink() {
        for photo in store.communityPhotos + store.guidePhotos where photo.sourceUrl != nil {
            let credit = PhotoCredit.forPhoto(photo)
            XCTAssertNotNil(credit?.link, "No link for \(photo.file)")
            XCTAssertFalse(credit?.linkLabel?.isEmpty ?? true, "No link label for \(photo.file)")
            XCTAssertFalse(credit?.text.isEmpty ?? true, "No author for \(photo.file)")
            XCTAssertNotNil(credit?.license, "No licence for \(photo.file)")
        }
    }

    func testLicenceAndHostLabels() throws {
        XCTAssertEqual(LicenseLabel.short("user-contributed, all rights reserved — shown with attribution and source link"),
                       "All rights reserved")
        XCTAssertEqual(LicenseLabel.short("CC BY-SA 4.0"), "CC BY-SA 4.0")
        XCTAssertEqual(SourceHost.label(for: try XCTUnwrap(URL(string: "https://www.mountainproject.com/photo/1/x"))), "Mountain Project")
        XCTAssertEqual(SourceHost.label(for: try XCTUnwrap(URL(string: "https://commons.wikimedia.org/wiki/File:x.jpg"))), "Wikimedia Commons")
        XCTAssertEqual(SourceHost.label(for: try XCTUnwrap(URL(string: "https://onsightkohtaoclimbing-blog.tumblr.com/"))), "Tumblr")
        XCTAssertEqual(SourceHost.label(for: try XCTUnwrap(URL(string: "http://www.railay.com/a.pdf"))), "railay.com")
        XCTAssertEqual(SourceHost.label(for: try XCTUnwrap(URL(string: "https://example.org/x"))), "example.org")
    }

    func testPhotoCreditsListCoversEveryCommunityPhoto() {
        let sources = PhotoCredits.sources(from: store.communityPhotos + store.guidePhotos)
        XCTAssertEqual(sources.reduce(0) { $0 + $1.photoCount }, Self.expectedCommunityImages)
        XCTAssertFalse(sources.contains { $0.name == "Other" }, "A community photo has no source link")
        let mp = sources.first { $0.name == "Mountain Project" }
        XCTAssertNotNil(mp)
        XCTAssertTrue(mp?.authors.allSatisfy { $0.license == "All rights reserved" } ?? false)
    }

    // MARK: Inventory — nothing removed

    func testBundledImageAndEntryCountsUnchanged() throws {
        let images = try XCTUnwrap(Bundle.main.resourceURL?.appendingPathComponent("AppResources/Images"))
        func count(_ folder: String) throws -> Int {
            try FileManager.default.contentsOfDirectory(atPath: images.appendingPathComponent(folder).path)
                .filter { !$0.hasPrefix(".") }.count
        }
        XCTAssertEqual(try count("guide"), Self.expectedGuideImages)
        XCTAssertEqual(try count("community"), Self.expectedCommunityImages)

        XCTAssertEqual(store.guidePhotos.count, Self.expectedGuideImages)
        XCTAssertEqual(store.communityPhotos.count, Self.expectedCommunityImages)
        let licences = store.communityPhotos.compactMap(\.license)
        XCTAssertEqual(licences.filter { $0.hasPrefix("CC") }.count, Self.expectedCcEntries)
        XCTAssertEqual(licences.filter { $0.localizedCaseInsensitiveContains("all rights reserved") }.count,
                       Self.expectedAllRightsReservedEntries)
        XCTAssertTrue(store.guidePhotos.allSatisfy { $0.license == nil }, "Guide entries gained a licence field")
    }
}
