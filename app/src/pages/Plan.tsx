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

function BulletList({ items, tone = 'bg-teal-600' }: { items: string[]; tone?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-stone-700">
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
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-stone-200 bg-stone-100 p-1">
          <TabsTrigger value="season" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <CalendarDays className="h-4 w-4" /> When to go
          </TabsTrigger>
          <TabsTrigger value="logistics" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <Plane className="h-4 w-4" /> Getting there
          </TabsTrigger>
          <TabsTrigger value="gear" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <Backpack className="h-4 w-4" /> Gear &amp; safety
          </TabsTrigger>
          <TabsTrigger value="ethics" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <HeartHandshake className="h-4 w-4" /> Ethics &amp; access
          </TabsTrigger>
          <TabsTrigger value="itineraries" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <Map className="h-4 w-4" /> Itineraries
          </TabsTrigger>
          <TabsTrigger value="guidebooks" className="min-h-10 gap-1.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" /> Guidebooks
          </TabsTrigger>
        </TabsList>

        {/* When to go */}
        <TabsContent value="season" className="mt-6 space-y-6">
          <p className="max-w-prose text-sm text-stone-600">{seasons.climate}</p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className={thClass}>Period</th>
                  <th className={thClass}>Conditions</th>
                  <th className={`hidden md:table-cell ${thClass}`}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {seasons.table.map((s) => (
                  <tr key={s.period} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-700">{s.period}</td>
                    <td className="px-4 py-3 text-stone-800">{s.conditions}</td>
                    <td className="hidden px-4 py-3 text-stone-600 md:table-cell">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
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
          <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">To the island</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={gettingThere.toIsland} />
            </CardContent>
          </Card>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100">
                  <th className={thClass}>Ferry route</th>
                  <th className={`hidden lg:table-cell ${thClass}`}>Operators</th>
                  <th className={thClass}>Duration</th>
                  <th className={`hidden md:table-cell ${thClass}`}>Fare</th>
                  <th className={`hidden xl:table-cell ${thClass}`}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {gettingThere.ferries.map((f) => (
                  <tr key={f.route} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{f.route}</td>
                    <td className="hidden px-4 py-3 text-stone-600 lg:table-cell">{f.operators}</td>
                    <td className="px-4 py-3 text-stone-700">{f.duration}</td>
                    <td className="hidden px-4 py-3 text-stone-700 md:table-cell">{f.fare ?? '—'}</td>
                    <td className="hidden px-4 py-3 text-stone-600 xl:table-cell">{f.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {gettingThere.conflicts.map((c, i) => (
            <Alert key={i} className="rounded-xl border-amber-300 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Sources disagree</AlertTitle>
              <AlertDescription className="text-amber-800/90">{c}</AlertDescription>
            </Alert>
          ))}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">On the island</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gettingThere.onIsland} />
              </CardContent>
            </Card>
            <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
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
          <Alert className="rounded-xl border-rose-300 bg-rose-50 text-rose-900">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <AlertTitle className="text-rose-800">Bolts &amp; the Thaitanium warning</AlertTitle>
            <AlertDescription className="text-rose-800/90">{gearAndSafety.bolts}</AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">The rock demands</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gearAndSafety.rockDemands} />
              </CardContent>
            </Card>
            <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-display tracking-tight">Kit list</CardTitle>
              </CardHeader>
              <CardContent>
                <BulletList items={gearAndSafety.kitList} />
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">Hazards</CardTitle>
            </CardHeader>
            <CardContent>
              <BulletList items={gearAndSafety.hazards} tone="bg-rose-500" />
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold tracking-tight">Gear, gyms &amp; rentals on the island</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {gearAndSafety.shops.map((s) => {
                const unverified = s.verified?.toLowerCase().startsWith('unverified')
                return (
                  <div key={s.name} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{s.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          unverified
                            ? 'border-amber-300 bg-amber-50 text-xs text-amber-800'
                            : 'border-teal-200 bg-teal-50 text-xs text-teal-700'
                        }
                      >
                        {unverified ? 'unverified' : 'verified'}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-stone-500">{s.location}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.services.map((v) => (
                        <span key={v} className="rounded-full border border-stone-300 px-2 py-0.5 text-xs text-stone-600">
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
          <Card className="rounded-xl border-teal-200 bg-teal-50">
            <CardContent className="pt-6">
              <Quote className="mb-3 h-5 w-5 text-teal-600" />
              {ethics.officialLine.map((l, i) => (
                <p key={i} className="font-display text-lg font-medium tracking-tight text-teal-900">
                  “{l}”
                </p>
              ))}
              <p className="mt-2 text-xs text-stone-500">— {ethics.officialLineSource}</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-display tracking-tight">The island rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ethics.rules.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm text-stone-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                      {i + 1}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-stone-200 bg-white shadow-sm">
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
              <Card key={it.slug} className="rounded-xl border-stone-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-lg tracking-tight">{it.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {it.days.map((d) => (
                    <div key={d.label}>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
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
              <div key={g.title} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{g.title}</span>
                  <Badge
                    variant="outline"
                    className={
                      g.current
                        ? 'shrink-0 border-teal-200 bg-teal-50 text-xs text-teal-700'
                        : 'shrink-0 border-stone-300 text-xs text-stone-500'
                    }
                  >
                    {g.current ? 'current' : 'outdated / context'}
                  </Badge>
                </div>
                <div className="mt-0.5 text-xs text-stone-500">
                  {g.author} · {g.year}
                </div>
                <p className="mt-2 text-sm text-stone-600">{g.note}</p>
                {g.url && (
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
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
