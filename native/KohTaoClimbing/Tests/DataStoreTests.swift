import XCTest
@testable import KohTaoClimbing

/// Guards schema drift: work/export-data.mjs regenerates AppResources/Data/*.json
/// from the web app's data layer, and these tests fail if any of the 7 files
/// stops decoding against the Swift models, or if cross-references break.
/// Hosted in the app, so Bundle.main resolves the real shipped AppResources.
@MainActor
final class DataStoreTests: XCTestCase {
    let store = DataStore.shared

    func testAllSevenJSONsDecode() {
        XCTAssertTrue(store.loadErrors.isEmpty, "DataStore load errors: \(store.loadErrors)")
    }

    func testEveryFileDecodedNonEmpty() {
        XCTAssertFalse(store.crags.isEmpty, "crags.json decoded empty")
        XCTAssertFalse(store.routes.isEmpty, "routes.json decoded empty")
        XCTAssertFalse(store.guidePhotos.isEmpty, "photos.json guide decoded empty")
        XCTAssertFalse(store.communityPhotos.isEmpty, "photos.json community decoded empty")
        XCTAssertFalse(store.reports.isEmpty, "reports.json decoded empty")
        XCTAssertNotNil(store.info, "info.json failed to decode")
        XCTAssertFalse(store.services.isEmpty, "services.json decoded empty")
        XCTAssertFalse(store.sources.isEmpty, "sources.json decoded empty")
    }

    func testRouteCragNamesResolveToCrags() {
        let cragNames = Set(store.crags.map(\.name))
        let dangling = store.routes.filter { !cragNames.contains($0.crag) }
        XCTAssertTrue(dangling.isEmpty,
                      "Routes referencing unknown crags: \(dangling.prefix(5).map { "\($0.name) -> \($0.crag)" })")
    }

    func testCragCoordinatesStayOnTheIsland() {
        for crag in store.crags {
            guard let coords = crag.coords else { continue }
            XCTAssert((10.0...10.2).contains(coords.lat), "\(crag.name) lat off-island: \(coords.lat)")
            XCTAssert((99.7...100.0).contains(coords.lng), "\(crag.name) lng off-island: \(coords.lng)")
        }
    }

    func testReportPhotosExistInCommunityLibrary() {
        let known = Set(store.communityPhotos.map(\.file))
        var missing: [String] = []
        for report in store.reports {
            for file in report.photos ?? [] where !known.contains(file) {
                missing.append("\(report.id) -> \(file)")
            }
        }
        XCTAssertTrue(missing.isEmpty, "Report photos missing from photos.json: \(missing.prefix(5))")
    }

    func testBundledPhotoFilesExist() {
        for photo in store.guidePhotos + store.communityPhotos {
            XCTAssertNotNil(BundledImageStore.url(for: photo.file).flatMap { FileManager.default.fileExists(atPath: $0.path) ? $0 : nil },
                            "Missing bundled image for \(photo.file)")
        }
    }

    func testGradeSortKeysAreStable() {
        for route in store.routes {
            let key = GradeSort.key(for: route)
            XCTAssert((0...4).contains(key.system), "Unexpected grade system in \(route.gradeSystem)")
        }
    }

    /// DQ-003-F2: photos have no per-route link, so the route photo signal must equal
    /// the crag's, and the filter copy must say "crag" while raw values stay stable.
    func testRoutePhotoSignalIsCragLevelAndLabelledSo() {
        for route in store.routes {
            XCTAssertEqual(store.hasPhotos(forRoute: route), store.hasPhotos(forCragName: route.crag),
                           "\(route.name) photo signal differs from its crag's")
        }
        XCTAssertEqual(PhotoPresenceFilter.fromLaunchArg("has-photo"), .hasPhoto)
        XCTAssertEqual(PhotoPresenceFilter.fromLaunchArg("no-photo"), .noPhoto)
        XCTAssertEqual(PhotoPresenceFilter.hasPhoto.rawValue, "has-photo")
        XCTAssertEqual(PhotoPresenceFilter.noPhoto.rawValue, "no-photo")
        XCTAssertEqual(PhotoPresenceFilter.hasPhoto.chipLabel, "crag has photos")
        XCTAssertEqual(PhotoPresenceFilter.noPhoto.chipLabel, "no crag photos")
        XCTAssertEqual(PhotoPresenceFilter.all.accessibilityLabel, "Crag photo filter")
        XCTAssertEqual(PhotoPresenceFilter.hasPhoto.accessibilityLabel, "Crag photo filter, crag has photos")
    }

    /// The old Thaitanium Project website domain is now a hijacked gambling site: never ship it.
    /// Built from parts so the repo itself never contains the domain.
    func testNoBundledJSONLinksTheHijackedThaitaniumDomain() throws {
        let domain = "thaitaniumproject" + ".com"
        let dir = try XCTUnwrap(Bundle.main.resourceURL?.appendingPathComponent("AppResources/Data"))
        let files = try FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)
            .filter { $0.pathExtension == "json" }
        XCTAssertEqual(files.count, 7, "Expected the 7 bundled JSON files")
        for file in files {
            let text = try String(contentsOf: file, encoding: .utf8).lowercased()
            XCTAssertFalse(text.contains(domain), "\(file.lastPathComponent) links the hijacked domain")
        }
    }

    /// Mek's Mountain entry fee is 200 THB (theCrag + rakkup, 2026-09-28), no longer 100 THB.
    func testMeksMountainFeeIs200THB() throws {
        let meks = try XCTUnwrap(store.crags.first { $0.slug == "meks-mountain" })
        let fee = try XCTUnwrap(meks.accessFee)
        XCTAssertTrue(fee.hasPrefix("200 THB"), "Mek's fee reads: \(fee)")
        let ethics = try XCTUnwrap(store.info?.ethics.fullerPicture.first { $0.contains("Mek's Mountain is") })
        XCTAssertTrue(ethics.contains("Mek's Mountain is 200 THB"), "Ethics fee line reads: \(ethics)")
    }
}
