import { useRef } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { CoverImage } from '@/components/CoverImage'
import { useGetAnimeQuery } from '@/features/season/api'
import { AddToWatchlistButton } from '@/features/season/components/AddToWatchlistButton'
import { GenreChips } from '@/features/season/components/GenreChips'
import { ShowDetailMessage } from '@/features/season/components/ShowDetailMessage'
import { ShowDetailSkeleton } from '@/features/season/components/ShowDetailSkeleton'
import { ShowFacts } from '@/features/season/components/ShowFacts'
import { seasonLabel, seasonPath } from '@/lib/season'

// `/anime/:id`. The route's loader has already turned a non-numeric id into "Page not found";
// an id Jikan doesn't know is a 404 from the API, shown here in-page.
export function ShowDetailPage() {
  const id = Number(useParams().id)
  // currentData is undefined while a different show loads, so the old one never flashes.
  const { currentData: show, error, isError, isFetching, refetch } = useGetAnimeQuery(id)
  const mainRef = useRef<HTMLElement>(null)

  function retry() {
    void refetch()
    // Retry is about to be replaced by the skeleton; keep keyboard focus on the page.
    mainRef.current?.focus()
  }

  let body
  if (show) {
    const meta = [show.studio, show.airingDay].filter(Boolean).join(' · ')
    body = (
      <div className="flex flex-col gap-5 desktop:flex-row desktop:items-start desktop:gap-12">
        <div className="flex items-end gap-4 desktop:block">
          <CoverImage
            src={show.imageUrl}
            title={show.title}
            className="w-[120px] shrink-0 desktop:w-[300px] desktop:rounded-lg"
          />
          {meta && (
            <span className="text-[0.8125rem] text-muted-foreground desktop:hidden">{meta}</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h1 className="font-heading text-2xl leading-[1.875rem] font-semibold desktop:text-[1.75rem] desktop:leading-[2.125rem]">
            {show.title}
          </h1>
          <GenreChips genres={show.genres} />
          <ShowFacts show={show} />
          {show.synopsis && (
            <p className="max-w-[620px] text-[0.9375rem] leading-[1.375rem]">{show.synopsis}</p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <AddToWatchlistButton show={show} look="detail" />
            <a
              href={show.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on MyAnimeList (opens in a new tab)"
              className="inline-flex h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              View on MyAnimeList
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    )
  } else if (isError && !isFetching) {
    const notFound = error && 'status' in error && error.status === 404
    body = <ShowDetailMessage kind={notFound ? 'not-found' : 'error'} onRetry={retry} />
  } else {
    body = <ShowDetailSkeleton />
  }

  const back = show?.seasonId
  return (
    <main
      ref={mainRef}
      tabIndex={-1}
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 pt-5 pb-10 outline-none desktop:gap-8 desktop:px-10 desktop:pt-10"
    >
      <Link
        to={back ? seasonPath(back) : '/'}
        className="inline-flex h-11 items-center gap-2 self-start text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-[18px]" />
        {back ? seasonLabel(back) : 'This season'}
      </Link>
      {body}
    </main>
  )
}
