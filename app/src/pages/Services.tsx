import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SectionHeader from '@/components/SectionHeader'
import { services } from '@/data/climbing'
import { ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react'

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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="Support local"
        title="Services & operators"
        lede="Two operators keep climbing alive on the island, and one community club guards access and bolting. Support them — they maintain the routes. Status and 2026 prices were fact-checked on 2026-08-02 where a badge says so."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {services.map((s) => {
          const verified = isVerified(s.verified)
          return (
            <Card
              key={s.name}
              className="flex flex-col rounded-xl border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm transition hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="font-display text-lg tracking-tight">{s.name}</CardTitle>
                  {verified ? (
                    <Badge variant="outline" className="shrink-0 border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/15 text-xs text-teal-700 dark:text-teal-400">
                      <ShieldCheck className="mr-1 h-3 w-3" /> verified 2026
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 text-xs text-amber-800 dark:text-amber-300">
                      <ShieldAlert className="mr-1 h-3 w-3" /> unverified
                    </Badge>
                  )}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{s.role}</div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">{s.summary}</p>
                <ul className="mb-4 space-y-2">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-stone-200 dark:border-stone-800 pt-3 text-sm">
                  <div className="text-stone-600 dark:text-stone-300">{s.contact}</div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {s.verified && (
                    <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">{s.verified}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <SectionHeader
        className="mt-12 sm:mt-16"
        kicker="Keep one handy"
        title="Guidebooks & apps"
        lede="This site is a map, not a manual — carry the current guide on the rock."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {guidebooks.map((g) => (
          <div key={g.name} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-4 shadow-sm">
            <div className="text-sm font-medium">{g.name}</div>
            <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">{g.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-5 text-sm text-stone-600 dark:text-stone-300">
        <h3 className="mb-2 font-display font-semibold tracking-tight text-stone-800 dark:text-stone-200">A short history</h3>
        Climbing grew out of the diving scene. James March’s Zen Gecko opened first (guide 2002,
        shop closed 2005); Goodtime Adventures followed in 2008 and drove most modern development;
        Evasion Koh Tao and a bouldering gym came and went. Today Goodtime and The Bunker remain,
        with the Koh Tao Climbing Club stewarding access.
      </div>
    </div>
  )
}
