# Koh Tao Climbing — improvements

Updated 30 Aug 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first. Skip anything already in the 0.1 (3) review binary (About, first-run, map QA, privacy/support pages, show-on-map, launch screen, PrivacyInfo).

## Done this pass (build 3)

- Show on map from crag and route detail (shared `MapFocus`; Map tab camera + selected pin).
- `UILaunchScreen` filled with `LaunchBackground` (gulf teal from the sport/sea palette). No launch image in Assets.
- `PrivacyInfo.xcprivacy` in the bundle: tracking false, no collected data types; UserDefaults CA92.1 for AppStorage only.

## Next

1. Merge [PR #3](https://github.com/capyreadonly/koh-tao-climbing/pull/3) (and fold #1/#2) so `main` matches the review binary.
2. Offline favorites / personal ticks. Search exists; you still cannot mark what you climbed.
3. Park or split the dirty web tree so it stops blocking native work.
4. Align `MARKETING_VERSION` with App Store 1.0 so TestFlight and the listing do not disagree.

## Notes

- Do not invent climbing facts (fact-check skill).
- Push as `capyreadonly` only.
- App Store watch is separate; this file is the product backlog.
