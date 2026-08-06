import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/SectionHeader'
import { crags, routes as classicRoutes, styleColor, sources } from '@/data/climbing'
import { routes } from '@/data/routes'
import { guidePhotos, communityPhotos, isUsable, isNdLicense } from '@/data/photos'
import { reports } from '@/data/reports'
import { cragThumbnail, imgSrc } from '@/lib/photo'
import {
  ArrowRight,
  MapPin,
  Sun,
  Route as RouteIcon,
  Mountain,
  Camera,
  BookOpen,
  ExternalLink,
} from 'lucide-react'

// Hero: wide view over Tanote Bay and its granite headlands (CC BY 2.0, Fabio
// Achilli) — scenery and rock rather than a random action shot. 2000×1125.
const HERO = communityPhotos.find((p) => p.file.includes('tanote-bay-commons-achilli'))!

const stats = [
  { icon: MapPin, label: 'Documented crags', value: String(crags.length) },
  { icon: RouteIcon, label: 'Routes & problems', value: String(routes.length) },
  {
    icon: Camera,
    label: 'Catalogued photos',
    value: String(guidePhotos.filter(isUsable).length + communityPhotos.length),
  },
  { icon: BookOpen, label: 'Fact-check sources', value: String(sources.length) },
]

const featured = ['meks-mountain', 'tanote-bay', 'jansom-bay', 'secret-garden-boulders']

// Newest dated reports first (dates are free-form, e.g. "2026-04 to 2026-05…").
const dateKey = (d: string) => {
  const m = d.match(/(\d{4})(?:-(\d{2}))?/)
  return m ? Number(m[1]) * 100 + Number(m[2] ?? 0) : 0
}
const latestReports = [...reports].sort((a, b) => dateKey(b.date) - dateKey(a.date)).slice(0, 3)

// The skill's card recipe — one visual system for every linked card.
const cardRecipe =
  'group h-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900 transition duration-200 hover:-translate-y-0.5 hover:border-stone-700'

export default function Home() {
  return (
    <div>
      {/* Hero — full-bleed real crag photo, bottom-left content block */}
      <section className="relative flex min-h-[78svh] items-end overflow-hidden border-b border-stone-800">
        <img
          src={imgSrc(HERO.file)}
          alt={HERO.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/15" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-36 sm:pb-16 sm:pt-44">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Gulf of Thailand · Chumphon Archipelago
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-stone-50 sm:text-5xl">
            Granite, jungle &amp; sea — the complete climbing database for Koh Tao
          </h1>
          <p className="mt-4 max-w-prose text-base text-stone-300 sm:text-lg">
            A small island famous for diving, hiding {routes.length} documented sport, trad and
            boulder lines on 200-million-year-old granite — every crag, season tip and access rule
            fact-checked against 2026 sources.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className="w-full bg-teal-400 font-semibold text-stone-950 hover:bg-teal-300 sm:w-auto"
            >
              <Link to="/crags">
                Explore the island map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-stone-600 bg-stone-950/60 text-stone-100 hover:bg-stone-800 sm:w-auto"
            >
              <Link to="/routes">Browse {routes.length} routes</Link>
            </Button>
          </div>
          <p className="mt-10 inline-block rounded bg-stone-950/70 px-2 py-1 text-[11px] text-stone-400">
            {HERO.caption} © {HERO.credit} ·{' '}
            <a
              href={HERO.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:underline"
            >
              source
            </a>
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-stone-800 bg-stone-900/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="h-5 w-5 shrink-0 text-teal-400" />
              <div>
                <div className="font-display text-2xl font-semibold tabular-nums text-stone-100">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-stone-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured crags */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            kicker="Where to climb"
            title="Featured crags"
            lede="Four headlands and jungled boulder fields to start with — the full island map has them all."
          />
          <Link
            to="/crags"
            className="hidden shrink-0 text-sm text-teal-400 hover:underline sm:block"
          >
            All {crags.length} crags →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {featured.map((slug) => {
            const c = crags.find((x) => x.slug === slug)!
            const thumb = cragThumbnail(c.name)
            return (
              <Link key={slug} to={`/crags/${slug}`} className="h-full">
                <article className={cardRecipe}>
                  {thumb && (
                    <div className={`aspect-[4/3] w-full ${isNdLicense(thumb) ? 'bg-stone-950' : ''}`}>
                      <img
                        src={imgSrc(thumb.file)}
                        alt={thumb.caption}
                        loading="lazy"
                        className={`h-full w-full ${isNdLicense(thumb) ? 'object-contain' : 'object-cover'}`}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {c.name}
                      </h3>
                      {c.highlight && (
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap border-stone-700 text-xs text-stone-400"
                        >
                          {c.highlight}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <MapPin className="h-3 w-3" /> {c.area}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-stone-400">{c.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.styles.map((s) => (
                        <span
                          key={s}
                          className={`rounded-full border px-2 py-0.5 text-xs ${styleColor[s]}`}
                        >
                          {s}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-1 text-xs text-stone-500">
                        <Sun className="h-3 w-3" /> {c.sun}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
        <p className="mt-6 sm:hidden">
          <Link to="/crags" className="text-sm text-teal-400 hover:underline">
            All {crags.length} crags →
          </Link>
        </p>
      </section>

      {/* Latest from the community */}
      <section className="border-y border-stone-800 bg-stone-900/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              kicker="Trip reports"
              title="Latest from the community"
              lede="First-hand conditions, dated prices and historical colour — every card links to the original."
            />
            <Link
              to="/community"
              className="hidden shrink-0 text-sm text-teal-400 hover:underline sm:block"
            >
              All {reports.length} reports →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {latestReports.map((r) => (
              <a key={r.url + r.title} href={r.url} target="_blank" rel="noreferrer" className="h-full">
                <article className={`${cardRecipe} flex flex-col p-5`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight">
                      {r.title}
                    </h3>
                    <ExternalLink className="h-4 w-4 shrink-0 text-stone-500 transition-colors group-hover:text-teal-400" />
                  </div>
                  <div className="mt-1.5 text-xs text-stone-500">
                    {r.author} · {r.date}
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm text-stone-400">{r.summary}</p>
                </article>
              </a>
            ))}
          </div>
          <p className="mt-6 sm:hidden">
            <Link to="/community" className="text-sm text-teal-400 hover:underline">
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
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {classicRoutes
            .filter((r) => r.stars >= 2)
            .slice(0, 4)
            .map((r) => {
              const c = crags.find((x) => x.slug === r.cragSlug)!
              return (
                <Link key={r.slug} to={`/crags/${r.cragSlug}`} className="h-full">
                  <article className={`${cardRecipe} p-4`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">{r.name}</span>
                      <span className="font-semibold tabular-nums text-teal-400">{r.grade}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <Mountain className="h-3 w-3" /> {c.name} · {r.style}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-stone-400">{r.note}</p>
                  </article>
                </Link>
              )
            })}
        </div>
      </section>
    </div>
  )
}
