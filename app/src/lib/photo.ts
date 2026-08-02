// Shared helpers for rendering photos from the data layer.
// Image files live under app/public — every src must go through imgSrc() so the
// './' base (GitHub Pages) keeps working.

export const imgSrc = (file: string) => `${import.meta.env.BASE_URL}${file}`

// Credit line required on all guide-guidebook imagery (topos, diagrams, photos).
export const GUIDE_PHOTO_CREDIT = 'from the Goodtime Adventures free guidebook PDF'

export const GUIDE_PDF_URL =
  'http://www.railay.com/railay/climbing/KT-Climbing-guide-1.14-sm.compressed.pdf'

// Human labels for the route-database source keys.
export const sourceLabel: Record<string, string> = {
  mountainproject: 'Mountain Project',
  '27crags': '27crags',
  'legacy-static': 'legacy draft',
  vault: 'vault note',
  guidebook: 'guidebook',
}

export const gradeSystemLabel: Record<string, string> = {
  french: 'FR',
  yds: 'YDS',
  font: 'FB',
  v: 'V',
}
