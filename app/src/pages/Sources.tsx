import { sources } from '@/data/climbing'
import { communityPhotos, isNdLicense } from '@/data/photos'
import { GUIDE_PDF_URL } from '@/lib/photo'
import { ExternalLink, Camera } from 'lucide-react'

export default function Sources() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Sources</h1>
      <p className="mt-2 max-w-2xl text-stone-400">
        Everything in this database was compiled from the public references below (fact-checked
        2026-08-02). Grades and access change — cross-check with the Rakkup guide, theCrag, or the
        Koh Tao Climbing Club before acting on anything here.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-stone-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Used for</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={s.url} className="border-b border-stone-800/60 last:border-0 hover:bg-stone-900/50">
                <td className="px-4 py-3 text-stone-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal-400 hover:underline"
                  >
                    {s.name} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </td>
                <td className="hidden px-4 py-3 text-stone-400 md:table-cell">{s.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Photo credits & licenses */}
      <h2 className="mb-4 mt-12 flex items-center gap-2 text-2xl font-semibold">
        <Camera className="h-5 w-5 text-teal-400" /> Photo credits &amp; licenses
      </h2>
      <p className="mb-6 max-w-3xl text-sm text-stone-400">
        Guide photos, topos and hand-drawn maps (paths <code className="text-teal-300">images/guide/*</code>)
        are extracted from the{' '}
        <a href={GUIDE_PDF_URL} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">
          Goodtime Adventures free guidebook PDF
        </a>{' '}
        (incl. the Zen Gecko bouldering guide by James March) — reproduced for documentation; all
        rights remain with the authors. Community images (paths{' '}
        <code className="text-teal-300">images/community/*</code>) are © their authors and used
        under the licenses listed below — CC-ND images are shown unmodified.
      </p>

      <p className="mb-2 text-xs text-stone-500 md:hidden">Swipe sideways to see the full table →</p>
      <div className="overflow-x-auto rounded-lg border border-stone-800">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900/80 text-left text-stone-400">
              <th className="px-4 py-3 font-medium">File</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Caption</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">License</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Source</th>
            </tr>
          </thead>
          <tbody>
            {communityPhotos.map((p) => (
              <tr key={p.file} className="border-b border-stone-800/60 last:border-0 hover:bg-stone-900/50">
                <td className="px-4 py-3 font-mono text-xs text-stone-400">
                  {p.file.replace('images/community/', '')}
                </td>
                <td className="hidden max-w-xs px-4 py-3 text-xs text-stone-400 lg:table-cell">
                  <span className="line-clamp-2">{p.caption}</span>
                </td>
                <td className="px-4 py-3 text-stone-200">{p.credit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${
                      isNdLicense(p)
                        ? 'border-amber-500/40 text-amber-300'
                        : 'border-stone-700 text-stone-400'
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
                      className="inline-flex items-center gap-1 text-xs text-teal-400 hover:underline"
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

      <div className="mt-8 rounded-lg border border-stone-800 bg-stone-900/40 p-5 text-sm text-stone-400">
        <h3 className="mb-1 font-semibold text-stone-200">Obsidian mirror</h3>
        This site is generated to mirror the Obsidian vault in <code className="text-teal-300">/vault</code> —
        24 interlinked notes (crags, routes, people &amp; orgs, planning, resources) with YAML
        frontmatter, wikilinks, Dataview queries and note templates. Open the folder in Obsidian to
        use it as a graph database.
      </div>
    </div>
  )
}
