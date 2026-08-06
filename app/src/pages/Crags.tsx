import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import SectionHeader from '@/components/SectionHeader'
import EmptyState from '@/components/EmptyState'
import CragCard from '@/components/CragCard'
import { crags, type Style } from '@/data/climbing'
import CragMap from '@/components/CragMap'
import { Search } from 'lucide-react'

const filters: { key: Style | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sport', label: 'Sport' },
  { key: 'trad', label: 'Trad' },
  { key: 'boulder', label: 'Boulder' },
  { key: 'multipitch', label: 'Multi-pitch' },
]

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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search crags…"
            className="border-stone-300 bg-white pl-9 text-stone-900 placeholder:text-stone-400"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStyle(f.key)}
              className={`inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
                style === f.key
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-stone-300 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CragCard key={c.slug} crag={c} />
        ))}
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
