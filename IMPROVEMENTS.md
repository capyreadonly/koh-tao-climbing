# Koh Tao Climbing — improvements

Updated 1 Oct 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` — ASC/iTunes `1.0.2` / binary build `7`, CFBundle `1.0.4` tip `e08edbd` (MapKit zoom; store still `1.0.2` as of 1 Oct). Product tip `feat/ui-pass-light-dark` @ `16b6a5d` (daily docs atop product `8825b0c` / prior docs `88576f4`; ancestry includes DQ-003 P1–P4+F2, photo credits, StoreKit rating + `1.0.5`/build `8`, light/dark, MapKit/DQ). Soft-launch Instagram paused. `main` still Aug 23 TF 0.1 (1) (`0cc0074`).

Skip tip ancestry: About/first-run, privacy/support, map QA, show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail, Has/No photo filter (crag-level), MapKit zoom, DQ-001-B1, DQ-002-B1, light/dark, StoreKit `1.0.5` (8), photo credits/attribution (`f9e7084`), DQ-003 P1–P4 (`d2ca7e8`; supersedes DQ-002 B2–B5), DQ-003-F2 (`1537787`), web `app/src/data` sync (`8825b0c`). Public title Koh Tao Climbing; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive/upload from this list.

Weekly Astra (28 Sep): no material route updates. Source hygiene only (no invented routes): (P2) UKC “no longer climbable” → generic legend in `sources.json`; (P3) verify The Topo Yang 35→36 before data edits; (P3) directory `27crags.com/crags/koh-tao` → `thetopo.com/crags/koh-tao` when touching sources.

## Next

1. **Land tip on `main`** — PR from `feat/ui-pass-light-dark` @ `16b6a5d` (prefer tip over advancing [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) still at `5f11bcc`, missing MapKit/DQ/light-dark/1.0.5). Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1)–[#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth [#4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. No archive/upload here.
2. **TestFlight tip `1.0.5` (build 8)** — tip already bumped; live still `1.0.2`/build `7`. Local Mini archive path exists (`ktc105`); ship lane only for TF. App Store submit needs Nic’s yes.
3. **Offline favorites / personal ticks** — search + map camera/`@AppStorage` exist; climbers still cannot star or tick. Strongest product ship once tip lands (or small parallel).
4. **Photo↔route DQ** via Astra/Codex (`DATA-QUALITY.md`). In tip: DQ-001-B1, DQ-002-B1, DQ-003 P1–P4+F2. Open: DQ-004–009 (+ optional `routeId`/`routeAnnotations[]`). Reconcile status table on next DQ pass. Labels only — no invented grades/routes. URGENT: false.
5. **Source hygiene** when next editing sources (UKC legend, Yang count, 27crags→The Topo directory).
6. **Park/split dirty web tree** at `koh tao climbing`; native work stays on clean unique worktree.
7. **Pins only from published coords** — Unmapped FAB lists missing coords; never invent (skip Phillips Secret Spot / unverified).
8. **Tests** for MapFocus / first-run / show-on-map after tip→`main` (UITests already cover map→routes, filters, appearance, attribution, review-prompt).

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth/analytics = scorecard / app manager; this file = product backlog.
- Instagram `@kohtaoclimbing` paused until Nic reopens.
