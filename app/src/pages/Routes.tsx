import { Fragment, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { crags } from '@/data/climbing'
import { routes } from '@/data/routes'
import { sourceLabel, gradeSystemLabel, styleLabel, styleList } from '@/lib/photo'
import { styleBadgeFor, verifiedBadge, unverifiedBadge } from '@/lib/badges'
import RouteCard from '@/components/RouteCard'
import RouteDetails, { hasRouteDetails } from '@/components/RouteDetails'
import {
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react'

const STYLE_FILTERS = [
  { key: 'all', label: 'All styles' },
  { key: 'sport', label: 'Sport' },
  { key: 'trad', label: 'Trad' },
  { key: 'boulder', label: 'Boulder' },
  { key: 'multipitch', label: 'Multi-pitch' },
  { key: 'toprope', label: 'Top-rope' },
  { key: 'dws', label: 'DWS' },
] as const

const PAGE_SIZE = 50

const cragSlugByName = new Map(crags.map((c) => [c.name, c.slug]))

// One table-header treatment: uppercase micro-labels (per design skill).
const headClass = 'text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400'

export default function Routes() {
  const [q, setQ] = useState('')
  const [style, setStyle] = useState<string>('all')
  const [crag, setCrag] = useState<string>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(0)
  // Expanded per-route detail rows (description/FA/protection from MP + the Goodtime PDF).
  const [openDetails, setOpenDetails] = useState<ReadonlySet<string>>(new Set())
  const navigate = useNavigate()

  const cragNames = useMemo(() => [...new Set(routes.map((r) => r.crag))].sort(), [])

  const list = useMemo(
    () =>
      routes.filter(
        (r) =>
          (style === 'all' || r.style.includes(style)) &&
          (crag === 'all' || r.crag === crag) &&
          (!verifiedOnly || r.verified) &&
          (q === '' ||
            `${r.name} ${r.grade} ${r.crag} ${r.sector ?? ''}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [q, style, crag, verifiedOnly],
  )

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount - 1)
  const rows = list.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE)

  const resetPage = () => setPage(0)

  const toggleDetails = (key: string) =>
    setOpenDetails((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="The database"
        title="Route database"
        lede={`${routes.length} routes and boulder problems merged from Mountain Project, 27crags, the Goodtime Adventures PDF and vault notes. Star scales differ per source — compare only within the same source. Amber marks the unverified; the info button expands description and first-ascent beta where available.`}
      />

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              resetPage()
            }}
            placeholder="Search routes, grades, sectors…"
            className="border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 pl-9 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
        <Select
          value={crag}
          onValueChange={(v) => {
            setCrag(v)
            resetPage()
          }}
        >
          <SelectTrigger className="border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 lg:w-64">
            <SelectValue placeholder="All crags" />
          </SelectTrigger>
          <SelectContent className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
            <SelectItem value="all" className="focus:bg-stone-100 dark:focus:bg-stone-800 focus:text-stone-900 dark:focus:text-stone-100">
              All crags ({cragNames.length})
            </SelectItem>
            {cragNames.map((n) => (
              <SelectItem key={n} value={n} className="focus:bg-stone-100 dark:focus:bg-stone-800 focus:text-stone-900 dark:focus:text-stone-100">
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setStyle(f.key)
                resetPage()
              }}
              className={`inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
                style === f.key
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                  : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => {
              setVerifiedOnly((v) => !v)
              resetPage()
            }}
            className={`inline-flex min-h-10 items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              verifiedOnly
                ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Check className="h-3.5 w-3.5" /> Verified only
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        {list.length} matching routes{list.length > PAGE_SIZE && ` — page ${pageSafe + 1} of ${pageCount}`}
      </p>

      <div className="mt-3 hidden overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800">
              <TableHead className={headClass}>Route</TableHead>
              <TableHead className={headClass}>Grade</TableHead>
              <TableHead className={headClass}>Style</TableHead>
              <TableHead className={headClass}>Crag</TableHead>
              <TableHead className={headClass}>★</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={`hidden lg:table-cell ${headClass}`}>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => {
              const slug = cragSlugByName.get(r.crag)
              const key = `${r.name}-${r.crag}-${i}`
              const expandable = hasRouteDetails(r)
              const open = openDetails.has(key)
              return (
                <Fragment key={key}>
                  <TableRow
                    onClick={
                      slug
                        ? (e) => {
                            if ((e.target as HTMLElement).closest('a,button')) return
                            navigate(`/crags/${slug}?route=${encodeURIComponent(r.name)}`)
                          }
                        : undefined
                    }
                    className={`border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 ${slug ? 'cursor-pointer' : ''}`}
                  >
                    <TableCell className="min-w-40 whitespace-normal font-medium text-stone-900 dark:text-stone-100">
                      {slug ? (
                        <Link
                          to={`/crags/${slug}?route=${encodeURIComponent(r.name)}`}
                          className="text-teal-700 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 hover:underline"
                        >
                          {r.name}
                        </Link>
                      ) : (
                        r.name
                      )}
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
                            {styleLabel[s] ?? s}
                          </span>
                        ))}
                      </span>
                    </TableCell>
                    <TableCell>
                      {slug ? (
                        <Link
                          to={`/crags/${slug}`}
                          className="text-sm text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-400 hover:underline"
                        >
                          {r.crag}
                        </Link>
                      ) : (
                        <span className="text-sm text-stone-700 dark:text-stone-300">{r.crag}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-amber-600 dark:text-amber-400">
                      {r.stars != null && r.stars > 0 ? r.stars : '—'}
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
      <div className="mt-3 space-y-3 md:hidden">
        {rows.map((r, i) => (
          <RouteCard key={`${r.name}-${r.crag}-${i}`} route={r} cragSlug={cragSlugByName.get(r.crag)} />
        ))}
      </div>

      {list.length === 0 && (
        <EmptyState className="mt-8" title="No routes match your filters">
          Widen the grade range, clear the search, or drop the verified-only filter.
        </EmptyState>
      )}

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={pageSafe === 0}
            onClick={() => setPage(pageSafe - 1)}
            className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm tabular-nums text-stone-500 dark:text-stone-400">
            Page {pageSafe + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            disabled={pageSafe >= pageCount - 1}
            onClick={() => setPage(pageSafe + 1)}
            className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
