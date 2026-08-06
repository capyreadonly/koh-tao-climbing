import Foundation

/// Best-effort numeric sort key for the guide's mixed grade systems (V-scale,
/// Font, French sport, and the local "zen gecko" boulder labels). Systems are
/// not cross-comparable, so sorting is grouped by grade system first.
enum GradeSort {
    /// Lower = easier. Unknown/ungraded grades sort last within their system.
    static func key(for route: RouteRecord) -> (system: Int, value: Double) {
        (systemRank(route.gradeSystem), value(route.grade))
    }

    static func systemRank(_ system: String) -> Int {
        switch system {
        case "v": return 0
        case "font": return 1
        case "french": return 2
        case "zen-gecko": return 3
        default: return 4
        }
    }

    static let ungradedValue: Double = 1_000_000

    private static func value(_ grade: String) -> Double {
        let lowered = grade.lowercased()
        if lowered.hasPrefix("v-easy") { return -10 }
        if lowered.hasPrefix("ungraded") || lowered.hasPrefix("project") { return ungradedValue }
        // Reduce ranges/lists to their first grade: "5a-5c" -> "5a", "E / M" -> "E",
        // "MH 6b (sit)" -> "MH".
        let first = grade.split(whereSeparator: { $0 == " " || $0 == "/" || $0 == "–" || $0 == "—" })
            .first.map(String.init) ?? grade
        // V-scale: V0, V10, VB (beginner).
        if first.caseInsensitiveCompare("vb") == .orderedSame { return -5 }
        if let match = first.wholeMatch(of: /^[vV](\d+)$/) {
            return (Double(match.1) ?? 0) * 10
        }
        // Zen-gecko boulder labels.
        let zen: [String: Double] = ["ve": 0, "e": 10, "m": 20, "mh": 30, "h": 40, "vh": 50]
        if let z = zen[first.lowercased()] { return z }
        // French / Font: number + optional a/b/c letter + optional "+".
        if let match = first.wholeMatch(of: /^(\d+)([a-cA-C]?)(\+?)(-.*)?$/) {
            var value = (Double(match.1) ?? 0) * 10
            switch match.2.lowercased() {
            case "b": value += 2
            case "c": value += 4
            default: break
            }
            if !match.3.isEmpty { value += 1 }
            return value
        }
        return ungradedValue
    }
}
