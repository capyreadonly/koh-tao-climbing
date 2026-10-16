# Koh Tao Climbing — improvements

Updated 16 Oct 2026 (Asia/Bangkok). Living backlog for the native iOS app. Highest first.

Status: live `READY_FOR_SALE` — ASC/iTunes `1.0.2` / binary build `7` (released 20 Sep), CFBundle `1.0.4` tip `e08edbd` (MapKit zoom); store still `1.0.2` as of 16 Oct, 0 ratings (US+GB/TH/AU/DE/JP lookups; US RSS 0). Product tip `feat/ui-pass-light-dark` @ `cd135fa` (15 Oct daily docs atop `7186d8f` / product `c193e1e` / `8825b0c`; ancestry includes DQ-002-B1 dual-nulls `2986299`, DQ-003 P1–P4+F2, photo credits, StoreKit rating + `1.0.5`/build `8`, light/dark, MapKit/DQ). Parallel unmerged data branch `data/post-1.0.5-fixes` still @ `87e17fb` (12 Oct source hygiene + guidebook link → The Topo / UKC legend; atop `d6a4168` KTCC rebolting / Mek’s fee / Elephant note). Soft-launch Instagram paused. `main` still Aug 23 TF 0.1 (1) (`0cc0074`).

Skip tip ancestry: About/first-run, privacy/support, map QA, show-on-map, launch screen, PrivacyInfo, Claude fable UX, Map→routes + grade/style filters, map pin → CragDetail, Has/No photo filter (crag-level), MapKit zoom, DQ-001-B1, DQ-002-B1, light/dark, StoreKit `1.0.5` (8), photo credits/attribution (`f9e7084`), DQ-003 P1–P4 (`d2ca7e8`; supersedes DQ-002 B2–B5), DQ-003-F2 (`1537787`), web `app/src/data` sync (`8825b0c`). Public title Koh Tao Climbing; ASC 6798921403, https://apps.apple.com/us/app/kohtaoclimbing/id6798921403. Do not archive/upload from this list.

Weekly Astra (12 Oct, window 28 Sep–12 Oct): URGENT=false; no verified in-window closure, bolt failure, or access ban. theCrag page footer 2026-10-07 (496 routes, 2,284 ascents; page timestamp, not an event date). The Topo Yang shows 36 boulders vs earlier 34 from 27crags — scope may differ, two new routes NOT established. Keep `routes.json` (624) unchanged pending problem-level evidence.

## Next

1. **Land tip + data on `main`** — PR from `feat/ui-pass-light-dark` @ `cd135fa`, then fold `data/post-1.0.5-fixes` @ `87e17fb` (data-only: KTCC/Mek/Elephant + 12 Oct source hygiene). Prefer this over advancing [PR #6](https://github.com/capyreadonly/koh-tao-climbing/pull/6) still at `5f11bcc` (missing MapKit/DQ/light-dark/1.0.5). Close superseded [#1](https://github.com/capyreadonly/koh-tao-climbing/pull/1)–[#3](https://github.com/capyreadonly/koh-tao-climbing/pull/3), [#5](https://github.com/capyreadonly/koh-tao-climbing/pull/5). Keep growth [#4](https://github.com/capyreadonly/koh-tao-climbing/pull/4) separate. No archive/upload here.
2. **TestFlight tip `1.0.5` (build 8)** with the data branch folded — tip already bumped; live still `1.0.2`/build `7`, now 26 days old. Local Mini archive path exists (`ktc105`); ship lane only for TF. App Store submit needs Nic’s yes.
3. **Offline favorites / personal ticks** — search + map camera/`@AppStorage` exist; climbers still cannot star or tick. Strongest product ship once tip lands (or small parallel).
4. **Photo↔route DQ** via Astra/Codex (`DATA-QUALITY.md`). In tip: DQ-001-B1, DQ-002-B1, DQ-003 P1–P4+F2. Open: DQ-004–009 (+ optional `routeId`/`routeAnnotations[]`). Weekly DQ runs failed 5 Oct and 12 Oct — no new batch for two weeks; DQ lane needs a working Codex host. Labels only — no invented grades/routes. URGENT: false.
5. **Source follow-ups (remaining)** — reconcile Yang 36 vs 34 with comparable, public problem-level evidence; seek dated, crag-specific confirmation of fees/access before changing access data. (UKC legend fix, 27crags→The Topo, dated Topo counts: done on `data/post-1.0.5-fixes`, ship with item 1.)
6. **Park/split dirty web tree** at `koh tao climbing`; native work stays on clean unique worktree.
7. **Pins only from published coords** — Unmapped FAB lists missing coords; never invent (skip Phillips Secret Spot / unverified).
8. **Tests** for MapFocus / first-run / show-on-map after tip→`main` (UITests already cover map→routes, filters, appearance, attribution, review-prompt).

## Notes

- Do not invent climbing facts.
- Push as `capyreadonly` only.
- Do not archive/upload to TestFlight or App Store from this list.
- Growth/analytics = scorecard / app manager; this file = product backlog. Day-30 (16 Oct) public storefronts still 0 ratings; 30d targets out of reach without ASC downloads.
- Instagram `@kohtaoclimbing` paused until Nic reopens.
- 15 Oct check: tip `7186d8f`→`cd135fa` (daily docs); data `87e17fb`; `main` `0cc0074`; PRs #1–#6 unchanged; live `1.0.2`, 0 ratings.
- 16 Oct check: tips unchanged since 15 Oct (`cd135fa`; data `87e17fb`; `fix/dq-002-b1-dual-nulls` `2986299` already in tip; `main` `0cc0074`; open PRs #1–#6 heads unchanged, #6 still `5f11bcc`). Live iTunes still `1.0.2`, 0 ratings (6 storefronts + US RSS). No native product commits for 12 days; items 1–2 still need a ship lane (product agent / app manager), not backlog edits.
