import { useMemo } from 'react'
import { Link } from 'react-router'
import L from 'leaflet'
import { LayersControl, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { crags } from '@/data/climbing'

// Real island map (replaces the legacy hand-drawn bezier SVG): Leaflet with an
// Esri World Imagery satellite base layer by default and OpenStreetMap as the
// street-map alternative. Tile layers need internet access; attributions are
// required by Esri's and OSM's tile usage terms.
const KOH_TAO: [number, number] = [10.095, 99.84]

const ESRI_IMAGERY = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Esri World Imagery — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  // Esri's World Imagery serves most areas to z18/z19; clamp to 18 to avoid empty tiles.
  maxZoom: 18,
}

const OSM_STANDARD = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}

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
}: {
  selectedSlug?: string
  className?: string
}) {
  const mapped = useMemo(() => crags.filter((c) => c.coords), [])
  const unmapped = useMemo(() => crags.filter((c) => !c.coords), [])

  return (
    <div className={className}>
      <div className="crag-map relative z-0 h-[350px] w-full overflow-hidden rounded-lg border border-stone-800 sm:h-[500px]">
        <MapContainer
          center={KOH_TAO}
          zoom={13}
          className="h-full w-full"
          aria-label="Map of Koh Tao with climbing crag markers"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite (Esri)">
              <TileLayer
                url={ESRI_IMAGERY.url}
                attribution={ESRI_IMAGERY.attribution}
                maxZoom={ESRI_IMAGERY.maxZoom}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Street map (OSM)">
              <TileLayer
                url={OSM_STANDARD.url}
                attribution={OSM_STANDARD.attribution}
                maxZoom={OSM_STANDARD.maxZoom}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {mapped.map((c) => (
            <Marker
              key={c.slug}
              position={[c.coords!.lat, c.coords!.lng]}
              icon={selectedSlug === c.slug ? ICON_SELECTED : ICON_DEFAULT}
            >
              <Popup>
                <div className="min-w-36">
                  <div className="text-sm font-semibold text-stone-100">{c.name}</div>
                  <div className="mt-0.5 text-xs text-stone-400">
                    {c.area} · {c.grades}
                  </div>
                  <Link
                    to={`/crags/${c.slug}`}
                    className="mt-2 inline-block text-xs font-medium text-teal-400 hover:underline"
                  >
                    Open crag guide →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {unmapped.length > 0 && (
        <p className="mt-2 text-xs text-stone-500">
          No verified coordinates yet: {unmapped.map((c) => c.name).join(' · ')}
        </p>
      )}
    </div>
  )
}
