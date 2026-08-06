import type { ReactNode } from 'react'
import { Mountain } from 'lucide-react'

// The single empty-state treatment — dashed panel + Mountain icon — reused
// wherever a list, table or gallery has nothing to show (per design skill).
export default function EmptyState({
  title,
  children,
  className,
}: {
  title: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 px-6 py-12 text-center ${className ?? ''}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
        <Mountain className="h-6 w-6 text-stone-400 dark:text-stone-500" />
      </span>
      <p className="font-medium text-stone-700 dark:text-stone-300">{title}</p>
      {children && <div className="max-w-prose text-sm text-stone-500 dark:text-stone-400">{children}</div>}
    </div>
  )
}
