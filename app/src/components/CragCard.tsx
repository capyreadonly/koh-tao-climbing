import { Link } from 'react-router'
import type { Crag } from '@/data/climbing'
import { isNdLicense } from '@/data/photos'
import { cragFeaturePhoto, imgSrc } from '@/lib/photo'
import { styleBadge } from '@/lib/badges'
import { ArrowRight, MapPin, Mountain, ShieldAlert, ShieldCheck } from 'lucide-react'

// The `verified` note says what the 2026-08-02 fact-check confirmed; notes that open
// with "Unverified" mean nothing could be corroborated.
const isFactChecked = (verified?: string) =>
  verified != null && !verified.toLowerCase().startsWith('unverified')

// The one big editorial crag card (Home featured grid + Crags page): a wide real
// photograph, name + grade range, one-line summary, style chips, "Read more →".
// CC-ND photos are shown unmodified (object-contain on a stone-50 matte).
export default function CragCard({ crag: c }: { crag: Crag }) {
  const photo = cragFeaturePhoto(c.name)
  const checked = isFactChecked(c.verified)

  return (
    <Link to={`/crags/${c.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className={`relative aspect-[16/10] w-full ${photo && isNdLicense(photo) ? 'bg-stone-50' : ''}`}>
          {photo ? (
            <img
              src={imgSrc(photo.file)}
              alt={photo.caption}
              loading="lazy"
              className={`h-full w-full ${isNdLicense(photo) ? 'object-contain' : 'object-cover'}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-100">
              <Mountain className="h-10 w-10 text-stone-300" />
            </div>
          )}
          {photo && (
            <span className="absolute bottom-2 right-2 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-stone-600">
              {photo.credit ? `© ${photo.credit}` : 'Goodtime Adventures guidebook'}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900">
              {c.name}
            </h3>
            <span className="shrink-0 text-xs tabular-nums text-stone-500">{c.grades}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
            <MapPin className="h-3 w-3" /> {c.area}
            {c.highlight && <span className="ml-1 text-emerald-700">· {c.highlight}</span>}
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-stone-600">{c.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {c.styles.map((s) => (
              <span key={s} className={`rounded-full border px-2 py-0.5 text-xs ${styleBadge[s]}`}>
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3 text-xs">
            <span
              title={c.verified}
              className={`inline-flex items-center gap-1 ${checked ? 'text-teal-700' : 'text-amber-700'}`}
            >
              {checked ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Fact-checked
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" /> Unverified
                </>
              )}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-teal-700 transition-colors group-hover:text-teal-600">
              Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
