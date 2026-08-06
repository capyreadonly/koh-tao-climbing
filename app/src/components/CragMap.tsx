import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { crags, type Crag } from '@/data/climbing'
import { styleLabel } from '@/lib/photo'

// Real island map (replaces the legacy hand-drawn bezier SVG): Leaflet with a
// single self-hosted OpenStreetMap tile layer. Tiles were fetched once from
// tile.openstreetmap.org for the Koh Tao bbox (lat 10.03-10.16, lng
// 99.79-99.90, zooms 10-15) and are served from our own origin under
// public/tiles/ — no third-party requests at runtime. Esri World Imagery was
// removed because its terms forbid storing tiles. Refresh with
// work/fetch-tiles.py --force; attribution is required by OSM's terms.
const KOH_TAO: [number, number] = [10.095, 99.84]

const OSM_SELFHOSTED = {
  // BASE_URL is './' (vite base), so this resolves relative to the deployed
  // index.html — works under the /koh-tao-climbing/ subpath.
  url: `${import.meta.env.BASE_URL}tiles/{z}/{x}/{y}.png`,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 10,
  maxZoom: 15,
}

// Downloaded tiles only cover the island bbox; keep the viewport inside it
// (slightly padded) so the map can't pan into empty space.
const MAP_MAX_BOUNDS: [[number, number], [number, number]] = [
  [10.0, 99.76],
  [10.19, 99.93],
]

// Per-STYLE map markers, thetopo.com pattern (see work/thetopo-tokens.md): a
// flat yellow (#f3dc10) disc carrying a dark glyph per climbing style — sport =
// quickdraw, trad = cammed nut, boulder = boulder blob, toprope = anchor ring
// with rope, multipitch = twin peaks, dws = rock over waves. Marker styles live
// in index.css (.crag-style-marker); glyphs are inline SVGs (stroke/fill
// #262626 on the yellow disc, theme-independent).
const GLYPH_STROKE =
  'fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
const STYLE_GLYPHS: Record<string, string> = {
  // quickdraw: two rounded biners + crossed sling
  sport: `<svg viewBox="0 0 24 24" ${GLYPH_STROKE}><rect x="8" y="2.5" width="8" height="6" rx="2"/><rect x="8" y="15.5" width="8" height="6" rx="2"/><path d="M11 8.5 13 15.5M13 8.5 11 15.5"/></svg>`,
  // nut on a wire: twin wire + tapered wedge
  trad: `<svg viewBox="0 0 24 24" ${GLYPH_STROKE}><path d="M10 2c0 4-1 6-1 8M14 2c0 4 1 6 1 8"/><path d="M8 10h8l-1.6 11h-4.8z" fill="#262626" stroke="none"/></svg>`,
  // boulder blob
  boulder: `<svg viewBox="0 0 24 24"><path d="M4.5 17.5C3.5 12 7 6.5 12 6.5s8.5 4.5 7.5 9.5c-.5 3-3 4-7.5 4s-7-1-7.5-2.5z" fill="#262626"/></svg>`,
  // anchor ring + rope V
  toprope: `<svg viewBox="0 0 24 24" ${GLYPH_STROKE}><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5C10 12 8 16 7 21M12 7.5c2 4.5 4 8.5 5 13.5"/></svg>`,
  // twin peaks
  multipitch: `<svg viewBox="0 0 24 24"><path d="M3 19 9 7l4 7 3-6 5 11z" fill="#262626"/></svg>`,
  // rock over waves (deep-water solo)
  dws: `<svg viewBox="0 0 24 24"><path d="M8.5 13c0-3.5 1.8-6 3.5-6s3.5 2.5 3.5 6z" fill="#262626"/><path d="M3 17c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 21c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round"/></svg>`,
}

// One glyph per crag: the crag's primary (first-listed) style — the data lists
// the main style first (Mek's = sport, Mao Rock = trad, Secret Garden = boulder).
const primaryStyle = (c: Crag) => c.styles[0] ?? 'sport'

const markerIcon = (crag: Crag, selected: boolean) =>
  L.divIcon({
    className: 'crag-leaflet-marker',
    html: `<span class="crag-style-marker${selected ? ' crag-style-marker-selected' : ''}">${
      STYLE_GLYPHS[primaryStyle(crag)] ?? STYLE_GLYPHS.sport
    }</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -17],
  })

// Icons cached per style+selection so Leaflet reuses divIcon instances.
const iconCache = new Map<string, L.DivIcon>()
const iconFor = (crag: Crag, selected: boolean) => {
  const key = `${primaryStyle(crag)}${selected ? '-sel' : ''}`
  let icon = iconCache.get(key)
  if (!icon) {
    icon = markerIcon(crag, selected)
    iconCache.set(key, icon)
  }
  return icon
}

// Legend order for the fullBleed map — the styles the marker set covers.
const LEGEND_STYLES = ['sport', 'trad', 'boulder', 'toprope', 'multipitch']

export default function CragMap({
  selectedSlug,
  className,
  fullBleed = false,
  children,
}: {
  selectedSlug?: string
  className?: string
  /** Landing-page use (Home): tall edge-to-edge map with square corners, zoom
      control top-right and no scroll-wheel zoom so the page can scroll past,
      plus the per-style marker legend underneath. Card use (Crags) keeps the
      framed 350/500px box. */
  fullBleed?: boolean
  /** Overlay rendered above the tiles but below markers/popups (z-500).
      Wrapper is pointer-events-none; make the chip itself pointer-events-auto. */
  children?: ReactNode
}) {
  const mapped = useMemo(() => crags.filter((c) => c.coords), [])
  const unmapped = useMemo(() => crags.filter((c) => !c.coords), [])

  return (
    <div className={className}>
      <div
        className={
          fullBleed
            ? 'crag-map relative z-0 h-[70svh] w-full overflow-hidden'
            : 'crag-map relative z-0 h-[350px] w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 sm:h-[500px]'
        }
      >
        <MapContainer
          center={KOH_TAO}
          zoom={13}
          minZoom={OSM_SELFHOSTED.minZoom}
          maxZoom={OSM_SELFHOSTED.maxZoom}
          maxBounds={MAP_MAX_BOUNDS}
          scrollWheelZoom={!fullBleed}
          zoomControl={!fullBleed}
          className="h-full w-full"
          aria-label="Map of Koh Tao with climbing crag markers"
        >
          <TileLayer
            url={OSM_SELFHOSTED.url}
            attribution={OSM_SELFHOSTED.attribution}
            minZoom={OSM_SELFHOSTED.minZoom}
            maxZoom={OSM_SELFHOSTED.maxZoom}
          />
          {fullBleed && <ZoomControl position="topright" />}
          {mapped.map((c) => (
            <Marker
              key={c.slug}
              position={[c.coords!.lat, c.coords!.lng]}
              icon={iconFor(c, selectedSlug === c.slug)}
            >
              <Popup>
                <div className="min-w-36">
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{c.name}</div>
                  <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    {c.area} · {c.grades}
                  </div>
                  <Link
                    to={`/crags/${c.slug}`}
                    className="mt-2 inline-block text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    Open crag guide →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {children && (
          <div className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[calc(100%-1.5rem)] sm:left-4 sm:top-4">
            {children}
          </div>
        )}
      </div>
      {fullBleed && (
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pt-3 text-xs text-stone-500 dark:text-stone-400">
          {LEGEND_STYLES.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              {/* static local SVGs, no user input */}
              <span
                className="crag-style-marker !h-5 !w-5 [&>svg]:!h-3 [&>svg]:!w-3"
                dangerouslySetInnerHTML={{ __html: STYLE_GLYPHS[s] }}
              />
              {styleLabel[s] ?? s}
            </span>
          ))}
        </div>
      )}
      {!fullBleed && unmapped.length > 0 && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          No verified coordinates yet: {unmapped.map((c) => c.name).join(' · ')}
        </p>
      )}
    </div>
  )
}
