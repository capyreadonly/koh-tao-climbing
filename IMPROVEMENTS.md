# Koh Tao Climbing — improvements

Updated 23 Oct 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` — ASC/iTunes `1.0.2` / binary build `7` (released 20 Sep); store still `1.0.2` as of 23 Oct, 0 ratings (iTunes lookup; 24 storefronts 0 on 22 Oct), now 33 days old. Product tip `feat/ui-pass-light-dark` @ `d2e5469` (22 Oct: build bump `1.0.5` (9) for DQ-1019 TestFlight, atop `946bf4c` DQ-1019-P3, `b2e988e` DQ-1019-P2, `e50a591` merge of `data/post-1.0.5-fixes` @ `87e17fb` = DQ-1019-P1; ancestry includes DQ-002-B1, DQ-003 P1–P4+F2, photo credits, StoreKit rating, light/dark, MapKit/DQ). `data/post-1.0.5-fixes` is now fully merged into tip. Soft-launch Instagram paused. `main` still Aug 23 TF 0.1 (1) (`0cc0074`).

Skip tip ancestry: About/first-run, privacy/support, map QA, show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail, Has/No photo filter (crag-level), MapKit zoom, DQ-001-B1, DQ-002-B1, light/dark, StoreKit `1.0.5`, photo credits/attribution (`f9e7084`), DQ-003 P1–P4 (`d2ca7e8`), DQ-003-F2 (`1537787`), DQ-003-FIX-09/10, web `app/src/data` sync (`8825b0c`), **DQ-1019-P1/P2/P3** (`e50a591`, `b2e988e`, `946bf4c`: Elephant top-bolt warning, Secret Garden access limit, Mek’s 200 THB, KTCC rebolting, source hygiene, Elephant anchor captions, Mao Rock / Laem Thian topo reassignment, Lang Khai / Shady Crack source notes). Public title Koh Tao Climbing; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive/upload from this list.

DQ-2026-10-19 (Astra/Codex gpt-6-astra, brief `/workspace/koh-tao-briefs/data-quality/dq-2026-10-19.md`): URGENT safety data is now on the ship tip (repo side resolved 22 Oct) but still not on any build climbers have — live `1.0.2` lacks the Elephant top-bolt warning and Secret Garden access limit until build `1.0.5` (9) ships. Weekly research 19 Oct: URGENT=false. Next DQ/research runs Mon 26 Oct.

## Next

1. **Ship `1.0.5` (9) to TestFlight, then App Store** — tip `d2e5469` carries the DQ-1019 safety/access data; this is the only way the warning reaches climbers. Confirm the TestFlight upload/processing state with the ship lane (app manager), attach the proof video + `DataStoreTests` result for DQ-1019, and queue App Review. App Store submit needs Nic’s yes.
2. **Verify DQ-1019 in the build** — on device/simulator: The Elephant shows the top-bolt warning; Secret Garden reads "access limited (construction), not closed"; Mao Rock page now has the jungle topo and Laem Thian the coast topo; Elephant anchor captions show the anchor-honesty appends. Small nit: UKC note says "rechecked 2026-09-28"; reconfirmed 12 and 19 Oct.
3. **Land tip on `main`** — PR from `feat/ui-pass-light-dark` @ `d2e5469`. Prefer this over advancing [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) still at `5f11bcc`. Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1)–[#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth [#4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. Delete merged `data/post-1.0.5-fixes` and `fix/dq-002-b1-dual-nulls` after owner confirms.
4. **Offline favorites / personal ticks** — search + map camera/`@AppStorage` exist; climbers still cannot star or tick. Strongest product ship after `1.0.5`.
5. **Photo↔route DQ follow-ups** (`DATA-QUALITY.md`) — scanner: strip `DQ-0xx:`/`DQ-1019:` notes before extraction, exclude `*-unusable`, keep plus signs, reject bolt counts/heights as grades, match within sector first, extract `N. Name` numbering. Needs-verification only: Elephant #11 (`The Trunk 7a` vs DB entries), Lang Khai `Difensless` V3 vs `Diffensless` 6B+, Babaloo spelling candidate. Schema `routeId`/`routeAnnotations[]` still post-1.0.5. Labels only — no invented grades/routes.
6. **Source follow-ups (remaining)** — reconcile Yang 36 vs repo Lang Khai 34 (2-problem gap needs login, nothing guessed); seek dated, crag-specific confirmation of fees/access/bolting rules before changing access data.
7. **Park/split dirty web tree** at `koh tao climbing`; native work stays on clean unique worktree.
8. **Pins only from published coords** — Unmapped FAB lists missing coords; never invent (skip Phillips Secret Spot / unverified).
9. **Tests** for MapFocus / first-run / show-on-map after tip→`main` (UITests already cover map→routes, filters, appearance, attribution, review-prompt).

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth/analytics = scorecard / app manager; this file = product backlog. Public storefronts still 0 ratings; 30d targets missed.
- Instagram `@kohtaoclimbing` paused until Nic reopens.
- 20–22 Oct: DQ-1019-P1 safety merge sat unimplemented for 3 days after the 19 Oct URGENT brief.
- 23 Oct check: tip advanced `4eea72c` → `d2e5469` (DQ-1019 P1–P3 landed + build `1.0.5` (9), all 22 Oct ~09:16). `data/post-1.0.5-fixes` @ `87e17fb` now an ancestor of tip. `main` `0cc0074`; PR #6 branch still `5f11bcc`; other branch tips unchanged. Live iTunes `1.0.2`, 0 ratings. No new DQ batch or research brief since 19 Oct. TestFlight state of build 9 not visible from the repo — ship lane to confirm.
