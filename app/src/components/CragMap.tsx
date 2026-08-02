import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { crags } from '@/data/climbing'

// React port of the legacy static site's hand-drawn island map
// (work/static-site-content.md §3): no map library, inline SVG, linear
// lat/lng → x/y projection over the same hardcoded bounds, 800×600 canvas.
const BOUNDS = { minLat: 10.055, maxLat: 10.135, minLng: 99.805, maxLng: 99.875 }
const W = 800
const H = 600

const latY = (l: number) => H - ((l - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H
const lngX = (n: number) => ((n - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W

// Island outline — the same 12-point quadratic-bezier coastline as the legacy map.
const ISLAND_OUTLINE = [
  [99.815, 10.065], [99.81, 10.075], [99.812, 10.085], [99.815, 10.095],
  [99.82, 10.105], [99.825, 10.115], [99.835, 10.125], [99.845, 10.13],
  [99.855, 10.128], [99.865, 10.122], [99.87, 10.11], [99.872, 10.095],
  [99.868, 10.08], [99.86, 10.07], [99.845, 10.065], [99.83, 10.062],
  [99.815, 10.065],
] as const

const islandPath = (() => {
  let d = `M ${lngX(ISLAND_OUTLINE[0][0])} ${latY(ISLAND_OUTLINE[0][1])}`
  for (let i = 1; i + 1 < ISLAND_OUTLINE.length; i += 2) {
    const [cLng, cLat] = ISLAND_OUTLINE[i]
    const [eLng, eLat] = ISLAND_OUTLINE[i + 1]
    d += ` Q ${lngX(cLng)} ${latY(cLat)} ${lngX(eLng)} ${latY(eLat)}`
  }
  return `${d} Z`
})()

// Beach/village labels from the legacy map.
const BEACHES = [
  { name: 'Sairee Beach', lng: 99.82, lat: 10.09, rx: 25, ry: 8 },
  { name: 'Mae Haad', lng: 99.855, lat: 10.128, rx: 20, ry: 6 },
  { name: 'Chalok', lng: 99.845, lat: 10.065, rx: 18, ry: 6 },
] as const

export default function CragMap({
  selectedSlug,
  className,
}: {
  selectedSlug?: string
  className?: string
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)

  const mapped = useMemo(() => crags.filter((c) => c.coords), [])
  const unmapped = useMemo(() => crags.filter((c) => !c.coords), [])

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-lg border border-stone-800"
        role="img"
        aria-label="Hand-drawn map of Koh Tao with climbing crag markers"
      >
        {/* sea */}
        <rect width={W} height={H} className="fill-sky-950" />
        {/* island */}
        <path
          d={islandPath}
          className="fill-emerald-900/70 stroke-emerald-600"
          strokeWidth={2}
        />
        {/* beaches / villages */}
        {BEACHES.map((b) => (
          <g key={b.name}>
            <ellipse
              cx={lngX(b.lng)}
              cy={latY(b.lat)}
              rx={b.rx}
              ry={b.ry}
              className="fill-amber-200/25"
            />
            <text
              x={lngX(b.lng)}
              y={latY(b.lat) + 3}
              textAnchor="middle"
              fontSize={10}
              className="fill-amber-100/80"
            >
              {b.name}
            </text>
          </g>
        ))}
        {/* the one "road" from the legacy map */}
        <line
          x1={lngX(99.825)}
          y1={latY(10.065)}
          x2={lngX(99.855)}
          y2={latY(10.128)}
          className="stroke-amber-300/40"
          strokeWidth={3}
        />
        {/* crag markers — click navigates to the crag page, hover shows the name */}
        {mapped.map((c) => {
          const x = lngX(c.coords!.lng)
          const y = latY(c.coords!.lat)
          const active = hovered === c.slug || selectedSlug === c.slug
          return (
            <g
              key={c.slug}
              className="cursor-pointer"
              onClick={() => navigate(`/crags/${c.slug}`)}
              onMouseEnter={() => setHovered(c.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${c.name} — ${c.area}`}</title>
              {/* generous invisible hit area for small markers */}
              <circle cx={x} cy={y} r={16} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={active ? 9 : 7}
                className={
                  selectedSlug === c.slug
                    ? 'fill-amber-400 stroke-stone-950'
                    : active
                      ? 'fill-emerald-300 stroke-stone-950'
                      : 'fill-teal-400 stroke-stone-950'
                }
                strokeWidth={2}
              />
              {active && (
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  className="fill-stone-100"
                  style={{ paintOrder: 'stroke', stroke: '#0c0a09', strokeWidth: 4 }}
                >
                  {c.name}
                </text>
              )}
            </g>
          )
        })}
        {/* legend */}
        <g transform={`translate(${W - 150}, 16)`}>
          <rect
            width={134}
            height={64}
            rx={8}
            className="fill-stone-950/85 stroke-stone-700"
          />
          <text x={10} y={18} fontSize={11} fontWeight={700} className="fill-stone-200">
            Legend
          </text>
          <circle cx={18} cy={32} r={5} className="fill-teal-400" />
          <text x={30} y={36} fontSize={10} className="fill-stone-400">
            Crag (click)
          </text>
          <circle cx={18} cy={48} r={5} className="fill-amber-400" />
          <text x={30} y={52} fontSize={10} className="fill-stone-400">
            Selected
          </text>
        </g>
      </svg>
      {unmapped.length > 0 && (
        <p className="mt-2 text-xs text-stone-500">
          No verified coordinates yet: {unmapped.map((c) => c.name).join(' · ')}
        </p>
      )}
    </div>
  )
}
