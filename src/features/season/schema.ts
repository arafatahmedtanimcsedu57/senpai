import { z } from 'zod'
import { isSeasonName } from '../../lib/season'
import type { Show } from '../../types/anime'

// Only the Jikan v4 fields the app uses (architecture.md → API contract). Unknown fields
// pass through untouched; a missing or wrongly typed one fails the request.
const named = z.object({ name: z.string() })
const image = z.object({ large_image_url: z.string().nullish(), image_url: z.string().nullish() })

export const jikanAnimeSchema = z.object({
  mal_id: z.number().int().positive(),
  url: z.string(),
  title: z.string(),
  title_english: z.string().nullish(),
  images: z.object({ jpg: image.optional(), webp: image.optional() }),
  episodes: z.number().int().nullish(),
  synopsis: z.string().nullish(),
  members: z.number().int().nullish(),
  studios: z.array(named).default([]),
  genres: z.array(named).default([]),
  broadcast: z.object({ day: z.string().nullish() }).nullish(),
  // The season it first aired in, e.g. "fall" / 2026; missing for older or unscheduled shows.
  season: z.string().nullish(),
  year: z.number().int().nullish(),
})
export type JikanAnime = z.input<typeof jikanAnimeSchema>

export const jikanSeasonPageSchema = z.object({
  data: z.array(jikanAnimeSchema),
  pagination: z.object({ last_visible_page: z.number().int(), has_next_page: z.boolean() }),
})

export const jikanAnimeResponseSchema = z.object({ data: jikanAnimeSchema })

export function toShow(raw: z.output<typeof jikanAnimeSchema>): Show {
  const { webp, jpg } = raw.images
  return {
    id: raw.mal_id,
    title: raw.title_english || raw.title,
    imageUrl: webp?.large_image_url ?? jpg?.large_image_url ?? null,
    studio: raw.studios[0]?.name ?? null,
    airingDay: raw.broadcast?.day ?? null,
    episodes: raw.episodes ?? null,
    genres: raw.genres.map((genre) => genre.name),
    synopsis: raw.synopsis ?? null,
    url: raw.url,
    members: raw.members ?? 0,
    seasonId:
      raw.season && isSeasonName(raw.season) && raw.year
        ? { year: raw.year, season: raw.season }
        : null,
  }
}
