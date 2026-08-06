import SectionHeader from '@/components/SectionHeader'
import { sources } from '@/data/climbing'
import { communityPhotos, isNdLicense } from '@/data/photos'
import { GUIDE_PDF_URL } from '@/lib/photo'
import { ExternalLink } from 'lucide-react'

// Plain-table header cell: uppercase micro-label (per design skill).
const thClass = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-500'

export default function Sources() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SectionHeader
        as="h1"
        kicker="Fact-check"
        title="Sources"
        lede="Everything in this database was compiled from the public references below (fact-checked 2026-08-02). Grades and access change — cross-check with the Rakkup guide, theCrag, or the Koh Tao Climbing Club before acting on anything here."
      />

      <div className="mt-8 overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className={thClass}>#</th>
              <th className={thClass}>Source</th>
              <th className={`hidden md:table-cell ${thClass}`}>Used for</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={s.url} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3 tabular-nums text-stone-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal-700 hover:underline"
                  >
                    {s.name} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
                <td className="hidden px-4 py-3 text-stone-600 md:table-cell">{s.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Archived documents */}
      <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-600">
        <h3 className="mb-1 font-display font-semibold tracking-tight text-stone-800">Archived documents</h3>
        <p className="max-w-prose">
          Source documents are archived in the{' '}
          <a
            href="https://github.com/capyreadonly/koh-tao-climbing/tree/main/archive/pdfs"
            target="_blank"
            rel="noreferrer"
            className="text-teal-700 hover:underline"
          >
            project repo
          </a>{' '}
          so this site keeps working if an original URL dies:{' '}
          <a
            href="https://github.com/capyreadonly/koh-tao-climbing/raw/main/archive/pdfs/KT-Climbing-guide-1.14.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-teal-700 hover:underline"
          >
            Goodtime free guidebook PDF (v1.14, 3.9 MB) <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>

      {/* Photo credits & licenses */}
      <SectionHeader
        className="mt-12 sm:mt-16"
        kicker="Attribution"
        title="Photo credits & licenses"
        lede="Every image on this site is a real photo, credited to its author — nothing generated, nothing stripped of its license."
      />
      <p className="mt-6 max-w-prose text-sm text-stone-600">
        Guide photos, topos and hand-drawn maps (paths <code className="text-teal-700">images/guide/*</code>)
        are extracted from the{' '}
        <a href={GUIDE_PDF_URL} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline">
          Goodtime Adventures free guidebook PDF
        </a>{' '}
        (incl. the Zen Gecko bouldering guide by James March) — reproduced for documentation; all
        rights remain with the authors. Community images (paths{' '}
        <code className="text-teal-700">images/community/*</code>) are © their authors and used
        under the licenses listed below — CC-ND images are shown unmodified.
      </p>

      <p className="mb-2 mt-6 text-xs text-stone-500 md:hidden">Swipe sideways to see the full table →</p>
      <div className="overflow-x-auto rounded-xl border border-stone-200 md:mt-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className={thClass}>File</th>
              <th className={`hidden lg:table-cell ${thClass}`}>Caption</th>
              <th className={thClass}>Author</th>
              <th className={thClass}>License</th>
              <th className={`hidden md:table-cell ${thClass}`}>Source</th>
            </tr>
          </thead>
          <tbody>
            {communityPhotos.map((p) => (
              <tr key={p.file} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-600">
                  {p.file.replace('images/community/', '')}
                </td>
                <td className="hidden max-w-xs px-4 py-3 text-xs text-stone-600 lg:table-cell">
                  <span className="line-clamp-2">{p.caption}</span>
                </td>
                <td className="px-4 py-3 text-stone-800">{p.credit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${
                      isNdLicense(p)
                        ? 'border-amber-300 bg-amber-50 text-amber-800'
                        : 'border-stone-300 text-stone-500'
                    }`}
                    title={isNdLicense(p) ? 'NoDerivatives — shown unmodified' : undefined}
                  >
                    {p.license}
                  </span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {p.sourceUrl && (
                    <a
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
                    >
                      source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-600">
        <h3 className="mb-1 font-display font-semibold tracking-tight text-stone-800">Obsidian mirror</h3>
        This site is generated to mirror the Obsidian vault in <code className="text-teal-700">/vault</code> —
        24 interlinked notes (crags, routes, people &amp; orgs, planning, resources) with YAML
        frontmatter, wikilinks, Dataview queries and note templates. Open the folder in Obsidian to
        use it as a graph database.
      </div>
    </div>
  )
}
