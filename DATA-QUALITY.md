# DATA-QUALITY backlog — Koh Tao Climbing

**Owner lane:** OpenAI (Astra) audits + drafts; Claude Code fixes; product ships TF/ASC.  
**Cadence:** Monday weekly loop — research + photo↔route integrity.  
**Branch target:** `improve/claude-design-ux` (or main when merged).  
**Rule:** no invented routes/photos; mark unverified; don’t ship guesses.

## Open audits
| ID | Area | Symptom / ask | Status |
|---|---|---|---|
| DQ-001 | photo↔route | Guide/community photos with `crag` / captions that don’t resolve to a `Crag.slug` or route name | open — first audit this week |
| DQ-002 | photo usability | `kind` ending `-unusable` still referenced in UI paths? | open |
| DQ-003 | ND licenses | Photos with ND license must not be cropped (native already flags `isNdLicense`) — verify all call sites | open |
| DQ-004 | style strings | Free-form `style` values beyond known set (`sport/toprope`, `trad,tr`, …) — normalize via `CragStyle.primaryStyle` only; document leftovers | open |
| DQ-005 | gradeSystem gaps | Routes with unknown `gradeSystem` or unparsable `grade` for `GradeSort` / future `GradeBand` | open |
| DQ-006 | crag coords | Crags missing `coords` (invisible on Map) | open |
| DQ-007 | verified honesty | Unverified routes presented without seal/warning in any surface | open |

## First audit (this week) — DQ-001 method
1. Load `photos.json` + `crags.json` + `routes.json`.
2. For each photo with `crag` set: fuzzy/exact match to crag `name`/`slug`.
3. For captions mentioning route-like tokens: optional match to `RouteRecord.name` within that crag.
4. Emit CSV/markdown: `file, photo.crag, resolved_slug?, issue`.
5. Do **not** auto-edit JSON without a second pass; open fix PR only for high-confidence renames.

## Done
_(none yet)_
