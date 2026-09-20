# Koh Tao Climbing — Map→Routes nav + grade/style filter UX
**For:** Claude Code implementation on `capyreadonly/koh-tao-climbing` @ `improve/claude-design-ux`  
**Author:** OpenAI / gpt-6-astra (Codex) · drafts only · product agent ships TF/ASC  
**Tone:** climber language, destination-guide clear — not startup chrome

---

## 0. Existing data (do not invent fields)

### `RouteRecord` (routes.json · 624)
`name`, `crag`, `sector?`, `grade`, `gradeSystem` (`v` | `font` | `french` | `zen-gecko` | …), `style` (free-form: `sport`, `boulder`, `toprope`, `trad`, `sport/toprope`, `trad,tr`, `multipitch`, `dws`, …), `stars?`, `bolts?`, `lengthM?`, `verified`, `source`, …

### `Crag` (crags.json · 29)
`slug`, `name`, `area`, `styles[]`, `grades` (display string), `coords?`, `sectors?`, `accessFee?`, `accessWarning?`, …

### Already in native UI
- **Map:** offline tiles, style-tinted pins, callout → `CragDetailView` via `path.append(crag)`.
- **Routes tab:** search; style chips via `CragStyle.primaryStyle`; verified toggle; grade sort via `GradeSort` (system-grouped, not cross-system).
- **Crag detail:** route list → `RouteDetailView`.

**Gap to close:** Map→Routes feels like “see the crag” not “get onto routes with filters”; Routes filter is style-only (no grade band); Map doesn’t surface style/grade filters before opening a pin.

---

## 1. Jobs-to-be-done

1. From the **map**, open a crag and land on **its routes** with optional style/grade filters already sensible.
2. On **Routes**, filter by **style** (existing) **and grade band** without leaving climber mental model (French / V / Font stay system-aware).
3. Preserve offline, no-account, verified/unverified honesty.

---

## 2. Navigation design — Map → routes

### 2.1 Keep
- Pin callout info → push `CragDetailView` (current).

### 2.2 Add (primary ask)
On `CragDetailView`, promote routes as the next action:

| Control | Behavior |
|---|---|
| **“Routes” toolbar / prominent section header CTA** | Scrolls to / expands routes section (if long About). Optional: already visible list is enough if list is first after Facts on small phones — prefer **routes section higher** or sticky “N routes” chip. |
| **“Open in Routes”** (secondary) | Pops/pushes into **Routes tab** with `selectedCrag = crag.name` (or slug) + clears global search; keeps any existing style chip if still present in that crag’s routes. |

**Deep-link contract for Claude Code** (new shared state or tab coordinator):

```text
RoutesFilterState {
  searchText: String
  selectedStyle: String?          // CragStyle.primaryStyle
  verifiedOnly: Bool
  gradeBand: GradeBand?           // NEW — see §3
  selectedCragName: String?       // NEW — when set, filter route.crag == name
  gradeSort: GradeSortOrder
}
```

- Map path: pin → CragDetail → “Open in Routes” sets `selectedCragName` and switches tab (use existing tab selection binding / `Notification` / `AppStorage` — pick one pattern already in app; don’t invent a second navigation stack).
- Clear chip: show “Crag: Mek's Mountain ✕” above Routes list when `selectedCragName != nil`.

### 2.3 Do not
- Don’t jump Map pin straight to a single route (too many routes per crag).
- Don’t require network.
- Don’t fake GPS approach lines beyond existing coords.

### 2.4 Acceptance
- From Map, ≤2 taps to a filtered route list for that crag.
- Back from Routes clears or keeps crag chip explicitly (prefer keep until ✕).
- Screenshot hooks: reuse `-initialRoute`; add `-routesCrag <name substring>` if useful for TF.

---

## 3. Grade / style filter UX

### 3.1 Style (extend, don’t replace)
Keep horizontal chips: known order `boulder, sport, toprope, trad, multipitch, dws` then leftovers. Selection = single style (current). Multi-select is **out of scope** for this pass.

Normalization already in `CragStyle.primaryStyle` — keep using it for filter equality.

### 3.2 Grade band (NEW)
Add a **Grade** control next to sort menu (sheet or menu), **not** a free-text grade search (search already matches grade substrings).

Because systems don’t cross-compare (`GradeSort` comment), band UI is **per system** or “Any”:

**Option A (recommended for MVP):**  
Menu: `Any grade` · `Easy` · `Mid` · `Hard` · `Project/ungraded`  
Mapped **inside each `gradeSystem`** using `GradeSort.value` thresholds:

| Band | french (approx) | v | font | zen-gecko |
|---|---|---|---|---|
| Easy | value ≤ 5a-ish (≤ ~50) | ≤ V2 | ≤ 5+ | VE–E |
| Mid | 5b–6b+ | V3–V6 | 6A–6C | M–MH |
| Hard | ≥ 6c | ≥ V7 | ≥ 7A | H–VH |
| Project/ungraded | `GradeSort.ungradedValue` / project / ungraded prefixes | same | same | same |

Tune thresholds in one `GradeBand.swift` table with unit tests (mirror `GradeSort` tests style). Document that bands are **heuristic**, not guidebook gospel.

**Option B (later):** dual French + V pickers — skip unless product asks.

### 3.3 Filter semantics (AND)
`verifiedOnly ∧ style ∧ gradeBand ∧ selectedCrag ∧ search`

Empty → `ContentUnavailableView` with “Clear filters” button that resets style, band, crag chip, verified (keep search or clear — prefer clear all filters).

### 3.4 Crag-scoped grade filter
When `selectedCragName` is set, chips/bands still apply to that crag’s routes only. Style chips should **rebuild from styles present in the filtered crag’s routes** (not island-wide) when crag chip is active — reduces empty states.

### 3.5 Map filter (optional light pass)
If cheap: style chips on Map that hide pins whose `crag.styles` don’t contain selected primary style. Grade band on Map is **defer** (crag.grades is a display string, not structured).

---

## 4. Implementation sketch for Claude Code

1. Add `GradeBand` + `matches(route:) -> Bool` using `GradeSort.key`.
2. Lift Routes filter state so Map/CragDetail can set `selectedCragName` (start with `@Observable` / shared `RoutesFilterModel` owned by root tab view).
3. CragDetail: “Open in Routes” button; optionally reorder sections so Routes appear earlier.
4. Routes: grade band control; crag chip; clear-filters on empty.
5. Tests: `GradeBand` thresholds; filter AND logic; `-routesCrag` debug arg.
6. Do **not** change JSON schema; do **not** add accounts/network.

---

## 5. Out of scope
ASO copy, new data sources, multi-select styles, cross-system grade math, approach polylines, TF upload (product agent).

---

## 6. Hand-off checklist
- [ ] Spec read against `Models.swift` / `RoutesTabView` / `MapTabView` / `CragDetailView`
- [ ] Claude Code implements on `improve/claude-design-ux`
- [ ] Product agent TF/ASC; Nic only for feedback
