import XCTest

/// Captures every main screen in light and dark for the UI-pass before/after
/// comparison. Opt-in, so the normal suite skips it:
///   echo after > /tmp/uipass/.phase
///   xcrun simctl ui <device> appearance dark   # see below
///   xcodebuild test -only-testing:KohTaoClimbingUITests/UIPassScreenshotTests …
/// PNGs land in /tmp/uipass/after/, and every PNG is also a named XCTAttachment,
/// so `xcrun xcresulttool export attachments` recovers them from the result bundle.
/// Start the simulator in dark: on the iOS 26.2 simulator, switching
/// `XCUIDevice.appearance` light→dark from a light start was silently ignored
/// (every "dark" shot came out light), while starting dark flipped reliably.
final class UIPassScreenshotTests: XCTestCase {
    private struct Shot {
        let name: String
        let arguments: [String]
        /// Extra settle time for the map raster and sheet animations.
        var settle: TimeInterval = 2.5
        var prepare: ((XCUIApplication) -> Void)? = nil
    }

    /// `-mapCameraDistance 0` overrides the persisted camera so every map shot opens
    /// on the default island framing.
    private static let freshMap = ["-mapCameraDistance", "0"]

    @MainActor
    private var shots: [Shot] {
        let freshMap = Self.freshMap
        return [
        Shot(name: "map", arguments: ["-skipAbout"] + freshMap, settle: 4),
        Shot(name: "map-crag-sheet", arguments: ["-selectCrag", "meks-mountain"] + freshMap, settle: 4),
        Shot(name: "map-edge", arguments: ["-debugCamera", "10.026", "99.792", "9000"], settle: 4),
        Shot(name: "crags", arguments: ["-initialTab", "crags"]),
        Shot(name: "crag-detail", arguments: ["-initialTab", "crags", "-initialCrag", "meks-mountain"]),
        Shot(name: "crag-detail-more", arguments: ["-initialTab", "crags", "-initialCrag", "meks-mountain"],
             prepare: { app in
                 app.swipeUp(velocity: .slow)
                 app.swipeUp(velocity: .slow)
             }),
        Shot(name: "routes", arguments: ["-initialTab", "routes"]),
        Shot(name: "routes-filtered", arguments: ["-initialTab", "routes", "-routesStyle", "sport",
                                                  "-routesGradeBand", "mid", "-routesPhotoFilter", "has-photo"]),
        Shot(name: "routes-empty", arguments: ["-initialTab", "routes", "-routesStyle", "boulder",
                                               "-routesGradeBand", "project", "-routesPhotoFilter", "has-photo"]),
        Shot(name: "route-detail", arguments: ["-initialTab", "routes", "-initialRoute", "a"]),
        Shot(name: "photo-viewer", arguments: ["-initialTab", "crags", "-initialCrag", "meks-mountain", "-showViewer", "0"],
             settle: 3),
        Shot(name: "plan", arguments: ["-initialTab", "plan"]),
        Shot(name: "guidebooks", arguments: ["-initialTab", "plan", "-planSection", "guidebooks"]),
        Shot(name: "gear-safety", arguments: ["-initialTab", "plan", "-planSection", "gear"]),
        Shot(name: "about", arguments: ["-initialTab", "plan", "-planSection", "about"]),
        Shot(name: "about-first-run", arguments: ["-didShowAboutGuide", "NO"] + freshMap, settle: 3),
        Shot(name: "community", arguments: ["-initialTab", "community"]),
        Shot(name: "report-detail", arguments: ["-initialTab", "community", "-initialReport", "video"]),
    ] }

    @MainActor
    func testCaptureAllScreensLightAndDark() throws {
        guard let config = Self.outputConfig() else {
            throw XCTSkip("Write a phase (before/after) to /tmp/uipass/.phase, or set TEST_RUNNER_UIPASS_OUT, to capture UI-pass screenshots.")
        }
        let outDir = config.dir
        try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
        let only = config.only

        for appearance in [XCUIDevice.Appearance.light, .dark] {
            XCUIDevice.shared.appearance = appearance
            let suffix = appearance == .dark ? "dark" : "light"
            for shot in shots where only?.contains(shot.name) ?? true {
                let app = XCUIApplication()
                // The rating prompt must never land in a screenshot.
                app.launchArguments += ["-disableReviewPrompt"] + shot.arguments
                app.launch()
                XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 15), "\(shot.name): app did not launch")
                Thread.sleep(forTimeInterval: shot.settle)
                shot.prepare?(app)
                if shot.prepare != nil { Thread.sleep(forTimeInterval: 1) }

                let png = XCUIScreen.main.screenshot().pngRepresentation
                let file = outDir.appendingPathComponent("\(shot.name)-\(suffix).png")
                try png.write(to: file)
                let attachment = XCTAttachment(data: png, uniformTypeIdentifier: "public.png")
                attachment.name = "\(shot.name)-\(suffix)"
                attachment.lifetime = .keepAlways
                add(attachment)
                app.terminate()
            }
        }
        XCUIDevice.shared.appearance = .light
    }

    /// Output folder and optional shot filter. `TEST_RUNNER_UIPASS_OUT` (plus
    /// `TEST_RUNNER_UIPASS_ONLY=map,crags`) wins; otherwise a `.phase` file in
    /// `/tmp/uipass` names the phase subfolder on its first line and an optional
    /// filter on its second; PNGs land in `/tmp/uipass/<phase>/`, to be copied into
    /// `docs/ui-pass/<phase>/`. /tmp rather than the repo because a checkout under
    /// ~/Documents is privacy-protected, and the simulator's test runner blocks on
    /// an unanswerable access prompt there. Missing or empty `.phase` = no capture.
    private static func outputConfig() -> (dir: URL, only: Set<String>?)? {
        func parseOnly(_ text: String?) -> Set<String>? {
            guard let text, !text.isEmpty else { return nil }
            return Set(text.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) })
        }
        let env = ProcessInfo.processInfo.environment
        if let out = env["UIPASS_OUT"], !out.isEmpty {
            return (URL(fileURLWithPath: out, isDirectory: true), parseOnly(env["UIPASS_ONLY"]))
        }
        let uiPass = URL(fileURLWithPath: "/tmp/uipass", isDirectory: true)
        guard let marker = try? String(contentsOf: uiPass.appendingPathComponent(".phase"), encoding: .utf8) else {
            return nil
        }
        let lines = marker.split(separator: "\n").map { $0.trimmingCharacters(in: .whitespaces) }
        guard let phase = lines.first, !phase.isEmpty else { return nil }
        return (uiPass.appendingPathComponent(phase, isDirectory: true), parseOnly(lines.dropFirst().first))
    }
}
