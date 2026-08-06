import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { crags } from '@/data/climbing'

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

// divIcon markers — Leaflet's default marker PNGs break under Vite asset hashing,
// so the markers are pure HTML/CSS dots styled in index.css (emerald/teal theme,
// amber when selected). The custom className replaces the white leaflet-div-icon box.
const markerIcon = (selected: boolean) =>
  L.divIcon({
    className: 'crag-leaflet-marker',
    html: `<span class="crag-marker-dot${selected ? ' crag-marker-dot-selected' : ''}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  })

const ICON_DEFAULT = markerIcon(false)
const ICON_SELECTED = markerIcon(true)

export default function CragMap({
  selectedSlug,
  className,
  fullBleed = false,
  children,
}: {
  selectedSlug?: string
  className?: string
  /** Landing-page use (Home): tall edge-to-edge map with square corners, zoom
      control top-right (clear of the overlay chip) and no scroll-wheel zoom so
      the page can scroll past. Card use (Crags) keeps the framed 350/500px box. */
  fullBleed?: boolean
  /** Overlay rendered above the tiles but below markers/popups (z-500) — e.g.
      the Home headline chip. Wrapper is pointer-events-none; make the chip
      itself pointer-events-auto. */
  children?: ReactNode
}) {
  const mapped = useMemo(() => crags.filter((c) => c.coords), [])
  const unmapped = useMemo(() => crags.filter((c) => !c.coords), [])

  return (
    <div className={className}>
      <div
        className={
          fullBleed
            ? 'crag-map relative z-0 h-[72svh] w-full overflow-hidden sm:h-[80svh]'
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
              icon={selectedSlug === c.slug ? ICON_SELECTED : ICON_DEFAULT}
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
      {!fullBleed && unmapped.length > 0 && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          No verified coordinates yet: {unmapped.map((c) => c.name).join(' · ')}
        </p>
      )}
    </div>
  )
}
