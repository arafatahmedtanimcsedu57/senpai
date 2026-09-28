import type { Ref } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { nextSeason, prevSeason, seasonLabel, seasonPath } from '@/lib/season'
import type { SeasonId } from '@/types/anime'

export interface SeasonHeaderProps {
  season: SeasonId
  /** True when `season` is the one airing now. */
  isCurrent: boolean
  /** Number of shows; leave out while loading or on error. */
  count?: number
  /** Lets the page move focus to the heading, e.g. after Retry replaces the focused button. */
  headingRef?: Ref<HTMLHeadingElement>
}

export function SeasonHeader({ season, isCurrent, count, headingRef }: SeasonHeaderProps) {
  const prev = prevSeason(season)
  const next = nextSeason(season)
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-[0.06em] text-muted-foreground">
          {isCurrent ? 'THIS SEASON' : 'SEASON'}
        </span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-heading outline-none text-[2rem] leading-9 font-bold tracking-[-0.02em] desktop:text-[2.5rem] desktop:leading-11"
        >
          {seasonLabel(season)}
        </h1>
        {count !== undefined && (
          <span className="text-[0.8125rem] leading-[1.125rem] text-muted-foreground">
            {count === 1 ? '1 show' : `${count} shows`}
          </span>
        )}
      </div>
      <nav aria-label="Seasons" className="flex gap-2">
        <Button asChild variant="outline" size="icon">
          <Link to={seasonPath(prev)} aria-label={`Previous season: ${seasonLabel(prev)}`}>
            <ChevronLeft aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link to={seasonPath(next)} aria-label={`Next season: ${seasonLabel(next)}`}>
            <ChevronRight aria-hidden="true" />
          </Link>
        </Button>
      </nav>
    </div>
  )
}
