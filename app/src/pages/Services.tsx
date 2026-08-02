import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { services } from '@/data/climbing'
import { ExternalLink, BookOpen, ShieldCheck, ShieldAlert } from 'lucide-react'

const guidebooks = [
  {
    name: 'Rakkup app — “Koh Tao Rock Climbing” (Kelsey Gray)',
    note: 'The current digital guide; essentially required for Tanote Bay route-finding.',
  },
  {
    name: 'theCrag — Koh Tao',
    note: 'Community database (1,800+ logged ascents); access & ethics notices.',
  },
  {
    name: 'Mountain Project — Tanote Bay',
    note: 'Sub-crag order, multi-pitch description, hardware warnings.',
  },
  {
    name: 'Free PDF — “Koh Tao Rock Climbing & Bouldering Guide” (railay.com)',
    note: 'Zen Gecko-era bouldering guide (2002, updated 2010). Old — verify on the ground.',
  },
]

// `verified` notes that open with "Unverified" mean no 2026 confirmation was found.
const isVerified = (v?: string) => v != null && !v.toLowerCase().startsWith('unverified')

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Services &amp; operators</h1>
      <p className="mt-2 max-w-2xl text-stone-400">
        Two operators keep climbing alive on the island, and one community club guards access and
        bolting. Support them — they maintain the routes. Status and 2026 prices were fact-checked
        on 2026-08-02 where a badge says so.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {services.map((s) => {
          const verified = isVerified(s.verified)
          return (
            <Card key={s.name} className="flex flex-col border-stone-800 bg-stone-900/60">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                  {verified ? (
                    <Badge variant="outline" className="shrink-0 border-teal-500/40 text-xs text-teal-300">
                      <ShieldCheck className="mr-1 h-3 w-3" /> verified 2026
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 border-amber-500/40 text-xs text-amber-300">
                      <ShieldAlert className="mr-1 h-3 w-3" /> unverified
                    </Badge>
                  )}
                </div>
                <div className="text-xs uppercase tracking-wide text-teal-400">{s.role}</div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-4 text-sm text-stone-400">{s.summary}</p>
                <ul className="mb-4 space-y-2">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-stone-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-stone-800 pt-3 text-sm">
                  <div className="text-stone-400">{s.contact}</div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-teal-400 hover:underline"
                  >
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {s.verified && (
                    <p className="mt-2 text-xs text-stone-500">{s.verified}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-4 mt-12 flex items-center gap-2 text-2xl font-semibold">
        <BookOpen className="h-5 w-5 text-teal-400" /> Guidebooks &amp; apps
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {guidebooks.map((g) => (
          <div key={g.name} className="rounded-lg border border-stone-800 bg-stone-900/60 p-4">
            <div className="text-sm font-medium">{g.name}</div>
            <p className="mt-1 text-sm text-stone-400">{g.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-stone-800 bg-stone-900/40 p-5 text-sm text-stone-400">
        <h3 className="mb-2 font-semibold text-stone-200">A short history</h3>
        Climbing grew out of the diving scene. James March’s Zen Gecko opened first (guide 2002,
        shop closed 2005); Goodtime Adventures followed in 2008 and drove most modern development;
        Evasion Koh Tao and a bouldering gym came and went. Today Goodtime and The Bunker remain,
        with the Koh Tao Climbing Club stewarding access.
      </div>
    </div>
  )
}
