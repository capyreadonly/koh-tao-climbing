import { Link } from 'react-router'
import { styleColor, type Style } from '@/data/climbing'
import type { RouteRecord } from '@/data/routes'
import { gradeSystemLabel, styleLabel, styleList } from '@/lib/photo'
import { Check } from 'lucide-react'

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
      className="py-1 text-left font-medium text-teal-300 hover:text-teal-200 hover:underline"
    >
      {r.name}
    </button>
  ) : cragSlug ? (
    <Link
      to={`/crags/${cragSlug}?route=${encodeURIComponent(r.name)}`}
      className="inline-block py-1 font-medium text-teal-300 hover:text-teal-200 hover:underline"
    >
      {r.name}
    </Link>
  ) : (
    <span className="font-medium text-stone-100">{r.name}</span>
  )

  return (
    <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          {name}
          {r.sector && (
            <span className="ml-2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-400">
              {r.sector}
            </span>
          )}
        </div>
        <div className="shrink-0 whitespace-nowrap">
          <span className="font-semibold text-teal-400">{r.grade}</span>{' '}
          <span className="rounded bg-stone-800 px-1 py-0.5 text-[10px] uppercase text-stone-400">
            {gradeSystemLabel[r.gradeSystem] ?? r.gradeSystem}
          </span>
        </div>
      </div>
      {r.note && <p className="mt-1 text-xs text-amber-300/80">⚠ {r.note}</p>}
      <div className="mt-2 flex flex-wrap gap-1">
        {styleList(r.style).map((s) => (
          <span
            key={s}
            className={`rounded-full border px-2 py-0.5 text-xs ${styleColor[s as Style] ?? 'bg-stone-500/15 text-stone-300 border-stone-500/30'}`}
          >
            {styleLabel[s] ?? s}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
        {onOpen !== undefined ? (
          <span>
            {r.heightM ? `${r.heightM} m` : ''}
            {r.bolts ? `${r.heightM ? ' · ' : ''}${r.bolts} bolts` : ''}
            {!r.heightM && !r.bolts && '—'}
          </span>
        ) : (
          <span>{r.crag}</span>
        )}
        {r.stars != null && r.stars > 0 && <span className="text-amber-400">★ {r.stars}</span>}
        {r.verified ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-teal-300">
            <Check className="h-3 w-3" /> verified
          </span>
        ) : (
          <span className="ml-auto inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-300">
            unverified
          </span>
        )}
      </div>
    </div>
  )
}
