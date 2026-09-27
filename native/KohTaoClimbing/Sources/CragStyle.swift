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

// MARK: - Guide theme

/// Shared vocabulary for the island-guide look: one corner radius, one amber for
/// access/hazard notes, one blue for informational notes. System fonts only, so
/// Dynamic Type keeps working everywhere.
enum GuideTheme {
    static let cornerRadius: CGFloat = 12
    static let heroCornerRadius: CGFloat = 16
    /// Brand teal from the asset catalog (Any + Dark), also the app-wide tint.
    static let brand = Color.accentColor
    /// Access warnings, hazards, conflicting sources — amber, not alarm red.
    static let warning = Color.orange
    /// Informational notes.
    static let note = Color.blue
    /// Star ratings: a deeper amber on light backgrounds, system-yellow bright on dark
    /// (plain `.yellow` was ~1.5:1 against white).
    static let star = Color("StarRating")
    /// Smallest comfortable tap target (HIG).
    static let minTapTarget: CGFloat = 44

    /// A style/category tint made legible as text or an icon on a pale tint of
    /// itself: pulled towards the label colour, so it darkens in light mode and
    /// lifts in dark. System teal, cyan and yellow are too pale as text on white.
    static func readable(_ tint: Color) -> Color {
        tint.mix(with: Color(.label), by: 0.35)
    }
}

/// Scrim for text laid over photos: a gradient to black that reads the same in
/// light and dark mode, because the photo — not the app theme — sets the backdrop.
struct PhotoScrim: View {
    var height: CGFloat = 110

    var body: some View {
        LinearGradient(stops: [.init(color: .clear, location: 0),
                               .init(color: .black.opacity(0.35), location: 0.45),
                               .init(color: .black.opacity(0.7), location: 1)],
                       startPoint: .top, endPoint: .bottom)
            .frame(height: height)
            .allowsHitTesting(false)
    }
}

/// Editorial section header for List sections: sentence case, primary colour and
/// a little more weight than the system's small-caps header, with an optional
/// one-line subtitle in secondary.
struct GuideHeader: View {
    let title: String
    var subtitle: String? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title)
                .font(.title3.weight(.semibold))
                .foregroundStyle(.primary)
            if let subtitle {
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .textCase(nil)
        .padding(.top, 4)
        .padding(.bottom, 2)
        .accessibilityElement(children: .combine)
    }
}

/// Calm tinted callout for access warnings, hazards and notes: soft tinted fill,
/// leading symbol, readable body copy.
struct GuideCallout: View {
    let text: String
    var systemImage: String = "exclamationmark.triangle.fill"
    var tint: Color = GuideTheme.warning
    var title: String? = nil

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: systemImage)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(tint)
                .padding(.top, 2)
            VStack(alignment: .leading, spacing: 3) {
                if let title {
                    Text(title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(GuideTheme.readable(tint))
                }
                Text(text)
                    .font(.callout)
                    .foregroundStyle(.primary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(tint.opacity(0.12), in: RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: GuideTheme.cornerRadius, style: .continuous)
                .strokeBorder(tint.opacity(0.25), lineWidth: 1)
        }
        .accessibilityElement(children: .combine)
    }
}

/// Labelled fact used in the crag/route fact grids: small secondary label above
/// the value, instead of a settings-style LabeledContent row.
struct FactCell: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.subheadline)
                .foregroundStyle(.primary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }
}

/// Friendly empty state for searches and filters, in the guide's own voice.
struct GuideEmptyState: View {
    let title: String
    let message: String
    var systemImage: String = "magnifyingglass"
    var actionTitle: String? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        ContentUnavailableView {
            Label(title, systemImage: systemImage)
        } description: {
            Text(message)
        } actions: {
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .buttonStyle(.bordered)
            }
        }
    }
}

/// Neutral placeholder tile for areas that have no photo yet.
struct PhotoPlaceholder: View {
    var systemImage: String = "mountain.2"

    var body: some View {
        Rectangle()
            .fill(.quaternary)
            .overlay {
                Image(systemName: systemImage)
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }
    }
}

/// Small capsule badge used for style/grade/fee tags. Semantic tint, no custom chrome.
struct StyleBadge: View {
    let text: String
    var color: Color = .secondary

    var body: some View {
        Text(text)
            .font(.caption2.weight(.semibold))
            .lineLimit(1)
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .background(color.opacity(0.16), in: Capsule())
            .foregroundStyle(GuideTheme.readable(color))
    }
}

/// One line of whole badges. When they don't all fit, the tail collapses into a
/// "+N" badge instead of every badge truncating to "topr…", "multi…".
struct BadgeRow: View {
    struct Badge: Hashable {
        let text: String
        let color: Color
    }

    let badges: [Badge]

    var body: some View {
        ViewThatFits(in: .horizontal) {
            // Down to "+N" alone, so even accessibility text sizes never overflow.
            ForEach(Array(stride(from: badges.count, through: 0, by: -1)), id: \.self) { shown in
                row(showing: shown)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(badges.map(\.text).joined(separator: ", "))
    }

    private func row(showing shown: Int) -> some View {
        HStack(spacing: 5) {
            ForEach(badges.prefix(shown), id: \.self) { badge in
                StyleBadge(text: badge.text, color: badge.color)
                    .fixedSize()
            }
            if shown < badges.count {
                StyleBadge(text: "+\(badges.count - shown)")
                    .fixedSize()
            }
        }
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
        .foregroundStyle(GuideTheme.star)
        .accessibilityLabel(Text(String(format: "%.1f stars", stars)))
    }
}

/// Verified / unverified marker used across route and crag views.
struct VerifiedMark: View {
    let verified: Bool

    var body: some View {
        Image(systemName: verified ? "checkmark.seal.fill" : "exclamationmark.circle")
            .foregroundStyle(GuideTheme.readable(verified ? .green : GuideTheme.warning))
            .accessibilityLabel(verified ? "Verified" : "Unverified")
    }
}
