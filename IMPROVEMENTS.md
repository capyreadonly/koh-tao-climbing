# Koh Tao Climbing — improvements

Updated 31 Aug 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Skip anything already in the 0.1 (3) review binary: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo. TestFlight 0.1 (2) is superseded. App Store 1.0 / build 0.1 (3) is WAITING_FOR_REVIEW (submitted 30 Aug 2026) — do not archive or upload from this list; App Store watch is a separate routine.

## Next

1. **Merge [PR #3](https://github.com/capyreadonly/koh-tao-climbing/pull/3)** so `main` matches the review binary (`fix/asc-4-3-unique` is ~14 commits ahead of `main`, mergeable/clean). Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1) and [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2) after. PR title still says “build 2”; HEAD is build 3 (`CURRENT_PROJECT_VERSION` 3). `main` is still at Aug 23 TF 0.1 (1).
2. **Offline favorites / personal ticks.** Search exists; AppStorage is only map camera + first-run About. Climbers still cannot mark what they did or starred. This is the next product ship after `main` is current.
3. **Align `MARKETING_VERSION`** in `native/project.yml` (still `0.1`) with the App Store listing (`1.0`). Do not bump `CURRENT_PROJECT_VERSION` and do not archive/upload.
4. **Park or split the dirty web tree** at `koh tao climbing` (WIP deletions, untracked images/vault, `.bak` files). Keep native work on this unique worktree only.
5. **Replace the red `loadErrors` overlay** in `KohTaoClimbingApp` / `RootTabView` (phase-A decode dump) with a normal empty/error state before any later store binary.
6. **Map pins only from published coords.** 17 of 29 crags have no `coords` (the Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified 27crags-only names. Do not invent coordinates.
7. **Tests for MapFocus / first-run / show-on-map** after #3 is on `main`. `DataStoreTests` already guard JSON decode; those three shipping paths have none.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- App Store watch is separate; this file is the product backlog.
