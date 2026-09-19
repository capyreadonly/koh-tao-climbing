import Foundation
import Observation

/// Shared selection for “Show on map”: a crag or route detail requests a slug,
/// the root tab switches to Map, and the map moves the camera and selects that pin.
@Observable
@MainActor
final class MapFocus {
    /// Crag slug to focus. Nil until the first request.
    private(set) var slug: String?
    /// Bumped on every request so the map can re-apply the same slug.
    private(set) var token: Int = 0

    func show(cragSlug: String) {
        slug = cragSlug
        token += 1
    }
}
