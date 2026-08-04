// Data layer for the Koh Tao Climbing Database.
// Mirrors the Obsidian vault in ../vault — same entities, same sources.
// Upgraded 2026-08-02 with the web fact-check (work/web-routes.json, work/web-services.json)
// and the legacy static-site merge (work/static-site-content.md); corrected 2026-08-04 per
// work/research2/audit.json + the research2 sources (Goodtime PDF facts, 27crags deep fetch,
// MP deep scrape): fabricated legacy route lists removed, Temple Rock / Laem Thian confirmed,
// Tao Tower & Phillips Secret Spot demoted to 'reported, unverified', The Warehouse removed,
// accessFee/accessWarning fields added.
//
// Verification model: `verified` notes on crags/services record what the 2026-08-02 web
// fact-check confirmed or disputed. The legacy static draft and the vault are treated as
// unverified unless corroborated by Mountain Project / 27crags / operator sites / the Goodtime PDF.
// The full 620+-record route database lives in ./routes.ts; `routes` below is the small
// vault highlight list kept for backwards compatibility.

export type Style = 'sport' | 'trad' | 'boulder' | 'multipitch' | 'toprope'

export interface Crag {
  slug: string
  name: string
  area: string
  styles: Style[]
  grades: string
  sun: string
  approach: string
  access: string
  /** Entry fee where one is documented (e.g. Mek's Mountain 100 THB at Goodtime Adventures). */
  accessFee?: string
  /** Access caveat the UI should surface (degraded access, closure reports, verify-locally flags). */
  accessWarning?: string
  summary: string
  details: string[]
  sectors?: { name: string; note?: string }[]
  highlight?: string
  tags: string[]
  /** WGS84 — Mountain Project coordinates preferred; legacy-draft coordinates flagged in `verified`. */
  coords?: { lat: number; lng: number }
  /** Route counts per source — counts from different databases are NOT reconciled. */
  routeCount?: string
  bestSeason?: string
  /** What the 2026-08-02 web fact-check confirmed or disputed for this crag. */
  verified?: string
}

export interface RouteEntry {
  slug: string
  name: string
  grade: string
  style: Style
  cragSlug: string
  stars: number
  note: string
}

export interface Service {
  name: string
  role: string
  since: string
  summary: string
  bullets: string[]
  contact: string
  url: string
  /** 2026-08-02 fact-check status for this operator. */
  verified?: string
}

export const crags: Crag[] = [
  {
    slug: 'meks-mountain',
    name: "Mek's Mountain",
    area: 'Central Koh Tao',
    styles: ['sport', 'toprope', 'multipitch'],
    grades: '4–7b (MP + Goodtime PDF)',
    sun: 'Climbable most of the day — walls face different directions for all-day shade (PDF)',
    approach: 'Motorbike up from the Sairee 7/11 crossroads toward Hin Wong, right turn near the phone tower, short walk',
    access: 'Private land — pay before climbing; receipt issued (Goodtime PDF)',
    accessFee: '100 THB entry, paid at Goodtime Adventures (PDF p8 attention box, verified)',
    summary:
      "The island's main sport venue and the default first stop: 18 sport routes and 14 top-rope anchors with 20 routes, grades 4–7b (Goodtime PDF area list). Home crag of Goodtime Adventures, with the friendly De-Vine Wall and the steeper Eagle Wall.",
    details: [
      'Most visitors climb here first to get a feel for Koh Tao granite before exploring further.',
      'Climbable through most of the day, which makes it the standard morning venue in the classic circuit.',
      'Benchmark ticks include The Bitch in Me (6b+/6c — sources conflict) and I Got a Feeling (6a/6a+), both logged by the 2017 Imperial College expedition.',
      'Largest roped area on the island: granite boulders on a steep hill, views from Fraggle Rock, highline bolts on the largest rock (MP). The Tongue Twister Wall anchor hosted the first high-line in Thailand (PDF).',
      'PDF warnings: Car Jack has loose rock and a dangerous swing on climb B (marked DANGER!!); at The Watchtower "a fall will be deadly" getting to and at the base.',
    ],
    sectors: [
      { name: 'De-Vine Wall', note: 'Friendly introduction wall, shade all day' },
      { name: 'Eagle Wall', note: "Steeper lines; Charly's Crack and I Got a Feeling are the two classics (PDF)" },
      { name: 'Low Bulge', note: '4 top-ropes, best before 11:30 (PDF)' },
      { name: 'Sairee Face', note: 'Good Morning Koh Tao, Smeartastic, Sairee Pull (PDF)' },
      { name: 'Two Face Wall', note: 'Return of the Ent Wife, Under Klingon (PDF)' },
      { name: 'Shady Crack', note: 'Easy crack, always in the shade (PDF)' },
      { name: "Quit Your'e Bitchin'", note: 'Naughty or Nice, The Bitch in Me (PDF)' },
      { name: 'Tongue Twister Wall', note: 'Overhanging; first high-line anchor in Thailand (PDF)' },
      { name: 'Car Jack', note: '28 m wall; loose-rock and swing warnings (PDF)' },
      { name: 'The Watchtower', note: '"A fall will be deadly" at the base (PDF); multipitch starts here' },
      { name: 'Lower Fraggle', note: 'Jungle shade all day (PDF)' },
    ],
    highlight: 'Main sport venue',
    tags: ['sport', 'toprope', 'multipitch', 'beginner-friendly', 'all-day'],
    coords: { lat: 10.09812, lng: 99.84185 },
    routeCount: '26 routes on Mountain Project (area text says ~35); Goodtime PDF: 18 sport routes + 14 TR anchors with 20 routes; theCrag snippet claims 44 (unverified)',
    bestSeason: 'Year-round',
    verified: "Routes, GPS and the 100 THB fee confirmed by the 2026-08-02 Mountain Project scrape and the Goodtime PDF (p8 attention box, verified 2026-08). Legacy-draft route names (Morning Glory, High Noon, Sunset Boulevard, 'Fraggle Rock' 6a+) matched no fact-checked source and were removed 2026-08-04.",
  },
  {
    slug: 'jansom-bay',
    name: 'Jansom Bay',
    area: 'South coast',
    styles: ['sport', 'toprope'],
    grades: '5c–7a+',
    sun: 'Morning shade, oven by noon (sun from ~11:30 per MP)',
    approach: 'Ride south toward Jansom Bay / Jamahkiri, then rock-hop past the abandoned huts on the north side of the beach',
    access: 'Private property — resort area, be a good guest; pay the beach office and let them know what you are doing (Goodtime PDF p5)',
    accessFee: 'Pay the Jansom Bay beach office (Goodtime PDF p5); MP reports 100 THB beach entry via Sensi Paradise / Charm Churee',
    summary:
      'Seaside crag right on the water, developed by Goodtime Adventures. Climb in the morning, snorkel the bay at lunch — the quintessential Koh Tao day.',
    details: [
      'The wall bakes around noon; the plan is climb → mask and fins → evening session at Golden View.',
      'Big seaside cliffs of 25–30 m+ close to Mae Haad (MP). Mornings only — sun hits from 11:30 (PDF).',
      'Near Jamahkiri resort — be a good guest; buy a drink, keep it clean.',
      'Near-coast hardware: verify bolt condition before trusting (Thaitanium rebolting context).',
      "Real hard lines per MP: Grunt Force Trauma (7a) and Trauma Extension (7a+); the Goodtime PDF adds Xico's Ascent (5c) and Good Intentions (6b+).",
    ],
    highlight: 'Climb + snorkel',
    tags: ['sport', 'seaside', 'morning'],
    coords: { lat: 10.07995, lng: 99.81574 },
    routeCount: '5 routes on Mountain Project; Goodtime PDF lists 6 routes (6a and above)',
    bestSeason: 'Nov–Apr (legacy draft); mornings year-round',
    verified: "GPS and routes confirmed by MP 2026-08-02. Legacy-draft route names (Tufa King, Coastal Drift, Grunt Force P1/P2, Sea Spray) matched no fact-checked source and were removed 2026-08-04. Legacy-draft GPS was ~4 km off; MP coordinates preferred.",
  },
  {
    slug: 'tanote-bay',
    name: 'Tanote Bay',
    area: 'East coast',
    styles: ['sport', 'trad', 'multipitch', 'toprope'],
    grades: '4c–6b+ (roped, MP) · Font 4–7C+ bouldering (27crags Tanote Beach)',
    sun: 'Morning sun, shade by late afternoon',
    approach: '10–15 min by taxi/motorbike from Mae Haad; navigate to Poseidon Resort or Jah Bar — steep curvy road at the end',
    access: 'Open; some sub-crags sensitive — ask the Climbing Club',
    summary:
      "The island's most complex venue: crags stacked from the water's edge to a summit pinnacle, linkable as exploration-style multi-pitches with a jungle feel.",
    details: [
      'Good-quality sport and trad — slabs and splitter cracks. Tape gloves are effectively mandatory for the cracks.',
      'Some routes can only be reached by climbing other routes first; the Rakkup guide is realistically required.',
      'Also in the bay: Tao Tower (near Tanote Goodview Resort) and Phillips Secret Spot — contact the Koh Tao Climbing Club.',
      'After climbing: one of the island’s best snorkel spots, plus the famous jumping rock.',
    ],
    sectors: [
      { name: 'Poseidon', note: "At the water's edge" },
      { name: 'Jah Crag' },
      { name: 'Layer Cake' },
      { name: 'Tanote Pinnacle', note: 'Top of the hill; reported best pitch of the linkup' },
    ],
    highlight: 'Multi-pitch linkups',
    tags: ['sport', 'trad', 'multipitch', 'adventure'],
    coords: { lat: 10.08396, lng: 99.84697 },
    routeCount: '12 routes on Mountain Project (all sub-areas); 35 boulder problems on 27crags (Tanote Beach); theCrag snippet claims 68 (unverified)',
    bestSeason: 'Nov–Apr (legacy draft)',
    verified: 'Sub-crag order, multipitch linkup and bolt warnings confirmed by MP 2026-08-02; MP deep scrape added the Poseidon/Jah Crag/Layer Cake/Tanote Pinnacle route lists 2026-08-04. MP keeps two Tanote Bay area pages — 123981447 is the maintained one. Legacy-draft route names (Poseidon Adventure, Neptune’s Trident, Tanote Tower, Sea Crack, Slab Happy, Jah Bless) matched no fact-checked source and were removed 2026-08-04; legacy-draft GPS was ~4.5 km off (MP coordinates preferred).',
  },
  {
    slug: 'lang-khai',
    name: 'Lang Khai',
    area: 'South side, near Chalok Baan Kao Bay',
    styles: ['sport', 'trad', 'toprope', 'boulder'],
    grades: '5c–6b+ (roped, MP); bouldering to 7B (27crags)',
    sun: 'Afternoon venue',
    approach: '~15 min by bike / 25 min by taxi from Sairee; park and walk in through Yang’s Bungalows',
    access: 'Open — free; near Chalok Baan Kao Bay',
    summary:
      'One of the less-frequently climbed but most beautiful and unique crags on the island — and home of the must-do classic Swooping Seabirds.',
    details: [
      'The classic afternoon objective after a morning at Mek’s Mountain.',
      'Quiet atmosphere compared to the main venues — a good pick on busy days.',
      'Avoid Nov–Dec: monsoon waves can swamp the belay areas (MP).',
      'The Goodtime PDF recommends a guide until the area is better mapped.',
      "27crags (Yang topo) calls out the bay's Tantalis (7B) as 'one of the island's king lines' and its bloc as the most beautiful on the island.",
    ],
    highlight: 'Hidden gem',
    tags: ['sport', 'quiet', 'afternoon'],
    coords: { lat: 10.08016, lng: 99.8475 },
    routeCount: '10 routes on Mountain Project; 35 boulder problems on 27crags (Yang = Lang Khai bay); theCrag snippet claims 80 (unverified)',
    bestSeason: 'Year-round except the Nov–Dec monsoon peak (MP)',
    verified: 'MP routes confirmed 2026-08-02. The vault classic Swooping Seabirds (6b) is not listed on MP — grade unverified. Legacy-draft route list (Turtle Power, King Cobra, Monkey Business, Thai Spice, Mango Sticky) matched no fact-checked source and was removed 2026-08-04; legacy-draft GPS was ~1.8 km off (MP coordinates preferred).',
  },
  {
    slug: 'golden-view',
    name: 'Golden View',
    area: 'Koh Tao',
    styles: ['sport', 'toprope'],
    grades: '1+–7b+ (MP)',
    sun: 'Evening / sunset; shade and a reliable breeze',
    approach: 'At the Golden View viewpoint (popular sunset spot); legacy draft: 10–20 min steep hike from The Bunker',
    access: 'Open — designated area at the viewpoint; steep paved road (legacy draft)',
    summary:
      'The sunset crag. Standard plan: bake out of Jansom Bay at noon, rest, then finish the day here watching the sun drop over the horizon.',
    details: [
      'Evening light on the granite is the draw; many technical short routes with a nice breeze (MP).',
      'MP reports “Mostly Thaitanium bolted routes!” — good current bolt condition.',
      'Bolted by Rock Junkie and Climbing Project; rebolted and extended by Evasion Koh Tao (theCrag snippet). Do not remove any fixed hardware.',
      'Verify hardware condition near the coast anyway.',
    ],
    highlight: 'Sunset sessions',
    tags: ['sport', 'sunset', 'evening'],
    coords: { lat: 10.0786, lng: 99.83768 },
    routeCount: '6 routes on Mountain Project; theCrag snippet claims 31 (unverified)',
    bestSeason: 'Year-round — shade and breeze (legacy draft; MP confirms the breeze)',
    verified: 'MP data confirmed 2026-08-02, including good bolt condition. Legacy-draft route names (Whale of a Time, Big C, Titanium Classic, Old Lady, Schwarz, The Edge) matched no fact-checked source and were removed 2026-08-04; legacy-draft GPS was ~1.8 km off (MP coordinates preferred).',
  },
  {
    slug: 'machetey-mountain',
    name: 'Machetey Mountain',
    area: 'Central Koh Tao (MP)',
    styles: ['sport', 'trad', 'toprope'],
    grades: '5a–8a (MP)',
    sun: 'Unknown — less-documented crag',
    approach: 'Less-documented — check the Rakkup guide or ask Goodtime Adventures',
    access: 'Private land; fees of 100–200 THB typical (MP)',
    summary:
      "A significant Mountain Project-documented sport crag holding the island's hardest listed sport routes — Realization (8a) and Top surprise (7c+).",
    details: [
      '13 routes on MP from 5a to 8a, mostly sport/TR.',
      'Not covered by the vault or the legacy draft — treat approach and access details as less-documented.',
    ],
    highlight: "Island's hardest sport routes",
    tags: ['sport', 'hard-grades', 'less-documented'],
    coords: { lat: 10.07929, lng: 99.82194 },
    routeCount: '13 routes on Mountain Project',
    bestSeason: 'Year-round per island norm (unverified)',
    verified: 'Exists only in Mountain Project data (scraped 2026-08-02); no vault or legacy-draft coverage.',
  },
  {
    slug: 'mao-rock',
    name: 'Mao Rock',
    area: 'Island interior (Laem Thian side)',
    styles: ['trad', 'toprope'],
    grades: '5–7a (vault, unverified)',
    sun: 'Morning venue',
    approach: 'Jungle hike on an old road; downhill in, uphill out (~30 min from the Hin Wong / Laem Thian junction per the PDF)',
    access: 'Open; top access easy but requires trad/natural-anchor skills (Goodtime PDF)',
    summary:
      "Koh Tao's trad venue, reached by a beautiful jungle hike on an old road. Lines demand big gear — cams up to 6 inches.",
    details: [
      'Few travelers carry a rack this big, which is why island trad stays the domain of the dedicated.',
      'Classic trad day: morning here, afternoon multi-pitch exploring at Tanote Bay.',
      'Bring plenty of water — jungle hiking in 30 °C+ humidity both ways.',
      'Other Laem Thian jungle climbs nearby are very overgrown (Goodtime PDF).',
    ],
    highlight: 'Trad + jungle',
    tags: ['trad', 'jungle', 'big-cams'],
    routeCount: '6 routes on the Goodtime PDF Laem Thian Jungle map (incl. Drink more 6b and Come on Dave!! 6b, both 30 m); no public list on MP/27crags',
    bestSeason: 'Year-round (unverified)',
    verified: 'Part of the Laem Thian area per the Goodtime PDF (jungle map, verified 2026-08); theCrag lists a "Mao Rock crag" under Koh Tao (snippet). Grades 5–7a from the vault remain unverified.',
  },
  {
    slug: 'shark-island',
    name: 'Shark Island',
    area: 'Island off the southeast coast',
    styles: ['trad'],
    grades: '4–5c (Goodtime PDF)',
    sun: 'Exposed island (unverified)',
    approach: 'Boat needed — details unverified',
    access: 'Natural anchors only — no bolts (Goodtime PDF)',
    summary:
      'A small island off the southeast coast with a handful of trad lines on natural anchors — an adventure outing rather than a cragging destination.',
    details: [
      'Mountain Project lists a single route: Hitchcocks Revenge (5a, trad/TR).',
      'The Goodtime PDF records 5 trad routes, 4 to 5c, natural anchors only.',
      'A community report mentions crumbly coastal rock and nesting birds in May/June — verify locally before going.',
    ],
    highlight: 'Boat-access trad',
    tags: ['trad', 'island', 'boat-access', 'less-documented'],
    coords: { lat: 10.06176, lng: 99.84514 },
    routeCount: '1 route on Mountain Project; Goodtime PDF lists 5',
    bestSeason: 'Unverified; avoid the May/June nesting season per community report',
    verified: 'Only one MP route plus Goodtime PDF mentions (2026-08-02); boat access details unverified.',
  },
  {
    slug: 'sairee-beach-boulders',
    name: 'Sairee Beach Boulders',
    area: 'Sairee Beach',
    styles: ['boulder', 'toprope'],
    grades: 'V0–V4 (vault); TR 4c–7a and bouldering 3–7A (MP/27crags)',
    sun: 'Exposed beach — climb early/late',
    approach: '5–10 min; walk to Sandbar Restaurant, Sairee Beach',
    access: 'Open — free, in front of Sandbar Restaurant',
    summary:
      'Beach bouldering in the middle of Sairee Beach, dominated by The Elephant — a big boulder directly in front of Sandbar Restaurant. Zero approach, sunset sessions, dinner 20 m away.',
    details: [
      'The Elephant has bolts on top for top-roping the beach-side routes (3-bolt anchor per the PDF; a short rope may be needed — ask Goodtime).',
      'Problems on all four sides: flakes, Yu’s Jam Crack, blunt arêtes, twin cracks, and up the nose facing the beach.',
      '27crags adds the North Sairee beach boulders (Sun God Traverse 6C, Suffer for the Children 7A) and two DWS lines.',
      'Sand landings are friendly; pads optional. Some coastal blocs only doable at low tide (27crags).',
    ],
    highlight: 'Zero-approach beach blocs',
    tags: ['boulder', 'beach', 'sunset'],
    coords: { lat: 10.09285, lng: 99.82758 },
    routeCount: '5 top-rope lines on MP; 16 boulder + 2 DWS on 27crags; Goodtime PDF lists 12 Elephant + 10 North Sairee problems',
    bestSeason: 'Year-round; tide-dependent for the coastal blocs (27crags)',
    verified: "The Elephant confirmed by MP and theCrag. Yu's Jam Crack carries a three-way grade conflict (5c top-rope / 5b trad / V1 boulder) — see routes.ts.",
  },
  {
    slug: 'secret-garden-boulders',
    name: 'Secret Garden Boulders',
    area: 'Behind the hills at the back of Sairee Beach (MP/27crags)',
    styles: ['boulder'],
    grades: 'Font 3–8A+ (27crags)',
    sun: 'Jungle shade helps; still humid',
    approach: '3–10 min on foot from the back of Sairee Beach',
    access: 'Open — free; keep noise down near the bungalows (long-term residents)',
    summary:
      "The island's classic jungle boulder field, documented since the Zen Gecko era. Home of James and the Giant Peach (8A+ / V11) and 50+ catalogued problems.",
    details: [
      '27crags sectors: Bizarro, Cresteando, Spaceship, Filo, Tortilla, Pez, View, Tortuga, Culo, James, Hug, Placa Madre.',
      'Named blocs from the free PDF guide: The Tombstone, The Egg, Spaceship, Letterbox, Stacking Boxes, Pancake Ninja, James and the Giant Peach.',
      'Landings vary — bring pads and a spotter; rentals via The Bunker or Goodtime Adventures.',
    ],
    sectors: [
      { name: 'Lower Secret Garden', note: 'The Tombstone, The Egg (PDF)' },
      { name: 'Main sector', note: 'Courtyard warm-ups, Pancake Ninja, James and the Giant Peach' },
      { name: 'Upper Secret Garden', note: 'I Just Need a Hug, Kit Kat, Groovy (PDF)' },
    ],
    highlight: 'Classic jungle bouldering',
    tags: ['boulder', 'jungle', 'classic'],
    coords: { lat: 10.09554, lng: 99.83484 },
    routeCount: '54 problems on 27crags; 2 on Mountain Project; Goodtime PDF maps 65 with 100s more unmapped',
    bestSeason: 'Year-round (morning shade)',
    verified: "Location conflict: the vault says 'Tanote Bay / Aow Leuk side' while MP GPS, 27crags and the legacy draft all place it behind Sairee Beach — MP coordinates preferred.",
  },
  {
    slug: 'babaloo-boulders',
    name: 'Babaloo Boulders',
    area: 'Chalok Baan Kao — boulders at the water’s edge (27crags)',
    styles: ['boulder'],
    grades: 'Font 4–8A (27crags)',
    sun: 'Mixed',
    approach: 'Motorbike + walk',
    access: 'Open — verify current state locally; some boulders only doable at low tide',
    summary:
      'Zen Gecko-era bouldering area from the old free PDF guide, re-documented on 27crags: seaside granite with sandstone stripes, up to the 8A namesake bloc Babaloo.',
    details: [
      '27crags hardest: Babaloo 8A, Dieguer Way 7B, Ihasia 7B. Aggressive granite with sandstone stripes — check tides.',
      'Named lines on the verified Matt Pierson 2010 topo (Goodtime PDF): Apache V5, Buddha Corner V3, Sunrise to Buddha V3 (great highball), Cheese Grater V2, Shrimp V4, Classic Refinement V5, Amitibar V5, Faze Action V4, Trancidnetal Breakfast V5 (sic), Eye of the whale clam V3, Buds V2.',
      'The Zen Gecko-era names once listed here (Check Dee, Het Mao, Vision Quest) actually belong to the Frontyard/Backyard per the PDF — see Backyard & Frontyard.',
      'The old guide (v6/11) predates the 27crags topo — cross-check condition and access with the Koh Tao Climbing Club or The Bunker before a dedicated session.',
    ],
    highlight: 'Old-school seaside blocs',
    tags: ['boulder', 'historic', 'seaside'],
    routeCount: '21 problems on 27crags; Goodtime PDF maps 40',
    bestSeason: 'Tide-dependent — low tide for the water’s-edge boulders (27crags)',
    verified: '27crags (21 problems, topo by Thai-Climb) vs Goodtime PDF (40 mapped) — full extent unverified. Zen Gecko-era names appear in no current database.',
  },
  {
    slug: 'backyard-frontyard',
    name: 'Backyard & Frontyard',
    area: 'Coconut plantations off the Tanote Bay / Aow Leuk road',
    styles: ['boulder'],
    grades: 'Font 4–8B (27crags)',
    sun: 'Plantation shade, humid',
    approach: 'Backyard to the left, Frontyard right up over the hill; 3–10 min walk-in',
    access: 'Private plantations — owners ask you to buy drinks at the Koh Tao Info shop; a small donation to the Koh Tao school is appreciated (Goodtime PDF)',
    accessWarning: "A UKC logbook snippet reports 'Climbs are no longer climbable' at Frontyard and Backyard (partially-verified — snippet only, ukclimbing.com blocks fetches; consistent with older reports of boulders lost to resort development) — verify locally before a dedicated trip",
    summary:
      "The island's largest documented boulder field: 68 problems on 27crags up to The Lost Idol (8B), spread through the coconut plantations on the way to Tanote Bay.",
    details: [
      '27crags hardest: The Lost Idol 8B, Catalonia is not Spain 8A+, Big Brother 8A, Heriotza 7C.',
      'Mountain Project separately lists the Backyard and Frontyard boulders plus the Golden Slab and Big Brother Slab sport crags.',
      'The Goodtime PDF maps 42 Backyard + 55 Frontyard problems — the area has been climbed for two decades.',
    ],
    highlight: '68+ catalogued problems',
    tags: ['boulder', 'plantation', 'classic'],
    coords: { lat: 10.08029, lng: 99.82863 },
    routeCount: '68 problems on 27crags; Goodtime PDF maps 97 across both yards; MP lists 6 boulders + 10 slab routes',
    bestSeason: 'Year-round',
    verified: '27crags routelist fetched 2026-08-02. MP splits the zone into Backyard, Frontyard, Golden Slab and Big Brother Slab sub-areas.',
  },
  {
    slug: 'golden-slab',
    name: 'Golden Slab',
    area: 'Back of Sairee Beach — MP sub-area of the Backyard zone',
    styles: ['sport', 'toprope'],
    grades: '5c–6c+ (MP)',
    sun: 'Unknown — less-documented crag',
    approach: 'Less-documented — see the Rakkup guide',
    access: 'Less-documented — ask the Koh Tao Climbing Club',
    summary:
      'A short sport/TR slab documented on Mountain Project with five routes from 5c to 6c+; not covered by the vault.',
    details: [
      'MP routes include chris loves cleaning crack (6c), swampdonkey (6c+) and Taku (6c).',
      'MP lists it as its own area inside the Backyard/Frontyard plantation zone.',
    ],
    highlight: 'Short slab sport',
    tags: ['sport', 'slab', 'less-documented'],
    routeCount: '5 routes on Mountain Project',
    bestSeason: 'Year-round (unverified)',
    verified: 'Mountain Project data only (2026-08-02); no vault or legacy-draft coverage.',
  },
  {
    slug: 'big-brother-slab',
    name: 'Big Brother Slab',
    area: 'Back of Sairee Beach — MP sub-area of the Backyard zone',
    styles: ['sport', 'toprope'],
    grades: '5c–6a+ (MP)',
    sun: 'Unknown — less-documented crag',
    approach: 'Less-documented — see the Rakkup guide',
    access: 'Less-documented — ask the Koh Tao Climbing Club',
    summary:
      'The second MP-documented sport slab in the Backyard zone: five routes from 5c to 6a+, including the photographed Drunken Yorkshireman (6a+).',
    details: [
      'MP routes include drunken yorkshireman (6a+), squirrel war (6a+) and wavey (6a).',
      'Ryan Senko following Drunken Yorkshireman is one of the Rakkup guide release photos (see the report gallery).',
    ],
    highlight: 'Drunken Yorkshireman',
    tags: ['sport', 'slab', 'less-documented'],
    routeCount: '5 routes on Mountain Project',
    bestSeason: 'Year-round (unverified)',
    verified: 'Mountain Project data only (2026-08-02); exact location unverified — grouped under the Backyard zone by MP.',
  },
  {
    slug: 'banana-rock',
    name: 'Banana Rock',
    area: 'Unverified — documented only on 27crags',
    styles: ['boulder'],
    grades: 'Font 3+–6B+ (27crags)',
    sun: 'Unverified',
    approach: 'Unverified — the 27crags topo is paywalled',
    access: 'Unverified',
    summary:
      'A bouldering crag documented only on 27crags: 11 problems up to 6B+ with Italian-flavored names, in sectors like Trio, The Boat and Tide.',
    details: [
      'Hardest listed: Finalmente 6B+ and Mia lí! Due Giazú Berfutt 6B+.',
      'Location could not be verified from accessible text — ask locally before hunting for it.',
    ],
    highlight: '27crags-only find',
    tags: ['boulder', 'less-documented', 'unverified'],
    routeCount: '11 problems on 27crags',
    bestSeason: 'Unverified',
    verified: 'Only 27crags data (fetched 2026-08-02); location and access unverified.',
  },
  {
    slug: 'coffee',
    name: 'Coffee',
    area: 'Unverified — documented only on 27crags',
    styles: ['boulder'],
    grades: 'Font 3–6C+ (27crags)',
    sun: 'Unverified',
    approach: 'Unverified — the 27crags topo is paywalled',
    access: 'Unverified',
    summary:
      'A bouldering crag documented only on 27crags: 16 problems up to 6C+ across the Terrace, Acquarius, House and DragonBall sectors.',
    details: [
      'Hardest listed: Mirino 6C+ and Capitan Ventosa 6C.',
      "27crags calls Coffee the area with 'the absolute most potential... an avalanche of boulders along the coast', while warning that access is not very convenient.",
      'Location could not be verified from accessible text — ask locally before hunting for it.',
    ],
    highlight: '27crags-only find',
    tags: ['boulder', 'less-documented', 'unverified'],
    routeCount: '16 problems on 27crags',
    bestSeason: 'Unverified',
    verified: 'Only 27crags data (fetched 2026-08-02); location and access unverified.',
  },
  {
    slug: 'temple-rock',
    name: 'Temple Rock',
    area: 'Central Koh Tao (MP coordinates)',
    styles: ['sport'],
    grades: "Unverified — holds 'the hardest route on Koh Tao' (rakkup)",
    sun: 'Unverified',
    approach: 'Unverified — see the rakkup guide (Temple Rock sector)',
    access: 'Unverified — ask the Koh Tao Climbing Club',
    summary:
      "Confirmed sport crag with its own sector in the rakkup digital guidebook: 'Temple Rock holds the hardest route on Koh Tao as well as possibility for some...' (paywalled). Indexed route names: Chilled Monkey Brains, Monks in the Gym (open project) and El Templo.",
    details: [
      'theCrag index snippet: "Temple Rock crag. All Sport climbing · 9 · ... 16m" — 9 routes around 16 m (search snippet, unverified; theCrag blocks scripted fetches).',
      'Mountain Project has a Temple Rock area page but it lists zero routes.',
      "rakkup also references 'The Edge' as a Koh Tao climb — crag assignment unverified.",
    ],
    highlight: "Island's hardest route (per rakkup)",
    tags: ['sport', 'hard-grades', 'less-documented'],
    coords: { lat: 10.09255, lng: 99.83696 },
    routeCount: '9 routes per theCrag snippet (unverified); rakkup sector with named routes; MP area page empty',
    bestSeason: 'Unverified',
    verified: 'Confirmed as a climbing spot 2026-08-04: rakkup guidebook sector + theCrag index snippet + MP area page. Route-level detail is paywalled (rakkup) or snippet-only (theCrag).',
  },
  {
    slug: 'flyin-high',
    name: "Flyin' High",
    area: 'Unverified — theCrag page blocked',
    styles: ['sport'],
    grades: '6a+–6c (theCrag snippet, unverified)',
    sun: 'Unverified',
    approach: 'Unverified',
    access: 'Unverified',
    summary:
      'A small sport crag known only from a theCrag search snippet: 6 routes from 6a+ to 6c, reportedly all titanium glue-in bolts with ramshorn lower-offs.',
    details: ['Route names unavailable — theCrag returns 403 to scripted fetches; data comes from a search-engine snippet.'],
    highlight: 'Reportedly all-titanium hardware',
    tags: ['sport', 'unverified'],
    routeCount: '6 routes per theCrag snippet (unverified — page 403-blocked)',
    bestSeason: 'Unverified',
    verified: 'Unverified: theCrag area page 403-blocked; all data from a search snippet (2026-08-02).',
  },
  {
    slug: 'laem-thian',
    name: 'Laem Thian',
    area: 'Laem Thian, east-coast jungle',
    styles: ['trad', 'toprope'],
    grades: '5b–6c+ (Goodtime PDF)',
    sun: 'Jungle shade (unverified)',
    approach: '~30 min hike from the Hin Wong / Laem Thian road junction; resort closed, road overgrown',
    access: 'Resort closed — the Goodtime PDF strongly advises going only with a GTA guide',
    accessWarning: 'Access degraded since the Laem Thian resort closed: road overgrown, 30 min hike in; jungle climbs very overgrown (Goodtime PDF, v1/14 — verify current state locally)',
    summary:
      'Confirmed jungle top-rope/trad area. Goodtime PDF: a coast sector (2 TR anchors, 4 short routes 5b–6c, beginner area) and a jungle sector (5 TR anchors, 8 routes to 6c+). Mao Rock is part of this area.',
    details: [
      'Mao Rock sits close to the road and is the practical entry point — named routes on the PDF jungle map: Drink more (6b, 30 m) and Come on Dave!! (6b, 30 m).',
      'theCrag lists "Leam Thian Coast" (top roping and trad, ~4 routes — search snippet, unverified) and a "Mao Rock crag" under Koh Tao.',
      'The PDF is v1/14 — heavily outdated; verify everything on the ground.',
    ],
    highlight: 'Jungle exploration',
    tags: ['trad', 'toprope', 'jungle', 'unverified'],
    routeCount: 'Goodtime PDF: 4 coast + 8 jungle routes (v1/14, outdated); theCrag snippet: ~4 coast routes (unverified)',
    bestSeason: 'Unverified',
    verified: 'Confirmed as a climbing spot 2026-08-04 (theCrag snippet + Goodtime PDF); current state unverified — access degraded since the resort closed.',
  },
  {
    slug: 'koh-nang-yuan',
    name: 'Koh Nang Yuan',
    area: 'Islet off Sairee Beach',
    styles: [],
    grades: 'Unverified',
    sun: 'Unverified',
    approach: 'Boat from Sairee',
    access: "Restricted — Goodtime PDF: 'Access is terrible!!'; routes effectively GTA-guided only",
    accessWarning: 'Routes exist per the Goodtime PDF but are operator-private (GTA clients only); private island with its own entry fee and strict rules',
    summary:
      'The postcard islet off Sairee. The Goodtime PDF records climbing here but keeps the details for guided clients — treat it as restricted and ask Goodtime Adventures.',
    details: [
      'No public route database entries on MP, theCrag (accessible parts) or 27crags (all slug variants 404, checked 2026-08-04).',
      'No evidence of deep-water-soloing here: the PDF does not call the routes DWS, and no DWS mention was found anywhere (2026-08-04 search) — any "Koh Nang Yuan DWS" claim is unverified. The PDF even warns DWS is generally not an option around Koh Tao (sharp oysters at the water\'s edge).',
    ],
    tags: ['unverified', 'restricted'],
    routeCount: 'Routes exist per the Goodtime PDF but are not publicly listed',
    bestSeason: 'Unverified',
    verified: 'Routes EXIST per one source (Goodtime PDF v1/14) but are operator-private; absent from all public route databases (checked 2026-08-04). Unverified whether any climbing is currently permitted.',
  },
  {
    slug: 'tao-tower',
    name: 'Tao Tower',
    area: 'Near Tanote Goodview Resort, Tanote Bay (reported, unverified)',
    styles: ['sport', 'multipitch'],
    grades: 'Unverified',
    sun: 'Unverified',
    approach: 'Near Tanote Goodview Resort — contact the Koh Tao Climbing Club',
    access: 'Sensitive — contact the Koh Tao Climbing Club',
    accessWarning: 'Reported crag with no data in any fact-checked source (MP/theCrag/27crags/PDF) — verify existence and access through the Koh Tao Climbing Club before going',
    summary:
      'A granite tower near Tanote Goodview Resort reported by the vault and the legacy draft — sensitive access, go through the Koh Tao Climbing Club. No route data exists in any fact-checked source.',
    details: [
      "The legacy draft's route names (Tower of Power, Tao Rising, Goodview Direct) matched no fact-checked source and were removed 2026-08-04 as likely fabrications.",
      'Mentioned in the vault as a Tanote Bay sub-crag requiring Climbing Club contact.',
      'Coordinates below are the legacy draft\'s own (10.1230, 99.8530) — the draft\'s other GPS points were kilometres off, so treat them as indicative only.',
    ],
    highlight: 'Tower climbing',
    tags: ['sport', 'multipitch', 'tower', 'unverified'],
    coords: { lat: 10.123, lng: 99.853 },
    routeCount: 'No route data in any fact-checked source (legacy draft claimed 12 — fabricated metadata removed)',
    bestSeason: 'Unverified',
    verified: 'Reported, unverified: legacy draft + vault mention only; no MP/theCrag/27crags/PDF data. Coordinates restored to the legacy draft\'s own value (the site previously mixed in Phillips Secret Spot\'s latitude).',
  },
  {
    slug: 'phillips-secret-spot',
    name: 'Phillips Secret Spot',
    area: 'Tanote Bay area — exact location withheld (reported, unverified)',
    styles: ['sport'],
    grades: 'Unverified',
    sun: 'Unverified',
    approach: 'Contact the Koh Tao Climbing Club for directions',
    access: 'Sensitive — contact the Koh Tao Climbing Club',
    accessWarning: 'Reported crag with no data in any fact-checked source — intentionally low-profile; go through the Koh Tao Climbing Club',
    summary:
      'A secluded sport crag near Tanote Bay whose access runs through the Koh Tao Climbing Club — intentionally low-profile. No route data exists in any fact-checked source.',
    details: [
      'The legacy draft\'s route names (Secret Agent, Hidden Treasure, Top Secret — an obvious themed set) matched no fact-checked source and were removed 2026-08-04 as likely fabrications.',
      'Appears in the vault as "Phillips Secret Spot" and in the legacy draft as "Phillipe\'s Secret Spot" — spelling unreconciled.',
      'Legacy-draft coordinates dropped: the draft\'s GPS points are demonstrably unreliable (1.8–4.5 km off on the verifiable crags).',
    ],
    highlight: 'Secluded',
    tags: ['sport', 'secluded', 'unverified'],
    routeCount: 'No route data in any fact-checked source (legacy draft claimed 9 — fabricated metadata removed)',
    bestSeason: 'Unverified',
    verified: 'Reported, unverified: legacy draft + vault mention only; no fact-checked data. Coordinates dropped (legacy GPS demonstrably unreliable).',
  },
  {
    slug: 'the-peak-boulders',
    name: 'The Peak Boulders',
    area: 'Hill above Chalok Baan Kao (Goodtime PDF)',
    styles: ['boulder'],
    grades: "Zen Gecko letters E–H (PDF); 16 mapped problems",
    sun: 'Exposed hilltop (unverified)',
    approach: 'Visible from the Aukotan market; rocky, sandy road up — experienced riders only (PDF)',
    access: 'Unverified',
    accessWarning: 'Difficult access road; PDF-only area (v6/11) — verify locally',
    summary:
      "Hilltop boulder group overlooking Chalok Baan Kao from the Goodtime PDF: 16 mapped problems including Pete's arete (MH), Nak Lung Noi (MH), Crimpology (H) and Long live the Buddha (MH).",
    details: ['Grades read from the topo image by classification — unverified against the artwork.'],
    tags: ['boulder', 'less-documented', 'unverified'],
    routeCount: '16 mapped problems per the Goodtime PDF (8 partially legible on the topo)',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
  {
    slug: 'sai-tong',
    name: 'Sai Tong',
    area: 'Jungle off Sai Tong beach (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'Zen Gecko letters E–H (PDF); 25 mapped problems',
    sun: 'Jungle (unverified)',
    approach: 'Trail north from Sai Tong beach or south from Charm Churee; new construction in the area (PDF)',
    access: 'Unverified',
    accessWarning: 'New construction reported in the area (PDF v6/11) — access may have changed; verify locally',
    summary:
      "Jungle boulders originally mapped 'by Chris Sharma and some of his mates' (PDF): 25 mapped problems, with Return of the Jeddi (H) and Hels's arete (M) named on the topo.",
    details: ['Grades read from the topo image by classification — unverified against the artwork.'],
    tags: ['boulder', 'less-documented', 'unverified', 'historic'],
    routeCount: '25 mapped problems per the Goodtime PDF (3 partially legible on the topo)',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
  {
    slug: 'fruit-bowl',
    name: 'Fruit Bowl',
    area: 'Central Sairee, opposite Sairee Cottage (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'Zen Gecko letters E–H + projects (PDF); 20 mapped problems',
    sun: 'Shade all day (PDF)',
    approach: 'On the jungle side of the main road opposite Sairee Cottage',
    access: 'Land owned by the Sairee Cottage family (PDF) — ask first',
    summary:
      'Small in-town boulder cluster from the Goodtime PDF: 20 mapped problems in all-day shade, one very large boulder with a fixed rope to the top. Mapped by Jed, Spider, Steve and Ryan, March 2010.',
    details: ['Individual line names are not printed in the PDF text layer; grades on the topo read by classification — unverified.'],
    tags: ['boulder', 'in-town', 'less-documented', 'unverified'],
    routeCount: '20 mapped problems per the Goodtime PDF',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
  {
    slug: 'hin-wong-hills',
    name: 'Hin Wong Hills',
    area: 'Road toward Hin Wong Bay (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'Zen Gecko letters VE–MH + projects (PDF); 14 mapped problems',
    sun: 'Little shade (PDF)',
    approach: 'After the Mango Bay turnoff, 100 m up a 4wd track (not the concrete road); 3–4 min walk',
    access: 'Unverified; ground can be overgrown — check landings (PDF)',
    summary:
      "East-coast hillside boulders with views, from the Goodtime PDF: 14 problems mapped by Derek Billings 2010, including Pyramid scheme (E) and Beached ez (M); three starred projects with a 'danger bad fall factor' warning on one.",
    details: ['Grades from the PDF text layer (verified); project lines unnamed.'],
    tags: ['boulder', 'less-documented', 'unverified'],
    routeCount: '14 mapped problems per the Goodtime PDF',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
  {
    slug: 'mango-mount',
    name: 'Mango Mount',
    area: 'Remote jungle, north Koh Tao (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'Zen Gecko letters / Font to 6A+ (PDF, partially legible)',
    sun: 'Jungle (unverified)',
    approach: 'Toward Hin Wong Bay, left up to the viewpoint; past Jim Bar and the first viewpoint toll station (without paying), be friendly at the second huts, through the gate; dirt road to the end (PDF)',
    access: 'Pass a family gate — be friendly; you may have to leave bikes (PDF)',
    accessWarning: 'Remote: early start, long drive, plenty of food and water; Ankle Biter rock rough and fragile — care on highballs (PDF)',
    summary:
      'Remote quality boulders in the north of the island from the Goodtime PDF, mapped by Danny Millar and Tom Lloyd 2013: four clusters (Ankle Biter, Hilltop, Tennis Ball, Tower of Power) with names like Bushy Crack, 1 Baht/10 Baht, Sweet Cheeks, Mango Mano and Another Green Traverse (6A+ sit).',
    details: ['Cluster names from the PDF text layer (verified); grades per image classification — unverified.'],
    tags: ['boulder', 'remote', 'adventure', 'less-documented', 'unverified'],
    routeCount: 'Four clusters per the Goodtime PDF (p39–41)',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries. Mango Bay itself is NOT a documented climbing area — this is the developed area near it.',
  },
  {
    slug: 'aow-luek',
    name: 'Aow Luek',
    area: 'Aow Luek beach (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'V0–V4 (PDF topo, Matt Pierson 2010)',
    sun: 'Beach (unverified)',
    approach: 'Aow Luek beach; snorkelling spot',
    access: 'Unverified — a grumpy-local warning is printed on the PDF page',
    accessWarning: 'Grumpy local reported on the PDF page (v6/11) — ask before climbing',
    summary:
      'Beach bouldering from the Goodtime PDF: 11 problems V0–V4 with three-star The Naturalist (V4) and Naturalist Extension (V4), plus Rhythm Splitter (V4), Pinatubo-grade slabs and Fish Supper (V2).',
    details: ['Grades read from the topo image by classification — unverified against the artwork.'],
    tags: ['boulder', 'beach', 'less-documented', 'unverified'],
    routeCount: '10–11 mapped problems per the Goodtime PDF',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
  {
    slug: 'sai-daeng-high-balls',
    name: 'Sai Daeng High Balls',
    area: 'Sai Daeng, near Coral View Resort (Goodtime PDF)',
    styles: ['boulder'],
    grades: 'V0–V2 (PDF topo) — VERY dangerous highballs',
    sun: 'Exposed (unverified)',
    approach: '5-minute boulder hop left from the Coral View Resort; views of Shark Island',
    access: 'Unverified',
    accessWarning: "'VERY dangerous highball bouldering with bad landings... Not recommended for the feint of heart!!' (PDF) — crumbly coastal rock; not for beginners",
    summary:
      'Dangerous coastal highballs from the Goodtime PDF (mapped by Derek Billings, March 2011): ~9 problems V0–V2 with bad landings and exposure above the sea.',
    details: ['Grades read from the topo image by classification — unverified against the artwork.'],
    tags: ['boulder', 'highball', 'dangerous', 'less-documented', 'unverified'],
    routeCount: '~9 problems per the Goodtime PDF',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only (2026-08); no MP/27crags/theCrag entries.',
  },
]

// The vault highlight routes — kept for backwards compatibility with the current UI.
// The full merged 620+ route database with per-source grades and conflict notes is in ./routes.ts.
// Grades below follow the 2026-08-04 audit: conversions shown as 'font (≈ V)', genuine conflicts as 'a/b'.
export const routes: RouteEntry[] = [
  { slug: 'swooping-seabirds', name: 'Swooping Seabirds', grade: '6b', style: 'sport', cragSlug: 'lang-khai', stars: 3, note: 'The must-do classic of Lang Khai — the line that justifies the trip. Grade unverified (vault only).' },
  { slug: 'the-bitch-in-me', name: 'The Bitch in Me', grade: '6b+/6c', style: 'sport', cragSlug: 'meks-mountain', stars: 2, note: "MP route page 6b+; MP area text, the Goodtime PDF and the 2017 Imperial College expedition say 6c — sources conflict." },
  { slug: 'i-got-a-feeling', name: 'I Got a Feeling', grade: '6a/6a+', style: 'sport', cragSlug: 'meks-mountain', stars: 2, note: 'MP and the Goodtime PDF say 6a; the PDF prints a 6a+ variation and the 2017 expedition logged 6a+.' },
  { slug: 'james-and-the-giant-peach', name: 'James and the Giant Peach', grade: '8A+ (≈ V11)', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 3, note: "The island's benchmark hard bloc — same grade in two systems, not a conflict." },
  { slug: 'pancake-ninja', name: 'Pancake Ninja', grade: '7A (≈ V6)', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 2, note: 'Named line in the free PDF bouldering guide — same grade in two systems. Highball & dangerous.' },
  { slug: 'shadows', name: 'Shadows', grade: '6B (≈ V2)', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Mid-grade Secret Garden classic — same grade in two systems.' },
  { slug: 'i-just-need-a-hug', name: 'I Just Need a Hug', grade: '6A (≈ V1)', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Upper Secret Garden warm-up — same grade in two systems.' },
  { slug: 'groovy', name: 'Groovy', grade: 'V1', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Upper Secret Garden boulder 4, V1 as printed in the Goodtime PDF.' },
  { slug: 'yus-jam-crack', name: "Yu's Jam Crack", grade: '5c (MP) / V1 (unverified)', style: 'toprope', cragSlug: 'sairee-beach-boulders', stars: 2, note: "The dividing crack on The Elephant's southern side. MP and the Goodtime PDF (as 'Yu's Yam Crack', sic) say 5c; a V1 boulder grade circulates from the assignment brief — conflicted." },
  { slug: 'vision-quest', name: 'Vision Quest', grade: 'VH (V5+ unverified)', style: 'boulder', cragSlug: 'backyard-frontyard', stars: 2, note: 'Huge dyno to a sloping lip — the old guide’s testpiece. The Goodtime PDF places it in the Frontyard (#10, grade VH), not Babaloo.' },
  { slug: 'check-dee', name: 'Chock Dee (Good Luck)', grade: 'M (V2 unverified)', style: 'boulder', cragSlug: 'backyard-frontyard', stars: 2, note: '“Excellent moves on good rock” per the Zen Gecko guide, which places it on the Frontyard Mini Crag (#1, grade M) — long mis-filed at Babaloo. MP V3 vs 27crags 6A is a genuine conflict.' },
  { slug: 'het-mao', name: 'Het Mao (Magic Mushrooms)', grade: 'MH (V3 unverified)', style: 'boulder', cragSlug: 'backyard-frontyard', stars: 1, note: 'Sit-start crank off a sandstone-like knob — the Zen Gecko/Goodtime PDF places it in the Backyard (#15, grade MH), not Babaloo.' },
]

export const services: Service[] = [
  {
    name: 'Goodtime Adventures',
    role: 'Guiding · Courses · Gear rental',
    since: '2008',
    summary:
      "The island's oldest climbing operation and the driving force behind route development — 200+ routes maintained, 4.9 rating from 1,522 Google reviews. Run by Tim and Charly Severino; also an SSI dive school with a Mae Haad beachfront beach club.",
    bullets: [
      'Discover Rock Climbing half-day from ฿2,600 · Rock 1 Intro to Top Rope 1 day from ฿3,600 · Rock 2 Sport Leading 2 days from ฿6,200',
      'Pathway continues through Rock 5 (trad/multipitch) plus a Rockmaster professional guide-training program',
      'Guide service from ฿2,000 with discounted gear rental (harness ฿100, shoes ฿200, chalk ฿100)',
      'Experienced climbers can rent gear and head out independently',
      'Home crags: Mek’s Mountain and Jansom Bay; climb + dive bundles save 10%',
    ],
    contact: 'Book via the website (vault-listed +66 (0) 80 658 0944 / info@goodtimethailand.com not confirmed on current pages)',
    url: 'https://goodtimethailand.com/climbing/',
    verified: 'Operating status, course pathway and prices verified on goodtimethailand.com, 2026-08-02; phone/email unverified. Owners\' names (Tim and Charly Severino) trace to the Mapo Tapo blog only — unverified against the operator site.',
  },
  {
    name: 'The Bunker',
    role: 'Bouldering gym · Outdoor courses · Hostel',
    since: 'current',
    summary:
      'The one and only indoor climbing/bouldering gym on Koh Tao — with Bunker Cafe and the 24-bed Warehouse Hostel next door; outdoor trips and courses with all equipment included.',
    bullets: [
      'Day pass 250 THB — reported by secondary sources, not confirmed on the operator site',
      'Outdoor beginner trips/courses and toprope coaching, all equipment included',
      'Intermediate lead course → independent climbing skills',
      'Warehouse Hostel 5D4N package: stay + 4 free gym day passes + 15% off the lead course (+10% off the cafe)',
      'The Warehouse Hostel is The Bunker\'s own adjacent 24-bed dorm — not a separate gym (the legacy draft listed a phantom "The Warehouse" gym/shop by conflation)',
      'The practical fallback for rainy days, pad rental, and current beta on crag conditions',
    ],
    contact: '@rockclimbingkohtao',
    url: 'https://kohtao-rockclimbing.com/',
    verified: 'Operating status, gym, courses and the 5D4N package verified 2026-08-02 (package page updated 2025-10-28); the 250 THB day-pass price is not confirmed on the operator site.',
  },
  {
    name: 'Koh Tao Climbing Club',
    role: 'Access & bolting stewardship',
    since: 'community',
    summary:
      "The community steward of climbing on the island. Sensitive access at some crags — ask before exploring; never bolt without the club's permission.",
    bullets: [
      'Contact for sensitive crags (Tao Tower, Phillips Secret Spot…)',
      'Bolting requires club permission',
      'Don’t litter — every crag is somebody’s backyard',
    ],
    contact: 'facebook.com/Climbingkohtao',
    url: 'https://www.facebook.com/Climbingkohtao/',
    verified: "Role confirmed via theCrag's live Koh Tao access/ethics sections, 2026-08-02.",
  },
  {
    name: 'Evasion Koh Tao',
    role: 'Shop · small bouldering wall (unverified)',
    since: 'unverified',
    summary:
      'Listed in the legacy static draft (indoor bouldering wall, kids climbing, shop) and in a 2018 Mountain Project note as the home of the small relocated bouldering wall, primarily for kids. theCrag credits Evasion with rebolting Golden View.',
    bullets: ['Current operating status unverified — no 2026 confirmation found'],
    contact: 'unverified',
    url: 'https://www.mountainproject.com/area/108569570/koh-tao',
    verified: 'Unverified: legacy draft + a January 2018 MP note only.',
  },
]

export const sources = [
  { name: 'Mapo Tapo — Koh Tao rock climbing guide', url: 'https://www.mapotapo.com/blog/koh-tao', used: 'Crag circuit, itineraries, granite, Goodtime/Zen Gecko history' },
  { name: 'theCrag — Koh Tao', url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao', used: 'Access & ethics, gear rental, guidebook listings' },
  { name: 'theCrag — The Elephant', url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao/area/9797417472', used: 'Sairee Beach boulder detail' },
  { name: 'Mountain Project — Koh Tao', url: 'https://www.mountainproject.com/area/108569570/koh-tao', used: 'Area tree, 96 routes (deep scrape 2026-08-04 with FA/length/protection), GPS, bolt warnings' },
  { name: 'Mountain Project — Tanote Bay', url: 'https://www.mountainproject.com/area/123981447/tanote-bay', used: 'Sub-crags, linkups, bolt warnings, sun timing' },
  { name: '27crags — Koh Tao', url: 'https://27crags.com/crags/koh-tao', used: '258 boulder/DWS routes with sectors, tick counts and ratings (deep fetch 2026-08-04)' },
  { name: 'Goodtime Adventures — free PDF guide v1/14', url: 'http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf', used: 'Authoritative print source: 325 route entries, page-to-crag mapping, fees, warnings (research2, 2026-08)' },
  { name: 'Goodtime Adventures — Climbing guidebook page', url: 'https://goodtimethailand.com/climbing-guidebook/', used: "200+ routes; rakkup guide called 'the most up to date resource available' (page updated 2026-07-30)" },
  { name: 'rakkup — Thailand: Koh Tao Rock Climbing (guidebook page)', url: 'https://rakkup.com/guidebooks/thailand-koh-tao-rock-climbing/', used: 'Current edition: 180 routes; Temple Rock sector (hardest route on the island)' },
  { name: 'Rakkup — Koh Tao guide by Kelsey Gray', url: 'https://rakkup.com/koh-tao-thailand-rock-climbing-by-kelsey-gray/', used: 'Current digital guidebook release article, route photos' },
  { name: 'railay.com — free Koh Tao climbing & bouldering PDF', url: 'http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf', used: 'Boulder names/grades, Zen Gecko guide' },
  { name: 'Imperial College — 2017 SE Asia expedition', url: 'https://www.imperial.ac.uk/be-inspired/exploration-board/previous-expeditions/2010s/2017-south-east-asia-climbing/', used: 'Mek’s Mountain route grades' },
  { name: 'Goodtime Adventures — Climbing', url: 'https://goodtimethailand.com/climbing/', used: '200+ routes, Rock 1–5 course pathway and prices (verified 2026-08-02)' },
  { name: 'Goodtime Adventures — Discover Rock Climbing', url: 'https://goodtimethailand.com/climbing/discover-rock-climbing/', used: 'Half-day price ฿2,600, guide service from ฿2,000, rental prices' },
  { name: 'The Bunker — 5D4N package', url: 'https://kohtao-rockclimbing.com/warehouse-hostel-climbing-package-5d4n/', used: 'Gym services, packages' },
  { name: 'SoTravel — Koh Tao dry-day activities', url: 'https://blog.sotravel.com/2024/06/28/koh-taos-best-dive-sites-your-complete-guide-to-underwater-adventures/', used: 'Bunker day pass price (secondary source)' },
  { name: 'DiveZone — Koh Tao travel guide', url: 'https://divezone.net/travel/koh-tao', used: 'Climate, seasons' },
  { name: 'Travel Happy — Koh Tao quick guide', url: 'https://travelhappy.info/koh-tao-quick-guide/', used: 'Activity context' },
  { name: 'Mountain Project — Thailand', url: 'https://www.mountainproject.com/area/105894648/thailand', used: 'Thaitanium Project rebolting context' },
  { name: 'Koh Tao Complete Guide — getting there', url: 'https://www.kohtaocompleteguide.com/de/reisefakten/anreise-nach-koh-tao/', used: 'Ferry operators incl. Boonsiri + Songserm, night boats (2026-05)' },
  { name: 'UKC Logbook — Frontyard and Backyard', url: 'https://www.ukclimbing.com/logbook/crags/frontyard_and_backyard-19525/', used: "'Climbs are no longer climbable' fragment (search snippet, partially-verified 2026-08-04)" },
  { name: 'Wonderland Koh Tao — best month to visit', url: 'https://wonderlandkohtao.com/best-month-to-visit-koh-tao/', used: 'Dry season Dec–Apr, October wettest (2026)' },
]

export const styleColor: Record<Style, string> = {
  sport: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  trad: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  boulder: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  multipitch: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  toprope: 'bg-stone-500/15 text-stone-300 border-stone-500/30',
}

export const cragBySlug = (slug: string) => crags.find((c) => c.slug === slug)
