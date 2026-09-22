# UX pass — island guide feel (Claude Code / model fable)

Date: 17 Sep 2026 (Asia/Tokyo). Design + SwiftUI only. No data, grades, coords, or ASC changes.

## What feels better for climbers

### Crags — magazine browse, not a directory
- Row thumbnails grew to **92pt** with continuous corners — photos lead the eye.
- Crag names sit in **title3 semibold**; area, grades, and badges stay quiet secondary.
- List opens with an editorial header (“Around the island”) and live area/route counts.
- Empty search speaks in guide voice (“Nothing by that name…”) with a one-tap **Show all areas**.

### Crag detail — photo-forward destination page
- **Hero photo** (~230pt) leads when a topo/photo exists; tap opens the viewer.
- Access warnings are soft **amber callouts**, not yellow alarm rows.
- About copy is readable body prose; highlight is a quiet starred line.
- Facts use a two-column labelled grid instead of settings-style rows; approach/access get full width.
- Photo gallery tiles are larger, with kind/caption under each; viewer shows a page counter.
- Show on map stays in toolbar + inline — same behaviour, calmer placement.

### Routes — scan grades, clear filters fast
- Rows lead with a **bold grade column**, then name and quiet meta (style, sector).
- Filter chips are calmer (neutral at rest, tinted when selected, no border chrome).
- A **clear** chip appears when style/verified filters are on.
- Empty search/filter states use guide copy plus **Clear filters**.
- Crag group headers are sentence case with a quiet route count (“12 routes”).
- Sort labels read “Easiest first” / “Hardest first” instead of a raw count dump.

### Route detail — grade hero, prose for the climb
- Opens on a large rounded grade + system, style badge, length/bolts, stars, and a calm verified line.
- Description / protection sit as body prose under “The climb” / “Protection”.
- Notes use a blue informational callout.
- Show on map + crag link unchanged.

### Plan — trip menu, not a utility dump
- Hub rows have tinted symbol tiles and one-line teasers (“Ferries, transfers…”).
- Editorial header: “Plan your trip”.
- Sub-screens use the same editorial headers, body prose, checkmark kit list, leaf rules, and consistent amber/blue callouts for hazards and conflicting sources.

### About / first-run — warmer welcome
- Large title + island line + short offline promise.
- Guideline 4.3 identity copy kept intact.
- First-run sheet adds a prominent teal **Start exploring** button (toolbar Continue still there).

### App shell & map
- Red decode dump replaced by a **material load-error banner** (summary → expand details → dismiss).
- Map out-of-coverage banner copy only: calmer “offline map ends here — return to the island” tone.

## Shared theme (`CragStyle.swift`)
Added guide vocabulary used across screens: `GuideTheme`, `GuideHeader`, `GuideCallout`, `FactCell`, `GuideEmptyState`, `PhotoPlaceholder`; refined `StyleBadge` / `StarsView` / `VerifiedMark`. No new source file — XcodeGen project unchanged.

## Constraints respected
- Models / JSON loading / launch args / MapFocus show-on-map untouched in behaviour.
- No invented climbing facts, grades, or coordinates.
- No TestFlight / App Store / ASC work.
- Community tab left as-is this pass.

## Design MCP
`claude-design` was Connected; this pass implemented directly in SwiftUI (Design MCP not required for the shipped edits).
