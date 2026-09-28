# Koh Tao Climbing — improvements

Updated 28 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` review `717f4a17` — ASC slot `1.0.2` / binary build `7`, CFBundle `1.0.4` tip `e08edbd` (MapKit zoom rebuild). Product tip `feat/ui-pass-light-dark` @ `b738736` (system light/dark + UI pass; parent `fix/dq-002-b1-dual-nulls` @ `2986299` with MapKit + DQ-001-B1 + DQ-002-B1 + daily IMPROVEMENTS through 27 Sep). Unique worktree is on that tip with local WIP toward `1.0.5` / build `8` (not committed). Soft-launch Instagram remains paused. `main` still parked at Aug 23 TF 0.1 (1) (`0cc0074`).

Skip anything already in tip ancestry: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail sheet, Has photo / No photo route filter, MapKit camera/zoom rebuild, DQ-001-B1 (four dual photo labels), DQ-002-B1 (three decorative duals cleared to `crag=null`), tip light/dark UI pass (`b738736`, not yet in the live store binary). Older TestFlight/store binaries superseded. Public title Koh Tao Climbing, subtitle Offline Koh Tao crag topos; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive or upload from this list.

Weekly Astra research (21 Sep): no material Koh Tao climbing updates. Optional source hygiene: `27crags.com/crags/koh-tao` 301 → `thetopo.com/crags/koh-tao` (update `sources/GUIDE-ALLOWLIST` when touching sources).

## Next

1. **Land the tip on `main`** — Prefer a PR from `feat/ui-pass-light-dark` @ `b738736` (light/dark + UI pass atop MapKit/DQ tip), or advance/replace [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) (head still `5f11bcc`, missing MapKit + DQ + light/dark). Then close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1), [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2), [#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), and [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth docs [PR #4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. Do not archive/upload from this step.
2. **TestFlight `1.0.5` (build 8) attribution pass** — Keep bundled guide images; add credit/source links on Goodtime and all-rights-reserved photos/topos/routes; label route sources; fix About / 27crags / Thaitanium copy. Align `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` with the ship (local WIP already sketches `1.0.5` / `8`). TestFlight only; App Store submit needs Nic’s yes.
3. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` / `MapCameraStore` cover map camera + first-run About. Climbers still cannot mark what they did or starred. Strongest next product ship once `main` matches the store tip (or in parallel if scoped small).
4. **Continue photo↔route data quality** via the Astra/Codex loop (`DATA-QUALITY.md`). DQ-001-B1 and DQ-002-B1 shipped; open residual: DQ-002-B2–B5 (annotate-only), DQ-003 usability, DQ-004 ND crop, DQ-005 style normalize, DQ-006 grade gaps. Labels/notes only — no invented routes or grades.
5. **Park or split the dirty web tree** at `koh tao climbing`. Keep native work on a clean unique worktree only.
6. **Map pins only from published coords.** 17 of 29 crags have no `coords` (Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
7. **Tests for MapFocus / first-run / show-on-map** after the tip is on `main`. UITests already cover map→routes, grade/style filters, and appearance; those three shipping paths still need coverage.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
- Instagram soft-launch (`@kohtaoclimbing`) stays paused until Nic reopens it.
