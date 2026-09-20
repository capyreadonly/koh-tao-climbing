# DATA-QUALITY backlog — Koh Tao Climbing

**Owner lane:** OpenAI (Astra) audits + drafts; Claude Code fixes; product ships TF/ASC.  
**Cadence:** Monday weekly loop — research + photo↔route integrity.  
**Branch target:** `improve/claude-design-ux` (or main when merged).  
**Rule:** no invented routes/photos; mark unverified; don’t ship guesses.  
**Last DQ-001 pass:** 2026-09-20 Asia/Bangkok · Codex `gpt-6-astra` · box-only deliverables (no GitHub push).

## Open audits
| ID | Area | Symptom / ask | Status |
|---|---|---|---|
| DQ-001 | photo↔route | Guide/community photos with `crag` / captions that don’t resolve to a `Crag.slug` or route name; multi-route topos have **no `routeId`** | **in progress / partial** — first audit complete; see ranked issues below + `dq-001-audit-report.md` |
| DQ-002 | photo usability | `kind` ending `-unusable` still referenced in UI paths? | open |
| DQ-003 | ND licenses | Photos with ND license must not be cropped (native already flags `isNdLicense`) — verify all call sites | open (7 ND photos flagged in scan) |
| DQ-004 | style strings | Free-form `style` values beyond known set (`sport/toprope`, `trad,tr`, …) — normalize via `CragStyle.primaryStyle` only; document leftovers | open |
| DQ-005 | gradeSystem gaps | Routes with unknown `gradeSystem` or unparsable `grade` for `GradeSort` / future `GradeBand` | open |
| DQ-006 | crag coords | Crags missing `coords` (invisible on Map) | open |
| DQ-007 | verified honesty | Unverified routes presented without seal/warning in any surface | open |

## DQ-001 ranked open issues (first pass)

Source: Codex `gpt-6-astra` top 10 in `/workspace/koh-tao-briefs/dq-001-top10.json`.  
**Do not auto-edit JSON** — proposed patch lists only; Climbing app coordinates PRs when Mini is online.

| Rank | Sev | File | Issue | Batch |
|---|---|---|---|---|
| 1 | high | `Images/guide/p42-2-X154.jpg` | Dual `Aow Luek / Lang Khai` label; Lang Khai topo mis-resolved; grade conflicts | DQ-001-B1 |
| 2 | high | `Images/guide/p37-1-X124.jpg` | Dual `Peak / Sai Tong`; Sai Tong membership obscured | DQ-001-B1 |
| 3 | high | `Images/guide/p37-0-X123.jpg` | Dual label breaks Peak Boulders topo membership | DQ-001-B1 |
| 4 | high | `Images/guide/p42-0-X152.jpg` | Dual label breaks Aow Luek membership despite caption | DQ-001-B1 |
| 5 | high | `Images/guide/p15-0-X43.jpg` | Mek De-Vine: `Mosquito`/`Mosquit` drift + Devine Intervention grade 6a+ vs DB 5c | DQ-001-B2 |
| 6 | high | `Images/guide/p15-1-X44.jpg` | Mek Quit Your'e Bitchin': `Btich` spelling + grade conflict; multi-route no routeId | DQ-001-B2 |
| 7 | medium | `Images/community/report-golden-view-kelsey-gray-01.jpg` | `Do It!` caption grade vs DB | DQ-001-B3 |
| 8 | medium | `Images/guide/p27-0-X73.jpg` | Backyard & Frontyard map — unresolved names / landmark false positives | DQ-001-B4 |
| 9 | medium | `Images/guide/p29-0-X82.jpg` | Secret Garden map — name transcription disagreement | DQ-001-B4 |
| 10 | medium | `Images/guide/p18-0-X52.jpg` | Elephant North: `The Trunk` vs DB `Trunk, The` article inversion | DQ-001-B5 |

### Structural / follow-up (not ranked in top 10 but open under DQ-001)

- **Schema gap:** no `routeId` / `routeAnnotations[]` — multi-route photo-topo & topo-diagram captions cannot deep-link (Astra suggestion in top10 JSON).
- **Community aliases:** `Backyard` / `Frontyard` → `Backyard & Frontyard` (scan: `crag_alias_needed`).
- **Scenic / unverified community (~21–23):** leave unresolved or move to scenic gallery; do not invent crag matches.
- **`topo_no_extractable_links`:** unnamed line overlays (e.g. some Mek photo-topos) — annotate as unverified lines only.
- Scan false-positive notes from Astra (Charly's Crack bolt-count; Sai Daeng “Route A”) — do not “fix” DB from those.

### Proposed fix batches (Claude/Mini)

| Batch | Title | Primary files |
|---|---|---|
| DQ-001-B1 | Correct four dual crag labels | `p42-2`, `p37-1`, `p37-0`, `p42-0` |
| DQ-001-B2 | Preserve Mek spelling/grade discrepancies (annotate; optional typo review) | `p15-0`, `p15-1` (+ routes.json only if high-confidence typo confirmed) |
| DQ-001-B3 | Annotate Golden View grade discrepancy | `report-golden-view-kelsey-gray-01.jpg` |
| DQ-001-B4 | Record unresolved map names without creating routes | `p27-0`, `p29-0`, `p34-0` |
| DQ-001-B5 | Resolve The Trunk article inversion | `p18-0` |

## Artifacts (box)

| Artifact | Path |
|---|---|
| Audit report | `/workspace/koh-tao-briefs/dq-001-audit-report.md` |
| Top 10 JSON | `/workspace/koh-tao-briefs/dq-001-top10.json` |
| Scan CSV | `/workspace/koh-tao-briefs/dq-001-photo-route-scan.csv` |
| Scan script | `/workspace/koh-tao-briefs/scripts/photo_route_scan.py` |
| Codex raw + model confirm | `/workspace/koh-tao-briefs/dq-001-astra-raw.json`, `dq-001-codex-model-confirm.txt` |

## First audit method (executed)

1. Load `photos.json` + `crags.json` + `routes.json`.
2. For each photo with `crag` set: exact / prefix / dual / alias / scenic resolve.
3. Caption route-like tokens matched to `RouteRecord.name` within crag (exact/fuzzy).
4. CSV emitted; Astra ranked top 10 with proposed fixes.
5. **Did not** auto-edit JSON; no PR opened (Mini offline / CloudAgent can’t see capyreadonly).

## Closed
_(none yet — move batch rows here after Claude/Mini ships + verify)_
