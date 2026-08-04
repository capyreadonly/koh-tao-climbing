import type { RouteRecord } from '@/data/routes'

// Expanded per-route detail: description/protection/FA/length from the MP deep
// scrape and the Goodtime PDF. Shared by the desktop tables (expanded row) and
// the mobile RouteCard (<details> disclosure).

// True when a route carries any of the new fact-checked fields worth expanding for.
export const hasRouteDetails = (r: RouteRecord) =>
  Boolean(r.description || r.protection || r.fa || r.lengthM != null)

export default function RouteDetails({ route: r }: { route: RouteRecord }) {
  const meta: { label: string; value: string }[] = []
  if (r.lengthM != null) meta.push({ label: 'Length', value: `${r.lengthM} m` })
  if (r.bolts != null) meta.push({ label: 'Bolts', value: String(r.bolts) })
  if (r.fa) meta.push({ label: 'First ascent', value: r.fa })

  return (
    <div className="space-y-2 text-left">
      {r.description && <p className="text-sm text-stone-300">{r.description}</p>}
      {r.protection && (
        <p className="text-sm text-stone-400">
          <span className="font-medium text-stone-300">Protection: </span>
          {r.protection}
        </p>
      )}
      {meta.length > 0 && (
        <dl className="flex flex-wrap gap-x-5 gap-y-1">
          {meta.map((m) => (
            <div key={m.label} className="flex gap-1.5 text-xs">
              <dt className="uppercase tracking-wide text-stone-500">{m.label}</dt>
              <dd className="text-stone-300">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
