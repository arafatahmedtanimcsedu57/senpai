// Shared anime types: the app's own shape, independent of Jikan's (see src/features/season).

export type SeasonName = 'winter' | 'spring' | 'summer' | 'fall'

export interface SeasonId {
  year: number
  season: SeasonName
}

export interface Show {
  id: number
  title: string
  imageUrl: string | null
  /** Wide 16:9 artwork (the trailer thumbnail), for the featured hero. */
  bannerUrl?: string | null
  studio: string | null
  /** e.g. "Fridays" — as Jikan words it. */
  airingDay: string | null
  /** null when not announced yet. */
  episodes: number | null
  genres: string[]
  synopsis: string | null
  url: string
  /** MyAnimeList members — the popularity used for ordering. */
  members: number
  /** The season it aired in, when Jikan says. */
  seasonId?: SeasonId | null
}

export type WatchStatus = 'watching' | 'plan-to-watch' | 'completed' | 'dropped'

/** A show on the user's watchlist, with the details needed to list it without refetching. */
export interface WatchlistEntry {
  id: number
  title: string
  imageUrl: string | null
  /** null for entries saved before v2 (see useWatchlistStore's migrate). */
  studio: string | null
  airingDay: string | null
  episodes: number | null
  status: WatchStatus
  /** Episodes watched. */
  progress: number
  /** ISO timestamp. */
  addedAt: string
  /** ISO timestamp of the last status or progress change. */
  updatedAt: string
}
