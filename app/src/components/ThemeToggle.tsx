import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

// Light/dark toggle (sun in dark mode, moon in light). Mounted guard: the
// resolved theme is only known client-side after hydration, so render an
// inert 40px placeholder first — otherwise the icon can flash the wrong one.
// (setState is deferred to a timeout callback: the react-hooks lint forbids
// synchronous setState in an effect body.)
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(t)
  }, [])

  if (!mounted) {
    return <span className="inline-flex h-10 w-10 items-center justify-center" aria-hidden="true" />
  }

  const dark = resolvedTheme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
