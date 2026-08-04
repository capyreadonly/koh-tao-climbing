// Shared helpers for rendering photos from the data layer.
// Image files live under app/public — every src must go through imgSrc() so the
// './' base (GitHub Pages) keeps working.

import { photosForCrag, type PhotoEntry } from '@/data/photos'

export const imgSrc = (file: string) => `${import.meta.env.BASE_URL}${file}`

// Card/featured thumbnails are topo-first: show the topo or the rock itself,
// not random action shots. Community photos (mostly bay/crag scenery with
// attribution) rank between crag photos and action shots; drawn island maps
// are the last resort before "whatever is usable".
const THUMB_PRIORITY = [
  'photo-topo',
  'topo-diagram',
  'crag-photo',
  'community-photo',
  'action-photo',
  'scenic',
  'map',
]

export function cragThumbnail(cragName: string): PhotoEntry | undefined {
  const all = photosForCrag(cragName)
  for (const kind of THUMB_PRIORITY) {
    const hit = all.find((p) => p.kind === kind)
    if (hit) return hit
  }
  return all[0]
}

// Credit line required on all guide-guidebook imagery (topos, diagrams, photos).
export const GUIDE_PHOTO_CREDIT = 'from the Goodtime Adventures free guidebook PDF'

export const GUIDE_PDF_URL =
  'http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf'

// Human labels for the route-database source keys. The 'guidebook' source is the
// Goodtime Adventures free PDF (v1/14) — the authoritative print source.
export const sourceLabel: Record<string, string> = {
  mountainproject: 'Mountain Project',
  '27crags': '27crags',
  vault: 'vault note',
  guidebook: 'Goodtime PDF',
}

export const gradeSystemLabel: Record<string, string> = {
  french: 'FR',
  yds: 'YDS',
  font: 'FB',
  v: 'V',
  'zen-gecko': 'ZG',
}

// A route can be more than one style at once (e.g. 'sport/toprope' — bolted
// but also easy to top-rope; MP also stores comma-joined pairs like 'trad,tr').
// Compound styles are stored slash- or comma-joined.
export const styleList = (style: string): string[] => style.split(/[\/,]/)

export const styleLabel: Record<string, string> = {
  sport: 'Sport',
  trad: 'Trad',
  boulder: 'Boulder',
  multipitch: 'Multi-pitch',
  toprope: 'Top-rope',
  dws: 'Deep-water solo',
}
