import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

// Hero: wide view over Tanote Bay and its granite headlands (CC BY 2.0, Fabio Achilli)
// — scenery and rock rather than a random action shot.
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

export default function Home() {
  return (
    <div>
      {/* Photo hero */}
      <section className="relative border-b border-stone-800">
        <img
          src={imgSrc(HERO.file)}
          alt={HERO.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-28">
          <Badge variant="outline" className="mb-4 border-teal-500/40 bg-stone-950/60 text-teal-300">
            Gulf of Thailand · Chumphon Archipelago
          </Badge>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Granite, jungle &amp; sea — the complete climbing database for{' '}
            <span className="text-teal-400">Koh Tao</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-stone-300 sm:text-lg">
            A small island famous for diving, hiding {routes.length} documented sport, trad and
            boulder lines on 200-million-year-old granite. Every crag, route, season tip and
            access rule — fact-checked against 2026 sources.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto">
              <Link to="/crags">
                Explore the island map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-stone-600 bg-stone-950/60 text-stone-200 hover:bg-stone-800 sm:w-auto"
            >
              <Link to="/routes">Browse {routes.length} routes</Link>
            </Button>
          </div>
        </div>
        <p className="absolute inset-x-3 bottom-2 rounded bg-stone-950/70 px-2 py-1 text-[11px] text-stone-400 sm:left-auto sm:max-w-[70%]">
          {HERO.caption} © {HERO.credit} ·{' '}
          <a href={HERO.sourceUrl} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">
            source
          </a>
        </p>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-stone-800 bg-stone-900/60">
              <CardContent className="flex items-center gap-3 p-5">
                <s.icon className="h-6 w-6 text-teal-400" />
                <div>
                  <div className="text-xl font-semibold">{s.value}</div>
                  <div className="text-xs text-stone-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured crags */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured crags</h2>
          <Link to="/crags" className="text-sm text-teal-400 hover:underline">
            All {crags.length} crags →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((slug) => {
            const c = crags.find((x) => x.slug === slug)!
            const thumb = cragThumbnail(c.name)
            return (
              <Link key={slug} to={`/crags/${slug}`}>
                <Card className="h-full overflow-hidden border-stone-800 bg-stone-900/60 transition-colors hover:border-teal-500/50">
                  {thumb && (
                    <div className={`h-44 w-full ${isNdLicense(thumb) ? 'bg-stone-950' : ''}`}>
                      <img
                        src={imgSrc(thumb.file)}
                        alt={thumb.caption}
                        loading="lazy"
                        className={`h-full w-full ${isNdLicense(thumb) ? 'object-contain' : 'object-cover'}`}
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                      {c.highlight && (
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap border-stone-700 text-xs text-stone-400"
                        >
                          {c.highlight}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <MapPin className="h-3 w-3" /> {c.area}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 line-clamp-2 text-sm text-stone-400">{c.summary}</p>
                    <div className="flex flex-wrap gap-1.5">
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
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Latest from the community */}
      <section className="border-t border-stone-800 bg-stone-900/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Latest from the community</h2>
            <Link to="/community" className="text-sm text-teal-400 hover:underline">
              All {reports.length} reports →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latestReports.map((r) => (
              <a key={r.url + r.title} href={r.url} target="_blank" rel="noreferrer">
                <Card className="h-full border-stone-800 bg-stone-950 transition-colors hover:border-teal-500/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-base leading-snug">{r.title}</CardTitle>
                      <ExternalLink className="h-4 w-4 shrink-0 text-stone-500" />
                    </div>
                    <div className="text-xs text-stone-500">
                      {r.author} · {r.date}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-4 text-sm text-stone-400">{r.summary}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Classics strip */}
      <section className="border-t border-stone-800">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">Classic ticks</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {classicRoutes
              .filter((r) => r.stars >= 2)
              .slice(0, 4)
              .map((r) => {
                const c = crags.find((x) => x.slug === r.cragSlug)!
                return (
                  <Link key={r.slug} to={`/crags/${r.cragSlug}`}>
                    <div className="h-full rounded-lg border border-stone-800 bg-stone-900/60 p-4 transition-colors hover:border-teal-500/50">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{r.name}</span>
                        <span className="font-semibold text-teal-400">{r.grade}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                        <Mountain className="h-3 w-3" /> {c.name} · {r.style}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-stone-400">{r.note}</p>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </div>
  )
}
