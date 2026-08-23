import { NavLink, Outlet, Link } from 'react-router'
import {
  Mountain,
  BookOpen,
  Github,
  Home,
  Route as RouteIcon,
  Map as MapIcon,
  Compass,
} from 'lucide-react'
import { GUIDE_PDF_URL } from '@/lib/photo'
import ThemeToggle from '@/components/ThemeToggle'

const nav = [
  { to: '/', label: 'Overview' },
  { to: '/crags', label: 'Crags' },
  { to: '/routes', label: 'Routes' },
  { to: '/map', label: 'Map' },
  { to: '/plan', label: 'Plan a Trip' },
  { to: '/services', label: 'Services' },
  { to: '/sources', label: 'Sources' },
]

// Mobile bottom tab bar (below md): the five day-to-day destinations. Services
// & Sources stay reachable from the footer.
const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/crags', label: 'Crags', icon: Mountain },
  { to: '/routes', label: 'Routes', icon: RouteIcon },
  { to: '/map', label: 'Map', icon: MapIcon },
  { to: '/plan', label: 'Plan', icon: Compass },
]

// Desktop nav: quiet stone links, active = accent text + accent underline.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-1 py-2 transition-colors whitespace-nowrap after:absolute after:inset-x-0 after:-bottom-[1px] after:h-0.5 after:rounded-full after:transition-colors ${
    isActive
      ? 'text-teal-700 dark:text-teal-400 after:bg-teal-600 dark:after:bg-teal-400'
      : 'text-stone-500 dark:text-stone-400 after:bg-transparent hover:text-stone-900 dark:hover:text-stone-100'
  }`

// Bottom tab bar: active tab gets accent icon + label.
const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 pt-1 text-[10px] font-medium transition-colors ${
    isActive ? 'text-teal-700 dark:text-teal-400' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
  }`

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <header className="sticky top-0 z-40 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-semibold tracking-tight text-stone-900 dark:text-stone-100"
          >
            <Mountain className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <span>
              Koh Tao <span className="text-teal-700 dark:text-teal-400">Climbing Guide</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-4 text-sm md:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Light/dark toggle — right of the nav on desktop; on mobile the nav
              is hidden so ml-auto pins it to the header's right edge. */}
          <span className="ml-auto md:ml-0">
            <ThemeToggle />
          </span>
        </div>
      </header>

      {/* Bottom padding (only below md) so the fixed tab bar never covers content:
          3.5rem bar height + the device safe-area inset. */}
      <main className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Primary"
      >
        <div className="flex h-14 items-stretch">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === '/'} className={tabClass}>
              <t.icon className="h-5 w-5" />
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Dark charcoal footer in BOTH themes (thetopo.com pattern): muted
          stone-400 text on stone-900, hover-white links. */}
      <footer className="border-t border-stone-800 bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-md">
              <Link
                to="/"
                className="flex items-center gap-2 font-display font-semibold tracking-tight text-stone-100"
              >
                <Mountain className="h-5 w-5 text-teal-400" />
                <span>
                  Koh Tao <span className="text-teal-400">Climbing Guide</span>
                </span>
              </Link>
              <p className="mt-3 text-sm text-stone-400">
                Community-contributed climbing database for Koh Tao, Thailand — compiled August
                2026 from public sources. Routes, grades and access change:{' '}
                <span className="text-stone-200">
                  verify locally with the Koh Tao Climbing Club before climbing.
                </span>
              </p>
            </div>
            <nav className="flex flex-col gap-2.5 text-sm" aria-label="Site credits">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Credits
              </span>
              <a
                href={GUIDE_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-white"
              >
                <BookOpen className="h-4 w-4 text-stone-500" />
                Goodtime Adventures guidebook PDF
              </a>
              <a
                href="https://github.com/capyreadonly/koh-tao-climbing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4 text-stone-500" />
                Source on GitHub
              </a>
              <Link
                to="/sources"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-white"
              >
                <Mountain className="h-4 w-4 text-stone-500" />
                Photo credits &amp; sources
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-stone-800 pt-6 text-xs text-stone-500">
            Photos remain © their authors and are shown with attribution — full credits on the
            Sources page. Not affiliated with any operator; support the local guides who maintain
            the bolts.
          </p>
        </div>
      </footer>
    </div>
  )
}
