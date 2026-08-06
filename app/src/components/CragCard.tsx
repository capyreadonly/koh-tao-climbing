import { Link } from 'react-router'
import type { Crag } from '@/data/climbing'
import { isNdLicense } from '@/data/photos'
import { cragFeaturePhoto, imgSrc, styleLabel } from '@/lib/photo'
import GradeChart from '@/components/GradeChart'
import { Mountain, ShieldAlert, ShieldCheck } from 'lucide-react'

// The `verified` note says what the 2026-08-02 fact-check confirmed; notes that open
// with "Unverified" mean nothing could be corroborated.
const isFactChecked = (verified?: string) =>
  verified != null && !verified.toLowerCase().startsWith('unverified')

// Short fee tag for the photo corner (mirrors thetopo's yellow "Premium" tag):
// "100 THB entry, paid at …" → "100 THB".
const feeTag = (accessFee?: string) => accessFee?.match(/\d[\d,]*\s*THB/i)?.[0].toUpperCase()

// The crag card (Home "topos" grid + Crags page), restyled 2026-08 to
// thetopo.com's crag-card pattern: 10px radius, soft 18px shadow, hover scale,
// 2:1 photo with a yellow corner tag, then a compact body row — name + meta +
// per-style labels on the left, grade-distribution mini chart on the right.
// CC-ND photos are shown unmodified (object-contain on a stone-50 matte).
export default function CragCard({ crag: c }: { crag: Crag }) {
  const photo = cragFeaturePhoto(c.name)
  const checked = isFactChecked(c.verified)
  const fee = feeTag(c.accessFee)

  return (
    <Link to={`/crags/${c.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[10px] border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-card dark:shadow-card-dark transition duration-200 hover:scale-[1.02]">
        <div className={`relative aspect-[2/1] w-full ${photo && isNdLicense(photo) ? 'bg-stone-50 dark:bg-stone-900' : ''}`}>
          {photo ? (
            <img
              src={imgSrc(photo.file)}
              alt={photo.caption}
              loading="lazy"
              // absolute inset-0: an h-full img in normal flow can't resolve
              // against the aspect-ratio box (cyclic sizing) and would render
              // at its natural ratio, stretching the card.
              className={`absolute inset-0 h-full w-full ${isNdLicense(photo) ? 'object-contain' : 'object-cover'}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900/80">
              <Mountain className="h-10 w-10 text-stone-300 dark:text-stone-600" />
            </div>
          )}
          {fee && (
            <span className="absolute right-0 top-2.5 rounded-l-sm bg-topo px-1.5 py-0.5 text-[10px] font-medium text-stone-950">
              {fee}
            </span>
          )}
          {photo && (
            <span className="absolute bottom-2 right-2 rounded bg-white/85 dark:bg-stone-950/85 px-1.5 py-0.5 text-[10px] text-stone-600 dark:text-stone-300">
              {photo.credit ? `© ${photo.credit}` : 'Goodtime Adventures guidebook'}
            </span>
          )}
        </div>
        <div className="flex flex-1 items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-1.5 text-base font-semibold text-stone-900 dark:text-stone-100">
              <span className="truncate">{c.name}</span>
              <span title={c.verified} className="shrink-0">
                {checked ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                )}
              </span>
            </h3>
            <p className="mt-0.5 truncate text-sm text-stone-500 dark:text-stone-400">
              {c.area} · {c.grades}
            </p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {c.styles.map((s) => styleLabel[s] ?? s).join(' · ')}
            </p>
          </div>
          <GradeChart cragName={c.name} />
        </div>
      </article>
    </Link>
  )
}
