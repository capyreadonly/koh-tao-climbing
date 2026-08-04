// Practical trip-planning info for the Koh Tao climbing guide.
// Merged from the legacy static site infoData (work/static-site-content.md — unverified draft),
// the vault planning notes (work/vault-facts.json) and the 2026-08-02 web fact-check
// (work/web-services.json); corrected 2026-08-04 per work/research2/audit.json + research2 sources
// (monsoon window per 27crags, Mek's/Jansom fees per the Goodtime PDF, rakkup counts verified,
// phantom 'Warehouse' shop removed). Known contradictions between sources are kept in
// `notes`/`conflicts` fields rather than silently resolved.

export interface FerryRoute {
  route: string
  operators: string
  duration: string
  fare?: string
  notes?: string
}

export interface GettingThere {
  toIsland: string[]
  ferries: FerryRoute[]
  /** Source contradictions the UI should surface, not hide. */
  conflicts: string[]
  onIsland: string[]
  withGear: string[]
}

export interface Season {
  period: string
  conditions: string
  note: string
}

export interface Seasons {
  climate: string
  table: Season[]
  dailyRhythm: string[]
  notes: string[]
}

export interface GearShop {
  name: string
  location: string
  services: string[]
  verified?: string
}

export interface GearAndSafety {
  rockDemands: string[]
  kitList: string[]
  bolts: string
  hazards: string[]
  shops: GearShop[]
}

export interface Ethics {
  officialLine: string[]
  officialLineSource: string
  rules: string[]
  fullerPicture: string[]
}

export interface ItineraryDay {
  label: string
  steps: string[]
}

export interface Itinerary {
  slug: string
  name: string
  days: ItineraryDay[]
}

export interface Guidebook {
  title: string
  author: string
  year: string
  note: string
  url?: string
  /** True for the references climbers should actually carry in 2026. */
  current: boolean
}

export const gettingThere: GettingThere = {
  toIsland: [
    'Koh Tao sits ~300 miles south of Bangkok in the Chumphon Archipelago, western Gulf of Thailand. No airport — arrival is by ferry to Mae Haad pier.',
    'Classic backpacker route: train or bus from Bangkok to Chumphon, then ferry (~10 h bus+ferry combined).',
    'Fly to Koh Samui (USM) or Surat Thani (URT), then ferry — Koh Samui is the nearest airport, ~1.5–2 h by boat.',
  ],
  ferries: [
    {
      route: 'Chumphon → Koh Tao (Mae Haad)',
      operators: 'Lomprayah high-speed catamaran (from Thung Makham Noi pier); Boonsiri also reported',
      duration: '~1 h 45',
      fare: 'from ~350 THB',
      notes: '~2–3 departures daily. Night boats with air-con dorm bunks (e.g. Chor Maetapee) take ~6 h.',
    },
    {
      route: 'Koh Samui / Koh Phangan → Koh Tao',
      operators: 'Lomprayah Catamaran, Songserm Express, Boonsiri; Lomlahkkhirin speedboat',
      duration: '~2 h from Samui (Lomprayah), ~1.5 h by speedboat',
      notes: 'Songserm confirmed still operating in 2025–2026.',
    },
    {
      route: 'Surat Thani → Koh Tao',
      operators: 'Several companies in rotation, incl. night boats',
      duration: '~9 h by night boat; slower than the Chumphon crossing',
      notes: 'Chumphon is the closest mainland point and the fastest crossing.',
    },
  ],
  conflicts: [
    "Ferry exclusivity conflict: ferryadvice.com calls Lomprayah 'the only ferry service from Chumphon to Koh Tao', while kohtaocompleteguide.com (2026-05) lists both Lomprayah AND Boonsiri on the mainland route plus night boats — treat 'Lomprayah only' as outdated or incomplete.",
    "Monsoon timing varies by source: vault says Sep–Nov rainy, the legacy draft says May–Oct hot/humid, 27crags says monsoon Oct–Dec, Rock+Run says avoid Oct–Jan. Consensus: October–November is the wettest stretch; climbing is possible year-round with flexible planning.",
  ],
  onIsland: [
    'Motorbike rental is the standard answer — numerous shops; best way to combine crags, beaches and food in one day.',
    'Roads near Tanote Bay are steep and curvy: drive slowly.',
    "Truck taxis reach many areas but charge more than you'd expect; Mae Haad → Tanote is 10–15 min.",
    'Distances are short everywhere; the whole island is ~21 km².',
  ],
  withGear: [
    'Most sport climbers fly in with rope + draws; trad climbers for Mao Rock need a rack including big cams (to 6").',
    'Renting on-island (Goodtime Adventures / The Bunker) is the lightest option — confirmed by theCrag, 2026-08-02.',
  ],
}

export const seasons: Seasons = {
  climate: 'Tropical, hot and humid year-round, ~28–32 °C (dry season 24–31 °C). Water ~29 °C all year. The rock is warm year-round — climbing is possible in every month with flexible planning.',
  table: [
    { period: 'Dec–Mar', conditions: 'Cool and dry — ideal', note: 'Peak tourist season; reliable weather; book ahead (Christmas sells out months in advance)' },
    { period: 'Mar–Apr', conditions: 'Hot and dry', note: 'Morning sessions; March–May warm, dry, calm seas' },
    { period: 'May–Jun', conditions: 'Hot, often called the sweet spot', note: 'Not too hot, fewer tourists' },
    { period: 'Jul–Aug', conditions: 'Hot and humid', note: 'Second tourist peak; generally good conditions; seek shade' },
    { period: 'Oct–Dec', conditions: 'Monsoon season (27crags)', note: 'Mostly short ~2-hour afternoon downpours but also full rainy days; October the wettest month, rough ferry crossings possible — plan flex days at The Bunker gym' },
  ],
  dailyRhythm: [
    'Start ~7:00 — it gets hot fast; early starts are the key to success.',
    "Match crag to sun: Tanote Bay gets morning sun and shade by late afternoon; Jansom Bay bakes by noon; Golden View is the evening crag; Mek's Mountain works most of the day.",
    'Midday = lunch, snorkel, siesta. Nobody climbs granite in tropical noon sun voluntarily.',
  ],
  notes: [
    'Seasons verified 2026-08-02: dry season roughly December–April, October–November wettest (thediversboat.com, wonderlandkohtao.com). 27crags states the monsoon as October–December; the table above follows that window.',
    'The legacy draft seasons table (Nov–Feb / Mar–Apr / May–Oct) is coarser and slightly conflicts with the vault on the monsoon window — the table above follows the fact-checked sources.',
  ],
}

export const gearAndSafety: GearAndSafety = {
  rockDemands: [
    "200-million-year-old granite that ranges from smooth to 'surgical blades' (comparable to Joshua Tree).",
    'Tape gloves for crack climbs — effectively mandatory at Tanote Bay; bring tape even for face climbing.',
    'Skin management — sharp crystals + humidity shred fingertips.',
    "Don't snorkel immediately before climbing — softened skin + sharp granite = short session. Climb first, snorkel after.",
  ],
  kitList: [
    "60 m rope, 12–15 quickdraws (sport at Mek's Mountain, Jansom Bay, Lang Khai, Golden View)",
    'Trad rack with large cams to 6" for Mao Rock and Tanote trad',
    'Crash pad(s) — boulders run from 1 m to highballs up to 10 m (27crags); rent at The Bunker (per 27crags) or Goodtime Adventures',
    'Lots of water (jungle approaches at Mao Rock), mosquito repellent, sun protection',
    'Or skip it all: rent from Goodtime Adventures or The Bunker',
  ],
  bolts:
    "Stainless bolts near the sea corrode dangerously across Thailand — Mountain Project carries the warning 'Stainless steel bolts are suspect near the coast!' on all Koh Tao pages. The Thaitanium Project has rebolted the vast majority of popular routes in the main areas with titanium glue-ins (role verified 2026-08-02; its current activity level is unverified — last dated rebolting evidence Oct 2024). Inspect before trusting, especially seaside crags like Tanote Bay's Poseidon and Jansom Bay; when in doubt ask the Koh Tao Climbing Club.",
  hazards: [
    'Heat exhaustion — follow the daily rhythm (early starts, midday siesta)',
    'Steep scooter roads — the most statistically dangerous thing on the island',
    'Jungle: mosquitoes, occasional bees/ants on less-traveled lines',
    'Low phone signal in spots — download the topo beforehand (27crags)',
    'Some coastal boulders only doable at low tide, especially at Babaloo and Sairee Beach',
  ],
  shops: [
    {
      name: 'The Bunker',
      location: 'Sairee Beach',
      services: ['Gear rental', 'Indoor gym', 'Hostel', 'Guidebook PDFs'],
      verified: 'Verified operating 2026-08-02; gear rental confirmed by theCrag. Rental inventory and prices are not published. The Warehouse Hostel is The Bunker\'s own adjacent dorm — the legacy draft\'s separate "The Warehouse" gym/shop was a conflation and has been removed.',
    },
    {
      name: 'Goodtime Adventures',
      location: 'Sairee Beach / Mae Haad',
      services: ['Gear rental', 'Guided climbing', 'Courses (Rock 1–5)', "Mek's Mountain access fee"],
      verified: 'Verified 2026-08-02. With a booked guide: harness ฿100, shoes ฿200, chalk ฿100. Independent rental available; inventory/prices otherwise unpublished.',
    },
    {
      name: 'Evasion Koh Tao',
      location: 'Sairee Beach',
      services: ['Indoor bouldering wall', 'Kids climbing', 'Shop'],
      verified: 'Unverified — legacy draft + a 2018 Mountain Project note only.',
    },
  ],
}

export const ethics: Ethics = {
  officialLine: ["Don't litter.", "Don't bolt without permission of the Koh Tao Climbing Club."],
  officialLineSource: "theCrag's Koh Tao page (verbatim, live-checked 2026-08-02)",
  rules: [
    "Don't litter — pack out all trash",
    "Don't bolt without Climbing Club permission",
    'Do not chip or modify holds',
    'Do not remove fixed hardware at anchors',
    'Respect local residents on approach trails',
  ],
  fullerPicture: [
    'Sensitive access exists. Some crags sit on or beside private land and resorts (Jansom Bay by Jamahkiri; Tao Tower and Phillips Secret Spot at Tanote Bay). Contact the club for current status before exploring off the beaten path.',
    "Be a good guest. Buy a drink or meal from the business whose land you're crossing; keep noise and chalk reasonable at beach crags like Sairee; don't boulder too close to the Secret Garden bungalows.",
    'All land on Koh Tao is private (Goodtime PDF) — pay the access fees: Mek\'s Mountain is 100 THB paid at Goodtime Adventures (receipt issued; PDF p8 attention box), Jansom Bay is paid at the beach office (PDF p5).',
    'Support the stewards. Renting gear or booking a day with Goodtime Adventures / The Bunker funds the people maintaining routes; the Thaitanium Project rebolting work runs on community donations.',
    'Leave No Trace applies doubly on a 21 km² island — pack out tape, tape wrappers and chalk-caked brushes.',
  ],
}

export const itineraries: Itinerary[] = [
  {
    slug: 'sport-two-day-circuit',
    name: 'Sport climbing — two-day circuit',
    days: [
      {
        label: 'Day 1',
        steps: [
          '07:00 breakfast — it gets hot fast',
          "Morning: Mek's Mountain — warm up on De-Vine Wall / Eagle Wall; try I Got a Feeling and The Bitch in Me",
          'Midday: lunch + snorkel',
          "Afternoon: Lang Khai — quieter, beautiful; don't miss Swooping Seabirds",
        ],
      },
      {
        label: 'Day 2',
        steps: [
          'Morning: Jansom Bay — climb until it bakes around noon',
          'Midday: swim the bay',
          'Evening: Golden View — routes with the sunset',
        ],
      },
    ],
  },
  {
    slug: 'trad-day',
    name: 'Trad day',
    days: [
      {
        label: 'Day 1',
        steps: [
          'Morning: jungle hike into Mao Rock (bring big cams to 6", lots of water)',
          'Afternoon: Tanote Bay once the sun fades — exploration-style multi-pitch linkups (Poseidon → Jah Crag → Layer Cake → Tanote Pinnacle); the pinnacle block is the best pitch',
          'Evening: swim + the Tanote jumping rock',
        ],
      },
    ],
  },
  {
    slug: 'boulder-day',
    name: 'Boulder day',
    days: [
      {
        label: 'Day 1',
        steps: [
          'Morning: Secret Garden Boulders — warm up in the Courtyard, project up to Pancake Ninja / James and the Giant Peach',
          'Late afternoon/sunset: Sairee Beach Boulders — The Elephant, sand landings, dinner at Sandbar',
        ],
      },
    ],
  },
  {
    slug: 'rainy-day',
    name: 'Rainy-day plan (Sep–Nov)',
    days: [
      {
        label: 'Day 1',
        steps: [
          'The Bunker gym day pass (250 THB — reported, not confirmed on the operator site), cafe, pool table',
          'Book the lead course for the rest of the week',
        ],
      },
    ],
  },
]

export const guidebooks: Guidebook[] = [
  {
    title: 'Koh Tao Rock Climbing (rakkup app)',
    author: 'Kelsey Gray',
    year: '2019 release; current edition',
    note: 'The current digital guide — 114 established climbs at the November 2019 release (rakkup release article, verified); the current edition lists 180 routes (rakkup guidebook page, checked 2026-08-04). Goodtime\'s own guidebook page (updated 2026-07-30) calls it "the most up to date resource available". Essentially required for Tanote Bay, where route-finding depends on its approach photos. iOS & Android, $7.99.',
    url: 'https://rakkup.com/guidebooks/thailand-koh-tao-rock-climbing/',
    current: true,
  },
  {
    title: 'theCrag — Koh Tao',
    author: 'community database',
    year: 'live',
    note: '1,800+ logged ascents; access/ethics notices inherited across all areas; good for Sairee Beach Boulders detail. Area pages may 403 scripted fetches.',
    url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao',
    current: true,
  },
  {
    title: 'Mountain Project — Koh Tao',
    author: 'community database',
    year: 'live (maintenance update March 2025)',
    note: 'Solid area descriptions, sub-crag order, GPS and hardware warnings; 96 routes scraped 2026-08-02.',
    url: 'https://www.mountainproject.com/area/108569570/koh-tao',
    current: true,
  },
  {
    title: '27crags — Koh Tao',
    author: 'community database (topo by Thai-Climb)',
    year: 'live',
    note: 'The bouldering reference: 258 problems with sectors, tick counts and ratings across 8 crags (deep fetch 2026-08-04). Topo images and descriptions are paywalled (Premium). No roped Koh Tao crags are listed on 27crags.',
    url: 'https://27crags.com/crags/koh-tao',
    current: true,
  },
  {
    title: 'Koh Tao Rock Climbing & Bouldering Guide (free PDF)',
    author: 'Goodtime Adventures; incl. the Zen Gecko Bouldering Guide (James March 2002, updated 2010 with Matt Pierson)',
    year: 'v1/14',
    note: "Historic free guide via railay.com covering Babaloo and Secret Garden. Zen Gecko was the island's first climbing shop (closed 2005); James March compiled the first guidebook in 2002. Old — verify everything on the ground.",
    url: 'http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf',
    current: false,
  },
  {
    title: 'Thailand: A Climbing Guide',
    author: 'Sam Lightner Jr',
    year: '2005',
    note: 'Covers all of Thailand; listed by the legacy draft. Far outdated for Koh Tao — context only.',
    current: false,
  },
  {
    title: 'King Climbers Southern Thailand guide (10th ed.)',
    author: 'Somporn Suebhait',
    year: '2025',
    note: 'Railay/Tonsai/Krabi focus — regional context for a longer Thailand trip.',
    current: false,
  },
  {
    title: 'The Pocket Guide (9th ed.)',
    author: 'Sirichai Pongsopon',
    year: 'Oct 2024',
    note: '800+ routes, written by a local Thai climber actively rebolting — regional context.',
    current: false,
  },
]
