import SwiftUI

/// Per-style tint colors, matching the web app's styleColor palette
/// (sport teal / trad amber / boulder violet / multipitch sky / toprope stone).
enum CragStyle {
    static func color(_ style: String) -> Color {
        switch style.lowercased().trimmingCharacters(in: .whitespaces) {
        case "sport": return .teal
        case "trad": return .orange
        case "boulder": return .purple
        case "multipitch": return .cyan
        case "toprope", "tr": return .gray
        default: return .secondary
        }
    }

    /// A crag has several styles; the first one drives its tint (map markers, badges).
    static func color(for crag: Crag) -> Color {
        color(crag.styles.first ?? "")
    }

    /// Routes carry free-form style strings ("sport/toprope", "trad,tr") — tint by first part.
    static func color(forStyleString style: String) -> Color {
        color(primaryStyle(style))
    }

    /// Normalized base style for filtering: first component, lowercased, "tr" -> "toprope".
    static func primaryStyle(_ style: String) -> String {
        let first = style.split(whereSeparator: { $0 == "/" || $0 == "," }).first.map(String.init) ?? style
        let trimmed = first.lowercased().trimmingCharacters(in: .whitespaces)
        return trimmed == "tr" ? "toprope" : trimmed
    }
}

/// Small capsule badge used for style/grade/fee tags. Semantic tint, no custom chrome.
struct StyleBadge: View {
    let text: String
    var color: Color = .secondary

    var body: some View {
        Text(text)
            .font(.caption2.weight(.medium))
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(color.opacity(0.15), in: Capsule())
            .foregroundStyle(color)
    }
}

/// Star rating: full/half stars for fractional values (MP 0–4ish, 27crags/PDF 0–3).
struct StarsView: View {
    let stars: Double

    var body: some View {
        HStack(spacing: 1) {
            let full = Int(stars.rounded(.down))
            let half = stars - Double(full) >= 0.5
            ForEach(0..<min(full, 5), id: \.self) { _ in
                Image(systemName: "star.fill")
            }
            if half, full < 5 {
                Image(systemName: "star.leadinghalf.filled")
            }
        }
        .font(.caption2)
        .foregroundStyle(.yellow)
        .accessibilityLabel(Text(String(format: "%.1f stars", stars)))
    }
}

/// Verified / unverified marker used across route and crag views.
struct VerifiedMark: View {
    let verified: Bool

    var body: some View {
        Image(systemName: verified ? "checkmark.seal.fill" : "exclamationmark.circle")
            .foregroundStyle(verified ? Color.green : Color.orange)
            .accessibilityLabel(verified ? "Verified" : "Unverified")
    }
}
