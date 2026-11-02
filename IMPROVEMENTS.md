# Koh Tao Climbing — improvements

Updated 2 Nov 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` — ASC/iTunes `1.0.2` / binary build `7` (released 20 Sep); store still `1.0.2` as of 2 Nov, 0 ratings (iTunes lookup US/GB/TH/AU/DE/JP/FR/SG on 2 Nov), now 43 days old. Product tip `feat/ui-pass-light-dark` @ `d2e5469` (22 Oct: build bump `1.0.5` (9) for DQ-1019 TestFlight, atop `946bf4c` DQ-1019-P3, `b2e988e` DQ-1019-P2, `e50a591` merge of `data/post-1.0.5-fixes` @ `87e17fb` = DQ-1019-P1); branch head `6e0d986` is the 26 Oct IMPROVEMENTS doc. No product commits for 11 days. Soft-launch Instagram paused. `main` still Aug 23 TF 0.1 (1) (`0cc0074`).

Skip tip ancestry: About/first-run, privacy/support, map QA, show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail, Has/No photo filter (crag-level), MapKit zoom, DQ-001-B1, DQ-002-B1, light/dark, StoreKit `1.0.5`, photo credits/attribution (`f9e7084`), DQ-003 P1–P4 (`d2ca7e8`), DQ-003-F2 (`1537787`), DQ-003-FIX-09/10, web `app/src/data` sync (`8825b0c`), **DQ-1019-P1/P2/P3** (`e50a591`, `b2e988e`, `946bf4c`; all nine DQ-1019 fixes re-confirmed on tip by the 26 Oct DQ run). Public title Koh Tao Climbing; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive/upload from this list.

DQ-2026-10-26 (Codex gpt-6.1-sol, brief `/workspace/koh-tao-briefs/data-quality/dq-2026-10-26.md`): URGENT=false. Safety data is on the ship tip but still not on any build climbers have — live `1.0.2` lacks the Elephant top-bolt warning and Secret Garden access limit until `1.0.5` (9) ships. Weekly research 26 Oct (`/workspace/koh-tao-briefs/weekly-research/2026-10-26.md`): URGENT=false. This week's research/DQ runs due today (Mon 2 Nov ~10:00–10:30).

## Next

1. **Ship `1.0.5` (9) to TestFlight, then App Store** — tip `d2e5469` carries the DQ-1019 safety/access data; this is the only way the warning reaches climbers. 11 days since the build bump with no visible TestFlight/App Review movement from the repo or storefront. Ship lane (app manager) to confirm upload/processing state, attach proof video + `DataStoreTests` result, and queue App Review. App Store submit needs Nic’s yes.
2. **Verify DQ-1019 in the build** — on device/simulator: The Elephant shows the top-bolt warning; Secret Garden reads "access limited (construction), not closed"; Mao Rock has the jungle topo and Laem Thian the coast topo; Elephant anchor captions show the anchor-honesty appends.
3. **DQ-1026 caption fixes (P2, caption-only)** — `DQ-1026-FIX-01` (`p18-0-X52`), `FIX-02` (`p36-0-X121`), `FIX-03` (`p09-0-X21`) per `dq-2026-10-26-fixes.json`. Small; can ride `1.0.5` if not yet uploaded, else next build. Also fix the stale UKC "rechecked 2026-09-28" note in `sources.json` / `reports.json` (reconfirmed 12, 19, 26 Oct).
4. **Land tip on `main`** — PR from `feat/ui-pass-light-dark` @ `d2e5469`. Prefer this over advancing [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) still at `5f11bcc`. Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1)–[#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth [#4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. Delete merged `data/post-1.0.5-fixes` and `fix/dq-002-b1-dual-nulls` after owner confirms.
5. **Offline favorites / personal ticks** — search + map camera/`@AppStorage` exist; climbers still cannot star or tick. Strongest product ship after `1.0.5`.
6. **Photo coverage + photo↔route linkage** — 26 Oct DQ: 7 crags with zero photos, 21 community assets unmatched. Schema `routeId`/`routeAnnotations[]` still backlog (post-1.0.5). Scanner: strip `DQ-0xx:`/`DQ-1019:` notes before extraction, exclude `*-unusable`, keep plus signs, reject bolt counts/heights as grades, match within sector first. Needs-verification only: Elephant #11 (`The Trunk 7a`), Lang Khai `Difensless` V3 vs `Diffensless` 6B+, Babaloo spelling. Labels only — no invented grades/routes.
7. **Source follow-ups (remaining)** — seek dated, crag-specific confirmation of fees/access/bolting rules before changing access data. (Yang 36 vs repo 34 resolved 26 Oct via The Topo route list: "Dino too good" 6B plus a likely duplicate "Hairy Classic Right" 6B+ — do not add climbs.)
8. **Park/split dirty web tree** at `koh tao climbing`; native work stays on clean unique worktree.
9. **Pins only from published coords** — Unmapped FAB lists missing coords; never invent (skip Phillips Secret Spot / unverified).
10. **Tests** for MapFocus / first-run / show-on-map after tip→`main` (UITests already cover map→routes, filters, appearance, attribution, review-prompt).

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth/analytics = scorecard / app manager; this file = product backlog. Public storefronts still 0 ratings; 30d targets missed.
- Instagram `@kohtaoclimbing` paused until Nic reopens.
- Cadence: this file is now updated weekly (Mondays ~09:00 Bangkok).
- 2 Nov check: no repo movement since 26 Oct — `feat/ui-pass-light-dark` @ `6e0d986` (26 Oct IMPROVEMENTS doc atop product tip `d2e5469`); all other branch tips and open PRs #1–#6 unchanged; `main` `0cc0074`. Live iTunes `1.0.2`, 0 ratings. Build `1.0.5` (9) still not live (11 days since bump).
- 26 Oct check: no repo movement since 25 Oct; live `1.0.2`, 0 ratings; Day-40 growth scorecard: 14d/30d targets missed. DQ-1026 + research 26 Oct both URGENT=false.
- 20–22 Oct: DQ-1019-P1 safety merge sat unimplemented for 3 days after the 19 Oct URGENT brief.
