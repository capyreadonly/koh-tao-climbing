import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import TopoSectionHeader from '@/components/TopoSectionHeader'
import CragCard from '@/components/CragCard'
import CragMap from '@/components/CragMap'
import { crags } from '@/data/climbing'
import { routes } from '@/data/routes'
import { communityPhotos, isNdLicense } from '@/data/photos'
import { imgSrc, GUIDE_PHOTO_CREDIT } from '@/lib/photo'
import { BedDouble, Check, ChevronLeft, ChevronRight, Ship, Smartphone, Sun, Waves } from 'lucide-react'

// Home = the thetopo.com destination-area pattern (work/thetopo-tokens.md):
// photo cover with the destination name → "Climbing in Koh Tao | Destination
// Info and Guidebook" → island map → "Koh Tao topos" crag cards → Photos →
// Travel info → PWA app promo. Koh Tao is our one destination.

// Cover photo: wide view over Tanote Bay and its granite headlands
// (CC BY 2.0, Fabio Achilli) — 2000×1125, crops freely (CC BY, not ND).
const COVER = communityPhotos.find((p) => p.file.includes('tanote-bay-commons-achilli'))!

// Photos strip: CC-ND images must be shown unmodified, and the strip crops to a
// fixed height — so only non-ND community photos go in.
const STRIP = communityPhotos.filter((p) => !isNdLicense(p)).slice(0, 14)
const STRIP_PHOTOGRAPHERS = new Set(STRIP.map((p) => p.credit).filter(Boolean)).size

// Phone-mockup screen in the app promo: the Mek's Mountain hand-drawn area map
// from the Goodtime guidebook PDF — real guide content, reads as "the app".
const PHONE_SCREEN = 'images/guide/p08-0-X19.jpg'

// Anchor tabs under the hero, mirroring thetopo's INFO/MAP/TOPO/… tab bar.
const TABS = [
  { id: 'info', label: 'Info' },
  { id: 'map', label: 'Map' },
  { id: 'topos', label: 'Topo' },
  { id: 'photos', label: 'Photos' },
  { id: 'travel', label: 'Travel info' },
  { id: 'get-app', label: 'Get the app' },
]

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// Travel-info blocks (thetopo's four-icon pattern), content from data/info.ts.
const TRAVEL = [
  {
    icon: Sun,
    title: 'Best season',
    body: 'December to March is cool, dry and reliable — but the rock is warm year-round and climbing is possible in every month with flexible planning. October–November brings the monsoon: short afternoon downpours and the odd full rainy day. Whatever the month: climb from 7:00, match the crag to the shade, and give the midday hours to lunch, a snorkel and a siesta.',
  },
  {
    icon: Ship,
    title: 'How to get there?',
    body: 'No airport on the island — ferries land at Mae Haad pier from Chumphon (~1 h 45, from ~350 THB), Koh Samui (~2 h, nearest airport) and Surat Thani. On the island a rental motorbike is the standard answer; truck taxis cover the rest, and every crag is a short ride away.',
  },
  {
    icon: BedDouble,
    title: 'Where to sleep?',
    body: "Sairee Beach is the climbing hub — The Bunker combines hostel, bouldering gym and gear rental a short ride from most crags, and Goodtime Adventures runs courses from the same strip. Mae Haad suits early ferries, Tanote Bay the quiet days. Book ahead for December–March: Christmas sells out months in advance.",
  },
  {
    icon: Waves,
    title: 'Other activities',
    body: "One of the cheapest places on earth to learn to dive, and the snorkelling is a fin-kick from most crags — Jansom Bay's classic day is climb in the morning, snorkel the bay at lunch. Add freediving courses, viewpoint hikes, the Koh Nang Yuan sandbar, yoga shalas and The Bunker's gym for rainy afternoons.",
  },
]

const APP_BULLETS = [
  `${routes.length} routes and ${crags.length} crags — topos, grades, access notes and the fact-check log`,
  'Self-hosted maps, tiles and photos that keep working with jungle-grade signal',
  'Per-style GPS markers — sport, trad, boulder — straight into each crag guide',
  'Free, no account, no subscription — install it like any app',
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('')
  const [showInstall, setShowInstall] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  // Photos-strip nav arrows (thetopo swiper pattern): circular buttons at the
  // strip edges, desktop only — touch users just swipe.
  const scrollStrip = (dir: 1 | -1) =>
    stripRef.current?.scrollBy({ left: dir * stripRef.current.clientWidth * 0.8, behavior: 'smooth' })

  // Minimal scrollspy for the anchor tab bar (active tab = yellow underline).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveTab(e.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    for (const t of TABS) {
      const el = document.getElementById(t.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* 1 — Cover hero: full-width photo, black overlay, centered destination
          name + subtitle + yellow CTA, credit bottom-left (thetopo banner). */}
      <section className="relative flex h-[62svh] min-h-[420px] items-center justify-center overflow-hidden sm:h-[72svh]">
        <img
          src={imgSrc(COVER.file)}
          alt={COVER.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
        <div className="relative px-4 text-center">
          <h1 className="font-sans text-5xl font-bold tracking-tight text-white drop-shadow-md sm:text-6xl">
            Koh Tao
          </h1>
          <p className="mt-2 text-white/90 drop-shadow sm:text-lg">
            Gulf of Thailand · Chumphon Archipelago
          </p>
          <button
            type="button"
            onClick={() => scrollTo('topos')}
            className="mt-6 rounded bg-topo px-8 py-3 text-sm font-semibold text-stone-950 shadow transition hover:bg-topo-hover"
          >
            Browse the topos
          </button>
        </div>
        <p className="absolute bottom-2 left-3 text-[11px] text-white/85 drop-shadow">
          {COVER.caption} © {COVER.credit} ·{' '}
          <a href={COVER.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
            source
          </a>
        </p>
      </section>

      {/* Anchor tab bar (thetopo pattern): centered uppercase tabs, active =
          yellow underline. Not sticky — it scrolls away with the hero. On
          mobile it's a single scrollable row like theirs, wrapping allowed
          only from sm up. */}
      <nav aria-label="On this page" className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl items-center gap-x-6 overflow-x-auto px-4 py-3 sm:flex-wrap sm:justify-center sm:gap-y-1 sm:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(t.id)}
              className={`shrink-0 border-b-2 px-1 py-1 text-[13px] font-medium uppercase tracking-wide transition-colors ${
                activeTab === t.id
                  ? 'border-topo text-stone-900 dark:text-stone-100'
                  : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 2 — Info: destination description */}
      <section id="info" className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <TopoSectionHeader title="Climbing in Koh Tao | Destination Info and Guidebook" />
          <div className="mt-6 space-y-4 text-center text-lg font-light leading-relaxed text-stone-700 dark:text-stone-300">
            <p>
              Koh Tao might be mostly known as a diver's island, but the dive boats motor past
              weathered granite headlands and jungled boulder fields — coarse, crystalline granite
              from the same 200-million-year-old batholith that built the walls of Koh Phangan and
              Ang Thong. Weathered into rounded domes, stacked boulders and seaside cliffs, it holds{' '}
              {crags.length} documented crags and {routes.length} routes and problems a short ride
              from the beach.
            </p>
            <p>
              Friendly sport walls at Mek's Mountain, trad adventure lines on Mao Rock, seaside
              granite at Tanote Bay and Jansom Bay, and bouldering in the Secret Garden and on
              Sairee Beach — every crag here is fact-checked against Mountain Project, 27crags,
              theCrag and the Goodtime Adventures guidebook.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Area map: full-bleed self-hosted tiles, per-style yellow markers */}
      <section id="map" aria-label="Island map" className="scroll-mt-16 border-y border-stone-200 dark:border-stone-800 pb-4">
        <CragMap fullBleed />
      </section>

      {/* 4 — Koh Tao topos: every crag as a thetopo-style card */}
      <section id="topos" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <TopoSectionHeader
            title="Koh Tao topos"
            subtitle={`${routes.length} routes in ${crags.length} crags`}
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crags.map((c) => (
              <CragCard key={c.slug} crag={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Photos: horizontal community strip with credits */}
      <section id="photos" className="scroll-mt-16 border-y border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
        <div className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <TopoSectionHeader
              title="Photos"
              subtitle={`${STRIP.length} photos shared by ${STRIP_PHOTOGRAPHERS} climbers`}
            />
          </div>
          <div className="relative mt-10">
            <div
              ref={stripRef}
              className="flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:px-[max(1rem,calc((100vw-72rem)/2))]"
            >
              {STRIP.map((p) => (
                <figure key={p.file} className="relative shrink-0 snap-center overflow-hidden rounded-[10px]">
                  <img
                    src={imgSrc(p.file)}
                    alt={p.caption}
                    loading="lazy"
                    className="h-60 w-auto sm:h-96"
                  />
                  <figcaption className="absolute bottom-2 left-2 rounded bg-stone-950/70 px-1.5 py-0.5 text-[10px] text-white">
                    {p.caption.length > 60 ? `${p.caption.slice(0, 57)}…` : p.caption}
                    {p.credit ? ` © ${p.credit}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
            {/* Circular edge arrows (thetopo swiper), desktop only */}
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              aria-label="Scroll photos back"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-stone-800 shadow-lg transition hover:scale-105 dark:bg-stone-800 dark:text-stone-100 sm:block"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              aria-label="Scroll photos forward"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-stone-800 shadow-lg transition hover:scale-105 dark:bg-stone-800 dark:text-stone-100 sm:block"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-center text-sm">
            <Link to="/community" className="font-medium text-teal-700 dark:text-teal-400 hover:underline">
              Trip reports &amp; community photos →
            </Link>
          </p>
        </div>
      </section>

      {/* 6 — Travel info: the four-icon pattern, content from data/info.ts */}
      <section id="travel" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <TopoSectionHeader title="Travel info" />
          <div className="mx-auto mt-10 max-w-2xl space-y-8">
            {TRAVEL.map((t) => (
              <div key={t.title} className="flex gap-5">
                <t.icon className="h-10 w-10 shrink-0 text-stone-900 dark:text-stone-100" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{t.body}</p>
                </div>
              </div>
            ))}
            <p className="pt-2 text-center text-sm">
              <Link to="/plan" className="font-medium text-teal-700 dark:text-teal-400 hover:underline">
                Read the full trip playbook →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 7 — App promo: the guide IS an installable PWA */}
      <section id="get-app" className="scroll-mt-16 border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <TopoSectionHeader
            title="Get the Koh Tao climbing guide on your smartphone"
            subtitle="This site is an installable app — the whole island guide, free and offline-capable."
          />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="mx-auto w-full max-w-[260px]">
              <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-stone-900 dark:border-stone-700 bg-stone-900 shadow-2xl">
                <img
                  src={imgSrc(PHONE_SCREEN)}
                  alt="The Koh Tao climbing guide app showing the Mek's Mountain area map"
                  className="aspect-[9/16] w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-stone-500 dark:text-stone-400">
                On screen: the Mek's Mountain area map, image {GUIDE_PHOTO_CREDIT}
              </p>
            </div>
            <div>
              <ul className="space-y-4">
                {APP_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" strokeWidth={2.5} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowInstall((v) => !v)}
                  aria-expanded={showInstall}
                  className="inline-flex items-center gap-2 rounded bg-topo px-8 py-3 text-sm font-semibold text-stone-950 shadow transition hover:bg-topo-hover"
                >
                  <Smartphone className="h-4 w-4" />
                  Add to Home Screen
                </button>
                {showInstall && (
                  <div className="mt-4 grid gap-4 rounded-[10px] border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">iPhone / iPad</p>
                      <p className="mt-1 text-stone-600 dark:text-stone-400">
                        Open in Safari → tap <span className="font-medium">Share</span> →{' '}
                        <span className="font-medium">Add to Home Screen</span>.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">Android</p>
                      <p className="mt-1 text-stone-600 dark:text-stone-400">
                        Open in Chrome → tap the <span className="font-medium">⋮ menu</span> →{' '}
                        <span className="font-medium">Install app</span> /{' '}
                        <span className="font-medium">Add to Home Screen</span>.
                      </p>
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
                  No app store, no account. Once installed, the guide and the map tiles you have
                  viewed keep working offline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
