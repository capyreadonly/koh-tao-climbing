import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import SectionHeader from '@/components/SectionHeader'
import EmptyState from '@/components/EmptyState'
import { crags, styleColor, type Style } from '@/data/climbing'
import { isNdLicense } from '@/data/photos'
import { cragThumbnail, imgSrc } from '@/lib/photo'
import CragMap from '@/components/CragMap'
import { MapPin, Sun, Search, ShieldCheck, ShieldAlert, Mountain } from 'lucide-react'

const filters: { key: Style | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sport', label: 'Sport' },
  { key: 'trad', label: 'Trad' },
  { key: 'boulder', label: 'Boulder' },
  { key: 'multipitch', label: 'Multi-pitch' },
]

// The `verified` note says what the 2026-08-02 fact-check confirmed; notes that open
// with "Unverified" mean nothing could be corroborated.
const isFactChecked = (verified?: string) =>
  verified != null && !verified.toLowerCase().startsWith('unverified')

export default function Crags() {
  const [q, setQ] = useState('')
  const [style, setStyle] = useState<Style | 'all'>('all')

  const list = useMemo(
    () =>
      crags.filter(
        (c) =>
          (style === 'all' || c.styles.includes(style)) &&
          (q === '' ||
            `${c.name} ${c.area} ${c.summary} ${c.tags.join(' ')}`
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [q, style],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="The island"
        title="Crags"
        lede={`${crags.length} documented areas — granite sport, trad and bouldering across the island. Click a map marker to open a crag.`}
      />

      {/* Island map */}
      <CragMap className="mt-8" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search crags…"
            className="border-stone-700 bg-stone-900 pl-9 text-stone-100 placeholder:text-stone-500"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStyle(f.key)}
              className={`inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
                style === f.key
                  ? 'border-teal-500/60 bg-teal-500/15 text-teal-300'
                  : 'border-stone-700 text-stone-400 hover:bg-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const thumb = cragThumbnail(c.name)
          const checked = isFactChecked(c.verified)
          return (
            <Link key={c.slug} to={`/crags/${c.slug}`} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-800 bg-stone-900 transition duration-200 hover:-translate-y-0.5 hover:border-stone-700">
                {thumb ? (
                  <div className={`aspect-[4/3] w-full ${isNdLicense(thumb) ? 'bg-stone-950' : ''}`}>
                    <img
                      src={imgSrc(thumb.file)}
                      alt={thumb.caption}
                      loading="lazy"
                      className={`h-full w-full ${isNdLicense(thumb) ? 'object-contain' : 'object-cover'}`}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-950">
                    <Mountain className="h-10 w-10 text-stone-700" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-base font-semibold tracking-tight">
                      {c.name}
                    </h2>
                    <span className="text-xs tabular-nums text-stone-500">{c.grades}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                    <MapPin className="h-3 w-3" /> {c.area}
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-stone-400">{c.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
                  <div className="mt-4 flex items-center gap-2 border-t border-stone-800/70 pt-3">
                    {c.highlight && (
                      <Badge variant="outline" className="border-stone-700 text-xs text-stone-400">
                        {c.highlight}
                      </Badge>
                    )}
                    <span
                      title={c.verified}
                      className={`ml-auto inline-flex items-center gap-1 text-xs ${
                        checked ? 'text-teal-400' : 'text-amber-400'
                      }`}
                    >
                      {checked ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> fact-checked
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3.5 w-3.5" /> unverified
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      {list.length === 0 && (
        <EmptyState className="mt-8" title="No crags match your filters">
          Try a different style or clear the search — the island only has {crags.length} documented
          areas.
        </EmptyState>
      )}
    </div>
  )
}
