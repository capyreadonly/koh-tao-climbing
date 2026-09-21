# DATA-QUALITY backlog — Koh Tao Climbing

**Owner lane:** OpenAI (Astra) audits + drafts; Claude Code fixes; product ships TF/ASC.  
**Cadence:** Monday weekly loop — research + photo↔route integrity.  
**Branch audited (DQ-002-B1):** `fix/dq-002-b1-dual-nulls` @ `2229f9d737514dd4d92c01dcc14e486bc440d431` (base before B1 commit).
**Rule:** no invented routes/photos; mark unverified; don’t ship guesses.  
**Last DQ-002 pass:** 2026-09-21 Asia/Bangkok · Codex `gpt-6-astra` · session `01a0c214-cc31-7b12-93d4-2b9565b8080c`.
**URGENT:** false.
**Note:** This file is the repo-root-ready `DATA-QUALITY.md`. Audit CSVs / Astra logs may live outside the app tree on the agent box until committed.

## Open audits
| ID | Area | Symptom / ask | Status |
|---|---|---|---|
| DQ-001 | photo↔route | Guide/community photos with `crag` / captions that don’t resolve; multi-route topos have **no `routeId`** | **partial** — B1 four duals **shipped on tip**; residual duals + B2–B5 carried into DQ-002 |
| DQ-002 | photo↔route re-audit | Monday re-scan on ship tip; ≤10 verified fixes; residual duals | **partial — DQ-002-B1 shipped on this tip; B2–B5 remain open/drafted** — see implement batch (`dq-002-claude-batch.md` / `dq-002-fixes.json` on box) |
| DQ-003 | photo usability | `kind` ending `-unusable` still referenced in UI paths? | open |
| DQ-004 | ND licenses | Photos with ND license must not be cropped (`isNdLicense`) — verify call sites | open (7 ND photos in scan) |
| DQ-005 | style strings | Free-form `style` beyond known set — normalize via `CragStyle.primaryStyle` | open |
| DQ-006 | gradeSystem gaps | Unknown `gradeSystem` / unparsable `grade` for `GradeSort` / future `GradeBand` | open |
| DQ-007 | crag coords | Crags missing `coords` (invisible on Map) | open |
| DQ-008 | verified honesty | Unverified routes presented without seal/warning | open |

## Closed (verified on ship tip)

| ID | What | Evidence |
|---|---|---|
| DQ-001-B1 (partial) | Dual-label renames for four topo/guide pages | Tip `photos.json`: `p42-2-X154`→Lang Khai; `p37-1-X124`→Sai Tong; `p37-0-X123`→The Peak Boulders; `p42-0-X152`→Aow Luek (confirmed 2026-09-21). |
| DQ-002-B1 | Cleared three residual decorative-icon dual crag labels (`crag=null`) | Tip `photos.json`: `p37-2-X125`, `p38-0-X126`, `p42-1-X153`; `kind=other-unusable` retained (confirmed 2026-09-21). |

## DQ-002 ranked verified fixes (B1 shipped; B2–B5 remain open)

**Do not invent routes/grades.** Prefer caption honesty notes + residual dual clears. DQ-002-B1 is shipped below; B2–B5 remain in the implement batch and are not applied here.

| Rank | Sev | File | Issue / edit | Batch |
|---|---|---|---|---|
| 1 | low | `Images/guide/p37-2-X125.jpg` | Residual dual on decorative icon → `crag=null` (**shipped**) | DQ-002-B1 |
| 2 | low | `Images/guide/p38-0-X126.jpg` | Residual dual → `crag=null` (**shipped**) | DQ-002-B1 |
| 3 | low | `Images/guide/p42-1-X153.jpg` | Residual dual → `crag=null` (**shipped**) | DQ-002-B1 |
| 4 | medium | `Images/guide/p15-0-X43.jpg` | Mek Mosquito/Mosquit + Devine grade annotate | DQ-002-B2 |
| 5 | medium | `Images/guide/p15-1-X44.jpg` | Mek Btich spelling + grade annotate | DQ-002-B2 |
| 6 | medium | `Images/community/report-golden-view-kelsey-gray-01.jpg` | Do It! 6c+ vs DB 6b annotate | DQ-002-B3 |
| 7 | medium | `Images/guide/p27-0-X73.jpg` | Frontyard map unresolved names — note only | DQ-002-B4 |
| 8 | medium | `Images/guide/p29-0-X82.jpg` | Secret Garden Frondly Fire + mixed grades | DQ-002-B4 |
| 9 | medium | `Images/guide/p34-0-X112.jpg` | Letter-code honesty + Friendly Fire | DQ-002-B4 |
| 10 | low | `Images/guide/p18-0-X52.jpg` | `The Trunk` ↔ `Trunk, The` caption note | DQ-002-B5 |

### Structural / follow-up (still open)

- **Schema gap:** no `routeId` / `routeAnnotations[]` on `PhotoEntry` — multi-route topos cannot deep-link.
- **DB typo renames** (`Mosquit Burrito`, `Son of A Btich`) — optional separate high-bar PR; not in DQ-002 ship batch.
- **Community aliases:** `Backyard` / `Frontyard` → `Backyard & Frontyard`.
- **Scenic / unverified community (~20):** leave unresolved; do not invent crag matches.
- Do not “fix” DB from scan false positives (bolt counts, lettered-route collisions).

### Proposed fix batches (Claude/Mini)

| Batch | Title | Primary files |
|---|---|---|
| DQ-002-B1 (shipped) | Clear three decorative-icon dual crag labels | `p37-2`, `p38-0`, `p42-1` |
| DQ-002-B2 | Annotate Mek spelling/grade discrepancies | `p15-0`, `p15-1` |
| DQ-002-B3 | Annotate Golden View Do It! grade disagreement | `report-golden-view-kelsey-gray-01.jpg` |
| DQ-002-B4 | Record unresolved map names / letter-code honesty | `p27-0`, `p29-0`, `p34-0` |
| DQ-002-B5 | Document The Trunk article-inversion match | `p18-0` |

## Method

1. Load tip `photos.json` + `crags.json` + `routes.json`.
2. Confirm B1 four duals fixed; three residual duals remain (`other-unusable`).
3. Programmatic photo↔route scan → ranked CSV.
4. Codex `gpt-6-astra` proposes ≤10 verified `photos.json` field edits with evidence.
5. Claude/Mini applies batch; re-verify on tip before merge.

## Closed (full)
_(move DQ-002 batch rows here after Claude/Mini ships + re-verify on tip)_
