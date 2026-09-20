import Foundation

/// Heuristic grade bands for Routes filtering. Systems are not cross-comparable;
/// thresholds apply inside each `gradeSystem` via `GradeSort` values.
/// Climber-useful buckets — not guidebook gospel.
enum GradeBand: String, CaseIterable, Identifiable, Sendable {
    case easy = "Easy"
    case mid = "Mid"
    case hard = "Hard"
    case project = "Project"

    var id: String { rawValue }

    static func fromLaunchArg(_ raw: String) -> GradeBand? {
        switch raw.lowercased() {
        case "easy": return .easy
        case "mid", "middle", "moderate": return .mid
        case "hard": return .hard
        case "project", "ungraded", "proj": return .project
        default: return nil
        }
    }

    func matches(_ route: RouteRecord) -> Bool {
        let value = GradeSort.key(for: route).value
        let ungraded = GradeSort.ungradedValue
        if self == .project {
            let g = route.grade.lowercased()
            return value >= ungraded * 0.9
                || g.hasPrefix("project")
                || g.hasPrefix("ungraded")
        }
        let (midLo, hardLo) = Self.bounds(system: route.gradeSystem)
        switch self {
        case .easy: return value < midLo
        case .mid: return value >= midLo && value < hardLo
        case .hard: return value >= hardLo && value < ungraded * 0.9
        case .project: return false
        }
    }

    /// (midLowerBound, hardLowerBound) in GradeSort value space.
    private static func bounds(system: String) -> (Double, Double) {
        switch system {
        case "v": return (30, 70)          // ≤V2 / V3–V6 / ≥V7
        case "font": return (55, 70)       // ≤5+ / 6A–6C / ≥7A
        case "french": return (52, 64)     // ≤5a / 5b–6b+ / ≥6c
        case "zen-gecko": return (20, 40)  // VE–E / M–MH / H–VH
        default: return (50, 65)
        }
    }
}
