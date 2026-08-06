import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import SectionHeader from '@/components/SectionHeader'
import {
  gettingThere,
  seasons,
  gearAndSafety,
  ethics,
  itineraries,
  guidebooks,
} from '@/data/info'
import {
  CalendarDays,
  Plane,
  Backpack,
  HeartHandshake,
  Map,
  BookOpen,
  AlertTriangle,
  ShieldAlert,
  Quote,
  ExternalLink,
} from 'lucide-react'

// Plain-table header cell: uppercase micro-label (per design skill).
const thClass = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500'

function BulletList({ items, tone = 'bg-teal-400' }: { items: string[]; tone?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-stone-300">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone}`} />
          {it}
        </li>
      ))}
    </ul>
  )
}

export default function Plan() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="Plan a trip"
        title="The distilled playbook"
        lede="Hot and humid year-round (28–32 °C), granite that gets vicious in the sun, and a community that asks you to check in before bolting. Source contradictions kept visible, not smoothed over."
      />

      <Tabs defaultValue="season" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-stone-900 p-1">
          <TabsTrigger value="season" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <CalendarDays className="h-4 w-4" /> When to go
          </TabsTrigger>
          <TabsTrigger value="logistics" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <Plane className="h-4 w-4" /> Getting there
          </TabsTrigger>
          <TabsTrigger value="gear" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <Backpack className="h-4 w-4" /> Gear &amp; safety
          </TabsTrigger>
          <TabsTrigger value="ethics" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <HeartHandshake className="h-4 w-4" /> Ethics &amp; access
          </TabsTrigger>
          <TabsTrigger value="itineraries" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <Map className="h-4 w-4" /> Itineraries
          </TabsTrigger>
          <TabsTrigger value="guidebooks" className="min-h-10 gap-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <BookOpen className="h-4 w-4" /> Guidebooks
          </TabsTrigger>
        </TabsList>

        {/* When to go */}
        <TabsContent value="season" className="mt-6 space-y-6">
          <p className="max-w-prose text-sm text-stone-400">{seasons.climate}</p>
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/80">
                  <th className={thClass}>Period</th>
                  <th className={thClass}>Conditions</th>
                  <th className={`hidden md:table-cell ${thClass}`}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {seasons.table.map((s) => (
                  <tr key={s.period} className="border-b border-stone-800/60 last:border-0 hover:bg-stone-900/50">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-300">{s.period}</td>
                    <td className="px-4 py-3 text-stone-200">{s.conditions}</td>
                    <td className="hidden px-4 py-3 text-stone-400 md:table-cell">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Card className="rounded-xl border-stone-800 bg-stone-900">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">The daily rhythm (matters more than the month)</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={seasons.dailyRhythm} />
            </CardContent>
          </Card>
          <div className="space-y-1 text-xs text-stone-500">
            {seasons.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        </TabsContent>

        {/* Getting there */}
        <TabsContent value="logistics" className="mt-6 space-y-6">
          <Card className="rounded-xl border-stone-800 bg-stone-900">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">To the island</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={gettingThere.toIsland} />
            </CardContent>
          </Card>

          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/80">
                  <th className={thClass}>Ferry route</th>
                  <th className={`hidden lg:table-cell ${thClass}`}>Operators</th>
                  <th className={thClass}>Duration</th>
                  <th className={`hidden md:table-cell ${thClass}`}>Fare</th>
                  <th className={`hidden xl:table-cell ${thClass}`}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {gettingThere.ferries.map((f) => (
                  <tr key={f.route} className="border-b border-stone-800/60 last:border-0 hover:bg-stone-900/50">
                    <td className="px-4 py-3 font-medium text-stone-100">{f.route}</td>
                    <td className="hidden px-4 py-3 text-stone-400 lg:table-cell">{f.operators}</td>
                    <td className="px-4 py-3 text-stone-300">{f.duration}</td>
                    <td className="hidden px-4 py-3 text-stone-300 md:table-cell">{f.fare ?? '—'}</td>
                    <td className="hidden px-4 py-3 text-stone-400 xl:table-cell">{f.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {gettingThere.conflicts.map((c, i) => (
            <Alert key={i} className="rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <AlertTitle className="text-amber-300">Sources disagree</AlertTitle>
              <AlertDescription className="text-amber-100/80">{c}</AlertDescription>
            </Alert>
          ))}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl border-stone-800 bg-stone-900">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">On the island</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gettingThere.onIsland} />
              </CardContent>
            </Card>
            <Card className="rounded-xl border-stone-800 bg-stone-900">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">Bringing gear vs renting</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gettingThere.withGear} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gear & safety */}
        <TabsContent value="gear" className="mt-6 space-y-6">
          <Alert className="rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-100">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <AlertTitle className="text-rose-300">Bolts &amp; the Thaitanium warning</AlertTitle>
            <AlertDescription className="text-rose-100/80">{gearAndSafety.bolts}</AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl border-stone-800 bg-stone-900">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">The rock demands</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gearAndSafety.rockDemands} />
              </CardContent>
            </Card>
            <Card className="rounded-xl border-stone-800 bg-stone-900">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">Kit list</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gearAndSafety.kitList} />
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border-stone-800 bg-stone-900">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">Hazards</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={gearAndSafety.hazards} tone="bg-rose-400" />
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold tracking-tight">Gear, gyms &amp; rentals on the island</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {gearAndSafety.shops.map((s) => {
                const unverified = s.verified?.toLowerCase().startsWith('unverified')
                return (
                  <div key={s.name} className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{s.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          unverified
                            ? 'border-amber-500/40 text-xs text-amber-300'
                            : 'border-teal-500/40 text-xs text-teal-300'
                        }
                      >
                        {unverified ? 'unverified' : 'verified'}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-stone-500">{s.location}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.services.map((v) => (
                        <span key={v} className="rounded-full border border-stone-700 px-2 py-0.5 text-xs text-stone-400">
                          {v}
                        </span>
                      ))}
                    </div>
                    {s.verified && <p className="mt-2 text-xs text-stone-500">{s.verified}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* Ethics */}
        <TabsContent value="ethics" className="mt-6 space-y-6">
          <Card className="rounded-xl border-teal-500/30 bg-teal-500/5">
            <CardContent className="pt-6">
              <Quote className="mb-3 h-5 w-5 text-teal-400" />
              {ethics.officialLine.map((l, i) => (
                <p key={i} className="font-display text-lg font-medium tracking-tight text-teal-100">
                  “{l}”
                </p>
              ))}
              <p className="mt-2 text-xs text-stone-500">— {ethics.officialLineSource}</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-stone-800 bg-stone-900">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">The island rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ethics.rules.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-xs font-semibold text-teal-300">
                      {i + 1}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-stone-800 bg-stone-900">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">The fuller picture — access &amp; the Koh Tao Climbing Club</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={ethics.fullerPicture} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Itineraries */}
        <TabsContent value="itineraries" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {itineraries.map((it) => (
              <Card key={it.slug} className="rounded-xl border-stone-800 bg-stone-900">
                <CardHeader>
                  <CardTitle className="font-display text-lg tracking-tight">{it.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {it.days.map((d) => (
                    <div key={d.label}>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-teal-400">
                        {d.label}
                      </div>
                      <BulletList items={d.steps} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guidebooks */}
        <TabsContent value="guidebooks" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {guidebooks.map((g) => (
              <div key={g.title} className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{g.title}</span>
                  <Badge
                    variant="outline"
                    className={
                      g.current
                        ? 'shrink-0 border-teal-500/40 text-xs text-teal-300'
                        : 'shrink-0 border-stone-700 text-xs text-stone-500'
                    }
                  >
                    {g.current ? 'current' : 'outdated / context'}
                  </Badge>
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  {g.author} · {g.year}
                </div>
                <p className="mt-2 text-sm text-stone-400">{g.note}</p>
                {g.url && (
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-teal-400 hover:underline"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
