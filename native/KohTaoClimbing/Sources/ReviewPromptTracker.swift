import Foundation

/// Decides when the App Store rating prompt may be shown. Pure bookkeeping over an
/// injected `UserDefaults` and app version, so the thresholds are unit-testable;
/// presenting the prompt, and choosing a calm moment for it, is up to the caller
/// (see `ReviewPromptCoordinator`).
///
/// Policy:
/// - at least `minimumDistinctDetails` distinct crag/route details opened, ever;
/// - at least `minimumSessions` sessions, so never in the first session;
/// - at most once per `CFBundleShortVersionString`. Counts are not reset after a
///   prompt, so the next version asks again once the user is back at a resting
///   screen after a detail — Apple's own cap (3 a year) limits it further.
final class ReviewPromptTracker {
    static let minimumDistinctDetails = 3
    static let minimumSessions = 2

    enum Key {
        static let viewedDetails = "reviewPrompt.viewedDetails"
        static let sessionCount = "reviewPrompt.sessionCount"
        static let lastPromptedVersion = "reviewPrompt.lastPromptedVersion"
    }

    /// Launch argument that switches the prompt off (UI tests, screenshot runs).
    static let disableArgument = "-disableReviewPrompt"

    private let defaults: UserDefaults
    private let appVersion: String

    init(defaults: UserDefaults = .standard, appVersion: String = ReviewPromptTracker.bundleVersion) {
        self.defaults = defaults
        self.appVersion = appVersion
    }

    static var bundleVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0"
    }

    /// Off for UI tests (launch argument) and for unit tests hosted in the app.
    static func isDisabled(arguments: [String] = ProcessInfo.processInfo.arguments,
                           environment: [String: String] = ProcessInfo.processInfo.environment) -> Bool {
        arguments.contains(disableArgument) || environment["XCTestConfigurationFilePath"] != nil
    }

    var sessionCount: Int { defaults.integer(forKey: Key.sessionCount) }

    var distinctDetailCount: Int { viewedDetails.count }

    var lastPromptedVersion: String? { defaults.string(forKey: Key.lastPromptedVersion) }

    private var viewedDetails: Set<String> {
        Set(defaults.stringArray(forKey: Key.viewedDetails) ?? [])
    }

    func recordSession() {
        defaults.set(sessionCount + 1, forKey: Key.sessionCount)
    }

    /// `id` is namespaced by the caller ("crag:<slug>", "route:<id>"); repeats are ignored.
    func recordDetailViewed(_ id: String) {
        var viewed = viewedDetails
        // Only the threshold matters, so stop growing the stored list once it's met.
        guard viewed.count < Self.minimumDistinctDetails, viewed.insert(id).inserted else { return }
        defaults.set(viewed.sorted(), forKey: Key.viewedDetails)
    }

    func shouldRequestReview() -> Bool {
        distinctDetailCount >= Self.minimumDistinctDetails
            && sessionCount >= Self.minimumSessions
            && lastPromptedVersion != appVersion
    }

    func markPrompted() {
        defaults.set(appVersion, forKey: Key.lastPromptedVersion)
    }
}
