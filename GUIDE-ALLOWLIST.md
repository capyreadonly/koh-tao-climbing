# Public guide / topo allowlist — Koh Tao Climbing

**Purpose:** In-app download / reference links for paper & digital guides already cited in repo research.  
**Rule:** Only URLs present in `native/KohTaoClimbing/AppResources/Data/sources.json` (or the local archive copy of the same Goodtime PDF). **Do not invent URLs.**  
**Audience:** Claude Code (implement download/open) · coordinated by koh tao climbing app.  
**Curated:** OpenAI + Codex `gpt-6-astra` · 2026-09-20 · all URLs must exist in `sources.json` (no invented links).

## Tier A — downloadable / primary guidebooks (prefer for “download guide”)

| Title | URL | Attribution / notes | Repo provenance |
|---|---|---|---|
| Goodtime Adventures — free PDF guide v1/14 | `http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf` | Hosted on railay.com; Goodtime / Zen Gecko lineage. Authoritative print-era source (~325 route entries). | `sources.json` (listed twice: Goodtime PDF + railay.com free PDF) · **280** routes use this as `sourceUrl` · local mirror: `archive/pdfs/KT-Climbing-guide-1.14.pdf` |
| Goodtime Adventures — Climbing guidebook page | `https://goodtimethailand.com/climbing-guidebook/` | Operator page; points to current resources (notes rakkup as most up to date, page updated 2026-07-30 per sources). | `sources.json` |
| rakkup — Thailand: Koh Tao Rock Climbing | `https://rakkup.com/guidebooks/thailand-koh-tao-rock-climbing/` | Commercial digital guidebook page (~180 routes per sources). | `sources.json` |
| Rakkup — Koh Tao guide by Kelsey Gray | `https://rakkup.com/koh-tao-thailand-rock-climbing-by-kelsey-gray/` | Release / author article; also used as photo `sourceUrl` (×4). | `sources.json` + photos.json |

## Tier B — live crowdbook / area trees (reference, not paper PDF)

| Title | URL | Attribution / notes | Repo provenance |
|---|---|---|---|
| theCrag — Koh Tao | `https://www.thecrag.com/en/climbing/thailand/koh-tao` | Community wiki; access/ethics, gear rental notes. | `sources.json` |
| theCrag — The Elephant | `https://www.thecrag.com/en/climbing/thailand/koh-tao/area/9797417472` | Sairee Beach boulder detail. | `sources.json` |
| Mountain Project — Koh Tao | `https://www.mountainproject.com/area/108569570/koh-tao` | Area tree; ~96 routes scraped into DB (`source=mountainproject`). | `sources.json` |
| Mountain Project — Tanote Bay | `https://www.mountainproject.com/area/123981447/tanote-bay` | Sub-area. | `sources.json` |
| 27crags — Koh Tao | `https://27crags.com/crags/koh-tao` | Boulder/DWS-heavy; ~247 routes with `source=27crags`. | `sources.json` |

## Tier C — supporting history / grades (optional deep links)

| Title | URL | Attribution / notes | Repo provenance |
|---|---|---|---|
| Mapo Tapo — Koh Tao rock climbing guide | `https://www.mapotapo.com/blog/koh-tao` | Circuit, itineraries, Goodtime/Zen Gecko history. | `sources.json` · photos cite ×2 |
| Imperial College — 2017 SE Asia expedition | `https://www.imperial.ac.uk/be-inspired/exploration-board/previous-expeditions/2010s/2017-south-east-asia-climbing/` | Mek’s Mountain grades context. | `sources.json` |
| UKC Logbook — Frontyard and Backyard | `https://www.ukclimbing.com/logbook/crags/frontyard_and_backyard-19525/` | Partially-verified access note in sources. | `sources.json` |

## Explicitly NOT on this allowlist

- Tourism / dive / ferry / weather pages in `sources.json` (SoTravel, DiveZone, Travel Happy, Wonderland, Koh Tao Complete Guide, etc.) — not climbing guides.
- Operator package / course marketing alone (Bunker package, Discover Rock Climbing half-day) unless you also need service pricing — those stay in `sources.json` but are **not** paper-guide downloads.
- Individual MP/27crags **route** URLs (hundreds in `routes.json`) — use Tier B area roots, not per-route spam.
- **thetopo.com** — appears only as UI design tokens in web app; **no guide URL in sources**.
- Flickr / YouTube / Reddit community media — not guides.

## Claude Code handoff notes

1. Prefer Tier A for any “Download paper guide” / offline PDF action: remote Goodtime PDF URL **or** ship/copy `archive/pdfs/KT-Climbing-guide-1.14.pdf` with clear attribution to Goodtime / railay.com host.
2. Tier B = open in browser / SafariView (live data, not a fixed PDF).
3. Do not scrape or rewrite guide content into the app without license review; this allowlist is **link + attribution**, not republication.
4. If a URL 404s at runtime, surface failure — do not substitute a guessed URL.

## Source of truth

```
native/KohTaoClimbing/AppResources/Data/sources.json
archive/pdfs/KT-Climbing-guide-1.14.pdf
archive/pdfs/README.md
```
