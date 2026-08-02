import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router'
import { Mountain, BookOpen, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const nav = [
  { to: '/', label: 'Overview' },
  { to: '/crags', label: 'Crags' },
  { to: '/routes', label: 'Routes' },
  { to: '/community', label: 'Community' },
  { to: '/plan', label: 'Plan a Trip' },
  { to: '/services', label: 'Services' },
  { to: '/sources', label: 'Sources' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-teal-500/15 text-teal-300'
      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
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
                  <SheetTitle className="flex items-center gap-2 text-stone-100">
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
                      className={linkClass}
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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Compiled August 2026 from public sources — verify grades &amp; access with the Koh Tao
            Climbing Club before climbing.
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            Mirrored in the Obsidian vault at <code className="text-stone-400">/vault</code>
          </span>
        </div>
      </footer>
    </div>
  )
}
