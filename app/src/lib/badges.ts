// Dual-theme badge styles. Light: pale 50 bg, 700-ish text, 200 border (the
// data layer's styleColor map is dark-themed and the data is READ-ONLY, so it
// can't be used as-is). Dark: the styleColor palette itself (500/15 bg,
// 300 text, 500/30 border) mirrored as dark: variants.

import type { Style } from '@/data/climbing'

// One soft-tint chip per climbing style. Extra keys ('dws', 'tr', …) cover
// route-record styles outside the Style union.
export const styleBadge: Record<string, string> = {
  sport: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30',
  trad: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
  boulder: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
  multipitch: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
  toprope: 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-500/15 dark:text-stone-300 dark:border-stone-500/30',
  dws: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
  tr: 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-500/15 dark:text-stone-300 dark:border-stone-500/30',
}

const FALLBACK_BADGE = 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-500/15 dark:text-stone-300 dark:border-stone-500/30'

// Lookup tolerant of route-record style strings outside the Style union
// ('dws', 'tr' — see lib/photo.ts styleList).
export const styleBadgeFor = (s: Style | string): string => styleBadge[s] ?? FALLBACK_BADGE

// Verification status chips (route tables, service cards, crag cards).
export const verifiedBadge = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30'
export const unverifiedBadge = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
