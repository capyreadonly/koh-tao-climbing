// Community trip reports and articles about climbing on Koh Tao.
// Source: work/community/reports.json (14 reports, collected 2026-08-02).
// `photos` lists files under app/public/images/community (see ./photos.ts communityPhotos)
// that were downloaded from the report page — all rights reserved by their authors,
// shown here with attribution and a source link.
// Caveats from the source notes (blocked pages, unverified authors, dated prices)
// are folded into the summaries.

export interface CommunityReport {
  title: string
  author: string
  date: string
  url: string
  type: string
  summary: string
  /** Paths relative to app/public, e.g. images/community/report-jansom-bay-kelsey-gray-01.jpg */
  photos?: string[]
}

export const reports: CommunityReport[] = [
  {
    title: 'Koh Tao, Thailand: A rock climbing guide',
    author: 'Mapo Tapo',
    date: '2024-05-07',
    url: 'https://www.mapotapo.com/blog/koh-tao',
    type: 'blog post',
    summary:
      "Climbing guide/trip write-up covering the island's history (Zen Gecko first shop, closed 2005; Goodtime Adventures opened 2008 under Tim and Charly Severino) and its 200-million-year-old granite 'comparable to Joshua Tree'. Suggests a sport circuit: morning at Mek's Mountain (De-Vine Wall, Eagle Wall), afternoon at Lang Khai (Swooping Seabirds), next day Jansom Bay until the midday heat then Golden View for sunset. For trad: Mao Rock in the morning, then Tanote Bay multi-pitches — some trad lines need cams to 6 inches. An earlier version appeared on The Next Line newsletter (2021-10-19).",
    photos: ['images/community/report-crag-mapo-tapo-01.jpg', 'images/community/report-topo-map-mapo-tapo-01.png'],
  },
  {
    title: 'Koh Tao (forum thread trip report)',
    author: 'unverified (UKBouldering forum member; poster handle not captured)',
    date: '2005-06-03',
    url: 'https://ukbouldering.com/threads/koh-tao.4138/',
    type: 'forum thread (UKBouldering)',
    summary:
      "The oldest known community report, predating Goodtime Adventures: a 2.5-month bouldering stay. Rock everywhere (beach, jungle, coconut farms) but harsh conditions — 7am starts mandatory, sun and humidity brutal after 11am, mosquitoes relentless. Granite described as large-crystal and sharp, with the best rock inland on coconut farms. James March (Zen Gecko) sold the bouldering guide direct for 300 baht and hired mats of variable quality; the author warns to bring pads (no hospital on the island) and partners. Mentions Chris Sharma and Nate Gold left problems from an earlier visit.",
  },
  {
    title: 'Bouldering on Koh Tao, Thailand | Destination Articles',
    author: 'Chris Chapman',
    date: '2021-07-08',
    url: 'https://rockrun.com/blogs/the-flash-rock-run-blog/bouldering-on-koh-tao-thailand-destination-articles',
    type: 'blog post (Rock+Run retailer blog)',
    summary:
      "Destination guide from a bouldering trip: best conditions February to May, avoid the October-to-January monsoon, climb early mornings. Travel: bus+boat from Bangkok around 800 baht (haggle). Grade spread 3+ to 8A+; recommends 'Evil Empire' (7B) at Ao Jan Som and 'Mantis' (7C) in the Front yard. Gear notes: strongest mosquito repellent, liquid chalk plus loose chalk for the sweat; crash pad and shoe hire available on the island. The article links a freely downloadable Koh Tao Bouldering Guide PDF.",
    photos: ['images/community/report-bouldering-chris-chapman-01.jpg'],
  },
  {
    title: 'The Best Rock Climbing in Thailand: Is it Worth the Trip? (Koh Tao section)',
    author: 'Mirjam (@mirigoesround)',
    date: '2023-04-23',
    url: 'https://www.thewanderingclimber.com/thailand-rock-climbing/',
    type: 'blog post',
    summary:
      'Thailand-wide guide with a dedicated Koh Tao section: about 70 sport and trad routes plus countless boulder problems on rough granite likened to Joshua Tree. Trad noted on Shark Island and Lang Khai (no bolts; coastal rock crumbly; kayak useful; nesting birds May/June). Describes a 5-pitch trad multi-pitch from seashore to the top of the island (pitches 5.7–5.10; full rack, 2× 60 m ropes). Access: land is private — ask at the Jansom Bay beach office or get a permit via Goodtime Adventures. Prices quoted at time of writing (2023): private guide 1,400 THB half day, beginner course 2,200, toprope course 3,100, 2-day lead 5,600, 2-day trad 6,400; gear rental shoes/harness ~300 THB/day, rope ~500, helmet ~200, crashpad ~300.',
  },
  {
    title: 'Koh Tao Thailand Rock Climbing by Kelsey Gray',
    author: 'Kelsey Gray (rakkup)',
    date: '2019-11-06',
    url: 'https://rakkup.com/koh-tao-thailand-rock-climbing-by-kelsey-gray/',
    type: 'blog post / digital guidebook release article',
    summary:
      'Release article for the rakkup digital guidebook — the current reference guide. Climbing on Koh Tao considered to have started in the early 2000s; first shop Zen Gecko (closed 2005); first guidebook by James March 2002. The guide compiles 114 established climbs, most within minutes of the road, including seaside crags, mountain-top cliffs and an island crag requiring a kayak. Weather good most of the year with October–November the rainy months. Photos show Jansom Bay, Rachal Fagan on Forewarned (6a) at Lang Khai, Rachel Fagan on Do It! (6c+) at Golden View, and Ryan Senko following Drunken Yorkshireman (6a+) at Big Brother Slab.',
    photos: [
      'images/community/report-jansom-bay-kelsey-gray-01.jpg',
      'images/community/report-lang-khai-kelsey-gray-01.jpg',
      'images/community/report-golden-view-kelsey-gray-01.jpg',
      'images/community/report-big-brother-slab-kelsey-gray-01.jpg',
    ],
  },
  {
    title: 'Onsight Koh Tao climbing (Tumblr photo/video blog)',
    author: "Onsight (Koh Tao climbing operator); one video credited 'Filmed & edited by Elizabeth'",
    date: 'undated (one post tagged May; era suggests mid-2010s — unverified)',
    url: 'https://onsightkohtaoclimbing-blog.tumblr.com/',
    type: 'blog (Tumblr) with embedded YouTube videos',
    summary:
      "Series of short climbing posts with videos: a Golden View session ('beautiful spot with around 15 climbs bolted, lots of potential for more lines'); a new boulder problem at 'Lan Kai' (Lang Khai) found and sent the same afternoon, estimated around V9; a sunset session at the 'Koh Tao Boulder Wall'; plus general bouldering clips. Six YouTube videos embedded; upload dates not visible on the page.",
    photos: ['images/community/report-koh-tao-onsight-01.jpg'],
  },
  {
    title: 'Rock Climbing in Koh Tao (Mountain Project area page)',
    author: 'unverified (Mountain Project contributors)',
    date: 'undated (maintenance update March 2025; content references Jan 2018 and Nov 2019)',
    url: 'https://www.mountainproject.com/area/108569570/koh-tao',
    type: 'crowd-sourced area description (Mountain Project)',
    summary:
      "Describes Koh Tao as a giant granite boulder field (over 200 boulders), 'easily world class in terms of bouldering opportunity', with over 80 bolted sport routes but mostly underdeveloped crags. Names Secret Garden (behind Sairee Beach) with problems as hard as V11 (James and the Giant Peach). Popular sport crags: Meks Mountain, Golden View, Jansom Bay and Lang Khai. Notes the small indoor wall relocated to the Evasion Koh Tao shop (open as of Jan 2018, primarily for kids) and the rakkup app guide released November 2019.",
  },
  {
    title: "Climbing above Thailand's Beautiful Waters",
    author: 'Dylan Jones (photos by Dylan Jones and Matt Cline)',
    date: '2016-02-24',
    url: 'https://www.adventurescientists.org/climbing-above-thailands-beautiful-waters-html/',
    type: 'blog post (Adventure Scientists)',
    summary:
      "Narrative of a nine-week climbing trip through Southeast Asia combined with water sampling for the ASC Global Microplastics Project. The Koh Tao leg: ferry to 'the northernmost island in the Chumphon Archipelago', a 'paradisiacal volcanic remnant known for its diving and granite rock climbing'; the author waded chest-deep among rounded boulders in Sairee Bay at sunset to take a water sample. Climbing detail on Koh Tao itself is minimal — included for completeness.",
  },
  {
    title: 'Where to Go Rock Climbing on Koh Tao',
    author: 'unverified (The Funky Turtle, local Koh Tao info site)',
    date: '2020-03-06',
    url: 'https://www.thefunkyturtle.com/lifestyle/activities/rock-climbing-koh-tao/',
    type: 'local info article',
    summary:
      'Local website article on rock climbing and bouldering on Koh Tao. PARTIALLY VERIFIED — the page returned HTTP 403 on fetch; visible content is an explainer of bouldering as a discipline (no ropes, problems typically under 20 ft, shoes and chalk, mantling to top out). A Koh Tao-based operator blog rather than a personal trip report.',
  },
  {
    title: 'UKC Forums - Koh Tao, Thailand',
    author: 'unverified (UKClimbing forum members)',
    date: 'undated (thread active in search index as of 2025-09-25)',
    url: 'https://www.ukclimbing.com/forums/destinations/koh_tao_thailand-344326',
    type: 'forum thread (UKClimbing)',
    summary:
      "Forum Q&A about climbing on Koh Tao. PARTIALLY VERIFIED — only a search snippet was retrievable (site blocks fetching): 'Koh Tao does have rocky bits. it's granite, with an established climbing operator and a couple of bolted locations. Rocks are of pretty good quality.' A related UKC thread snippet adds: 'for the boulderer the island is incredible, solid granite blocs everywhere.'",
  },
  {
    title: 'Google reviews of Goodtime Adventures — Rock Climbing (excerpts via operator site)',
    author: 'Various Google reviewers (Dave Leslie; Jordan Dart-Howell; Divya Joseph — as quoted)',
    date: '2026-04 to 2026-05 (review dates as displayed)',
    url: 'https://goodtimethailand.com/climbing/discover-rock-climbing/',
    type: 'review excerpts (Google reviews embedded on operator website)',
    summary:
      "Goodtime shows a 4.9 rating from 1,522 Google reviews; excerpts tagged 'for Rock Climbing' praise guide Andrew (family first outdoor climb, discover half-day) and instructor Danny. Advertised on the same page: Discover Rock Climbing half-day from 2,600 THB; guide service from 2,000 THB with discounted gear rental (harness 100, shoes 200, chalk 100 THB). Reviews are quoted via the operator's own website — selection may be curated.",
  },
  {
    title: 'The Bunker Koh Tao — customer reviews (embedded on operator site)',
    author: 'Various reviewers (handles: Meander68671016148; SeaMaster76; Andreas H; Tony M)',
    date: '2025-12-09 to 2026-01-01 (review dates as displayed)',
    url: 'https://kohtao-rockclimbing.com/',
    type: 'review excerpts (TripAdvisor-style reviews embedded on operator website)',
    summary:
      "Reviews embedded on The Bunker's homepage: '10 out of 10 — really kind and skilled owner' (Jan 2026); 'fantastic staff and great vibe' though an advanced climber wanted more varied gym routes after a couple of days (Dec 2025); 'best Toprope experience ever with coach Tony' (Dec 2025); 'relaxed and welcoming… very good experience in Koh Tao when rain is there!' (Dec 2025). Quoted via the operator's own site — selection may be curated.",
  },
  {
    title: 'How to Hike to Fraggle Rock on Koh Tao',
    author: 'We Seek Travel (Olly Gaspar — site owner; byline unverified)',
    date: '2024-11-21',
    url: 'https://www.weseektravel.com/fraggle-rock-koh-tao/',
    type: 'blog post (hiking, mentions climbing area)',
    summary:
      "Hiking report for the Fraggle Rock viewpoint: short motorbike ride from Sairee then a 5-minute hike to a massive boulder perched above town with panoramic views of Mae Haad Bay, Sairee Beach and Koh Nang Yuan. The surrounding area — 'known as Mek's Mountain' — is described as 'a hotspot for rock climbing and abseiling'. Useful as an access description for the Mek's Mountain crag area.",
  },
  {
    title: 'Koh Tao crag description (27 Crags, community-contributed)',
    author: 'unverified (27crags.com community contributor)',
    date: 'undated',
    url: 'https://27crags.com/crags/koh-tao/description',
    type: 'crowd-sourced crag description',
    summary:
      "Community topo description: 'very aggressive Granite, with stripes of Sandstone in it'; climbable all year but best when cooler and outside the monsoon (given as October to December). Warns of low phone signal in spots (download the topo beforehand) and that some coastal boulders are only doable at low tide, 'especially in Babaloo & Sairee Beach'. Beaches described as family friendly; jungle boulders have more animals around.",
  },
]
