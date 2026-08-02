// Data layer for the Koh Tao Climbing Database.
// Mirrors the Obsidian vault in ../vault — same entities, same sources.
// Upgraded 2026-08-02 with the web fact-check (work/web-routes.json, work/web-services.json)
// and the legacy static-site merge (work/static-site-content.md).
//
// Verification model: `verified` notes on crags/services record what the 2026-08-02 web
// fact-check confirmed or disputed. The legacy static draft and the vault are treated as
// unverified unless corroborated by Mountain Project / 27crags / operator sites.
// The full 312-record route database lives in ./routes.ts; `routes` below is the small
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
    grades: '4c–7a',
    sun: 'Climbable most of the day',
    approach: 'Motorbike up from the Sairee 7/11 crossroads toward Hin Wong, right turn near the phone tower, short walk',
    access: 'Private land — 100 THB daily fee, pay at Goodtime Adventures (MP)',
    summary:
      "The island's main sport venue and the default first stop. Home crag of Goodtime Adventures, with the friendly De-Vine Wall and the steeper Eagle Wall.",
    details: [
      'Most visitors climb here first to get a feel for Koh Tao granite before exploring further.',
      'Climbable through most of the day, which makes it the standard morning venue in the classic circuit.',
      'Benchmark ticks include The Bitch in Me (6b+/6c — sources conflict) and I Got a Feeling (6a/6a+), both logged by the 2017 Imperial College expedition.',
      'Largest roped area on the island: granite boulders on a steep hill, views from Fraggle Rock, highline bolts on the largest rock (MP).',
    ],
    sectors: [
      { name: 'De-Vine Wall', note: 'Friendly introduction wall' },
      { name: 'Eagle Wall', note: 'Steeper lines' },
    ],
    highlight: 'Main sport venue',
    tags: ['sport', 'toprope', 'multipitch', 'beginner-friendly', 'all-day'],
    coords: { lat: 10.09812, lng: 99.84185 },
    routeCount: '26 routes on Mountain Project (area text says ~35); theCrag snippet claims 44 (unverified)',
    bestSeason: 'Year-round',
    verified: 'Routes, GPS and the 100 THB private-land fee confirmed by the 2026-08-02 Mountain Project scrape; theCrag route count unverified (page 403-blocked).',
  },
  {
    slug: 'jansom-bay',
    name: 'Jansom Bay',
    area: 'South coast',
    styles: ['sport', 'toprope'],
    grades: '5c–7a+',
    sun: 'Morning shade, oven by noon (sun from ~11:30 per MP)',
    approach: 'Ride south toward Jansom Bay / Jamahkiri, then rock-hop past the abandoned huts on the north side of the beach',
    access: 'Private property — 100 THB beach entry via Sensi Paradise / Charm Churee (MP); resort area, be a good guest',
    summary:
      'Seaside crag right on the water, developed by Goodtime Adventures. Climb in the morning, snorkel the bay at lunch — the quintessential Koh Tao day.',
    details: [
      'The wall bakes around noon; the plan is climb → mask and fins → evening session at Golden View.',
      'Big seaside cliffs of 25–30 m+ close to Mae Haad (MP).',
      'Near Jamahkiri resort — be a good guest; buy a drink, keep it clean.',
      'Near-coast hardware: verify bolt condition before trusting (Thaitanium rebolting context).',
    ],
    highlight: 'Climb + snorkel',
    tags: ['sport', 'seaside', 'morning'],
    coords: { lat: 10.07995, lng: 99.81574 },
    routeCount: '5 routes on Mountain Project; Goodtime PDF lists 6 routes (6a and above)',
    bestSeason: 'Nov–Apr (legacy draft); mornings year-round',
    verified: 'GPS and routes confirmed by MP 2026-08-02. Legacy-draft route names (Tufa King, Coastal Drift, Grunt Force P1/P2…) match no fact-checked source — unverified. Legacy-draft GPS was ~4 km off; MP coordinates preferred.',
  },
  {
    slug: 'tanote-bay',
    name: 'Tanote Bay',
    area: 'East coast',
    styles: ['sport', 'trad', 'multipitch', 'toprope'],
    grades: '4c–7c+',
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
    routeCount: '12 routes on Mountain Project (all sub-areas); theCrag snippet claims 68 (unverified); 35 boulder problems on 27crags (Tanote Beach)',
    bestSeason: 'Nov–Apr (legacy draft)',
    verified: 'Sub-crag order, multipitch linkup and bolt warnings confirmed by MP 2026-08-02. MP keeps two Tanote Bay area pages — 123981447 is the maintained one. Legacy-draft route names (Poseidon Adventure, Neptune’s Trident…) unverified.',
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
    ],
    highlight: 'Hidden gem',
    tags: ['sport', 'quiet', 'afternoon'],
    coords: { lat: 10.08016, lng: 99.8475 },
    routeCount: '10 routes on Mountain Project; theCrag snippet claims 80 (unverified); 35 boulder problems on 27crags (Yang)',
    bestSeason: 'Year-round except the Nov–Dec monsoon peak (MP)',
    verified: 'MP routes confirmed 2026-08-02. The vault classic Swooping Seabirds (6b) is not listed on MP — grade unverified. Legacy-draft route list (Turtle Power, King Cobra…) matches no fact-checked source.',
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
    verified: 'MP data confirmed 2026-08-02, including good bolt condition. Legacy-draft route names (Whale of a Time, Big C, Titanium Classic…) match no fact-checked source — unverified.',
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
    routeCount: 'No public route list found on any accessible database',
    bestSeason: 'Year-round (unverified)',
    verified: 'Area exists on theCrag (breadcrumb; page 403-blocked) and in the Goodtime PDF as part of Laem Thian. No route data on MP/27crags — vault notes only.',
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
      'Guide flavour from the Zen Gecko era: Check Dee (“Good Luck”), Het Mao (“Magic Mushrooms”), Jup (“The Kiss”), and the testpiece dyno Vision Quest.',
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
    styles: [],
    grades: 'Unverified',
    sun: 'Unverified',
    approach: 'Unverified',
    access: 'Unverified',
    summary:
      'An area listed on both Mountain Project and theCrag with no published routes — included for completeness while its status is unclear.',
    details: ['The MP area page exists but lists no routes; theCrag also lists Temple Rock under Koh Tao (page 403-blocked).'],
    tags: ['unverified'],
    coords: { lat: 10.09255, lng: 99.83696 },
    routeCount: 'No routes listed (MP area page empty)',
    bestSeason: 'Unverified',
    verified: 'Area pages exist but carry no route data (checked 2026-08-02).',
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
    access: 'Resort closed — guide strongly advised (Goodtime PDF)',
    summary:
      'Jungle top-rope/trad terrain from the Goodtime PDF: a coast sector (2 TR anchors, 4 short routes 5b–6c) and a jungle sector (5 TR anchors, 8 routes to 6c+).',
    details: [
      'Mao Rock sits on the Laem Thian side and is the practical entry point.',
      'theCrag lists “Leam Thian Coast” under Koh Tao (page 403-blocked).',
      'The PDF is v1/14 — heavily outdated; verify everything on the ground.',
    ],
    highlight: 'Jungle exploration',
    tags: ['trad', 'toprope', 'jungle', 'unverified'],
    routeCount: 'Goodtime PDF: 4 coast + 8 jungle routes (v1/14, outdated)',
    bestSeason: 'Unverified',
    verified: 'Goodtime PDF only; current state unverified (2026-08-02).',
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
    summary:
      'The postcard islet off Sairee. The Goodtime PDF records climbing here but keeps the details for guided clients — treat it as restricted and ask Goodtime Adventures.',
    details: ['No public route database entries on MP, theCrag (accessible parts) or 27crags.'],
    tags: ['unverified', 'restricted'],
    routeCount: 'Routes exist per the Goodtime PDF but are not publicly listed',
    bestSeason: 'Unverified',
    verified: 'Unverified whether any climbing is currently permitted (2026-08-02).',
  },
  {
    slug: 'tao-tower',
    name: 'Tao Tower',
    area: 'Near Tanote Goodview Resort, Tanote Bay',
    styles: ['sport', 'multipitch'],
    grades: '5c–6b (legacy draft, unverified)',
    sun: 'Unverified',
    approach: 'Near Tanote Goodview Resort — contact the Koh Tao Climbing Club',
    access: 'Sensitive — contact the Koh Tao Climbing Club',
    summary:
      'A distinctive granite tower near Tanote Goodview Resort with reported sport and multi-pitch lines — sensitive access, go through the Koh Tao Climbing Club.',
    details: [
      'Legacy-draft routes: Tower of Power (6a), Tao Rising (6b multi-pitch), Goodview Direct (5c) — all unverified.',
      'Mentioned in the vault as a Tanote Bay sub-crag requiring Climbing Club contact.',
    ],
    highlight: 'Tower climbing',
    tags: ['sport', 'multipitch', 'tower', 'unverified'],
    coords: { lat: 10.115, lng: 99.853 },
    routeCount: '12 routes per the legacy static draft (unverified)',
    bestSeason: 'Year-round (legacy draft, unverified)',
    verified: 'Legacy draft + vault mention only; no MP/theCrag/27crags data. Coordinates come from the unverified legacy draft — its other GPS points were kilometres off.',
  },
  {
    slug: 'phillips-secret-spot',
    name: 'Phillips Secret Spot',
    area: 'Tanote Bay area — exact location withheld',
    styles: ['sport'],
    grades: '6a–6c (legacy draft, unverified)',
    sun: 'Unverified',
    approach: 'Contact the Koh Tao Climbing Club for directions',
    access: 'Sensitive — contact the Koh Tao Climbing Club',
    summary:
      'A secluded sport crag near Tanote Bay whose access runs through the Koh Tao Climbing Club — intentionally low-profile.',
    details: [
      'Legacy-draft routes: Secret Agent (6a), Hidden Treasure (6b), Top Secret (6c) — all unverified.',
      'Appears in the vault as “Phillips Secret Spot” and in the legacy draft as “Phillipe’s Secret Spot”.',
    ],
    highlight: 'Secluded',
    tags: ['sport', 'secluded', 'unverified'],
    coords: { lat: 10.115, lng: 99.86 },
    routeCount: '9 routes per the legacy static draft (unverified)',
    bestSeason: 'Year-round (legacy draft, unverified)',
    verified: 'Legacy draft + vault mention only; no fact-checked data. Coordinates come from the unverified legacy draft.',
  },
]

// The vault highlight routes — kept for backwards compatibility with the current UI.
// The full merged 312-route database with per-source grades and conflict notes is in ./routes.ts.
export const routes: RouteEntry[] = [
  { slug: 'swooping-seabirds', name: 'Swooping Seabirds', grade: '6b', style: 'sport', cragSlug: 'lang-khai', stars: 3, note: 'The must-do classic of Lang Khai — the line that justifies the trip.' },
  { slug: 'the-bitch-in-me', name: 'The Bitch in Me', grade: '6c', style: 'sport', cragSlug: 'meks-mountain', stars: 2, note: "Benchmark 6c; top tick of the 2017 Imperial College expedition." },
  { slug: 'i-got-a-feeling', name: 'I Got a Feeling', grade: '6a+', style: 'sport', cragSlug: 'meks-mountain', stars: 2, note: 'Friendly mid-grade line for day-one granite calibration.' },
  { slug: 'james-and-the-giant-peach', name: 'James and the Giant Peach', grade: 'V11', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 3, note: "The island's benchmark hard bloc." },
  { slug: 'pancake-ninja', name: 'Pancake Ninja', grade: 'V6', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 2, note: 'Named line in the free PDF bouldering guide.' },
  { slug: 'shadows', name: 'Shadows', grade: 'V2', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Mid-grade Secret Garden classic.' },
  { slug: 'i-just-need-a-hug', name: 'I Just Need a Hug', grade: 'V1', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Upper Secret Garden warm-up.' },
  { slug: 'groovy', name: 'Groovy', grade: 'V1', style: 'boulder', cragSlug: 'secret-garden-boulders', stars: 1, note: 'Upper Secret Garden.' },
  { slug: 'yus-jam-crack', name: "Yu's Jam Crack", grade: 'V1', style: 'boulder', cragSlug: 'sairee-beach-boulders', stars: 2, note: 'The crack dividing The Elephant on its southern side.' },
  { slug: 'vision-quest', name: 'Vision Quest', grade: 'V5+', style: 'boulder', cragSlug: 'babaloo-boulders', stars: 2, note: 'Huge dyno to a sloping lip — the old guide’s testpiece.' },
  { slug: 'check-dee', name: 'Check Dee (Good Luck)', grade: 'V2', style: 'boulder', cragSlug: 'babaloo-boulders', stars: 2, note: '“Excellent moves on good rock” per the Zen Gecko guide.' },
  { slug: 'het-mao', name: 'Het Mao (Magic Mushrooms)', grade: 'V3', style: 'boulder', cragSlug: 'babaloo-boulders', stars: 1, note: 'Sit-start crank off a sandstone-like knob.' },
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
    verified: 'Operating status, course pathway and prices verified on goodtimethailand.com, 2026-08-02; phone/email unverified.',
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
  {
    name: 'The Warehouse',
    role: 'Indoor gym · hostel · shop (unverified)',
    since: 'unverified',
    summary:
      "Listed only in the legacy static draft as an indoor gym/hostel/climbing shop at Sairee Beach. Possibly conflated with The Bunker's Warehouse Hostel — treat as unverified.",
    bullets: ['Current operating status unverified — appears in no fact-checked source'],
    contact: 'unverified',
    url: 'https://kohtao-rockclimbing.com/',
    verified: 'Unverified: legacy static draft only.',
  },
]

export const sources = [
  { name: 'Mapo Tapo — Koh Tao rock climbing guide', url: 'https://www.mapotapo.com/blog/koh-tao', used: 'Crag circuit, itineraries, granite, Goodtime/Zen Gecko history' },
  { name: 'theCrag — Koh Tao', url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao', used: 'Access & ethics, gear rental, guidebook listings' },
  { name: 'theCrag — The Elephant', url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao/area/9797417472', used: 'Sairee Beach boulder detail' },
  { name: 'Mountain Project — Koh Tao', url: 'https://www.mountainproject.com/area/108569570/koh-tao', used: 'Area tree, 96 routes, GPS, bolt warnings (scraped 2026-08-02)' },
  { name: 'Mountain Project — Tanote Bay', url: 'https://www.mountainproject.com/area/123981447/tanote-bay', used: 'Sub-crags, linkups, bolt warnings, sun timing' },
  { name: '27crags — Koh Tao', url: 'https://27crags.com/crags/koh-tao', used: '216 boulder/DWS routes with sectors (fetched 2026-08-02)' },
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
