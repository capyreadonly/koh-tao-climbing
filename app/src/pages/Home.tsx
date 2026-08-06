import { Link } from 'react-router'
import SectionHeader from '@/components/SectionHeader'
import CragCard from '@/components/CragCard'
import CragMap from '@/components/CragMap'
import { crags, routes as classicRoutes } from '@/data/climbing'
import { routes } from '@/data/routes'
import { communityPhotos } from '@/data/photos'
import { reports } from '@/data/reports'
import { seasons, gettingThere } from '@/data/info'
import { imgSrc } from '@/lib/photo'
import { ExternalLink, Mountain } from 'lucide-react'

// Destination-section photo: wide view over Tanote Bay and its granite
// headlands (CC BY 2.0, Fabio Achilli) — scenery and rock rather than a random
// action shot. 2000×1125. (Was the full-bleed hero until the map became the hero.)
const DESTINATION_PHOTO = communityPhotos.find((p) =>
  p.file.includes('tanote-bay-commons-achilli'),
)!

const featured = ['meks-mountain', 'tanote-bay', 'jansom-bay', 'secret-garden-boulders']

// Newest dated reports first (dates are free-form, e.g. "2026-04 to 2026-05…").
const dateKey = (d: string) => {
  const m = d.match(/(\d{4})(?:-(\d{2}))?/)
  return m ? Number(m[1]) * 100 + Number(m[2] ?? 0) : 0
}
const latestReports = [...reports].sort((a, b) => dateKey(b.date) - dateKey(a.date)).slice(0, 3)

export default function Home() {
  return (
    <div>
      {/* Map-first hero (thetopo/27crags pattern): the island map IS the landing
          page — full-bleed under the sticky header, headline chip floating over
          the tiles, markers opening crag popups. */}
      <section aria-label="Island map">
        <CragMap fullBleed>
          <div className="pointer-events-auto rounded-xl border border-stone-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">
              Gulf of Thailand<span className="hidden sm:inline"> · Chumphon Archipelago</span>
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Koh Tao
            </h1>
            <p className="mt-0.5 text-xs text-stone-600 sm:mt-1 sm:text-sm">
              <span className="font-semibold tabular-nums text-stone-900">{crags.length}</span>{' '}
              crags ·{' '}
              <span className="font-semibold tabular-nums text-stone-900">{routes.length}</span>{' '}
              routes — tap a marker
            </p>
          </div>
        </CragMap>
      </section>

      {/* Browse crags — the big photo cards, straight under the map */}
      <section className="border-y border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              kicker="Where to climb"
              title="Browse crags"
              lede="Four headlands and jungled boulder fields to start with — the map above has them all."
            />
            <Link
              to="/crags"
              className="hidden shrink-0 text-sm font-medium text-teal-700 hover:underline sm:block"
            >
              All {crags.length} crags →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {featured.map((slug) => (
              <CragCard key={slug} crag={crags.find((x) => x.slug === slug)!} />
            ))}
          </div>
          <p className="mt-6 sm:hidden">
            <Link to="/crags" className="text-sm font-medium text-teal-700 hover:underline">
              All {crags.length} crags →
            </Link>
          </p>
        </div>
      </section>

      {/* The destination — long-form editorial guide */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          kicker="The destination"
          title="An island of granite in the Gulf"
          lede="What the dive boats motor past: weathered granite headlands and jungled boulder fields, with routes a short ride from the beach."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-prose">
            <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900">
              The rock
            </h3>
            <p className="mt-3 text-stone-600">
              Koh Tao's climbing sits on coarse, crystalline granite — the same 200-million-year-old
              batholith that built the famous walls of nearby Koh Phangan and the Ang Thong marine
              park. Weathered into rounded domes, stacked boulders and seaside headlands, it
              delivers {crags.length} documented crags and {routes.length} routes and problems:
              friendly sport walls at Mek's Mountain, trad adventure lines on Mao Rock, and
              bouldering in the Secret Garden and on Sairee Beach.
            </p>
            <h3 className="mt-8 font-display text-lg font-semibold tracking-tight text-stone-900">
              The season
            </h3>
            <p className="mt-3 text-stone-600">{seasons.climate}</p>
            <p className="mt-3 text-stone-600">
              December to March is cool, dry and reliable; October and November bring the monsoon.
              Whatever the month, the day has the same shape — climb from 7:00, match the crag to
              the shade, and surrender the midday hours to lunch, a snorkel and a siesta.
            </p>
          </div>
          <div className="max-w-prose">
            <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900">
              Getting there
            </h3>
            <p className="mt-3 text-stone-600">{gettingThere.toIsland[0]}</p>
            <p className="mt-3 text-stone-600">
              {gettingThere.toIsland[1]} {gettingThere.toIsland[2]}
            </p>
            <h3 className="mt-8 font-display text-lg font-semibold tracking-tight text-stone-900">
              Rest days
            </h3>
            <p className="mt-3 text-stone-600">
              This is one of the cheapest places on earth to learn to dive, and the snorkelling is
              a fin-kick from most crags — Jansom Bay's classic day is climb in the morning, snorkel
              the bay at lunch. Add freediving courses, viewpoint hikes, the Koh Nang Yuan
              sandbar, yoga shalas and The Bunker's bouldering gym for rainy afternoons, and a rest
              day plans itself.
            </p>
            <p className="mt-6">
              <Link to="/plan" className="font-medium text-teal-700 hover:underline">
                Read the full trip playbook →
              </Link>
            </p>
          </div>
        </div>
        <figure className="mt-10">
          <img
            src={imgSrc(DESTINATION_PHOTO.file)}
            alt={DESTINATION_PHOTO.caption}
            loading="lazy"
            className="aspect-[16/10] w-full rounded-xl border border-stone-200 object-cover sm:aspect-[21/9]"
          />
          <figcaption className="mt-2 text-[11px] text-stone-500">
            {DESTINATION_PHOTO.caption} © {DESTINATION_PHOTO.credit} ·{' '}
            <a
              href={DESTINATION_PHOTO.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-teal-700 hover:underline"
            >
              source
            </a>
          </figcaption>
        </figure>
      </section>

      {/* Latest from the community */}
      <section className="border-y border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              kicker="Trip reports"
              title="Latest from the community"
              lede="First-hand conditions, dated prices and historical colour — every card links to the original."
            />
            <Link
              to="/community"
              className="hidden shrink-0 text-sm font-medium text-teal-700 hover:underline sm:block"
            >
              All {reports.length} reports →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {latestReports.map((r) => (
              <a key={r.url + r.title} href={r.url} target="_blank" rel="noreferrer" className="group block h-full">
                <article className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-stone-900">
                      {r.title}
                    </h3>
                    <ExternalLink className="h-4 w-4 shrink-0 text-stone-400 transition-colors group-hover:text-teal-600" />
                  </div>
                  <div className="mt-1.5 text-xs text-stone-500">
                    {r.author} · {r.date}
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm text-stone-600">{r.summary}</p>
                </article>
              </a>
            ))}
          </div>
          <p className="mt-6 sm:hidden">
            <Link to="/community" className="text-sm font-medium text-teal-700 hover:underline">
              All {reports.length} reports →
            </Link>
          </p>
        </div>
      </section>

      {/* Classics strip */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          kicker="Worth the walk"
          title="Classic ticks"
          lede="The lines locals name first — two stars and up in the fact-checked database."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classicRoutes
            .filter((r) => r.stars >= 2)
            .slice(0, 4)
            .map((r) => {
              const c = crags.find((x) => x.slug === r.cragSlug)!
              return (
                <Link key={r.slug} to={`/crags/${r.cragSlug}`} className="group block h-full">
                  <article className="h-full rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-stone-900">{r.name}</span>
                      <span className="font-semibold tabular-nums text-teal-700">{r.grade}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <Mountain className="h-3 w-3" /> {c.name} · {r.style}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-stone-600">{r.note}</p>
                  </article>
                </Link>
              )
            })}
        </div>
      </section>
    </div>
  )
}
