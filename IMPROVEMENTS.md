# Koh Tao Climbing — improvements

Updated 17 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Skip anything already in the live 1.0 / build 0.1 (3) binary: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo. TestFlight 0.1 (2) is superseded. App is LIVE on the App Store (READY_FOR_SALE as of 16 Sep; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403). Do not archive or upload from this list. Nic’s current focus (17 Sep): design/UX polish on Crags, Routes, Map, Plan, About — climber experience, not new data or App Store process.

## Next

1. **Merge [PR #3](https://github.com/capyreadonly/koh-tao-climbing/pull/3)** so `main` matches the live binary (`fix/asc-4-3-unique` is 30 commits ahead of `main`, MERGEABLE/CLEAN). Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1) and [#2](https://github.com/capyreadonly/koh-tao-climbing/pull/2) after. PR title still says “build 2”; HEAD is build 3 (`CURRENT_PROJECT_VERSION` 3). `main` is still at Aug 23 TF 0.1 (1).
2. **Design / UX polish pass** on Crags, Routes, Map, Plan, and About — denser lists, empty/search states, hierarchy, and map chrome so day-to-day use feels sharper. Not new climbing data; not App Store paperwork. Prefer this unique worktree only.
3. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` is only map camera + first-run About. Climbers still cannot mark what they did or starred. Strong next product ship after `main` is current (or in parallel with polish if scoped small).
4. **Align `MARKETING_VERSION`** in `native/project.yml` (still `0.1`) with the App Store listing (`1.0`). Do not bump `CURRENT_PROJECT_VERSION` and do not archive/upload.
5. **Park or split the dirty web tree** at `koh tao climbing` (WIP deletions, untracked images/vault, `.bak` files; still on `improve/native-map-qa`). Keep native work on this unique worktree only.
6. **Replace the red `loadErrors` overlay** in `KohTaoClimbingApp` (phase-A decode dump) with a normal empty/error state before any later store binary.
7. **Map pins only from published coords.** 17 of 29 crags have no `coords` (Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
8. **Tests for MapFocus / first-run / show-on-map** after #3 is on `main`. `DataStoreTests` already guard JSON decode; those three shipping paths have none.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
