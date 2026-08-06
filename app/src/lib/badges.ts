// Light-theme badge styles. The data layer is READ-ONLY and its styleColor map
// (app/src/data/climbing.ts) is dark-themed (bg-teal-500/15 text-teal-300),
// which is unreadable on the light editorial theme — so every badge in the UI
// must use these overrides instead of the raw data values.

import type { Style } from '@/data/climbing'

// One soft-tint chip per climbing style: pale 50 bg, 700-ish text, 200 border.
// Extra keys ('dws', 'tr', …) cover route-record styles outside the Style union.
export const styleBadge: Record<string, string> = {
  sport: 'bg-teal-50 text-teal-700 border-teal-200',
  trad: 'bg-amber-50 text-amber-800 border-amber-200',
  boulder: 'bg-violet-50 text-violet-700 border-violet-200',
  multipitch: 'bg-sky-50 text-sky-700 border-sky-200',
  toprope: 'bg-stone-100 text-stone-600 border-stone-300',
  dws: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  tr: 'bg-stone-100 text-stone-600 border-stone-300',
}

const FALLBACK_BADGE = 'bg-stone-100 text-stone-600 border-stone-300'

// Lookup tolerant of route-record style strings outside the Style union
// ('dws', 'tr' — see lib/photo.ts styleList).
export const styleBadgeFor = (s: Style | string): string => styleBadge[s] ?? FALLBACK_BADGE

// Verification status chips (route tables, service cards, crag cards).
export const verifiedBadge = 'bg-teal-50 text-teal-700 border-teal-200'
export const unverifiedBadge = 'bg-amber-50 text-amber-800 border-amber-200'
