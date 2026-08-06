import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SectionHeader from '@/components/SectionHeader'
import EmptyState from '@/components/EmptyState'
import { cragBySlug, type Style } from '@/data/climbing'
import { routesForCrag } from '@/data/routes'
import {
  guidePhotosForCrag,
  communityPhotosForCrag,
  isNdLicense,
  type PhotoEntry,
} from '@/data/photos'
import { imgSrc, GUIDE_PHOTO_CREDIT, GUIDE_PDF_URL, sourceLabel, gradeSystemLabel, styleLabel, styleList, cragFeaturePhoto } from '@/lib/photo'
import { styleBadgeFor, verifiedBadge, unverifiedBadge } from '@/lib/badges'
import PhotoCard from '@/components/PhotoCard'
import RouteCard from '@/components/RouteCard'
import RouteDetails, { hasRouteDetails } from '@/components/RouteDetails'
import {
  ArrowLeft,
  MapPin,
  Sun,
  Footprints,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  ListChecks,
  Info,
  Check,
  ExternalLink,
  ChevronRight,
  Banknote,
  AlertTriangle,
} from 'lucide-react'

// Guide imagery that belongs in the large topo viewer rather than the gallery.
const TOPO_KINDS = new Set(['photo-topo', 'topo-diagram', 'map'])

// People/atmosphere shots (as opposed to rock or topo imagery) — shown collapsed
// at the bottom of the gallery so the crag itself stays the focus.
const ATMOSPHERE_KINDS = new Set(['action-photo', 'scenic'])

// Gallery sort: crag context photos first, then community scenery, then the rest.
const contextRank = (p: PhotoEntry) =>
  p.kind === 'crag-photo' ? 0 : p.kind === 'community-photo' ? 1 : 2

// Route → topo matching: guidebook topo captions name their routes in prose
// ("named routes Good Morning Koh Tao (5 bolts, 14m), …"), so a
// case-insensitive substring check on the caption is enough.
const topoForRoute = (routeName: string, topos: PhotoEntry[]) => {
  const needle = routeName.toLowerCase()
  return topos.find((p) => p.caption.toLowerCase().includes(needle))
}

// One table-header treatment: uppercase micro-labels (per design skill).
const headClass = 'text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400'

// The `verified` note says what the 2026-08-02 fact-check confirmed; notes that
// open with "Unverified" mean nothing could be corroborated.
const isFactChecked = (verified?: string) =>
  verified != null && !verified.toLowerCase().startsWith('unverified')

export default function CragDetail() {
  const { slug } = useParams()
  const crag = cragBySlug(slug ?? '')
  const [lightbox, setLightbox] = useState<PhotoEntry | null>(null)
  const [searchParams] = useSearchParams()
  const routeParam = searchParams.get('route')
  const topoSectionRef = useRef<HTMLElement>(null)
  const [topoFlash, setTopoFlash] = useState(false)
  // Expanded per-route detail rows in the routes table (description/protection/FA).
  const [openDetails, setOpenDetails] = useState<ReadonlySet<string>>(new Set())

  // Computed before the not-found return so hooks below run unconditionally.
  const guideAll = crag ? guidePhotosForCrag(crag.name) : []
  const topos = guideAll.filter((p) => TOPO_KINDS.has(p.kind))

  // Deep link /crags/{slug}?route=Name (from the route database): land on the
  // photo-topo section; when a topo caption mentions the route, open that topo
  // straight in the lightbox. No caption match → scroll + flash the header.
  useEffect(() => {
    if (!crag || !routeParam) return
    const scroll = window.setTimeout(() => {
      topoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
    const match = topoForRoute(routeParam, topos)
    let followUp: number | undefined
    if (match) {
      followUp = window.setTimeout(() => setLightbox(match), 600)
    } else if (topos.length > 0) {
      setTopoFlash(true)
      followUp = window.setTimeout(() => setTopoFlash(false), 2200)
    }
    return () => {
      window.clearTimeout(scroll)
      if (followUp) window.clearTimeout(followUp)
    }
    // topos derives from crag — stable per slug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crag, routeParam])

  if (!crag) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState title="Crag not found">
          <Link to="/crags" className="text-teal-700 dark:text-teal-400 hover:underline">
            ← Back to all crags
          </Link>
        </EmptyState>
      </div>
    )
  }

  const galleryGuide = guideAll.filter((p) => !TOPO_KINDS.has(p.kind))
  const community = communityPhotosForCrag(crag.name)
  const cragRoutes = routesForCrag(crag.name)
  const hero = cragFeaturePhoto(crag.name)
  const checked = isFactChecked(crag.verified)

  // Row/card click in the routes table: open the matching topo in the lightbox
  // directly; without a caption match, scroll to the topo section and flash it.
  const openRouteTopo = (routeName: string) => {
    const match = topoForRoute(routeName, topos)
    if (match) {
      setLightbox(match)
      return
    }
    topoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (topos.length > 0) {
      setTopoFlash(true)
      window.setTimeout(() => setTopoFlash(false), 2200)
    }
  }

  // Gallery split: crag context (rock, community scenery) up front, people/atmosphere
  // shots last under a collapsed toggle. If the crag has nothing else, the action
  // shots are shown directly so the page is never empty.
  const galleryAll = [...galleryGuide, ...community]
  const context = galleryAll
    .filter((p) => !ATMOSPHERE_KINDS.has(p.kind))
    .sort((a, b) => contextRank(a) - contextRank(b))
  const atmosphere = galleryAll.filter((p) => ATMOSPHERE_KINDS.has(p.kind))
  const atmosphereCollapsed = atmosphere.length > 0 && (context.length > 0 || topos.length > 0)

  const facts = [
    { icon: MapPin, label: 'Area', value: crag.area },
    { icon: GraduationCap, label: 'Grades', value: crag.grades },
    { icon: Sun, label: 'Sun', value: crag.sun },
    { icon: CalendarDays, label: 'Best season', value: crag.bestSeason ?? 'Unverified' },
    { icon: Footprints, label: 'Approach', value: crag.approach },
    { icon: ShieldAlert, label: 'Access', value: crag.access },
    ...(crag.accessFee ? [{ icon: Banknote, label: 'Entry fee', value: crag.accessFee }] : []),
    ...(crag.routeCount ? [{ icon: ListChecks, label: 'Route counts per source', value: crag.routeCount }] : []),
  ]

  const toggleDetails = (key: string) =>
    setOpenDetails((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <div>
      {/* Hero photo band — same cover pattern as the Home destination hero:
          dark scrim (both themes), white name + on-photo chips, credit
          bottom-left (thetopo .photo__credit style). */}
      {hero && (
        <section className="relative flex min-h-[46svh] items-end overflow-hidden border-b border-stone-200 dark:border-stone-800 sm:min-h-[58svh]">
          <img
            src={imgSrc(hero.file)}
            alt={hero.caption}
            className={`absolute inset-0 h-full w-full ${isNdLicense(hero) ? 'bg-stone-50 dark:bg-stone-900 object-contain' : 'object-cover'}`}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:pb-14 sm:pt-36">
            <Link
              to="/crags"
              className="mb-4 inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All crags
            </Link>
            <h1 className="font-sans text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl">
              {crag.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {crag.styles.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/40 bg-black/35 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm"
                >
                  {styleLabel[s] ?? s}
                </span>
              ))}
              {crag.highlight && (
                <span className="rounded-full border border-white/25 bg-black/25 px-2.5 py-0.5 text-xs text-white/85 backdrop-blur-sm">
                  {crag.highlight}
                </span>
              )}
            </div>
          </div>
          <p
            className="absolute bottom-2 left-3 max-w-[calc(100%-1.5rem)] text-[11px] text-white/85 drop-shadow line-clamp-2"
            title={hero.caption}
          >
            {hero.caption}
            {hero.credit ? (
              <>
                {' '}© {hero.credit} · {hero.license}
                {hero.sourceUrl && (
                  <>
                    {' · '}
                    <a href={hero.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                      source
                    </a>
                  </>
                )}
              </>
            ) : (
              <> · image {GUIDE_PHOTO_CREDIT}</>
            )}
          </p>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {!hero && (
          <>
            <Link
              to="/crags"
              className="mb-6 inline-flex items-center gap-1 text-sm text-stone-600 dark:text-stone-300 transition-colors hover:text-teal-700 dark:hover:text-teal-400"
            >
              <ArrowLeft className="h-4 w-4" /> All crags
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
                {crag.name}
              </h1>
              {crag.styles.map((s) => (
                <span key={s} className={`rounded-full border px-2.5 py-0.5 text-xs ${styleBadgeFor(s)}`}>
                  {styleLabel[s] ?? s}
                </span>
              ))}
              {crag.highlight && (
                <span className="rounded-full border border-stone-300 dark:border-stone-700 px-2.5 py-0.5 text-xs text-stone-600 dark:text-stone-300">
                  {crag.highlight}
                </span>
              )}
            </div>
          </>
        )}

        <p className="max-w-prose text-lg text-stone-600 dark:text-stone-300">{crag.summary}</p>

        {crag.accessWarning && (
          <div className="mt-6 max-w-prose rounded-r-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40 px-4 py-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4" /> Access warning
            </p>
            <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-300/90">{crag.accessWarning}</p>
          </div>
        )}

        {/* Facts — clean inline meta (icons + values, hairline separators, no boxes) */}
        <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <f.icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> {f.label}
              </dt>
              <dd className="mt-1.5 text-sm text-stone-800 dark:text-stone-200">{f.value}</dd>
            </div>
          ))}
          {crag.coords && (
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Coordinates
              </dt>
              <dd className="mt-1.5">
                <a
                  href={`https://www.google.com/maps?q=${crag.coords.lat},${crag.coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm tabular-nums text-teal-700 dark:text-teal-400 hover:underline"
                >
                  {crag.coords.lat.toFixed(5)}, {crag.coords.lng.toFixed(5)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </dd>
            </div>
          )}
        </dl>

        {crag.verified && (
          <p
            className={`mt-6 flex max-w-prose items-start gap-1.5 text-xs ${
              checked ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {checked ? (
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            ) : (
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            )}
            <span>
              <span className="font-semibold">{checked ? 'Fact-checked' : 'Unverified'} (2026-08-02).</span>{' '}
              <span className="text-stone-500 dark:text-stone-400">{crag.verified}</span>
            </span>
          </p>
        )}

        {/* Photo-topos */}
        {topos.length > 0 && (
          <section ref={topoSectionRef} className="mt-12 scroll-mt-20 sm:mt-16">
            <div
              className={`-mx-2 rounded-md px-2 py-1 transition-colors duration-500 ${
                topoFlash ? 'bg-teal-100 dark:bg-teal-500/20' : ''
              }`}
            >
              <SectionHeader
                kicker="Route finding"
                title="Photo-topos & maps"
                lede="Every topo page from the Goodtime guidebook that covers this crag — click any image to enlarge."
              />
            </div>
            <Carousel opts={{ loop: topos.length > 1 }} className="mx-auto mt-8 max-w-4xl">
              <CarouselContent>
                {topos.map((p) => (
                  <CarouselItem key={p.file}>
                    <button
                      type="button"
                      onClick={() => setLightbox(p)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img
                        src={imgSrc(p.file)}
                        alt={p.caption}
                        loading="lazy"
                        className="max-h-[60vh] w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 object-contain"
                      />
                    </button>
                    <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-stone-600 dark:text-stone-300">
                      {p.caption}
                    </p>
                    <p className="mt-1 text-center text-xs text-stone-500 dark:text-stone-400">
                      Image {GUIDE_PHOTO_CREDIT} · click to enlarge
                    </p>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {topos.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 border-stone-300 dark:border-stone-700 bg-white/90 dark:bg-stone-950/90 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900" />
                  <CarouselNext className="right-2 border-stone-300 dark:border-stone-700 bg-white/90 dark:bg-stone-950/90 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900" />
                </>
              )}
            </Carousel>
          </section>
        )}

        {/* Gallery — crag context first; action/atmosphere shots collapsed at the end */}
        {(context.length > 0 || atmosphere.length > 0) && (
          <section className="mt-12 sm:mt-16">
            <SectionHeader
              kicker="On the rock"
              title="Gallery"
              lede="Crag context first, people and atmosphere last — every photo stays © its author."
            />
            {context.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {context.map((p) => (
                  <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
                ))}
              </div>
            )}
            {atmosphere.length > 0 &&
              (atmosphereCollapsed ? (
                <details className="group mt-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
                  <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-teal-700 dark:hover:text-teal-400 [&::-webkit-details-marker]:hidden">
                    <ChevronRight className="h-4 w-4 text-stone-400 dark:text-stone-500 transition-transform group-open:rotate-90" />
                    Action &amp; atmosphere ({atmosphere.length})
                  </summary>
                  <div className="grid gap-4 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
                    {atmosphere.map((p) => (
                      <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
                    ))}
                  </div>
                </details>
              ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {atmosphere.map((p) => (
                    <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
                  ))}
                </div>
              ))}
          </section>
        )}

        {topos.length === 0 && galleryGuide.length === 0 && community.length === 0 && (
          <EmptyState className="mt-12" title="No photos for this crag yet">
            Contributions welcome via the Koh Tao Climbing Club.
          </EmptyState>
        )}

        {/* Routes table */}
        <section className="mt-12 sm:mt-16">
          <SectionHeader
            kicker="The lines"
            title="Routes & problems"
            lede={`${cragRoutes.length} in the merged database — click a route to open its photo-topo, or the info button for description and first-ascent beta.`}
          />
          {cragRoutes.length === 0 ? (
            <EmptyState className="mt-8" title="No individual routes in the merged database">
              See the Rakkup guide or the route counts above, and verify locally.
            </EmptyState>
          ) : (
            <>
              <div className="mt-8 hidden overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800">
                      <TableHead className={headClass}>Route</TableHead>
                      <TableHead className={headClass}>Grade</TableHead>
                      <TableHead className={headClass}>Style</TableHead>
                      <TableHead className={headClass}>★</TableHead>
                      <TableHead className={`hidden md:table-cell ${headClass}`}>Length</TableHead>
                      <TableHead className={headClass}>Status</TableHead>
                      <TableHead className={`hidden lg:table-cell ${headClass}`}>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cragRoutes.map((r, i) => {
                      const key = `${r.name}-${i}`
                      const expandable = hasRouteDetails(r)
                      const open = openDetails.has(key)
                      return (
                        <Fragment key={key}>
                          <TableRow
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest('a,button')) return
                              openRouteTopo(r.name)
                            }}
                            className="group cursor-pointer border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900"
                          >
                            <TableCell className="min-w-40 whitespace-normal font-medium text-stone-900 dark:text-stone-100">
                              <span className="text-teal-700 dark:text-teal-400 group-hover:underline">{r.name}</span>
                              {expandable && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleDetails(key)
                                  }}
                                  aria-expanded={open}
                                  aria-label={`Route details for ${r.name}`}
                                  title="Description, protection, first ascent"
                                  className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full align-middle transition-colors ${
                                    open ? 'text-teal-700 dark:text-teal-400' : 'text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400'
                                  }`}
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {r.sector && (
                                <span className="ml-2 rounded bg-stone-100 dark:bg-stone-900/80 px-1.5 py-0.5 text-[10px] text-stone-500 dark:text-stone-400">
                                  {r.sector}
                                </span>
                              )}
                              {r.ticks != null && r.ticks > 0 && (
                                <span className="ml-2 text-[10px] font-normal text-stone-500 dark:text-stone-400">
                                  {r.ticks} ticks
                                </span>
                              )}
                              {r.note && (
                                <p className="mt-1 flex items-start gap-1 text-xs font-normal text-amber-700 dark:text-amber-400">
                                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {r.note}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className="font-semibold tabular-nums text-teal-700 dark:text-teal-400">{r.grade}</span>{' '}
                              <span className="rounded bg-stone-100 dark:bg-stone-900/80 px-1 py-0.5 text-[10px] uppercase text-stone-500 dark:text-stone-400">
                                {gradeSystemLabel[r.gradeSystem] ?? r.gradeSystem}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-stone-700 dark:text-stone-300">
                              <span className="flex flex-wrap gap-1">
                                {styleList(r.style).map((s) => (
                                  <span
                                    key={s}
                                    className={`rounded-full border px-2 py-0.5 text-xs ${styleBadgeFor(s)}`}
                                  >
                                    {styleLabel[s as Style] ?? s}
                                  </span>
                                ))}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-amber-600 dark:text-amber-400">
                              {r.stars != null && r.stars > 0 ? r.stars : '—'}
                            </TableCell>
                            <TableCell className="hidden text-sm text-stone-500 dark:text-stone-400 md:table-cell">
                              {r.lengthM ? `${r.lengthM} m` : ''}
                              {r.bolts ? `${r.lengthM ? ' · ' : ''}${r.bolts} bolts` : ''}
                              {!r.lengthM && !r.bolts && '—'}
                            </TableCell>
                            <TableCell>
                              {r.verified ? (
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${verifiedBadge}`}>
                                  <Check className="h-3 w-3" /> verified
                                </span>
                              ) : (
                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${unverifiedBadge}`}>
                                  unverified
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {r.sourceUrl ? (
                                <a
                                  href={r.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 hover:underline"
                                >
                                  {sourceLabel[r.source] ?? r.source}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-xs text-stone-500 dark:text-stone-400">
                                  {sourceLabel[r.source] ?? r.source}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                          {open && expandable && (
                            <TableRow className="border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900">
                              <TableCell colSpan={7} className="whitespace-normal py-3 pl-6">
                                <RouteDetails route={r} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      )
                    })}
                  </TableBody>
              </Table>
              </div>
              {/* Stacked cards on small screens */}
              <div className="mt-8 space-y-3 md:hidden">
                {cragRoutes.map((r, i) => (
                  <RouteCard key={`${r.name}-${i}`} route={r} onOpen={() => openRouteTopo(r.name)} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Beta + sectors */}
        <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Beta</h2>
            <ul className="mt-6 space-y-3">
              {crag.details.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-700 dark:text-stone-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  {d}
                </li>
              ))}
            </ul>
            {crag.sectors && (
              <div className="mt-8">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Sectors
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {crag.sectors.map((s) => (
                    <div key={s.name} className="rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-3">
                      <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{s.name}</div>
                      {s.note && <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{s.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-5">
            <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">Good to know</h2>
            <div className="mt-3 space-y-3 text-sm text-stone-600 dark:text-stone-300">
              <p>
                Grades and bolt counts come from Mountain Project, 27crags, the Goodtime
                Adventures PDF and vault notes — scales and reliability differ per source. Amber
                rows need local verification.
              </p>
              <p>
                Near-coast hardware can be suspect — inspect before trusting and ask the Koh Tao
                Climbing Club when in doubt.
              </p>
              <Link to="/routes" className="inline-block font-medium text-teal-700 dark:text-teal-400 hover:underline">
                Full route database →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-h-[92vh] max-w-[calc(100vw-2rem)] overflow-y-auto border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-4 text-stone-900 dark:text-stone-100 sm:max-w-4xl sm:p-6">
          {lightbox && (
            <>
              <DialogTitle className="sr-only">Photo viewer</DialogTitle>
              <img
                src={imgSrc(lightbox.file)}
                alt={lightbox.caption}
                className="max-h-[75vh] w-full rounded-md bg-stone-50 dark:bg-stone-900 object-contain"
              />
              <DialogDescription className="text-sm text-stone-600 dark:text-stone-300">
                {lightbox.caption}
              </DialogDescription>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {lightbox.credit ? (
                  <>
                    © {lightbox.credit} · {lightbox.license}
                    {lightbox.sourceUrl && (
                      <>
                        {' · '}
                        <a
                          href={lightbox.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-700 dark:text-teal-400 hover:underline"
                        >
                          source
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Image {GUIDE_PHOTO_CREDIT} ·{' '}
                    <a
                      href={GUIDE_PDF_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      PDF source
                    </a>
                  </>
                )}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
