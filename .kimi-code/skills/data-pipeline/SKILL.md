---
name: data-pipeline
description: How the site's data layer (routes, photos, reports) is generated and verified from research sources
whenToUse: When adding, correcting, or regenerating routes, crags, photos, or community reports in app/src/data
type: prompt
---

# Data pipeline — Koh Tao climbing guide

`app/src/data/routes.ts`, `photos.ts`, and `reports.ts` are GENERATED. Hand edits get overwritten — change the source data or the generator, then regenerate.

## Generators (all in work/)

- `work/gen-routes2.mjs` → `app/src/data/routes.ts` (624 records; sources: mountainproject | 27crags | guidebook | vault)
- `work/gen-photos2.mjs` → `app/src/data/photos.ts` (179 guide photos + 72 community photos)
- `work/gen-reports2.mjs` → `app/src/data/reports.ts` (34 reports)
- `climbing.ts` and `info.ts` are hand-maintained (edit directly).

## Source-of-truth hierarchy (highest first)

1. **Goodtime guidebook PDF** — `work/research2/pdf-routes.json` (routes/grades/bolts as printed), `work/research2/page-crag-map.json` (PDF page → crag; the ONLY valid way to attribute guide photos, filenames carry `p{page}`), `work/research2/pdf-facts.md`
2. **Mountain Project** — `work/research2/mp-deep.json` (descriptions, FA, length, protection), `work/web-routes.json`
3. **27crags** — `work/research2/27crags-more.json` (bouldering; sectors, tick counts)
4. **Vault notes** — `work/vault-facts.json`
5. **Community reports** — `work/community/reports.json`, `work/research2/reports2.json` (beta-level, cite as such)

NEVER reintroduce `legacy-static` data: the old static site's route lists were fabricated (38 routes removed Aug 2026; see `work/research2/audit.json` + `work/research2/corrections-applied.md`).

## Verify after any regeneration

```sh
cd app && npx tsc -b            # must exit 0
node work/verify-corrections.mjs # routes/photos invariants
node work/verify-images.mjs      # every referenced image exists in dist expectations
```

## Adding community photos

1. Record metadata FIRST in `work/community/web-photos.json` (file, sourceUrl, pageUrl, author, license, crag, caption).
2. Download to `app/public/images/community/` with a unique slug name; verify with `file`.
3. Resize >800KB non-ND images: `sips -Z 2000 -s formatOptions 80 <file>` (NEVER upscale small files; keep CC-ND files byte-original).
4. Regenerate photos.ts, run the verifiers above.
