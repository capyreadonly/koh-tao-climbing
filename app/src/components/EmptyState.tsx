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
      className={`flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 px-6 py-12 text-center ${className ?? ''}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
        <Mountain className="h-6 w-6 text-stone-400" />
      </span>
      <p className="font-medium text-stone-700">{title}</p>
      {children && <div className="max-w-prose text-sm text-stone-500">{children}</div>}
    </div>
  )
}
