import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { cragBySlug, styleColor } from '@/data/climbing'
import { routesForCrag } from '@/data/routes'
import {
  guidePhotosForCrag,
  communityPhotosForCrag,
  type PhotoEntry,
} from '@/data/photos'
import { imgSrc, GUIDE_PHOTO_CREDIT, GUIDE_PDF_URL, sourceLabel, gradeSystemLabel } from '@/lib/photo'
import PhotoCard from '@/components/PhotoCard'
import {
  ArrowLeft,
  MapPin,
  Sun,
  Footprints,
  ShieldAlert,
  GraduationCap,
  CalendarDays,
  ListChecks,
  Info,
  Check,
  ExternalLink,
  Images,
  ChevronRight,
} from 'lucide-react'

// Guide imagery that belongs in the large topo viewer rather than the gallery.
const TOPO_KINDS = new Set(['photo-topo', 'topo-diagram', 'map'])

// People/atmosphere shots (as opposed to rock or topo imagery) — shown collapsed
// at the bottom of the gallery so the crag itself stays the focus.
const ATMOSPHERE_KINDS = new Set(['action-photo', 'scenic'])

// Gallery sort: crag context photos first, then community scenery, then the rest.
const contextRank = (p: PhotoEntry) =>
  p.kind === 'crag-photo' ? 0 : p.kind === 'community-photo' ? 1 : 2

export default function CragDetail() {
  const { slug } = useParams()
  const crag = cragBySlug(slug ?? '')
  const [lightbox, setLightbox] = useState<PhotoEntry | null>(null)

  if (!crag) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-stone-400">Crag not found.</p>
        <Link to="/crags" className="mt-4 inline-block text-teal-400 hover:underline">
          ← Back to all crags
        </Link>
      </div>
    )
  }

  const guideAll = guidePhotosForCrag(crag.name)
  const topos = guideAll.filter((p) => TOPO_KINDS.has(p.kind))
  const galleryGuide = guideAll.filter((p) => !TOPO_KINDS.has(p.kind))
  const community = communityPhotosForCrag(crag.name)
  const cragRoutes = routesForCrag(crag.name)

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
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/crags"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-400 hover:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4" /> All crags
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{crag.name}</h1>
        {crag.styles.map((s) => (
          <span key={s} className={`rounded-full border px-2.5 py-0.5 text-xs ${styleColor[s]}`}>
            {s}
          </span>
        ))}
        {crag.highlight && (
          <span className="rounded-full border border-stone-700 px-2.5 py-0.5 text-xs text-stone-400">
            {crag.highlight}
          </span>
        )}
      </div>
      <p className="mt-3 max-w-3xl text-lg text-stone-400">{crag.summary}</p>

      {/* Facts panel */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-stone-500">
              <f.icon className="h-3.5 w-3.5" /> {f.label}
            </div>
            <div className="mt-1.5 text-sm text-stone-200">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {crag.routeCount && (
          <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-stone-500">
              <ListChecks className="h-3.5 w-3.5" /> Route counts per source
            </div>
            <div className="mt-1.5 text-sm text-stone-200">{crag.routeCount}</div>
          </div>
        )}
        {crag.coords && (
          <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-stone-500">
              <MapPin className="h-3.5 w-3.5" /> Coordinates
            </div>
            <a
              href={`https://www.google.com/maps?q=${crag.coords.lat},${crag.coords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-sm text-teal-400 hover:underline"
            >
              {crag.coords.lat.toFixed(5)}, {crag.coords.lng.toFixed(5)}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {crag.verified && (
        <Alert className="mt-3 border-teal-500/30 bg-teal-500/10 text-teal-100">
          <Info className="h-4 w-4 text-teal-400" />
          <AlertTitle className="text-teal-300">Fact-check status (2026-08-02)</AlertTitle>
          <AlertDescription className="text-teal-100/80">{crag.verified}</AlertDescription>
        </Alert>
      )}

      {/* Photo-topos */}
      {topos.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Images className="h-5 w-5 text-teal-400" />
            <h2 className="text-2xl font-semibold">Photo-topos &amp; maps</h2>
          </div>
          <Carousel opts={{ loop: topos.length > 1 }} className="mx-auto max-w-4xl">
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
                      className="max-h-[60vh] w-full rounded-lg border border-stone-800 bg-stone-950 object-contain"
                    />
                  </button>
                  <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-stone-400">
                    {p.caption}
                  </p>
                  <p className="mt-1 text-center text-xs text-stone-500">
                    Image {GUIDE_PHOTO_CREDIT} · click to enlarge
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
            {topos.length > 1 && (
              <>
                <CarouselPrevious className="left-2 border-stone-700 bg-stone-900/80 text-stone-200 hover:bg-stone-800" />
                <CarouselNext className="right-2 border-stone-700 bg-stone-900/80 text-stone-200 hover:bg-stone-800" />
              </>
            )}
          </Carousel>
        </section>
      )}

      {/* Gallery — crag context first; action/atmosphere shots collapsed at the end */}
      {(context.length > 0 || atmosphere.length > 0) && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
          {context.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {context.map((p) => (
                <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
              ))}
            </div>
          )}
          {atmosphere.length > 0 &&
            (atmosphereCollapsed ? (
              <details className="group mt-6 rounded-lg border border-stone-800 bg-stone-900/60">
                <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-medium text-stone-300 transition-colors hover:text-teal-300 [&::-webkit-details-marker]:hidden">
                  <ChevronRight className="h-4 w-4 text-stone-500 transition-transform group-open:rotate-90" />
                  Action &amp; atmosphere ({atmosphere.length})
                </summary>
                <div className="grid gap-4 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
                  {atmosphere.map((p) => (
                    <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
                  ))}
                </div>
              </details>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {atmosphere.map((p) => (
                  <PhotoCard key={p.file} photo={p} onClick={() => setLightbox(p)} />
                ))}
              </div>
            ))}
        </section>
      )}

      {topos.length === 0 && galleryGuide.length === 0 && community.length === 0 && (
        <p className="mt-12 rounded-lg border border-dashed border-stone-800 p-6 text-center text-sm text-stone-500">
          No photos for this crag yet — contributions welcome via the Koh Tao Climbing Club.
        </p>
      )}

      {/* Routes table */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Routes &amp; problems{' '}
          <span className="text-base font-normal text-stone-500">
            ({cragRoutes.length} in the merged database)
          </span>
        </h2>
        {cragRoutes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-800 p-6 text-sm text-stone-500">
            No individual routes from this crag in the merged database — see the Rakkup guide or
            the route counts above, and verify locally.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-800">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-800 bg-stone-900/80 hover:bg-stone-900/80">
                  <TableHead className="text-stone-400">Route</TableHead>
                  <TableHead className="text-stone-400">Grade</TableHead>
                  <TableHead className="text-stone-400">Style</TableHead>
                  <TableHead className="text-stone-400">★</TableHead>
                  <TableHead className="hidden text-stone-400 md:table-cell">Height</TableHead>
                  <TableHead className="text-stone-400">Status</TableHead>
                  <TableHead className="hidden text-stone-400 lg:table-cell">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cragRoutes.map((r, i) => (
                  <TableRow key={`${r.name}-${i}`} className="border-stone-800 hover:bg-stone-900/60">
                    <TableCell className="font-medium text-stone-100">
                      {r.name}
                      {r.sector && (
                        <span className="ml-2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-400">
                          {r.sector}
                        </span>
                      )}
                      {r.note && (
                        <p className="mt-1 text-xs font-normal text-amber-300/80">⚠ {r.note}</p>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-semibold text-teal-400">{r.grade}</span>{' '}
                      <span className="rounded bg-stone-800 px-1 py-0.5 text-[10px] uppercase text-stone-400">
                        {gradeSystemLabel[r.gradeSystem] ?? r.gradeSystem}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-stone-300">{r.style}</TableCell>
                    <TableCell className="text-sm text-amber-400">
                      {r.stars != null && r.stars > 0 ? r.stars : '—'}
                    </TableCell>
                    <TableCell className="hidden text-sm text-stone-400 md:table-cell">
                      {r.heightM ? `${r.heightM} m` : ''}
                      {r.bolts ? `${r.heightM ? ' · ' : ''}${r.bolts} bolts` : ''}
                      {!r.heightM && !r.bolts && '—'}
                    </TableCell>
                    <TableCell>
                      {r.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-xs text-teal-300">
                          <Check className="h-3 w-3" /> verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
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
                          className="inline-flex items-center gap-1 text-xs text-teal-400 hover:underline"
                        >
                          {sourceLabel[r.source] ?? r.source}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-stone-500">
                          {sourceLabel[r.source] ?? r.source}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* Beta + sectors */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Card className="border-stone-800 bg-stone-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {crag.details.map((d, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {d}
                </li>
              ))}
            </ul>
            {crag.sectors && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                  Sectors
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {crag.sectors.map((s) => (
                    <div key={s.name} className="rounded-md border border-stone-800 bg-stone-950 p-3">
                      <div className="text-sm font-medium">{s.name}</div>
                      {s.note && <div className="mt-0.5 text-xs text-stone-500">{s.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-stone-800 bg-stone-900/60">
          <CardHeader>
            <CardTitle>Good to know</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-400">
            <p>
              Grades and bolt counts come from Mountain Project, 27crags, the legacy draft and
              vault notes — scales and reliability differ per source. Amber rows need local
              verification.
            </p>
            <p>
              Near-coast hardware can be suspect — inspect before trusting and ask the Koh Tao
              Climbing Club when in doubt.
            </p>
            <Link to="/routes" className="inline-block text-teal-400 hover:underline">
              Full route database →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl border-stone-800 bg-stone-950 text-stone-100">
          {lightbox && (
            <>
              <DialogTitle className="sr-only">Photo viewer</DialogTitle>
              <img
                src={imgSrc(lightbox.file)}
                alt={lightbox.caption}
                className="max-h-[75vh] w-full rounded-md bg-stone-950 object-contain"
              />
              <DialogDescription className="text-sm text-stone-400">
                {lightbox.caption}
              </DialogDescription>
              <p className="text-xs text-stone-500">
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
                          className="text-teal-400 hover:underline"
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
                      className="text-teal-400 hover:underline"
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
