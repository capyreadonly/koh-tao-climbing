# Archive

Two-level archive for everything this project cites.

## 1. Small documents → Git (`archive/pdfs/`)

PDFs under ~50 MB are committed to this repo with provenance (see
[`pdfs/README.md`](pdfs/README.md)). Currently: the Goodtime free guidebook v1.14
(3.9 MB), the project's primary source.

## 2. All source pages → S3 (private)

Every URL cited by the site (route database pages, blog posts, reports, photo
pages, operator sites — 616 snapshots, ~94 MB, fetched 2026-08-02) is archived at:

```
s3://koh-tao-climbing-source-archive-914499832220/sources/
```

- Bucket: `koh-tao-climbing-source-archive-914499832220` (region `ap-southeast-1`,
  versioning enabled, public access blocked — private archive, not a re-publication)
- Layout: `sources/<host>/<path-slug>.<html|pdf|jpg|png>`
- Index: `sources/manifest.json` — every URL with its S3 key, HTTP status, bytes,
  and SHA-256. 11 URLs could not be fetched (403/400 blocks from theCrag, UKC,
  UKBouldering, TripAdvisor, Facebook, TheFunkyTurtle, WanderingClimber; one
  27crags timeout) — these are recorded in the manifest with their error.

### Restore / inspect

```sh
aws s3 cp s3://koh-tao-climbing-source-archive-914499832220/sources/manifest.json .
aws s3 sync s3://koh-tao-climbing-source-archive-914499832220/sources/ ./sources-archive/
```

### Re-archive (refresh snapshots)

The fetch script lives at `work/fetch-sources.py` (gitignored with `work/`):
it reads `work/source-urls.txt` (extracted from `app/src/data/*.ts` and the
research manifests), downloads each URL politely (0.4 s pacing, browser UA),
then `aws s3 sync work/sources-archive s3://koh-tao-climbing-source-archive-914499832220/sources/`.
