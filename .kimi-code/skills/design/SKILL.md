---
name: design
description: Visual design standards for the Koh Tao climbing guide website — typography, color, layout, imagery, motion, mobile rules
whenToUse: When creating or restyling any page, component, or visual element of the site (app/src/pages, components, index.css)
type: prompt
---

# Design standards — Koh Tao climbing guide

Binding rules for any UI work on this site. Stack: Tailwind 3 + shadcn/ui, DUAL-THEME (light + dark) editorial design — thetopo.com-style destination magazine in the light theme, the pre-2026-08 dark guide revived in the dark theme. Every component ships both variants; never ship a light-only or dark-only surface.

## Personality

Magazine destination guide: airy pages, generous whitespace, big real photography, clean cards, long-form prose sections, one restrained accent. Calm and print-like. No gradient-everything, no emoji-as-icons, no rainbow badges, no dashboard tiles.

## Typography

- Display/headings: "Space Grotesk" (`font-display`); body/UI: "Inter". Both self-hosted in `app/public/fonts/` via `@font-face` in `app/index.html` (`font-display: swap` + system fallbacks). NEVER load fonts from a CDN — no third-party runtime fetches anywhere on the site.
- Scale: h1 `text-3xl sm:text-5xl`, h2 `text-2xl sm:text-3xl` (`font-display font-semibold tracking-tight text-stone-900 dark:text-stone-100`); section kicker `text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400`.
- Body copy `text-stone-600`/`text-stone-700` (dark: `stone-300`), muted `text-stone-500` (dark: `stone-400`), max line length `max-w-prose`. Numbers/stats in `font-semibold tabular-nums`.

## Color (light → dark mapping)

- Base: `bg-white dark:bg-stone-950` page, `bg-stone-50 dark:bg-stone-900` alternating section bands/footer, cards `bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 shadow-sm`, hairline borders `stone-200 dark:stone-800` (stronger inputs `stone-300 dark:stone-700`). Table heads `bg-stone-100 dark:bg-stone-900/80`.
- Text: `stone-900 dark:stone-100` primary, `stone-800 dark:stone-200`, `stone-600`/`stone-700 dark:stone-300` body, `stone-500 dark:stone-400` secondary, `stone-400 dark:stone-500` faint.
- ONE accent: teal/emerald. Links & active states `text-teal-700 dark:text-teal-400` (hover `teal-600 dark:teal-300` or underline), icons `text-teal-600 dark:text-teal-400`, primary buttons `bg-teal-700 text-white hover:bg-teal-600 dark:bg-teal-500 dark:text-stone-950`, kickers `text-emerald-700 dark:text-emerald-400`. Never teal-300/400 as text on white (light theme); teal-300 is reserved for dark-mode chip text.
- Amber = warnings/unverified ONLY. Callouts `bg-amber-50 dark:bg-amber-950/40`, text `amber-700 dark:amber-400` / `amber-800 dark:amber-300`, borders `amber-300 dark:amber-500/30` / `amber-500`. Rose = danger/video badges ONLY (`rose-50 dark:rose-950/40` callouts, `rose-500/15` dark chips, `rose-300` dark text).
- Style/verification badges ALWAYS come from `app/src/lib/badges.ts` (`styleBadge` / `styleBadgeFor`, `verifiedBadge`, `unverifiedBadge`) — it carries both themes: light soft tints (50 bg / 700 text / 200 border) + dark tints (`bg-*-500/15 text-*-300 border-*-500/30`, mirroring the read-only `styleColor` map in the data layer). Never use the data layer's `styleColor` directly in UI.

## Theming (binding)

- Mechanism: `next-themes` `ThemeProvider` in `app/src/main.tsx` (`attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange`) flipping `.dark` on `<html>`; Tailwind `darkMode: ["class"]` in `app/tailwind.config.js`. Theme persists in localStorage key `theme` (`light` | `dark` | `system`).
- No flash of wrong theme: an inline script in `app/index.html` `<head>` applies `.dark` + `color-scheme` before first paint, mirroring next-themes' resolution. Keep it in sync if the provider config changes. `theme-color` is two meta tags with `media="(prefers-color-scheme: …)"` (`#ffffff` light, `#0c0a09` stone-950 dark); the PWA manifest theme_color stays light.
- Toggle: `app/src/components/ThemeToggle.tsx` (lucide Sun/Moon, `aria-label="Toggle dark mode"`, 40px target, mounted guard against wrong-icon flash). One instance in the Layout header — right of the desktop nav, pinned to the header's right edge on mobile (`ml-auto md:ml-0` wrapper). Reachable on every screen.
- EVERY new component/page ships both variants. Write the light classes, then append the `dark:` counterpart per the mapping above (a codemod of the original sweep lives at `work/theme-sweep.py`). Check hover/focus/placeholder/active variants too.
- shadcn primitives theme via the `.dark` CSS-variable block already in `app/src/index.css`; hardcoded stone/white overrides on instances still need explicit `dark:` classes.
- Test both: toggle in the header AND OS-level `prefers-color-scheme` (fresh profile = system default).

## Layout & spacing

- Page container: `mx-auto max-w-6xl px-4`. Section rhythm `py-12 sm:py-16`; section header pattern = kicker + h2 + one-line lede (SectionHeader component), then `mt-8` content. Alternate white / `bg-stone-50 dark:bg-stone-900` bands separated by hairlines (`border-y border-stone-200 dark:border-stone-800`).
- Header: sticky (`bg-white/90 dark:bg-stone-950/90 backdrop-blur-md`, hairline `border-b`), display wordmark, desktop nav links with accent underline on active (`after:` bar `teal-600 dark:teal-400`), theme toggle at the right edge.
- Mobile: fixed bottom tab bar below md (Home, Crags, Routes, Community, Plan; lucide icon + 10px label, `h-14`, `pb-[env(safe-area-inset-bottom)]`, active = `teal-700 dark:teal-400`; bar `bg-white/95 dark:bg-stone-950/95`). Page content gets matching bottom padding: `pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0` on `<main>`. index.html viewport must keep `viewport-fit=cover`. Secondary destinations (Services, Sources) live in desktop nav + footer only.
- Footer: `bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800`, wordmark + disclaimer + credits links.
- Cards: `rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm`, hover `transition duration-200 hover:-translate-y-0.5 hover:shadow-md`. The one big crag card (CragCard component): photo `aspect-[16/10]`, name + grade range, area, line-clamp-2 summary, style chips, Fact-checked line + "Read more →". Never mixed aspect ratios in a grid.
- Editorial facts/meta: inline `dl` rows with hairline separators (`border-b border-stone-200 dark:border-stone-800`), icon + uppercase micro-label + value — not boxed stat tiles.
- Tables: header row `bg-stone-100 dark:bg-stone-900/80`, hairline `border-stone-200 dark:border-stone-800` rows, `hover:bg-stone-50 dark:hover:bg-stone-900`; `overflow-x-auto` wrapper on md+, replaced by RouteCard stacked cards below md.
- Callouts: access warnings = `border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40` (left-border, not a loud alert box); fact-check status = a small "Fact-checked (date)" line with ShieldCheck icon.
- Filter pills: rounded-full; active `border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400`, inactive `border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800`.

## Imagery (binding)

- Content imagery = REAL photos only (guide topos, community photos), always with their attribution line. Never remove credits; card/hero credit chips are `bg-white/75 dark:bg-stone-950/75 backdrop-blur-sm` overlays.
- AI-generated images are allowed ONLY for decorative purposes (hero backdrop treatment, section background textures, empty-state illustrations) and must live in `app/public/images/decor/` with a note in the Sources page credits. Never present generated art as a crag/route photo. Never generate a fake topo.
- Hero: real destination photo, full-bleed, scrim matched to the theme (`bg-gradient-to-t from-white dark:from-stone-950 via-white/45 dark:via-stone-950/45 to-white/5 dark:to-stone-950/5`) with display text over the bottom. Credit line visible.
- CC-ND images: `object-contain` on a `bg-stone-50 dark:bg-stone-900` matte, never cropped (isNdLicense helper).
- Empty states: one consistent treatment (EmptyState component: dashed stone panel + lucide Mountain), not per-page improvisation.
- Map: self-hosted OSM tiles only (`public/tiles/`, no third-party requests); Leaflet chrome styled per-theme in index.css (`.crag-map` overrides for light, `.dark .crag-map` for dark; teal-600 markers in both, amber-600 selected). Dark mode additionally dims the tiles: `.dark .leaflet-tile-pane { filter: brightness(0.9) saturate(0.9) }`.

## Components & motion

- shadcn primitives only; touch targets ≥40px (already customized — don't regress).
- Motion: `transition-colors`/`transition-transform`/`shadow` 150–250ms; no parallax, no autoplay carousels, no scroll-jacking. Theme switches are transition-free (next-themes `disableTransitionOnChange`).
- Map, lightbox (Dialog), carousel: already styled for both themes — match them instead of restyling.

## Accessibility floor

- Contrast AA: on white, stone-600+ body text, teal-700+ text links (teal-600 only icons/large), stone-500 only secondary/meta. On stone-950, stone-300+ body text, teal-400 links, stone-400 only secondary/meta (stone-500 for faint captions/icons).
- Every `<img>` has meaningful `alt`; decorative-only images get `alt=""`.
- Interactive elements have `focus-visible` ring (index.css default: teal-600 outline); icon-only buttons have `aria-label`.

## Done means

Mobile (375px) and desktop both pass, in BOTH themes: no horizontal scroll, nothing hidden under the bottom tab bar, consistent section rhythm, credits intact, no unthemed (light-only) surfaces, `npm run build` green.
