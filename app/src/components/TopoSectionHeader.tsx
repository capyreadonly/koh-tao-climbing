import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// thetopo.com lander section header (see work/thetopo-tokens.md): centered
// Roboto-weight h2 (our Inter bold is the self-hosted stand-in), 70px yellow
// underline bar, centered light subtitle. Used by the Home destination page
// sections; the kicker-style SectionHeader stays the pattern elsewhere.
export default function TopoSectionHeader({
  title,
  subtitle,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('text-center', className)}>
      <h2 className="font-sans text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
        {title}
      </h2>
      <div aria-hidden className="mx-auto mt-4 h-0.5 w-[70px] bg-topo" />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-stone-700 dark:text-stone-300">
          {subtitle}
        </p>
      )}
    </header>
  )
}
