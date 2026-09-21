# Koh Tao Climbing — improvements

Updated 21 Sep 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` review `717f4a17` — ASC slot `1.0.2` / binary build `7`, CFBundle `1.0.4` tip `e08edbd` (MapKit zoom). Map→routes + photo filter already shipped.

Skip anything already shipped: About + first-run, privacy/support pages, map QA (callouts, legend, FABs, unmapped badge, clustering, VoiceOver, coverage banner), show-on-map, launch screen, PrivacyInfo, Claude fable UX (photo-forward crags, grade-first routes, calmer filters/empty states, warmer Plan/About, softer load-error banner), Map→routes, and photo filter. TestFlight 0.1 (2) and store 1.0 / build 0.1 (3) are superseded. Public title Koh Tao Climbing, subtitle Offline Koh Tao crag topos; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive or upload from this list. Nic’s product focus remains climber UX (not new climbing data or App Store process).

Weekly Astra research (21 Sep 2026): **no material updates**. Optional source hygiene: `sources/GUIDE-ALLOWLIST` `27crags.com/crags/koh-tao` → `thetopo.com/crags/koh-tao` (301; rebrand 2026-04-13).

## Next

1. **Offline favorites / personal ticks.** Search exists on Crags/Routes/Community; `@AppStorage` is still map camera + first-run About. Climbers cannot mark what they did or starred. Strongest next product ship now that the current 1.0.4 tip is the source of truth.
2. **Incremental UX polish** on Map chrome and remaining empty/search edges — the shipped magazine Crags/Routes/Plan/About pass is in place; only chase sharp day-to-day friction, not another redesign.
3. **Align `MARKETING_VERSION`** in `native/project.yml` (still `0.1`) with the App Store listing (`1.0.2`). Do not bump `CURRENT_PROJECT_VERSION` and do not archive/upload.
4. **Park or split the dirty web tree** at `koh tao climbing` (WIP deletions, untracked images/vault, `.bak` files). Keep native work on this unique worktree only.
5. **Map pins only from published coords.** 17 of 29 crags have no `coords` (Unmapped FAB already lists them). Add a pin only when a public source already publishes one. Skip withheld spots (Phillips Secret Spot) and unverified names. Do not invent coordinates.
6. **Tests for MapFocus / first-run / show-on-map** after the current tip is on `main`. `DataStoreTests` already guard JSON decode; those three shipping paths have none.

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth / App Store analytics are separate (scorecard / app manager); this file is the product backlog.
