# Koh Tao Climbing — improvements

Updated 25 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` review `717f4a17` — ASC slot `1.0.2` / binary build `7`, CFBundle `1.0.4` tip `e08edbd` (MapKit zoom rebuild). Product tip branch `fix/mapkit-zoom-1.0.4` @ `2229f9d`; unique worktree tip `fix/dq-002-b1-dual-nulls` @ `a72e231` (includes MapKit zoom + DQ-001-B1 + DQ-002-B1 + daily IMPROVEMENTS through 24 Sep). Map→routes, grade/style filters, Has photo / No photo labels+filter, paper-guide links, DQ-001-B1, and DQ-002-B1 are in tip ancestry. Soft-launch Instagram remains paused until the app journey is solid. `main` still parked at Aug 23 TF 0.1 (1) (`0cc0074`).

Skip anything already shipped: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo, Claude fable UX (photo-forward crags, grade-first routes, calmer filters/empty states, warmer Plan/About, softer load-error banner), Map→routes + grade/style filters, map pin → CragDetail sheet, Has photo / No photo route filter, MapKit camera/zoom rebuild, DQ-001-B1 (four dual photo labels), DQ-002-B1 (three decorative duals cleared to `crag=null`). TestFlight 0.1 (2) and older store binaries are superseded. Public title Koh Tao Climbing, subtitle Offline Koh Tao crag topos; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive or upload from this list.

Weekly Astra research (21 Sep): no material Koh Tao climbing updates. Optional source hygiene only: `27crags.com/crags/koh-tao` 301 → `thetopo.com/crags/koh-tao` (update `sources/GUIDE-ALLOWLIST` when touching sources).

## Next

1. **Land the live tip on `main`** — Prefer a PR from `fix/dq-002-b1-dual-nulls` @ `a72e231` (ahead of `main`; includes MapKit zoom + DQ-002-B1 + IMPROVEMENTS), or advance/replace [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) (head still `5f11bcc`, missing MapKit + DQ). Then close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1), [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2), [#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), and [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth docs [PR #4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. Do not archive/upload from this step.
2. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` / `MapCameraStore` cover map camera + first-run About. Climbers still cannot mark what they did or starred. Strongest next product ship once `main` matches the store tip (or in parallel if scoped small).
3. **Continue photo↔route data quality** via the Astra/Codex loop (`DATA-QUALITY.md`). DQ-001-B1 and DQ-002-B1 shipped; open residual: DQ-002-B2–B5 (annotate-only), DQ-003 usability, DQ-004 ND crop, DQ-005 style normalize, DQ-006 grade gaps. Labels/notes only — no invented routes or grades.
4. **Align `MARKETING_VERSION`** in `native/project.yml` (still `0.1`) with the App Store listing (`1.0.2`). Do not bump `CURRENT_PROJECT_VERSION` and do not archive/upload.
5. **Park or split the dirty web tree** at `koh tao climbing` (WIP deletions, untracked images/vault, `.bak` files). Keep native work on a clean unique worktree only.
6. **Map pins only from published coords.** 17 of 29 crags have no `coords` (Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
7. **Tests for MapFocus / first-run / show-on-map** after the live tip is on `main`. UITests already cover map→routes and grade/style filters; those three shipping paths still need coverage.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
- Instagram soft-launch (`@kohtaoclimbing`) stays paused until Nic reopens it.
