# Koh Tao Climbing — improvements

Updated 30 Aug 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first. Skip anything already in the 0.1 (2) review binary (About, first-run, map QA, privacy/support pages).

## Next

1. Merge [PR #3](https://github.com/capyreadonly/koh-tao-climbing/pull/3) (and fold #1/#2) so `main` matches the 0.1 (2) binary in App Review.
2. “Show on map” from a crag or route (still gated) so the map is not a dead end.
3. Offline favorites / personal ticks. Search exists; you still cannot mark what you climbed.
4. Real launch screen (`UILaunchScreen` is empty).
5. Unmapped-crags sheet should use the same `CragRow` as the Crags tab, not a thin list.
6. Add `PrivacyInfo.xcprivacy` so the “Data Not Collected” claim is in the binary, not just the listing.
7. Park or split the dirty web tree so it stops blocking native work.
8. Align `MARKETING_VERSION` with App Store 1.0 so TestFlight and the listing do not disagree.

## Notes

- Do not invent climbing facts (fact-check skill).
- Push as `capyreadonly` only.
- App Store watch is separate; this file is the product backlog.
