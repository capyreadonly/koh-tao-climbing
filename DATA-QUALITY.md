# DATA-QUALITY backlog — Koh Tao Climbing

**Owner lane:** OpenAI (Astra) audits + drafts; Claude Code fixes; product ships TF/ASC.  
**Cadence:** Monday weekly loop — research + photo↔route integrity.  
**Branch audited (DQ-003):** `feat/ui-pass-light-dark` @ `77761ec68faa6ce3b956118de1b006b01203a0f9` (1.0.5 (8)).  
**Rule:** no invented routes/photos; mark unverified; don’t ship guesses.  
**Last pass (DQ-003):** 2026-09-28 Asia/Bangkok · Codex `gpt-6-astra` · session `01a0e621-2d0c-71a2-b9ad-7fb1cb4f803e`.  
**Previous (DQ-002):** 2026-09-21 · session `01a0c214-cc31-7b12-93d4-2b9565b8080c` · baseline `5f11bcc`.  
**URGENT:** false.  
**Note:** This file is the repo-root-ready `DATA-QUALITY.md`. Audit CSVs / Astra logs live on the agent box until committed.  

## Open audits
| ID | Area | Symptom / ask | Status |
|---|---|---|---|
| DQ-001 | photo↔route | Guide/community photos with `crag` / captions that don’t resolve; multi-route topos have **no `routeId`** | **partial** — B1 four duals shipped; residual work carried via DQ-002 → DQ-003 |
| DQ-002 | photo↔route re-audit | ≤10 verified fixes; residual duals | **partial — B1 applied on tip; B2–B5 pending** (captions byte-identical to 5f11bcc; texts still valid → carried into DQ-003 P1–P3) |
| DQ-003 | photo↔route pass (2026-09-28) | Re-scan on 1.0.5 tip; per-route linkage gap; has-photo filter honesty; unmatched community assets | **patches drafted** — 10 verified fixes in 4 non-blocking batches (`dq-003-claude-batch.md` / `dq-003-fixes.json`) |
| DQ-004 | ND licenses | Photos with ND license must not be cropped (`isNdLicense`) — verify call sites | open (7 ND photos in scan) |
| DQ-005 | style strings | Free-form `style` beyond known set — normalize via `CragStyle.primaryStyle` | open |
| DQ-006 | gradeSystem gaps | Unknown `gradeSystem` / unparsable `grade` for `GradeSort` / future `GradeBand` | open |
| DQ-007 | crag coords | Crags missing `coords` (invisible on Map) | open (12/29 crags have coords on tip) |
| DQ-008 | verified honesty | Unverified routes presented without seal/warning | open |
| DQ-009 | photo usability | `kind` ending `-unusable` still referenced in UI paths? (renumbered from the old DQ-003 backlog stub on 2026-09-28 to free DQ-003 for the photo↔route pass) | open — note: tip `guidePhotos(forCrag:)` and `rebuildPhotoCragIndex()` both filter `isUsable` |

## Closed (verified on ship tip)

| ID | What | Evidence |
|---|---|---|
| DQ-001-B1 (partial) | Dual-label renames for four topo/guide pages | Tip `77761ec` `photos.json`: `p42-2-X154`=Lang Khai; `p37-1-X124`=Sai Tong; `p37-0-X123`=The Peak Boulders; `p42-0-X152`=Aow Luek (re-confirmed 2026-09-28). |
| DQ-002-B1 | Cleared three residual decorative-icon dual crag labels (`crag=null`) | Tip `77761ec` `photos.json`: `p37-2-X125`, `p38-0-X126`, `p42-1-X153` `crag=null`, `kind=other-unusable` (commits `935e6bf`/`ae9e37f`; re-confirmed 2026-09-28). |

## DQ-002 status on tip `77761ec` (2026-09-28)

| Batch | Status | Evidence |
|---|---|---|
| DQ-002-B1 | **applied** | 4 original duals still single-crag; 3 decorative duals `crag=null` (only data diff vs 5f11bcc). |
| DQ-002-B2 | **pending** | `p15-0-X43` / `p15-1-X44` captions unchanged, no DQ-002 note; DB still `Mosquit Burrito` 6a, `Devine Intervention` 5c, `Son of A Btich` 7a, `The bitch in me` 6b+. → DQ-003-FIX-01/02 |
| DQ-002-B3 | **pending** | Golden View caption still `Rachel Fagan climbing Do It! (6c+) at Golden View. Photo by Kelsey Gray.`; DB `Do It!` French 6b. → DQ-003-FIX-03 |
| DQ-002-B4 | **pending** | `p27-0-X73`, `p29-0-X82`, `p34-0-X112` unchanged (p34 still says letters "appear to be quality/star markers"). → DQ-003-FIX-05/06/07 |
| DQ-002-B5 | **pending** | `p18-0-X52` still `11. The Trunk 7a`, no note; DB `Trunk, The` French 7a (Sairee Beach Boulders). → DQ-003-FIX-08 |

## DQ-003 — photo↔route pass (2026-09-28)

**Diff vs 5f11bcc:** only `photos.json` (the 3 B1 nulls). `routes.json` / `crags.json` identical. No photos added/removed. Schema: still **no** `routeId` / `routeIds` / `routeAnnotations[]`.

### Findings (Astra)
| ID | Sev | Finding |
|---|---|---|
| DQ-003-F1 | medium | No per-route photo linkage; of 23 multi-route scan flags, 19 are genuine multi-route/layout assets, 3 duplicate single-route extractions, 1 route/sector conflation. |
| DQ-003-F2 | medium | 1.0.3 "has photo" route filter is crag-level: `hasPhotos(forRoute:)` → `hasPhotos(forCragName: route.crag)`; 577/624 routes pass. Honesty issue → relabel filter as crag-level after 1.0.5; don’t switch to caption substring matching. |
| DQ-003-F3 | low | 23 kind-eligible community assets match no crag page (16 unverified, 4 scenic, 1 island map, 2 aliases `Backyard`/`Frontyard`). Fix only the 2 aliases. |
| DQ-003-F4 | low | B1 nulls show as 3 new `unresolved_crag` scan flags (40→43) — scanner artifact, no product regression. |
| DQ-003-F5 | medium | New grade conflict: `report-lang-khai-kelsey-gray-01.jpg` Forewarned 6a vs DB French 5c (verified=true) — annotate. |
| DQ-003-F6 | low | Scan false positives (Charly's Crack bolts, Shady Crack B vs Route B, Sai Daeng Route A, Stringer/Pow/Tao/Deco words) — don’t fix data from them. |
| DQ-003-F7 | low | Scanner misses unnamed multi-line assets (e.g. `golden-view-mp-gruber-03`, `p39-1-X128`, `p40-5-X139`, `p17-1-X50`). |

### Verified fixes (≤10) — none block 1.0.5
| Rank | Sev | File | Edit | Batch |
|---|---|---|---|---|
| 1 | medium | `Images/guide/p15-0-X43.jpg` | append DQ-002-B2 Mosquit/Devine note | DQ-003-P1 |
| 2 | medium | `Images/guide/p15-1-X44.jpg` | append DQ-002-B2 Btich/bitch-in-me note | DQ-003-P1 |
| 3 | medium | `Images/community/report-golden-view-kelsey-gray-01.jpg` | set caption with DQ-002-B3 Do It! note | DQ-003-P1 |
| 4 | medium | `Images/community/report-lang-khai-kelsey-gray-01.jpg` | append Forewarned 6a vs DB 5c note (NEW) | DQ-003-P1 |
| 5 | medium | `Images/guide/p27-0-X73.jpg` | append DQ-002-B4 unresolved labels note | DQ-003-P2 |
| 6 | medium | `Images/guide/p29-0-X82.jpg` | append DQ-002-B4 Frondly/Friendly + mixed grades note | DQ-003-P2 |
| 7 | medium | `Images/guide/p34-0-X112.jpg` | replace letter-code sentence (DQ-002-B4) | DQ-003-P2 |
| 8 | low | `Images/guide/p18-0-X52.jpg` | append DQ-002-B5 Trunk note | DQ-003-P3 |
| 9 | low | `Images/community/backyard-mp-ways-01.png` | `crag` `Backyard` → `Backyard & Frontyard` (NEW) | DQ-003-P4 |
| 10 | low | `Images/community/frontyard-mp-ways-01.png` | `crag` `Frontyard` → `Backyard & Frontyard` (NEW) | DQ-003-P4 |

### Structural / follow-up (still open)
- **Schema gap:** no `routeId` / `routeAnnotations[]` on `PhotoEntry` — post-1.0.5 optional annotations separating verified DB references from unresolved source labels; never auto-link from fuzzy names/landmarks.
- **Has-photo filter copy** (DQ-003-F2) — post-1.0.5 UI string change; predicate unchanged.
- **DB typo renames** (`Mosquit Burrito`, `Son of A Btich`) — optional separate high-bar PR.
- **Scanner:** exclude `*-unusable` from actionable unresolved totals; dedupe community candidates; keep plus signs.
- **21 unmatched community assets** — leave unresolved; do not invent crag matches.
- **Laem Thian jungle / Mao Rock coast topo** — review separately.

## Method

1. Load tip `photos.json` + `crags.json` + `routes.json`; diff vs previous audited SHA.
2. Re-verify prior batches field-by-field on tip.
3. Programmatic photo↔route scan → CSV.
4. Codex `gpt-6-astra` judges (evidence embedded in prompt) → ≤10 verified `photos.json` field edits.
5. Claude/Mini applies batch; re-verify on tip before merge.

## Closed (full)
_(move DQ-003 batch rows here after Claude/Mini ships + re-verify on tip)_
