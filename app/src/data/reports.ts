// Community trip reports and articles about climbing on Koh Tao.
// Sources: work/community/reports.json (14 reports, collected 2026-08-02) and
// work/research2/reports2.json (20 reports, collected 2026-08-04 — Reddit threads, UKC/Sendage/
// theCrag crowd-sourced pages, TripAdvisor, and 9 YouTube items kept as links only).
// `photos` lists files under app/public/images/community (see ./photos.ts communityPhotos)
// that were downloaded from the report page — all rights reserved by their authors,
// shown here with attribution and a source link. YouTube thumbnails are intentionally
// NOT downloaded — videos are represented as links (type 'video' with the watch URL).
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
  {
    title: 'Ko(h?) Tao, Thailand anyone been there? (r/climbing thread)',
    author: 'unverified (Reddit r/climbing posters)',
    date: 'unverified (thread ID 2uopvn suggests early 2015; not confirmed)',
    url: 'https://www.reddit.com/r/climbing/comments/2uopvn/koh_tao_thailand_anyone_been_there/',
    type: 'forum thread (Reddit r/climbing)',
    summary:
      'Q&A thread about climbing on Koh Tao. Search snippet from a reply: \'The rock on Koh Tao is granite, and there is a good mix of single or multi-pitch sport and trad routes across the grades. There are also a few bouldering areas, the ones I visited were called "front yard" and "back yard" (I think...) But in conclusion, definitely bring shoes.\' PARTIALLY VERIFIED — reddit.com returns 403 to direct fetches; content summarized from a DuckDuckGo search snippet only. Full thread (question, other replies, dates) not retrievable from this network.',
  },
  {
    title: 'Bouldering in Koh Tao, Thailand (r/climbing thread)',
    author: 'unverified (Reddit r/climbing poster)',
    date: 'unverified (thread ID dblyqd and a Tumblr repost of the same content — tumblr.com/mochinnie-chimchim/188055774171, ID suggests ~Oct 2019; not confirmed)',
    url: 'https://www.reddit.com/r/climbing/comments/dblyqd/bouldering_in_koh_tao_thailand/',
    type: 'forum thread (Reddit r/climbing)',
    summary:
      'Thread titled \'Bouldering in Koh Tao, Thailand\' (likely a photo/video post). Only the thread title and subreddit boilerplate were retrievable; a Tumblr repost of the same titled content exists (\'Bouldering in Koh Tao, Thailand · via Climbing\'). PARTIALLY VERIFIED — reddit.com blocks fetching; snippet content is minimal. Existence and title confirmed via DuckDuckGo index.',
  },
  {
    title: 'What to do in koh tao (r/ThailandTourism thread)',
    author: 'unverified (Reddit r/ThailandTourism posters)',
    date: 'unverified (thread ID 151qyhm suggests ~July 2023; not confirmed)',
    url: 'https://www.reddit.com/r/ThailandTourism/comments/151qyhm/what_to_do_in_koh_tao/',
    type: 'forum thread (Reddit r/ThailandTourism)',
    summary:
      'Things-to-do thread; a reply snippet reads: \'Awesome rock climbing community if you wanted to give that a go, the natural high cafe is beautiful, same as the restaurants and bars further up the mountain...\' — indicates an active climbing community on the island at the time and points to the Natural High Cafe area (Mek\'s Mountain side) as a climber hangout. PARTIALLY VERIFIED — snippet only (reddit 403s direct fetches).',
  },
  {
    title: 'Koh Tao Rock Climbing Adventure | Taking the Fall with Namah Rope',
    author: 'Namah Ropes (YouTube channel @namahropes)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=L3e9XfVd6aE',
    type: 'video',
    summary:
      'First-person climbing video from Koh Tao. Search-result description: \'Experience the ultimate adrenaline rush as we explore the breathtaking rock climbing spots of Koh Tao, Thailand. In this thrilling adventure, I push my limits on towering limestone cliffs, trust...\' (NOTE: Koh Tao rock is granite — the uploader\'s \'limestone\' wording is wrong or generic). Title/author verified via noembed oembed. Channel appears to be a rope-access/brand channel. Description text from search snippet — partially verified.',
  },
  {
    title: 'Bouldering in Koh Tao; Thailand',
    author: 'Eskild Nilsen Røst (YouTube channel @generalOst)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=Ry-B_qOytc8',
    type: 'video',
    summary:
      'Bouldering trip video by a visiting climber. Description snippet: \'Took a brake from the limestone climbing and spent some time on Koh Tao.. This place has some awsome bouldering, but the good rocks can be hard to find.\' — a useful ground-truth note that quality boulders require effort to locate. Title/author verified via noembed; description via search snippet (partially verified). Likely filmed during a Railay/Tonsai limestone trip detour.',
  },
  {
    title: 'Koh Tao Rock Climbing: A Thrilling Experience',
    author: 'Harvey Stanley Travels (YouTube channel @HarveyStanleyTravels)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=gA9CRB94q1w',
    type: 'video',
    summary:
      'Travel-vlogger video of a first-ever rock climbing experience on Koh Tao (guided beginner session). Description snippet: \'Join me on my first-ever rock climbing adventure in Koh Tao! Embark on an exhilarating journey with me, Harvey Stanley, as I tackle rock climbing for t...\' Title/author verified via noembed; description partially verified from search snippet.',
  },
  {
    title: 'Bunker Climbing Gym Koh Tao - Bouldering Demo - Green & Blue Routes',
    author: 'The Bunker Koh Tao Climbing Gym (YouTube channel @bunkerclimbingkohtao)',
    date: '2024-09-17 (date shown in search index; unverified against YouTube page)',
    url: 'https://www.youtube.com/watch?v=s4FhoCXqIQs',
    type: 'video',
    summary:
      'The Bunker\'s demo video of its easier indoor boulder problems. Description snippet: \'If you\'re a beginner in bouldering, watch this video first and learn how to do some of our easier boulder problems. They can be tricky and seem impossible if...\' Confirms the gym uses color-graded circuits (Green & Blue = easier) and that The Bunker runs a YouTube channel with presumably more climbing content. Title/author verified via noembed; date from DuckDuckGo result metadata (unverified).',
  },
  {
    title: 'Mapo Tapo rock-climbing tour, episode#2 - Koh Tao',
    author: 'Mapo Tapo (YouTube channel @mapotapo7660)',
    date: 'undated (upload date not exposed by oembed; related blog post dated 2024-05-07)',
    url: 'https://www.youtube.com/watch?v=k4X25KQHASQ',
    type: 'video',
    summary:
      'Video companion to Mapo Tapo\'s Koh Tao climbing trips. Description snippet: \'Virtually climb in the magnificent Koh Tao! Located roughly 300 miles from Bangkok, Koh Tao is an island of divers and hoppers surrounded by jungle and granite. A small subset of rock climbers...\' Title/author verified via noembed. Companion to the Mapo Tapo blog report already in work/community/reports.json; the video itself is new.',
  },
  {
    title: 'Come rock climbing with Goodtime Adventures on Koh Tao!',
    author: 'Goodtime Thailand (YouTube channel @Goodtimethailand)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=ErxCBEuxumA',
    type: 'video',
    summary:
      'Goodtime Adventures promotional climbing video. Description snippet: \'Have you dreamed about the most epic rock and cliffs to climb on? Have you dreamed about staying on a tropical island? Then Koh Tao is the right place for yo...\' Useful as visual documentation of Goodtime\'s climbing operations (crags shown unverified). Title/author verified via noembed. Operator-produced, not independent.',
  },
  {
    title: 'DO SOMETHING DIFFERENT IN KOH TAO (LEARN TO ROCK CLIMB)',
    author: 'The Curtis Life (YouTube channel @thecurtislife2588)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=JKvV77CsB1U',
    type: 'video',
    summary:
      'Traveler vlog: \'We learnt to lead climb in Koh Tao! After we hired some bouldering equipment and saw how many great spots were there for climbing outdoors Tim and Tyler deci...\' — documents hiring bouldering gear on the island first, then taking a lead-climbing course (instructors named Tim and Tyler, per snippet). Title/author verified via noembed; description partially verified from search snippet. \'Tim\' is presumably Tim Severino of Goodtime — unverified.',
  },
  {
    title: 'I tried to climb this boulder to see the sunset | Climbing Golden View Viewpoint Koh Tao, Thailand',
    author: 'Native Explorer (YouTube channel @NativeExplorer)',
    date: 'undated (upload date not exposed by oembed)',
    url: 'https://www.youtube.com/watch?v=USgn9qcjTK8',
    type: 'video',
    summary:
      'Non-climber traveler attempts to scramble/climb the Golden View viewpoint boulder for sunset views. Description snippet: \'I finally attempted to climb Golden View Viewpoint in Koh Tao, Thailand. The most breathtaking climbing landmark in Koh Tao.\' Title/author verified via noembed; description partially verified. More of a viewpoint-scramble than roped climbing, but documents the Golden View boulder area.',
  },
  {
    title: 'Climbing - Koh Tao, Thailand (Onsight YouTube channel)',
    author: 'Onsight (YouTube channel @ThailandRockClimbingKohTao)',
    date: 'undated',
    url: 'https://www.youtube.com/@ThailandRockClimbingKohTao/videos',
    type: 'video channel',
    summary:
      'Onsight\'s YouTube channel. Channel description: \'Onsight is a chill climbing company on koh tao. We are located in Koh Tao Bouldering wall. This is koh tao climbers HQ. We offer climbing services such as guide sessions out on the rocks and ...\' (truncated). Confirms Onsight operates/operated out of the \'Koh Tao Bouldering Wall\' as a climber HQ. This is the same operator whose Tumblr blog (already in reports.json) embedded 6 older videos; the channel likely hosts those and possibly more. Channel description via search snippet (partially verified). Video list not enumerated — YouTube channel pages require JS. Current operating status of Onsight unverified.',
  },
  {
    title: 'Mek\'s Mountain - UKC Logbook crag page',
    author: 'unverified (UKClimbing logbook contributors)',
    date: 'undated',
    url: 'https://www.ukclimbing.com/logbook/crags/meks_mountain-21938/',
    type: 'crowd-sourced logbook (UKClimbing)',
    summary:
      'UKC logbook entry for Mek\'s Mountain: \'The most developed area for sport climbing on Ko Tao. 18 Sport Routes, 14 Top-Rope anchors with 20 routes, 4 to 7a and above.\' A sub-page exists for the route \'Good Morning Koh Tao (variation)\' 5c: \'15m, 2 pitches. Sharing the same bolted line and anchor, but climbing to the right hand side. Can be further climbed as an easy training platform for a multi-...\' (truncated). PARTIALLY VERIFIED — ukclimbing.com blocks direct fetches (403); content from search snippets. Numbers (18 sport routes / 20 toprope routes) differ from other sources and would need cross-checking.',
  },
  {
    title: 'Frontyard and Backyard - UKC Logbook crag page',
    author: 'unverified (UKClimbing logbook contributors)',
    date: 'undated',
    url: 'https://www.ukclimbing.com/logbook/crags/frontyard_and_backyard-19525/',
    type: 'crowd-sourced logbook (UKClimbing)',
    summary:
      'UKC logbook entry for the Frontyard and Backyard bouldering areas: \'The Frontyard offers a central location on Koh Tao with a diverse number of problems. available from Koh Tao Info, Climbs are no longer climbable.\' — the fragment \'Climbs are no longer climbable\' suggests these areas have been LOST to access/development (consistent with older reports warning beachside boulders disappear to resort development). PARTIALLY VERIFIED — snippet only (ukclimbing.com 403s). The \'no longer climbable\' fragment is important correction material: any published site content listing Frontyard/Backyard as open should be flagged for verification. \'available from Koh Tao Info\' presumably refers to a topo once sold at Koh Tao Info.',
  },
  {
    title: 'Koh Tao - theCrag community area page',
    author: 'unverified (theCrag.com community contributors)',
    date: 'undated (search index shows page activity as of 2026-07-01)',
    url: 'https://www.thecrag.com/en/climbing/thailand/koh-tao',
    type: 'crowd-sourced crag wiki (theCrag)',
    summary:
      'Community wiki listing 496 routes for Koh Tao: \'Koh Tao is an amazing granite paradise! With granite boulders all over the island offering everything from bouldering to sports climbing and even some awesome trad lines.\' Inherited access note: \'Some of the crags on Koh Tao have sensitive access issues, please contact the Koh Tao Climbing Club for more details. If you want to rent gear that can be done from either Goodtime Adventures or The Bunker.\' Inherited ethic: \'Don\'t litter. Please don\'t bolt without permission of the Koh Tao Climbing Club.\' Sub-areas include Golden View (\'Great granite climbing with 360 panoramic views. 31 routes in total including the slab climbs on the road to the crag\'), Jansom Bay (approach past abandoned huts and a goat\'s house; 100 Baht beach access fee), \'The Elephant\' (big beach boulder in the middle of Sairee Beach in front of Sandbar Restaurant, with bolts on top for toproping), \'Flyin\' High\' (6 lines 6a+ to 6c, Ti glue-in bolts and ramshorn lower-offs), and \'Lost Faces\' (12 routes). New crowd-sourced source alongside Mountain Project and 27crags. Route counts (496 vs ~200 elsewhere) likely include boulder problems; treat with caution. The Koh Tao Climbing Club bolting-permission ethic is notable.',
  },
  {
    title: 'Koh Tao bouldering ascents (Sendage community tick list)',
    author: 'Sendage users incl. \'Evan Waugh\', \'tinydynos\', \'josh_scotvold\'',
    date: 'ascents logged 2019-09-30 and 2023-06-09',
    url: 'https://sendage.com/area/koh-tao-thailand',
    type: 'crowd-sourced ascent log (Sendage)',
    summary:
      'Sendage area page for Koh Tao listing community sends: \'Trust your feet\' 5.8 (onsight, josh_scotvold, 2023-06-09); \'Super Pinch\' (onsight, Evan, 2019-09-30 — listed V4 on the area page but V7 on the climb page, grade discrepancy unverified); \'Regleteo\' V7 (redpoint, Evan, 2019-09-30); \'Brujo On Holidays\' V1 (onsight); \'Shadows\' V2 (onsight). Climb pages: \'Always Working\' V4 (1 send, redpointed by tinydynos: \'Overthought the climb, but otherwise straightforward.\'); \'Super Pinch\' V7 (3 sends, onsighted by Evan Waugh: \'Had to avoid the murder hornets congregating on the undercling.\' — a real hazard note for jungle boulders). Area page fetched successfully. Problem names (Super Pinch, Regleteo, Brujo On Holidays, Shadows, Always Working, Trust your feet) are community-recorded and not cross-referenced to any guidebook sector — crag attribution unverified.',
  },
  {
    title: 'THE BUNKER CLIMBING GYM KOH TAO - TripAdvisor reviews',
    author: 'Various TripAdvisor reviewers',
    date: 'undated',
    url: 'https://www.tripadvisor.co.uk/Attraction_Review-g303910-d24057982-Reviews-or50-The_Bunker_Climbing_Gym_Koh_Tao-Koh_Tao_Surat_Thani_Province.html',
    type: 'review page (TripAdvisor)',
    summary:
      'TripAdvisor listing for The Bunker Climbing Gym. Review snippet: \'The Bunker\'s guided outdoor climbing trips are amazing. Our guide Tony was so fun to spend time with, and a very skilled guide. He took us to a variety of ...\' (truncated) — corroborates that The Bunker runs guided outdoor trips (guide named Tony) in addition to the indoor gym, matching the \'coach Tony\' mentioned in reviews on The Bunker\'s own site. PARTIALLY VERIFIED — TripAdvisor blocks direct fetches; snippet only.',
  },
  {
    title: '15 Climbing Gym Bangkok and Thailand Locations (The Bunker section)',
    author: 'unverified (The Amateur Climber blog)',
    date: '2025-02-10',
    url: 'https://theamateurclimber.com/climbing-gym-bangkok-thailand/',
    type: 'blog post (first-person gym review)',
    summary:
      'Thailand climbing-gym roundup with a first-person section on The Bunker: \'the only indoor climbing place in Koh Tao... a combination of a hostel, cafe, and indoor bouldering gym that is perfect for digital nomads to chill and work. Although the bouldering space is quite small, it has a large range of climbing grades.\' Notes The Bunker organizes outdoor top-rope trips for beginners and offers outdoor bouldering and lead courses; \'everyone here is really friendly and chill\', cafe has vegetarian/vegan options. Independent-ish review of The Bunker (not operator-published).',
  },
  {
    title: 'Koh Tao Climbing Club - Get A Grip Productions gallery/club pages',
    author: 'Get A Grip Productions (photographer site hosting Koh Tao Climbing Club pages)',
    date: '2023 (Club Days 2023 galleries)',
    url: 'https://www.getagripproductions.org/PAGES/Koh-Tao-Climbing-Club-',
    type: 'photo/video gallery site (club documentation)',
    summary:
      'Site for a photographer \'specializing in capturing unique, high-energy images of trapeze artists & rock climbers in action\', hosting Koh Tao Climbing Club pages. Search snippet: \'The club is donation based... Friday\' — i.e. a donation-based club meeting on Fridays. A \'Club Days 2023\' gallery documents e.g. \'13 January Jansom Bay\' club day with an embedded YouTube video titled \'Koh Tao Climbing Club · Best Club Day...\' (truncated). UNREACHABLE — both club page URLs return HTTP 502 from this network; content summarized from search snippets only (partially verified). Corroborates the active \'Koh Tao Climbing Club\' referenced by theCrag\'s bolting ethic. Worth retrying later for Jansom Bay club-day photos/videos.',
  },
  {
    title: 'Why rock climbing is the hidden gem activity in Koh Tao',
    author: 'unverified (The Points Traveler blog)',
    date: '2025-06-10 (search index date; unverified on page)',
    url: 'https://www.thepointstraveler.com/why-rock-climbing-is-the-hidden-gem-activity-in-koh-tao/',
    type: 'blog post',
    summary:
      'Generic promotional-style article: climbing on Koh Tao is uncrowded, accessible to beginners via half/full-day guided trips with equipment and instruction, indoor gym introductory sessions available, community \'small but welcoming\'. Contains no crag names, route details or first-person climbing specifics — likely sponsored/SEO content. Low factual value; included for completeness. Fetched in full. No unique verifiable facts.',
  },
]
