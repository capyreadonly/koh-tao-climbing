import { useMemo, useState } from 'react'
import { Link } from 'react-router'
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
import { crags } from '@/data/climbing'
import { routes } from '@/data/routes'
import { sourceLabel, gradeSystemLabel } from '@/lib/photo'
import { Search, Check, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

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

export default function Routes() {
  const [q, setQ] = useState('')
  const [style, setStyle] = useState<string>('all')
  const [crag, setCrag] = useState<string>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(0)

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Route database</h1>
      <p className="mt-2 max-w-3xl text-stone-400">
        {routes.length} routes and boulder problems merged from Mountain Project, 27crags, the
        legacy draft and vault notes. Star scales differ per source — compare only within the same
        source. Amber rows are unverified or carry a cross-source conflict.
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              resetPage()
            }}
            placeholder="Search routes, grades, sectors…"
            className="border-stone-700 bg-stone-900 pl-9 text-stone-100 placeholder:text-stone-500"
          />
        </div>
        <Select
          value={crag}
          onValueChange={(v) => {
            setCrag(v)
            resetPage()
          }}
        >
          <SelectTrigger className="border-stone-700 bg-stone-900 text-stone-100 lg:w-64">
            <SelectValue placeholder="All crags" />
          </SelectTrigger>
          <SelectContent className="border-stone-700 bg-stone-900 text-stone-100">
            <SelectItem value="all" className="focus:bg-stone-800 focus:text-stone-100">
              All crags ({cragNames.length})
            </SelectItem>
            {cragNames.map((n) => (
              <SelectItem key={n} value={n} className="focus:bg-stone-800 focus:text-stone-100">
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
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                style === f.key
                  ? 'border-teal-500/60 bg-teal-500/15 text-teal-300'
                  : 'border-stone-700 text-stone-400 hover:bg-stone-800'
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
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors ${
              verifiedOnly
                ? 'border-teal-500/60 bg-teal-500/15 text-teal-300'
                : 'border-stone-700 text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Check className="h-3.5 w-3.5" /> Verified only
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        {list.length} matching routes{list.length > PAGE_SIZE && ` — page ${pageSafe + 1} of ${pageCount}`}
      </p>

      <div className="mt-3 overflow-hidden rounded-lg border border-stone-800">
        <Table>
          <TableHeader>
            <TableRow className="border-stone-800 bg-stone-900/80 hover:bg-stone-900/80">
              <TableHead className="text-stone-400">Route</TableHead>
              <TableHead className="text-stone-400">Grade</TableHead>
              <TableHead className="text-stone-400">Style</TableHead>
              <TableHead className="text-stone-400">Crag</TableHead>
              <TableHead className="text-stone-400">★</TableHead>
              <TableHead className="text-stone-400">Status</TableHead>
              <TableHead className="hidden text-stone-400 lg:table-cell">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => {
              const slug = cragSlugByName.get(r.crag)
              return (
                <TableRow
                  key={`${r.name}-${r.crag}-${i}`}
                  className="border-stone-800 hover:bg-stone-900/60"
                >
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
                  <TableCell>
                    {slug ? (
                      <Link
                        to={`/crags/${slug}`}
                        className="text-sm text-stone-300 hover:text-teal-400 hover:underline"
                      >
                        {r.crag}
                      </Link>
                    ) : (
                      <span className="text-sm text-stone-300">{r.crag}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-amber-400">
                    {r.stars != null && r.stars > 0 ? r.stars : '—'}
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
              )
            })}
          </TableBody>
        </Table>
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-stone-500">No routes match your filters.</p>
      )}

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={pageSafe === 0}
            onClick={() => setPage(pageSafe - 1)}
            className="border-stone-700 text-stone-300 hover:bg-stone-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-stone-500">
            Page {pageSafe + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pageSafe >= pageCount - 1}
            onClick={() => setPage(pageSafe + 1)}
            className="border-stone-700 text-stone-300 hover:bg-stone-800"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
