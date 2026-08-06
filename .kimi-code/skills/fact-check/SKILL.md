---
name: fact-check
description: Rules for adding or changing any factual climbing content (routes, grades, access, fees, history) on the site
whenToUse: When the user asks to add or edit climbing facts, routes, grades, crag info, access notes, or community content
type: prompt
---

# Fact-check rules — Koh Tao climbing guide

The user cares about accuracy and has caught fabricated data before. Follow these rules for every factual claim that goes into `app/src/data/` or the UI.

## Rules

1. **Every fact needs a source.** Acceptable: the guidebook PDF extractions, Mountain Project, 27crags, rakkup, operator websites (Goodtime/Bunker), the vault, or a URL you fetched during the task. Record new research as JSON under `work/research2/` with source URLs.
2. **Uncertain → say so.** Use `verified: false` / an "unverified" note. Never smooth over uncertainty, never fill gaps by guessing. A missing value is better than an invented one.
3. **Conflicts stay visible.** When sources disagree (e.g. The Bitch in Me 6b+ vs 6c), keep both opinions in the record's note and mark verified:false. Exception: font↔V grade pairs (8A+≈V11, 7A≈V6, 6B≈V2, 6A≈V1) are the SAME grade in different systems — note as conversion, not conflict.
4. **theCrag is 403-blocked** from this network — claims resting only on theCrag stay "unverified" unless corroborated.
5. **Legacy-static data is banned.** The old static site fabricated routes (see `work/research2/audit.json`). Do not reuse anything from `archive/legacy-index.html` as fact.
6. **Photos need provenance**: author, license, source URL — catalogued in `work/community/web-photos.json`. CC-ND images are displayed byte-original (no resizing/cropping). Attribution lines in the UI are mandatory, never remove them.
7. **Prices/fees/access** go stale — mark with a checked date and prefer operator sites over blogs.
8. Leave an audit trail: significant correction rounds get a summary file like `work/research2/corrections-applied.md`.

## Currently known-unverified (do not "upgrade" without new evidence)

- Tao Tower & Phillips Secret Spot locations/routes (vault + legacy only)
- Bunker 250 THB day pass (secondary sources only)
- Koh Nang Yuan climbing (GTA-only access per PDF; no DWS evidence)
- Backyard & Frontyard status (UKC logbook says "no longer climbable" — partially verified; site shows a warning)
- Thaitanium current activity level; Goodtime phone/email; Flyin' High details
