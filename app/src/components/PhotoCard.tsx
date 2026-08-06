import { isNdLicense, type PhotoEntry } from '@/data/photos'
import { imgSrc, GUIDE_PHOTO_CREDIT } from '@/lib/photo'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

// A gallery figure for one PhotoEntry. Community photos carry author/license/source
// attribution; guide photos are credited to the Goodtime Adventures guidebook PDF.
// CC-ND images must be shown unmodified — they get object-contain (no cropping).
export default function PhotoCard({
  photo,
  onClick,
  className,
  imgClassName,
}: {
  photo: PhotoEntry
  onClick?: () => void
  className?: string
  imgClassName?: string
}) {
  const nd = isNdLicense(photo)
  const community = photo.credit != null

  return (
    <figure
      className={cn(
        'overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-sm',
        onClick && 'cursor-zoom-in transition-colors hover:border-teal-400',
        className,
      )}
      onClick={onClick}
    >
      <div className={cn('aspect-[4/3] w-full', nd && 'bg-stone-50 dark:bg-stone-900')}>
        <img
          src={imgSrc(photo.file)}
          alt={photo.caption}
          loading="lazy"
          className={cn(
            'h-full w-full',
            nd ? 'object-contain' : 'object-cover',
            imgClassName,
          )}
        />
      </div>
      <figcaption className="space-y-1 p-3">
        <p className="line-clamp-2 text-xs text-stone-600 dark:text-stone-300">{photo.caption}</p>
        {community ? (
          <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-stone-500 dark:text-stone-400">
            <span>
              © {photo.credit} · {photo.license}
            </span>
            {photo.sourceUrl && (
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-teal-700 dark:text-teal-400 hover:underline"
              >
                source <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        ) : (
          <p className="text-[11px] text-stone-500 dark:text-stone-400">{GUIDE_PHOTO_CREDIT}</p>
        )}
      </figcaption>
    </figure>
  )
}
