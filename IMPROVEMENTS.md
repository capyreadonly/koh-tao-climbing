# Koh Tao Climbing — improvements

Updated 18 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Skip anything already in the live 1.0.1 (build 4) binary: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo, Claude fable UX (photo-forward crags, grade-first routes, calmer filters/empty states, warmer Plan/About, softer load-error banner). TestFlight 0.1 (2) and store 1.0 / build 0.1 (3) are superseded. App is LIVE: 1.0.1 (4) READY_FOR_SALE as of ~17 Sep 23:38 ICT; public title Koh Tao Climbing, subtitle Offline Koh Tao crag topos; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive or upload from this list. Nic’s product focus remains climber UX (not new climbing data or App Store process).

## Next

1. **Land the live tip on `main`** — merge [PR #5](https://github.com/capyreadonly/koh-tao-climbing/pull/5) (`improve/claude-design-ux` @ `b086672`, the 1.0.1 archive tip). `main` is still Aug 23 TF 0.1 (1). Then close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1), [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2), and [#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3) (4.3 uniqueness + build 3 — already in the live tip ancestry). Keep growth docs [PR #4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate.
2. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` is still map camera + first-run About. Climbers cannot mark what they did or starred. Strongest next product ship once `main` matches the store (or in parallel if scoped small).
3. **Incremental UX polish** on Map chrome and remaining empty/search edges — 1.0.1 already shipped the magazine Crags/Routes/Plan/About pass; only chase sharp day-to-day friction, not another redesign.
4. **Align `MARKETING_VERSION`** in `native/project.yml` (still `0.1`) with the App Store listing (`1.0.1`). Do not bump `CURRENT_PROJECT_VERSION` and do not archive/upload.
5. **Park or split the dirty web tree** at `koh tao climbing` (WIP deletions, untracked images/vault, `.bak` files). Keep native work on this unique worktree only.
6. **Map pins only from published coords.** 17 of 29 crags have no `coords` (Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
7. **Tests for MapFocus / first-run / show-on-map** after the live tip is on `main`. `DataStoreTests` already guard JSON decode; those three shipping paths have none.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
