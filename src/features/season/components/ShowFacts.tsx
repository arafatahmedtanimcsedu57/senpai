import { seasonLabel } from '@/lib/season'
import type { Show } from '@/types/anime'

export interface ShowFactsProps {
  show: Show
}

/** Episodes / Airs / Studio / Season; unknown facts are left out ("?" for an unknown episode count). */
export function ShowFacts({ show }: ShowFactsProps) {
  const facts: [string, string | null][] = [
    ['Episodes', String(show.episodes ?? '?')],
    ['Airs', show.airingDay],
    ['Studio', show.studio],
    ['Season', show.seasonId ? seasonLabel(show.seasonId) : null],
  ]
  return (
    <dl className="grid grid-cols-2 gap-4 desktop:grid-cols-4">
      {facts
        .filter((fact): fact is [string, string] => fact[1] !== null)
        .map(([term, value]) => (
          <div key={term} className="flex flex-col gap-0.5">
            <dt className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              {term}
            </dt>
            <dd className="text-[0.9375rem] font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
    </dl>
  )
}
