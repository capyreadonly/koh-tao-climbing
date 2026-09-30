# Koh Tao Climbing — improvements

Updated 30 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` — ASC slot `1.0.2` / binary build `7`, CFBundle `1.0.4` tip `e08edbd` (MapKit zoom rebuild; iTunes lookup still `1.0.2` as of 30 Sep). Product tip `feat/ui-pass-light-dark` @ `88576f4` (daily IMPROVEMENTS 29 Sep atop web attribution sync `8825b0c`, DQ-003-F2 `1537787`, DQ-003 P1–P4 `d2ca7e8`, photo-credit pass `f9e7084`, StoreKit rating + `1.0.5` / build `8` `77761ec`, light/dark UI `b738736`, MapKit/DQ parent `2986299`). Soft-launch Instagram remains paused. `main` still parked at Aug 23 TF 0.1 (1) (`0cc0074`).

Skip anything already in tip ancestry: About + first-run, privacy/support pages, map QA, show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail sheet, Has photo / No photo route filter (now labelled as crag-level photos), MapKit camera/zoom rebuild, DQ-001-B1, DQ-002-B1, tip light/dark UI pass, StoreKit rating prompt + version bump to `1.0.5` (8), photo credits / route-source labels / About attribution (`f9e7084`), DQ-003 P1–P4 caption/crag fixes (`d2ca7e8`; supersedes pending DQ-002 B2–B5), DQ-003-F2 filter honesty (`1537787`), web `app/src/data` attribution sync (`8825b0c`). Older TestFlight/store binaries superseded. Public title Koh Tao Climbing, subtitle Offline Koh Tao crag topos; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive or upload from this list.

Weekly Astra research (28 Sep): no material Koh Tao climbing updates. Optional source hygiene (do not invent routes): (P2) reword UKC “no longer climbable” note in `sources.json` as generic legend text; (P3) investigate The Topo Yang boulder count 35→36 before data edits; (P3) repoint directory `27crags.com/crags/koh-tao` → `thetopo.com/crags/koh-tao` when touching sources (preserve per-route provenance).

## Next

1. **Land the tip on `main`** — Prefer a PR from `feat/ui-pass-light-dark` @ `88576f4` (1.0.5 attribution + DQ-003 + light/dark atop MapKit/DQ), or advance/replace [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) (head still `5f11bcc`, missing MapKit + DQ + light/dark + 1.0.5). Then close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1), [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2), [#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), and [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth docs [PR #4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. Do not archive/upload from this step.
2. **TestFlight upload of tip `1.0.5` (build 8)** — Tip already has attribution, rating prompt, and version bump; live store is still `1.0.2` / build `7`. Archive + TF only from the product/ship lane. App Store submit needs Nic’s yes. Do not archive from this list.
3. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` / `MapCameraStore` cover map camera + first-run About. Climbers still cannot mark what they did or starred. Strongest next product ship once `main` matches the store tip (or in parallel if scoped small).
4. **Continue photo↔route data quality** via the Astra/Codex loop (`DATA-QUALITY.md`). DQ-001-B1, DQ-002-B1, and tip commits for DQ-003 P1–P4 + F2 are in ancestry; open residual: DQ-004 ND crop, DQ-005 style normalize, DQ-006 grade gaps, DQ-007 coords, DQ-008 verified honesty, DQ-009 unusable kinds, plus optional `routeId` / `routeAnnotations[]` schema. Repo `DATA-QUALITY.md` status table may still lag tip commits — reconcile on next DQ pass. Labels/notes only — no invented routes or grades. URGENT: false.
5. **Source hygiene (from 28 Sep weekly research)** when next touching sources: UKC legend wording, Yang count verify before edits, 27crags → The Topo directory entry.
6. **Park or split the dirty web tree** at `koh tao climbing`. Keep native work on a clean unique worktree only.
7. **Map pins only from published coords.** Unmapped FAB already lists crags without `coords`. Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
8. **Tests for MapFocus / first-run / show-on-map** after the tip is on `main`. UITests already cover map→routes, grade/style filters, appearance, attribution, and review-prompt; those three shipping paths still need coverage.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
- Instagram soft-launch (`@kohtaoclimbing`) stays paused until Nic reopens it.
