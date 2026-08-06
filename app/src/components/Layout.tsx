import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router'
import { Mountain, BookOpen, Menu, Github } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { GUIDE_PDF_URL } from '@/lib/photo'

const nav = [
  { to: '/', label: 'Overview' },
  { to: '/crags', label: 'Crags' },
  { to: '/routes', label: 'Routes' },
  { to: '/community', label: 'Community' },
  { to: '/plan', label: 'Plan a Trip' },
  { to: '/services', label: 'Services' },
  { to: '/sources', label: 'Sources' },
]

// Active link = accent pill; inactive = quiet stone until hover.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3.5 py-1.5 transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-teal-500/15 text-teal-300'
      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/70'
  }`

// Sheet links get a taller hit area for thumbs (>= 40px).
const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-3 text-base transition-colors ${
    isActive
      ? 'bg-teal-500/15 text-teal-300'
      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-semibold tracking-tight"
          >
            <Mountain className="h-5 w-5 text-teal-400" />
            <span>
              Koh Tao <span className="text-teal-400">Climbing DB</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-1 text-sm md:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile nav */}
          <div className="ml-auto md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-stone-700 text-stone-300 hover:bg-stone-800"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-64 border-stone-800 bg-stone-950 text-stone-100"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 font-display text-stone-100">
                    <Mountain className="h-5 w-5 text-teal-400" />
                    Koh Tao <span className="text-teal-400">Climbing DB</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1 text-sm">
                  {nav.map((n) => (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      end={n.to === '/'}
                      onClick={() => setOpen(false)}
                      className={mobileLinkClass}
                    >
                      {n.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone-800">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-md">
              <Link
                to="/"
                className="flex items-center gap-2 font-display font-semibold tracking-tight"
              >
                <Mountain className="h-5 w-5 text-teal-400" />
                <span>
                  Koh Tao <span className="text-teal-400">Climbing DB</span>
                </span>
              </Link>
              <p className="mt-3 text-sm text-stone-400">
                Community-contributed climbing database for Koh Tao, Thailand — compiled August
                2026 from public sources. Routes, grades and access change:{' '}
                <span className="text-stone-300">
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
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-teal-300"
              >
                <BookOpen className="h-4 w-4 text-stone-500" />
                Goodtime Adventures guidebook PDF
              </a>
              <a
                href="https://github.com/capyreadonly/koh-tao-climbing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-teal-300"
              >
                <Github className="h-4 w-4 text-stone-500" />
                Source on GitHub
              </a>
              <Link
                to="/sources"
                className="inline-flex items-center gap-2 text-stone-400 transition-colors hover:text-teal-300"
              >
                <Mountain className="h-4 w-4 text-stone-500" />
                Photo credits &amp; sources
              </Link>
            </nav>
          </div>
          <p className="mt-8 border-t border-stone-800/60 pt-6 text-xs text-stone-500">
            Photos remain © their authors and are shown with attribution — full credits on the
            Sources page. Not affiliated with any operator; support the local guides who maintain
            the bolts.
          </p>
        </div>
      </footer>
    </div>
  )
}
