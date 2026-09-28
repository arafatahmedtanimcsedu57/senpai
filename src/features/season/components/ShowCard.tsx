import { Link } from 'react-router'
import { CoverImage } from '@/components/CoverImage'
import type { Show } from '@/types/anime'
import { AddToWatchlistButton } from './AddToWatchlistButton'

export interface ShowCardProps {
  show: Show
}

/** "MADHOUSE · Fridays · 28 eps"; unknown parts are left out, an unknown count is "? eps". */
function metaLine({ studio, airingDay, episodes }: Show) {
  return [studio, airingDay, `${episodes ?? '?'} eps`].filter(Boolean).join(' · ')
}

export function ShowCard({ show }: ShowCardProps) {
  return (
    <article className="flex flex-col gap-2.5">
      {/* Cover + title + meta open the detail page; the button stays outside the link. */}
      <Link
        to={`/anime/${show.id}`}
        aria-labelledby={`show-${show.id}-title`}
        className="group flex flex-col gap-2.5 rounded-sm"
      >
        <CoverImage src={show.imageUrl} title={show.title} />
        <div className="flex flex-col gap-1">
          <h2
            id={`show-${show.id}-title`}
            className="group-hover:underline line-clamp-2 min-h-[2lh] text-[0.9375rem] leading-[1.3125rem] font-semibold desktop:text-base"
          >
            {show.title}
          </h2>
          <span className="text-[0.8125rem] leading-[1.125rem] text-muted-foreground">
            {metaLine(show)}
          </span>
        </div>
      </Link>
      <AddToWatchlistButton show={show} className="w-full" />
    </article>
  )
}
