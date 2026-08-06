import { Link } from 'react-router'
import type { RouteRecord } from '@/data/routes'
import { gradeSystemLabel, styleLabel, styleList } from '@/lib/photo'
import { styleBadgeFor, verifiedBadge, unverifiedBadge } from '@/lib/badges'
import RouteDetails, { hasRouteDetails } from '@/components/RouteDetails'
import { AlertTriangle, Check, ChevronRight } from 'lucide-react'

// Mobile (<md) presentation of one route record — the wide route tables get a
// stacked card instead of a cramped horizontally scrolling grid.
// `cragSlug` (Routes database page) turns the name into a deep link to the
// crag's topo section and shows the crag name; `onOpen` (CragDetail page)
// makes the name open the topo lightbox in place. Neither → plain text.
export default function RouteCard({
  route: r,
  cragSlug,
  onOpen,
}: {
  route: RouteRecord
  cragSlug?: string
  onOpen?: () => void
}) {
  const name = onOpen ? (
    <button
      type="button"
      onClick={onOpen}
      className="py-1 text-left font-medium text-teal-700 hover:text-teal-600 hover:underline"
    >
      {r.name}
    </button>
  ) : cragSlug ? (
    <Link
      to={`/crags/${cragSlug}?route=${encodeURIComponent(r.name)}`}
      className="inline-block py-1 font-medium text-teal-700 hover:text-teal-600 hover:underline"
    >
      {r.name}
    </Link>
  ) : (
    <span className="font-medium text-stone-900">{r.name}</span>
  )

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          {name}
          {r.sector && (
            <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
              {r.sector}
            </span>
          )}
        </div>
        <div className="shrink-0 whitespace-nowrap">
          <span className="font-semibold tabular-nums text-teal-700">{r.grade}</span>{' '}
          <span className="rounded bg-stone-100 px-1 py-0.5 text-[10px] uppercase text-stone-500">
            {gradeSystemLabel[r.gradeSystem] ?? r.gradeSystem}
          </span>
        </div>
      </div>
      {r.note && (
        <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {r.note}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {styleList(r.style).map((s) => (
          <span
            key={s}
            className={`rounded-full border px-2 py-0.5 text-xs ${styleBadgeFor(s)}`}
          >
            {styleLabel[s] ?? s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
        {onOpen !== undefined ? (
          <span>
            {r.lengthM ? `${r.lengthM} m` : ''}
            {r.bolts ? `${r.lengthM ? ' · ' : ''}${r.bolts} bolts` : ''}
            {!r.lengthM && !r.bolts && '—'}
          </span>
        ) : (
          <span>{r.crag}</span>
        )}
        {r.stars != null && r.stars > 0 && <span className="text-amber-600">★ {r.stars}</span>}
        {r.ticks != null && r.ticks > 0 && <span>{r.ticks} ticks</span>}
        {r.verified ? (
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${verifiedBadge}`}
          >
            <Check className="h-3 w-3" /> verified
          </span>
        ) : (
          <span
            className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 ${unverifiedBadge}`}
          >
            unverified
          </span>
        )}
      </div>
      {hasRouteDetails(r) && (
        <details className="group mt-2 rounded-lg border border-stone-200 bg-stone-50">
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 px-3 text-xs font-medium text-stone-500 transition-colors hover:text-teal-700 [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 transition-transform group-open:rotate-90" />
            Route details
          </summary>
          <div className="px-3 pb-3">
            <RouteDetails route={r} />
          </div>
        </details>
      )}
    </div>
  )
}
