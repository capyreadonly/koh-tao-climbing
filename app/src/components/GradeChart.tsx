import { routesForCrag } from '@/data/routes'

// Mini grade-distribution bar chart, thetopo.com crag-card pattern (see
// work/thetopo-tokens.md): six ascending difficulty bands as rounded vertical
// bars, green → purple, light-gray stub for empty bands. Heights normalize to
// the crag's biggest band. Colors are theme-independent (same on both, like
// the yellow markers).

// Band palette, easiest → hardest.
const BAND_COLORS = ['#58b368', '#9bbf30', '#f3dc10', '#f08c1e', '#e0453a', '#8e44ad']
const EMPTY_COLOR = '#e5e5e5'

// Map any grade string in the database to a band index 0-5, or -1 when the
// grade can't be parsed (ignored in the chart).
function gradeBand(grade: string, system: string): number {
  const g = grade.trim().toLowerCase()
  if (system === 'french') {
    const m = g.match(/^(\d)\s*([abc])?/)
    if (!m) return -1
    const num = Number(m[1])
    const letter = m[2] ?? 'a'
    if (num <= 4 || (num === 5 && letter === 'a')) return 0
    if (num === 5 || (num === 6 && letter === 'a')) return 1
    if (num === 6) return 2
    if (num === 7 && (letter === 'a' || letter === 'b')) return 3
    if (num === 7 || (num === 8 && letter === 'a')) return 4
    return 5
  }
  if (system === 'yds') {
    const m = g.match(/^5\.(\d+)/)
    if (!m) return -1
    const num = Number(m[1])
    if (num <= 7) return 0
    if (num <= 9) return 1
    if (num === 10) return 2
    if (num === 11) return 3
    if (num === 12) return 4
    return 5
  }
  if (system === 'font') {
    const m = g.match(/^(\d)\s*([abc])?/)
    if (!m) return -1
    const num = Number(m[1])
    const letter = m[2] ?? 'a'
    if (num <= 4) return 0
    if (num === 5) return 1
    if (num === 6) return letter === 'a' ? 1 : 2
    if (num === 7 && (letter === 'a' || letter === 'b')) return 3
    if (num === 7 || (num === 8 && letter === 'a')) return 4
    return 5
  }
  if (system === 'v') {
    const m = g.match(/^v(?:b|(\d+))/)
    if (!m) return -1
    if (m[1] == null) return 0 // VB
    const num = Number(m[1])
    if (num <= 1) return 0
    if (num <= 2) return 1
    if (num <= 4) return 2
    if (num <= 6) return 3
    if (num <= 9) return 4
    return 5
  }
  // zen-gecko boulder letters: VE~3/4, E~5a-5c, M~6a, MH~6b-6c, H~6c-7a, VH~7b+
  if (system === 'zen-gecko') {
    if (g.startsWith('vh')) return 5
    if (g.startsWith('mh')) return 3
    if (g.startsWith('ve')) return 0
    if (g.startsWith('e')) return 1
    if (g.startsWith('m')) return 2
    if (g.startsWith('h')) return 4
    return -1
  }
  return -1
}

export default function GradeChart({ cragName }: { cragName: string }) {
  const bands = [0, 0, 0, 0, 0, 0]
  let total = 0
  for (const r of routesForCrag(cragName)) {
    const b = gradeBand(r.grade, r.gradeSystem)
    if (b >= 0) {
      bands[b]++
      total++
    }
  }
  if (total === 0) return null
  const max = Math.max(...bands)

  return (
    <div
      className="flex h-7 w-16 shrink-0 items-end justify-end gap-[3px]"
      title={`Grade distribution across ${total} graded routes/problems`}
      aria-label={`Grade distribution across ${total} graded routes and problems`}
      role="img"
    >
      {bands.map((count, i) => (
        <span
          key={i}
          className="w-[8px] rounded-t-[2px]"
          style={{
            background: count > 0 ? BAND_COLORS[i] : EMPTY_COLOR,
            // Empty bands render as a stub slot (thetopo pattern); filled bands
            // scale linearly with a small floor so singles stay visible.
            height: count > 0 ? `${Math.max(30, (count / max) * 100)}%` : '35%',
          }}
        />
      ))}
    </div>
  )
}
