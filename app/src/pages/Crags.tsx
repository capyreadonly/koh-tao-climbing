import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Crags</h1>
      <p className="mt-2 text-stone-400">
        {crags.length} documented areas — granite sport, trad and bouldering across the island.
        Click a map marker to open a crag.
      </p>

      {/* Island map */}
      <CragMap className="mt-6" />

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
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
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
            <Link key={c.slug} to={`/crags/${c.slug}`}>
              <Card className="h-full overflow-hidden border-stone-800 bg-stone-900/60 transition-colors hover:border-teal-500/50">
                {thumb ? (
                  <div className={`h-36 w-full ${isNdLicense(thumb) ? 'bg-stone-950' : ''}`}>
                    <img
                      src={imgSrc(thumb.file)}
                      alt={thumb.caption}
                      loading="lazy"
                      className={`h-full w-full ${isNdLicense(thumb) ? 'object-contain' : 'object-cover'}`}
                    />
                  </div>
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-teal-950">
                    <Mountain className="h-8 w-8 text-stone-600" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <span className="text-xs text-stone-500">{c.grades}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <MapPin className="h-3 w-3" /> {c.area}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 line-clamp-3 text-sm text-stone-400">{c.summary}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
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
                  <div className="mt-3 flex items-center gap-2">
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
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {list.length === 0 && (
        <p className="mt-10 text-center text-stone-500">No crags match your filters.</p>
      )}
    </div>
  )
}
