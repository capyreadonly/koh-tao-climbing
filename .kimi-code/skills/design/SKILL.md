---
name: design
description: Visual design standards for the Koh Tao climbing guide website — typography, color, layout, imagery, motion, mobile rules
whenToUse: When creating or restyling any page, component, or visual element of the site (app/src/pages, components, index.css)
type: prompt
---

# Design standards — Koh Tao climbing guide

Binding rules for any UI work on this site. Stack: Tailwind 3 + shadcn/ui, LIGHT editorial theme (thetopo.com-style destination magazine, not a dashboard). The site was dark (stone-950/emerald) until 2026-08; it is now light — do not reintroduce dark surfaces.

## Personality

Magazine destination guide: airy white pages, generous whitespace, big real photography, clean cards, long-form prose sections, one restrained accent. Calm and print-like. No gradient-everything, no emoji-as-icons, no rainbow badges, no dashboard tiles.

## Typography

- Display/headings: "Space Grotesk" (`font-display`); body/UI: "Inter". Both self-hosted in `app/public/fonts/` via `@font-face` in `app/index.html` (`font-display: swap` + system fallbacks). NEVER load fonts from a CDN — no third-party runtime fetches anywhere on the site.
- Scale: h1 `text-3xl sm:text-5xl`, h2 `text-2xl sm:text-3xl` (`font-display font-semibold tracking-tight text-stone-900`); section kicker `text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700`.
- Body copy `text-stone-600`/`text-stone-700`, muted `text-stone-500`, max line length `max-w-prose`. Numbers/stats in `font-semibold tabular-nums`.

## Color

- Base: `bg-white` page, `bg-stone-50` alternating section bands/footer, cards `bg-white border-stone-200 shadow-sm`, hairline borders `stone-200` (stronger inputs `stone-300`).
- Text: `stone-900` primary, `stone-600`/`stone-700` body, `stone-500` secondary, `stone-400` faint.
- ONE accent: teal/emerald — darker shades for contrast on white. Links & active states `text-teal-700` (hover `teal-600` or underline), icons `text-teal-600`, primary buttons `bg-teal-700 text-white hover:bg-teal-600`, kickers `text-emerald-700`. Never teal-300/400 as text on white.
- Amber = warnings/unverified ONLY (`amber-50` bg, `amber-700`/`amber-800` text, `amber-300`/`amber-500` border). Rose = danger/video badges ONLY (`rose-50`/`rose-700`). Style badges ALWAYS come from `app/src/lib/badges.ts` (`styleBadge` / `styleBadgeFor`, `verifiedBadge`, `unverifiedBadge`) — the `styleColor` map in the data layer is dark-themed and the data is READ-ONLY; never use it in UI.

## Layout & spacing

- Page container: `mx-auto max-w-6xl px-4`. Section rhythm `py-12 sm:py-16`; section header pattern = kicker + h2 + one-line lede (SectionHeader component), then `mt-8` content. Alternate white / `bg-stone-50` bands separated by hairlines (`border-y border-stone-200`).
- Header: sticky white (`bg-white/90 backdrop-blur-md`, hairline `border-b`), display wordmark, desktop nav links with accent underline on active (`after:` bar in teal-600).
- Mobile: fixed bottom tab bar below md (Home, Crags, Routes, Community, Plan; lucide icon + 10px label, `h-14`, `pb-[env(safe-area-inset-bottom)]`, active = teal-700). Page content gets matching bottom padding: `pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0` on `<main>`. index.html viewport must keep `viewport-fit=cover`. Secondary destinations (Services, Sources) live in desktop nav + footer only.
- Footer: `bg-stone-50 border-t border-stone-200`, wordmark + disclaimer + credits links.
- Cards: `rounded-xl border border-stone-200 bg-white shadow-sm`, hover `transition duration-200 hover:-translate-y-0.5 hover:shadow-md`. The one big crag card (CragCard component): photo `aspect-[16/10]`, name + grade range, area, line-clamp-2 summary, style chips, Fact-checked line + "Read more →". Never mixed aspect ratios in a grid.
- Editorial facts/meta: inline `dl` rows with hairline separators (`border-b border-stone-200`), icon + uppercase micro-label + value — not boxed stat tiles.
- Tables: light — header row `bg-stone-100`, hairline `border-stone-200` rows, `hover:bg-stone-50`; `overflow-x-auto` wrapper on md+, replaced by RouteCard stacked cards below md.
- Callouts: access warnings = `border-l-4 border-amber-500 bg-amber-50` (left-border, not a loud alert box); fact-check status = a small "Fact-checked (date)" line with ShieldCheck icon.
- Filter pills: rounded-full; active `border-teal-600 bg-teal-50 text-teal-700`, inactive `border-stone-300 text-stone-600 hover:bg-stone-100`.

## Imagery (binding)

- Content imagery = REAL photos only (guide topos, community photos), always with their attribution line. Never remove credits; card/hero credit chips are `bg-white/75 backdrop-blur-sm` on light overlays.
- AI-generated images are allowed ONLY for decorative purposes (hero backdrop treatment, section background textures, empty-state illustrations) and must live in `app/public/images/decor/` with a note in the Sources page credits. Never present generated art as a crag/route photo. Never generate a fake topo.
- Hero: real destination photo, full-bleed, LIGHT scrim (`bg-gradient-to-t from-white via-white/55 to-white/5`) with dark display text over the bottom — not a dark overlay. Credit line visible.
- CC-ND images: `object-contain` on a `bg-stone-50` matte, never cropped (isNdLicense helper).
- Empty states: one consistent treatment (EmptyState component: dashed stone-300 panel + lucide Mountain), not per-page improvisation.
- Map: self-hosted OSM tiles only (`public/tiles/`, no third-party requests); Leaflet chrome styled light in index.css (`.crag-map` overrides: white bars/popups, teal-600 markers, amber-600 selected).

## Components & motion

- shadcn primitives only; touch targets ≥40px (already customized — don't regress).
- Motion: `transition-colors`/`transition-transform`/`shadow` 150–250ms; no parallax, no autoplay carousels, no scroll-jacking.
- Map, lightbox (white Dialog), carousel: already styled — match them instead of restyling.

## Accessibility floor

- Contrast AA on white: stone-600+ for body text; teal-700+ for text links (teal-600 only for icons/large elements); stone-500 only for secondary/meta text.
- Every `<img>` has meaningful `alt`; decorative-only images get `alt=""`.
- Interactive elements have `focus-visible` ring (index.css default: teal-600 outline); icon-only buttons have `aria-label`.

## Done means

Mobile (375px) and desktop both pass: no horizontal scroll, nothing hidden under the bottom tab bar, consistent section rhythm, credits intact, `npm run build` green.
