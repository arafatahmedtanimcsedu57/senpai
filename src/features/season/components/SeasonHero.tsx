import { useState } from 'react'
import { Info } from 'lucide-react'
import { Link } from 'react-router'
import { seasonLabel } from '@/lib/season'
import type { SeasonId, Show } from '@/types/anime'
import { showMeta } from '../showMeta'
import { AddToWatchlistButton } from './AddToWatchlistButton'

export interface SeasonHeroProps {
  show: Show
  season: SeasonId
}

/**
 * The featured show at the top of a season: a rounded portrait panel on phones (poster art), a
 * full-bleed band from the desktop breakpoint (wide trailer art, else the poster) that the app
 * header sits on top of.
 */
export function SeasonHero({ show, season }: SeasonHeroProps) {
  const label = seasonLabel(season).toUpperCase()
  // Art that fails to load is dropped: the wide art falls back to the poster, the poster to the
  // tinted panel with the title's first letter.
  const [failed, setFailed] = useState<string[]>([])
  const usable = (src: string | null | undefined) => (src && !failed.includes(src) ? src : null)
  const banner = usable(show.bannerUrl)
  const art = usable(show.imageUrl) ?? banner

  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-[440px] overflow-hidden rounded-md bg-night ring-1 ring-foreground/12 desktop:h-[620px] desktop:rounded-none desktop:ring-0"
    >
      {/* Art (decorative: the title is right there). */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-start justify-center pt-9 font-heading text-[13.75rem] leading-[0.8] font-extrabold text-foreground/14 desktop:items-center desktop:justify-end desktop:pt-0 desktop:pr-24 desktop:text-[26.25rem]"
      >
        {show.title.match(/[\p{L}\p{N}]/u)?.[0]}
      </span>
      {art && (
        // One download per width: the wide art from the desktop breakpoint, the poster below.
        <picture>
          {banner && <source media="(min-width: 80rem)" srcSet={banner} />}
          <img
            src={art}
            alt=""
            fetchPriority="high"
            onError={(event) => {
              const src = event.currentTarget.currentSrc || art
              setFailed((list) => [...list, src])
            }}
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_oklab,var(--background)_96%,transparent)_0%,color-mix(in_oklab,var(--background)_75%,transparent)_38%,transparent_68%)] desktop:bg-[linear-gradient(0deg,var(--background)_0%,transparent_38%),linear-gradient(90deg,color-mix(in_oklab,var(--background)_95%,transparent)_0%,color-mix(in_oklab,var(--background)_85%,transparent)_45%,transparent_75%)]"
      />

      {/* Content lines up with the page grid (1280 max, 40px gutter) at any width. */}
      <div className="absolute inset-x-0 bottom-0 z-[1] desktop:bottom-35">
        <div className="mx-auto flex flex-col items-center gap-2.5 px-4 pb-4 text-center desktop:max-w-[1280px] desktop:items-start desktop:gap-4.5 desktop:px-10 desktop:pb-0 desktop:text-left desktop:[&>*]:max-w-[580px]">
          <p className="flex items-center gap-2.5">
            <span className="flex h-5.5 items-center rounded-sm bg-primary px-2 text-[0.625rem] font-bold tracking-[0.08em] text-primary-foreground desktop:h-6 desktop:text-[0.6875rem]">
              FEATURED<span className="desktop:hidden">&nbsp;·&nbsp;{label}</span>
            </span>
            <span className="hidden text-[0.8125rem] font-semibold tracking-[0.06em] desktop:inline">
              {label}
            </span>
          </p>
          <h2
            id="hero-title"
            className="font-heading text-2xl leading-7 font-extrabold tracking-[-0.02em] text-balance desktop:text-[3.5rem] desktop:leading-[3.625rem] desktop:tracking-[-0.03em]"
          >
            {show.title}
          </h2>
          <p className="text-[0.8125rem] leading-[1.125rem] font-semibold text-foreground/85 desktop:text-[0.9375rem] desktop:leading-5 desktop:text-foreground">
            {showMeta(show)}
          </p>
          {show.synopsis && (
            <p className="hidden text-[1.0625rem] leading-[1.625rem] text-foreground/85 desktop:line-clamp-2">
              {show.synopsis}
            </p>
          )}
          <div className="flex w-full gap-2 pt-1 desktop:w-auto desktop:gap-3 desktop:pt-1.5">
            <AddToWatchlistButton show={show} look="hero" />
            <Link
              to={`/anime/${show.id}`}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-muted-foreground/28 px-3 text-[0.9375rem] font-semibold text-foreground hover:bg-muted-foreground/40 desktop:h-13 desktop:flex-none desktop:px-6.5 desktop:text-[1.0625rem]"
            >
              <Info aria-hidden="true" className="size-5 desktop:size-[22px]" />
              More info
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
