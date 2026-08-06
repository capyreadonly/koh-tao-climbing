import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// The one section-header pattern — kicker + display title + one-line lede —
// used on every page and page section (see .kimi-code/skills/design).
// `as="h1"` for the page-level header, default h2 for sections.
export default function SectionHeader({
  kicker,
  title,
  lede,
  as: Heading = 'h2',
  className,
}: {
  kicker: string
  title: ReactNode
  lede?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <header className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{kicker}</p>
      <Heading
        className={cn(
          'mt-2 font-display font-semibold tracking-tight text-stone-100',
          Heading === 'h1' ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl',
        )}
      >
        {title}
      </Heading>
      {lede && <p className="mt-3 max-w-prose text-stone-400">{lede}</p>}
    </header>
  )
}
