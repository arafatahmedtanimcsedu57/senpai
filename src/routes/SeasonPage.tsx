import { useRef } from 'react'
import { useParams } from 'react-router'
import { useGetSeasonQuery } from '@/features/season/api'
import { SeasonHeader } from '@/features/season/components/SeasonHeader'
import { SeasonHero } from '@/features/season/components/SeasonHero'
import { SeasonMessage } from '@/features/season/components/SeasonMessage'
import { ShowCard } from '@/features/season/components/ShowCard'
import { ShowGrid } from '@/features/season/components/ShowGrid'
import { ShowGridSkeleton } from '@/features/season/components/ShowGridSkeleton'
import { isSameSeason, parseSeasonParams, seasonOf } from '@/lib/season'
import { cn } from '@/lib/utils'

// `/` shows the season airing now; `/season/:year/:season` any other. The route's loader has
// already turned a malformed season URL into "Page not found".
export function SeasonPage() {
  const params = useParams()
  const current = seasonOf(new Date())
  const season = parseSeasonParams(params) ?? current
  // currentData is undefined while a different season loads, so the old grid never shows
  // under the new heading.
  const { currentData: shows, isError, isFetching, refetch } = useGetSeasonQuery(season)
  const headingRef = useRef<HTMLHeadingElement>(null)

  function retry() {
    void refetch()
    // The Retry button is about to be replaced by the skeleton; keep keyboard focus on the page.
    headingRef.current?.focus()
  }

  let body
  if (shows) {
    body =
      shows.length === 0 ? (
        <SeasonMessage kind="empty" />
      ) : (
        <ShowGrid>
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </ShowGrid>
      )
  } else if (isError && !isFetching) {
    body = <SeasonMessage kind="error" onRetry={retry} />
  } else {
    body = <ShowGridSkeleton />
  }

  // The featured show: the most popular one (shows are sorted by popularity).
  const featured = shows?.[0]

  return (
    <main className="w-full">
      {featured && (
        <div className="px-4 pt-5 desktop:p-0">
          <SeasonHero show={featured} season={season} />
        </div>
      )}
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 pt-5 pb-10 desktop:gap-8 desktop:px-10',
          // With a hero the grid rises into its bottom edge; without one, clear the header that
          // sits over the top of this page on desktop.
          featured ? 'desktop:-mt-24 desktop:pt-0' : 'desktop:pt-28',
        )}
      >
        <SeasonHeader
          season={season}
          isCurrent={isSameSeason(season, current)}
          count={shows?.length}
          headingRef={headingRef}
        />
        {body}
      </div>
    </main>
  )
}
