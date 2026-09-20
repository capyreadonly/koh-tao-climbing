# DQ-001 — Photo↔route first-pass audit report

**Status:** partial / in progress (first pass complete; JSON not auto-edited)  
**Date:** 2026-09-20 (Asia/Bangkok)  
**Owner lane:** OpenAI (Astra judgment) → Claude/Mini proposed fix batches · Climbing app coordinates PRs  
**Repo checkout:** `/workspace/koh-tao-climbing`  
**Data:** `native/KohTaoClimbing/AppResources/Data/{photos,routes,crags,sources}.json`

## Method

1. **Inventory** — Read `Models.swift` (`PhotoEntry`), `DataStore.swift` (crag join + photo filters), `CragDetailView.swift` / `PhotoViewerSheet` (UI surface). Confirmed: **no `routeId` field**; photos join to crags only.
2. **Programmatic scan** — `/workspace/koh-tao-briefs/scripts/photo_route_scan.py`  
   - Resolves `photo.crag` with DataStore semantics (`exact` / `Name (` prefix) plus dual-label / alias / scenic helpers.  
   - Extracts caption candidates (paren grades, space grades, lettered routes, DB-name hits, sector hints).  
   - Fuzzy/exact match against `routes.json` for resolved crag(s).  
   - Flags: unresolved / dual / alias / scenic, caption routes missing, multi-route + no-routeId gap, topo with no links, grade mismatch, spelling drift, ND license.  
   - Output CSV: `/workspace/koh-tao-briefs/dq-001-photo-route-scan.csv` (251 rows).
3. **Codex judgment** — Model **`gpt-6-astra` only** (confirmed in session meta + `model_confirm`).  
   - Command (initial): `codex exec --model gpt-6-astra --skip-git-repo-check -s read-only --add-dir … --output-schema dq-001-codex-schema.json -o dq-001-astra-raw.json -` with inventory+scan package on stdin.  
   - Session `01a0bd7b-87ab-7231-be23-33618a3da79e` interrupted mid-reasoning; **resumed** with `codex exec resume -m gpt-6-astra …` → wrote `/workspace/koh-tao-briefs/dq-001-astra-raw.json`.  
   - Log proof: `/workspace/koh-tao-briefs/dq-001-codex-model-confirm.txt` (`model: gpt-6-astra`).  
   - Machine output: `/workspace/koh-tao-briefs/dq-001-top10.json`.

**Hard rules honored:** no invented routes/URLs; no GitHub push/PR; no Swift edits; JSON fixes as proposed lists only.

## Inventory — how UI/data links photos

### Schema (`PhotoEntry` in `Models.swift`)

| Field | Required | Notes |
|---|---|---|
| `file` | yes | Bundle path under `AppResources/`, also `Identifiable.id` |
| `kind` | yes | `photo-topo`, `topo-diagram`, `crag-photo`, `action-photo`, `map`, `scenic`, `community-photo`, `*-unusable`, `other` |
| `caption` | yes | Free text; **only** place multi-route topo names live |
| `crag` | optional | Display / join key — **crag name string**, not slug |
| `page` | optional | Guidebook page (guide photos) |
| `credit` / `license` / `sourceUrl` | optional | Community provenance; ND detected via `license` containing `"ND"` |

**Missing:** `routeId`, `routeIds[]`, `annotations`, sector id. Linking is **crag name + caption text only**.

### Join keys (`DataStore.swift`)

- `RouteRecord.crag` = crag **name** (not slug). Lookup: `routesByCragName[crag.name]`.
- Photos → crag via `photoBelongs`:
  - `photo.crag == crag.name`, **or**
  - `photo.crag.hasPrefix(crag.name + " (")` (qualifier variants).
- Guide usable filter: `isUsable` (= not `*-unusable`). Community has no usable filter.
- Thumbnail rank prefers `photo-topo` > `crag-photo` > … > `map`.

### UI (`CragDetailView`)

- `store.photos(forCrag:)` → horizontal `PhotoGalleryRow`; tap → `PhotoViewerSheet`.
- Caption / credit / license shown in viewer chrome only — **not parsed**, **not linked** to `RouteRecord`.
- Routes listed in a **separate** section; `NavigationLink` to route detail. No photo→route deep link.
- ND: `cropToFill: !photo.isNdLicense` + `NdBadge`.

### Multi-route gap (critical)

Guide `photo-topo` / `topo-diagram` captions routinely list **many** named routes (Mek sectors, Elephant, Shark Island, Peak/Sai Tong, Aow Luek, etc.). Schema cannot attach lines to routes → scan flags `multi_route_caption` + `no_routeId_multi_route_gap`. Astra recommends optional `routeAnnotations[]` (resolve to existing IDs only; keep printed grades separate).

### Counts (verified)

| Asset | Count |
|---|---|
| Routes | 624 |
| Crags | 29 |
| Guide photos | 179 |
| Community photos | 72 |

Guide kinds (approx): `other-unusable` 51, `crag-photo` 41, `photo-topo` 24, `action-photo` 16, `topo-diagram` 13, `map` 10, `scenic` 8, plus unusable variants. Community: mostly `community-photo` (71) + 1 map.

### Crag resolve extras found by scan

- **Dual labels** (`A / B`): e.g. `The Peak Boulders / Sai Tong`, `Aow Luek / Lang Khai` — **not** accepted by `photoBelongs` for either side → photo invisible on both crag galleries unless one side somehow matches (it doesn't).
- **Aliases:** `Backyard` / `Frontyard` → should map to `Backyard & Frontyard` (alias needed; not in app today).
- **Scenic / unverified community (~21–23):** `unverified (…)`, `Mae Haad (arrival/scenic)`, `Sairee Beach (scenic viewpoint)`, `John-Suwan Viewpoint`, `multiple (island topo map)`, etc. — correctly unresolved / scenic_non_crag.

## Scan summary (CSV)

Flag highlights from `dq-001-photo-route-scan.csv`:

| Flag | Approx count |
|---|---|
| ok_crag_only | 90 |
| caption_says_unverified | 66 |
| unresolved_crag | 40 |
| multi_route_caption / no_routeId_multi_route_gap | 23 |
| topo_no_extractable_links | 21 |
| unverified_crag_label | 16 |
| grade_mismatch_vs_db | 10 |
| dual_crag_label | 7 |
| caption_routes_not_in_db | 7 |
| nd_license | 7 |
| name_spelling_drift | 6 |
| scenic_non_crag | 4 |
| crag_alias_needed | 2 |

Astra corrected several scan false positives (see notes in `dq-001-top10.json`): e.g. Charly's Crack “grade 5” was bolt-count noise; Sai Daeng “Route A” contradicted caption saying no names.

## Top 10 problems (Astra `gpt-6-astra`)

| Sev | File | Crag | Issue | Evidence (abbrev) | Fix batch |
|---|---|---|---|---|---|
| high | `Images/guide/p42-2-X154.jpg` | Aow Luek / Lang Khai | Dual label prevents canonical membership; scan resolves the Lang Khai topo to Aow Luek. Multiple routes lack structured links, with additional grade conflicts. | Caption title is 'Lang Khaai Bay'; the Lang Khai subset contains Planet Paradise, Tantalis and the other named problems. Flags include dual_crag_label and no_routeId_multi_route_ga… | `DQ-001-B1` |
| high | `Images/guide/p37-1-X124.jpg` | The Peak Boulders / Sai Tong | Dual label obscures Sai Tong membership and produces a misleading Peak Boulders scan resolution. | Caption title is 'Sai Tong area'. Return of the Jeddi and Hels's arete occur in the supplied Sai Tong subset, while the scan resolved_slug is the-peak-boulders. Caption explicitly … | `DQ-001-B1` |
| high | `Images/guide/p37-0-X123.jpg` | The Peak Boulders / Sai Tong | Dual label breaks membership for a specifically titled Peak Boulders topo with seven named routes. | Caption title is 'The Peak Boulders'. All seven scan-matched names occur in the supplied The Peak Boulders subset. Flags include dual_crag_label and no_routeId_multi_route_gap. Cap… | `DQ-001-B1` |
| high | `Images/guide/p42-0-X152.jpg` | Aow Luek / Lang Khai | Dual label breaks membership despite direct Aow Luek evidence; caption also falsely describes its crag field as null. | Caption title is 'Aow Luek' and ends 'so crag is null', while photo.crag is Aow Luek / Lang Khai. The supplied Aow Luek subset includes all eight named matches and existing numbere… | `DQ-001-B1` |
| high | `Images/guide/p15-0-X43.jpg` | Mek's Mountain | Confirmed Mosquito/Mosquit spelling drift and Devine Intervention grade disagreement complicate eight-route linking. | Full caption says 'Mosquito Burrito 6a' and 'Devine Intervention 6a+'. DB has Mosquit Burrito 6a and Devine Intervention 5c in De-Vine Wall. The scan truncates Devine's caption gra… | `DQ-001-B2` |
| high | `Images/guide/p15-1-X44.jpg` | Mek's Mountain | Confirmed bitch/Btich spelling drift and a grade conflict accompany a multi-route topo, including an unlabeled line. | Caption says 'Son of a bitch 7a' versus DB 'Son of A Btich' 7a, and 'The bitch in me 6c' versus DB 6b+. DB includes an existing '(unlabeled line)' 6c+ in Quit Your'e Bitchin', matc… | `DQ-001-B2` |
| medium | `Images/community/report-golden-view-kelsey-gray-01.jpg` | Golden View | Single-route action caption reports a different grade from the scan's DB value. | Caption: 'Rachel Fagan climbing Do It! (6c+) at Golden View.' Scan reports Do It! DB grade 6b. Supplied photo sourceUrl is https://rakkup.com/koh-tao-thailand-rock-climbing-by-kels… | `DQ-001-B3` |
| medium | `Images/guide/p27-0-X73.jpg` | Backyard & Frontyard | Map names lack reliable route links; scanner conflates landmarks with routes and reports unmatched names and a grade conflict. | Caption lists The Lost Idol V8, Jungle Science V9, Mantle V6 and Predator V7 as problems, but Big Brother as a landmark. Scan reports the last three problem names unmatched, The Lo… | `DQ-001-B4` |
| medium | `Images/guide/p29-0-X82.jpg` | Secret Garden Boulders | Related maps disagree on a printed name and marker interpretation; scanner cannot establish missing routes or grade errors reliably. | p29 caption has 'Under Frondly Fire V4'; p34-0-X112 caption has 'Under Friendly Fire V4'. Both scans mark the respective name unmatched. p29 calls VE/E/M/MH/H/VH difficulty codes, … | `DQ-001-B4` |
| medium | `Images/guide/p18-0-X52.jpg` | Sairee Beach Boulders | The Trunk is falsely flagged absent because DB inverts the article; topo numbering also presents an identity ambiguity. | Caption lists '9. The Wet Beaver 4' and '11. The Trunk 7a'. Supplied DB includes The Wet Beaver 4 and Trunk, The 7a, whose sourceUrl ends /the-trunk. DB also includes '(The Elephan… | `DQ-001-B5` |

Full evidence + proposed_fix + confidence + unverified flags: see `/workspace/koh-tao-briefs/dq-001-top10.json`.

### Proposed fixes (summary by batch)

#### `DQ-001-B1` — Correct four dual crag labels

- **Touches (proposed):** `Images/guide/p42-2-X154.jpg`, `Images/guide/p37-1-X124.jpg`, `Images/guide/p37-0-X123.jpg`, `Images/guide/p42-0-X152.jpg`
- **Notes:** [{"selector":{"file":"Images/guide/p42-2-X154.jpg"},"patch":[{"op":"test","path":"/crag","value":"Aow Luek / Lang Khai"},{"op":"replace","path":"/crag","value":"Lang Khai"}]},{"selector":{"file":"Images/guide/p37-1-X124.jpg"},"patch":[{"op":"test","path":"/crag","value":"The Peak Boulders / Sai Tong"},{"op":"replace","path":"/crag","value":"Sai Tong"}]},{"selector":{"file":"Images/guide/p37-0-X123.jpg"},"patch":[{"op":"test","path":"/crag","value":"The Peak Boulders / Sai Tong"},{"op":"replace","path":"/crag","value":"The Peak Boulders"}]},{"selector":{"file":"Images/guide/p42-0-X152.jpg"},"pa…

#### `DQ-001-B2` — Preserve Mek's Mountain spelling and grade discrepancies

- **Touches (proposed):** `Images/guide/p15-0-X43.jpg`, `Images/guide/p15-1-X44.jpg`
- **Notes:** [{"selector":{"file":"Images/guide/p15-0-X43.jpg"},"requires":"routeAnnotations schema; merge with any existing annotations","patch":[{"op":"add","path":"/routeAnnotations","value":[{"routeId":null,"sourceName":"Mosquito Burrito","printedGrade":"6a","status":"unverified","note":"Existing DB candidate: Mosquit Burrito, De-Vine Wall; resolve existing ID before linking."},{"routeId":null,"sourceName":"Devine Intervention","printedGrade":"6a+","status":"unverified","note":"DB grade 5c; retain source discrepancy pending review."}]}]},{"selector":{"file":"Images/guide/p15-1-X44.jpg"},"requires":"rou…

#### `DQ-001-B3` — Annotate the Golden View grade discrepancy

- **Touches (proposed):** `Images/community/report-golden-view-kelsey-gray-01.jpg`
- **Notes:** [{"selector":{"file":"Images/community/report-golden-view-kelsey-gray-01.jpg"},"requires":"routeAnnotations schema; merge with any existing annotations","patch":[{"op":"add","path":"/routeAnnotations","value":[{"routeId":null,"sourceName":"Do It!","printedGrade":"6c+","sourceUrl":"https://rakkup.com/koh-tao-thailand-rock-climbing-by-kelsey-gray/","status":"unverified","note":"Scan reports DB grade 6b; route subset unavailable. One route, not two fuzzy candidates."}]}]}]

#### `DQ-001-B4` — Record unresolved map names without creating routes

- **Touches (proposed):** `Images/guide/p27-0-X73.jpg`, `Images/guide/p29-0-X82.jpg`, `Images/guide/p34-0-X112.jpg`
- **Notes:** [{"selector":{"file":"Images/guide/p27-0-X73.jpg"},"requires":"routeAnnotations schema; merge with any existing annotations","patch":[{"op":"add","path":"/routeAnnotations","value":[{"routeId":null,"sourceName":"The Lost Idol","printedGrade":"V8","status":"unverified","note":"Scan reports DB 8B; identity and grade comparison require review."},{"routeId":null,"sourceName":"Jungle Science","printedGrade":"V9","status":"unverified"},{"routeId":null,"sourceName":"Mantle","printedGrade":"V6","status":"unverified"},{"routeId":null,"sourceName":"Predator","printedGrade":"V7","status":"unverified"}]}]…

#### `DQ-001-B5` — Resolve The Trunk's article inversion without number-only matching

- **Touches (proposed):** `Images/guide/p18-0-X52.jpg`
- **Notes:** [{"selector":{"file":"Images/guide/p18-0-X52.jpg"},"requires":"routeAnnotations schema; merge with any existing annotations; replace null IDs only after existing-record lookup","patch":[{"op":"add","path":"/routeAnnotations","value":[{"routeId":null,"sourceName":"The Wet Beaver","sourceLabel":"9","printedGrade":"4","status":"pending_id_lookup","note":"Existing The Wet Beaver record in Sairee Beach Boulders, The Elephant."},{"routeId":null,"sourceName":"The Trunk","sourceLabel":"11","printedGrade":"7a","status":"pending_id_lookup","note":"Existing DB record Trunk, The, source https://www.mounta…


### Schema suggestion (Astra)

Add optional routeAnnotations[] to PhotoEntry with routeId nullable, sourceName, sourceLabel, printedGrade, gradeSystem nullable, sourceUrl, page, status and note. Resolve routeId only to existing records using crag plus sector and source context; retain unresolved labels without creating routes. Preserve printed grades independently of DB grades, including unknown historical grade systems. Add optional cragIds[] for genuinely shared images and update membership accordingly; these four dual-labeled images instead support individual canonical crag labels. Keep landmark annotations distinct from route annotations. Do not invent image coordinates or equate topo numbers across different faces.

### Astra notes / blockers

Analysis only; no files edited or external sources checked. Rankings follow the requested priorities rather than raw scan scores. Route IDs and photo-manifest paths were not supplied. Batch notes contain JSON-encoded lists of proposed record-relative patches; select records by the stated file or route selector before applying. New annotation fields require schema support first. Unverified flags cover unresolved identity, attribution, or grade judgments, not merely whether a discrepancy exists. Scan corrections: Charly's Crack is 6a in both the full caption and DB; the reported caption grade 5 is a bolt-count extraction error. Shady Crack B 6c matches DB B in Shady Crack, not Route B 6a in Low Bulge. Sai Daeng's full caption explicitly says no route names, contradicting the scan's Route A candidate. Community action captions describe single routes; duplicated fuzzy candidates do not establish multiple routes or spelling drift. Forewarned has an additional caption-versus-DB conflict, 6a versus 5c, deferred below the top ten. No individual community Backyard/Frontyard alias or scenic_non_crag records were supplied, so concrete edits for those categories are unsupported. Do not infer aliases from URL slugs alone. The unlocated p44 action photo should retain null crag; it is not evidence of scenic_non_crag.

## Suggested small PR batches for Claude/Mini

Do **not** auto-merge. Each batch is a proposed JSON patch list only (no Swift unless product later accepts `routeAnnotations`).

1. **DQ-001-B1** — Split/correct four dual `photo.crag` labels (`p42-2`, `p42-0`, `p37-0`, `p37-1`) to canonical single crag names so `photoBelongs` works. Prefer caption titles (Lang Khai / Peak / Sai Tong / Aow Luek) over slash strings. Mark remaining face attribution unverified where caption still hedges.
2. **DQ-001-B2** — Mek's Mountain spelling/grade discrepancies: preserve printed caption grades in annotations; fix **confirmed** DB typos only when high confidence (`Mosquit Burrito`→`Mosquito Burrito`, `Son of A Btich`→`Son of a bitch` spelling) **or** leave DB and annotate drift — do not invent new routes. Grade conflicts (`Devine Intervention` 6a+/5c, `The bitch in me` 6c/6b+) → annotate, don't silently overwrite without guidebook page check.
3. **DQ-001-B3** — Golden View community action grade caption vs DB (`Do It!`) — annotate discrepancy; sourceUrl already on photo if present.
4. **DQ-001-B4** — Map pages (`p27`, `p29`, related): record unresolved printed names; do not create routes from map labels alone.
5. **DQ-001-B5** — `The Trunk` / article inversion at Sairee Beach Boulders — resolve matcher/name normalization; no new route.

**Follow-ups (not in top 10 but open):** community aliases Backyard/Frontyard; scenic_non_crag cleanup; `topo_no_extractable_links` photos (e.g. unnamed line overlays); ND call-site audit → DQ-003; unusable kinds still bundled → DQ-002.

## Deliverable paths

| Artifact | Path |
|---|---|
| Backlog | `/workspace/koh-tao-briefs/DATA-QUALITY.md` |
| This report | `/workspace/koh-tao-briefs/dq-001-audit-report.md` |
| Top 10 JSON | `/workspace/koh-tao-briefs/dq-001-top10.json` |
| Scan CSV | `/workspace/koh-tao-briefs/dq-001-photo-route-scan.csv` |
| Scan script | `/workspace/koh-tao-briefs/scripts/photo_route_scan.py` |
| Codex raw | `/workspace/koh-tao-briefs/dq-001-astra-raw.json` |
| Codex model confirm | `/workspace/koh-tao-briefs/dq-001-codex-model-confirm.txt` |

## Out of scope (respected)

- Map-nav / filter UX  
- Pushing to GitHub / opening PRs  
- Auto-editing `photos.json` / `routes.json`  
- Changing app Swift code  
