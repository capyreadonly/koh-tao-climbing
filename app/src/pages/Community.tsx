import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/SectionHeader'
import EmptyState from '@/components/EmptyState'
import { reports, type CommunityReport } from '@/data/reports'
import { communityPhotos, type PhotoEntry } from '@/data/photos'
import { imgSrc } from '@/lib/photo'
import { ExternalLink, Play } from 'lucide-react'

const photoByFile = new Map<string, PhotoEntry>(communityPhotos.map((p) => [p.file, p]))

// 'video' / 'video channel' reports are YouTube links (no thumbnails by design);
// forum threads and crowd-sourced pages group under Discussions; the rest are articles.
type ReportGroup = 'articles' | 'videos' | 'discussions'

const isVideoReport = (r: CommunityReport) => r.type === 'video' || r.type === 'video channel'

const groupOf = (r: CommunityReport): ReportGroup => {
  if (isVideoReport(r)) return 'videos'
  const t = r.type.toLowerCase()
  if (t.includes('forum') || t.includes('thread') || t.includes('crowd-sourced') || t.includes('logbook'))
    return 'discussions'
  return 'articles'
}

const GROUP_FILTERS: { key: ReportGroup | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'articles', label: 'Articles' },
  { key: 'videos', label: 'Videos' },
  { key: 'discussions', label: 'Discussions' },
]

export default function Community() {
  const [group, setGroup] = useState<ReportGroup | 'all'>('all')
  const filtered = group === 'all' ? reports : reports.filter((r) => groupOf(r) === group)
  const countFor = (key: ReportGroup | 'all') =>
    key === 'all' ? reports.length : reports.filter((r) => groupOf(r) === key).length

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="Community"
        title="Community reports"
        lede="Trip reports, articles, videos and forum threads from climbers who have been to Koh Tao — first-hand experiences, dated prices and historical colour that no database captures. Summaries are ours; every card links out to the original. Photos remain © their authors and are shown with attribution."
      />

      <div className="mt-8 flex flex-wrap gap-1.5">
        {GROUP_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setGroup(f.key)}
            className={`inline-flex min-h-10 items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
              group === f.key
                ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {f.label} ({countFor(f.key)})
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {filtered.map((r) => {
          const video = isVideoReport(r)
          return (
            <Card
              key={r.url + r.title}
              className="flex flex-col rounded-xl border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm transition hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="font-display text-lg leading-snug tracking-tight">
                    {r.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-xs ${
                      video ? 'border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400'
                    }`}
                  >
                    {video && <Play className="mr-1 h-3 w-3" />}
                    {r.type}
                  </Badge>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {r.author} · {r.date}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">{r.summary}</p>
                {r.photos && r.photos.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {r.photos.map((file) => {
                      const p = photoByFile.get(file)
                      return (
                        <figure key={file} className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
                          <img
                            src={imgSrc(file)}
                            alt={p?.caption ?? r.title}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover"
                          />
                          {p && (
                            <figcaption className="p-2 text-[11px] text-stone-500 dark:text-stone-400">
                              © {p.credit} · {p.license}
                            </figcaption>
                          )}
                        </figure>
                      )
                    })}
                  </div>
                )}
                <div className="mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {video ? (
                        <>
                          Watch the video <Play className="ml-1 h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Read the original <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </>
                      )}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState className="mt-8" title="No reports in this group yet">
          Try another filter — or send us yours.
        </EmptyState>
      )}

      <p className="mt-8 text-sm text-stone-500 dark:text-stone-400">
        Climbed Koh Tao yourself? Share conditions with the{' '}
        <a
          href="https://www.facebook.com/Climbingkohtao/"
          target="_blank"
          rel="noreferrer"
          className="text-teal-700 dark:text-teal-400 hover:underline"
        >
          Koh Tao Climbing Club
        </a>{' '}
        or log ascents on{' '}
        <a
          href="https://www.thecrag.com/en/climbing/thailand/koh-tao"
          target="_blank"
          rel="noreferrer"
          className="text-teal-700 dark:text-teal-400 hover:underline"
        >
          theCrag
        </a>
        . Full image attribution lives on the <Link to="/sources" className="text-teal-700 dark:text-teal-400 hover:underline">Sources</Link> page.
      </p>
    </div>
  )
}
