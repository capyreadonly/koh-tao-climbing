---
name: design
description: Visual design standards for the Koh Tao climbing guide website — typography, color, layout, imagery, motion, mobile rules
whenToUse: When creating or restyling any page, component, or visual element of the site (app/src/pages, components, index.css)
type: prompt
---

# Design standards — Koh Tao climbing guide

The user judged an earlier iteration "quite ugly". These rules are binding for any UI work on this site. Stack: Tailwind 3 + shadcn/ui, dark theme.

## Personality

Premium guidebook, not generic dashboard. Think print guide meets modern outdoor brand: warm dark background, confident display type, real granite photography doing the heavy lifting, one disciplined accent color. No gradient-everything, no emoji-as-icons, no rainbow badges.

## Typography

- Display/headings: a distinctive face (e.g. "Sora" or "Space Grotesk" via Google Fonts); body/UI: "Inter". Load with `display=swap` + system fallbacks in `app/index.html`.
- Scale: h1 `text-3xl sm:text-5xl` (never fixed huge sizes that overflow mobile), h2 `text-2xl sm:text-3xl`, section kicker `text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400`.
- Body copy `text-stone-300`, muted `text-stone-400`, max line length `max-w-prose` for paragraphs. Numbers/stats in `font-semibold tabular-nums`.

## Color

- Base: `stone-950` page bg, `stone-900` cards, borders `stone-800`.
- ONE accent: emerald/teal (`emerald-400`/`teal-400`) for links, active states, key stats. Amber = warnings/unverified ONLY. Rose = danger/video badges ONLY. Style badges use the fixed `styleColor` map — do not invent new colors.
- Never put pure white large blocks on the dark bg; use `stone-100` for primary text.

## Layout & spacing

- Page container: `mx-auto max-w-6xl px-4` (content), `max-w-7xl` (wide tables/map). Section rhythm: `py-12 sm:py-16`, section header pattern = kicker + h2 + one-line lede, then `mt-8` content.
- Cards: `rounded-xl border border-stone-800 bg-stone-900`, hover `transition hover:-translate-y-0.5 hover:border-stone-700`, image `aspect-[4/3] w-full object-cover` (never mixed aspect ratios in a grid).
- Tables: `overflow-x-auto` wrapper on md+, replaced by card lists below md (established pattern in RouteCard.tsx — reuse it).

## Imagery (binding)

- Content imagery = REAL photos only (guide topos, community photos), always with their attribution line. Never remove credits.
- AI-generated images are allowed ONLY for decorative purposes (hero backdrop treatment, section background textures, empty-state illustrations) and must live in `app/public/images/decor/` with a note in the Sources page credits. Never present generated art as a crag/route photo. Never generate a fake topo.
- Hero: real crag photo, full-bleed, dark gradient overlay (`from-stone-950/80 via-stone-950/40`), content bottom-left aligned, credit line visible.
- Empty states: one consistent illustration/icon treatment (lucide `Mountain`), not per-page improvisation.

## Components & motion

- shadcn primitives only; Buttons default size ≥40px touch target (already customized — don't regress).
- Motion: `transition-colors`/`transition-transform` 150–250ms; no parallax, no autoplay carousels, no scroll-jacking.
- Map, lightbox, carousel: already styled — match them instead of restyling.

## Accessibility floor

- Contrast AA on dark bg (stone-300+ on stone-900 is fine; stone-500 on stone-900 is not for body text).
- Every `<img>` has meaningful `alt`; decorative-only images get `alt=""`.
- Interactive elements have `focus-visible` ring; icon-only buttons have `aria-label`.

## Done means

Mobile (375px) and desktop both pass: no horizontal scroll, no text overflow, consistent section rhythm, credits intact, `npm run build` green.
