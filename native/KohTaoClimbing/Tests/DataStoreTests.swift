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
}
