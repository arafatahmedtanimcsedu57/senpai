import { describe, expect, it } from 'vitest'
import { jikanAnimeSchema, jikanSeasonPageSchema, toShow } from './schema'
import { rawAnime } from '../../mocks/fixtures/anime'

const frieren = rawAnime[0]

describe('jikanAnimeSchema + toShow', () => {
  it('maps a full Jikan anime to a Show', () => {
    expect(toShow(jikanAnimeSchema.parse(frieren))).toEqual({
      id: frieren.mal_id,
      title: "Frieren: Beyond Journey's End",
      imageUrl: frieren.images.webp?.large_image_url,
      studio: 'Madhouse',
      airingDay: 'Fridays',
      episodes: 28,
      genres: ['Adventure', 'Drama', 'Fantasy'],
      synopsis: expect.stringContaining('elf mage'),
      url: frieren.url,
      members: 1_200_000,
      seasonId: { year: 2026, season: 'fall' },
    })
  })

  it('has no season when Jikan gives none or an unknown one', () => {
    expect(
      toShow(jikanAnimeSchema.parse({ ...frieren, season: null, year: null })).seasonId,
    ).toBeNull()
    expect(toShow(jikanAnimeSchema.parse({ ...frieren, season: 'autumn' })).seasonId).toBeNull()
  })

  it('falls back to the default title when there is no English title', () => {
    const show = toShow(jikanAnimeSchema.parse({ ...frieren, title_english: null }))
    expect(show.title).toBe(frieren.title)
  })

  it('keeps unknown values as null', () => {
    const show = toShow(
      jikanAnimeSchema.parse({
        ...frieren,
        episodes: null,
        synopsis: null,
        members: null,
        studios: [],
        broadcast: null,
        images: { jpg: { large_image_url: null } },
      }),
    )
    expect(show).toMatchObject({
      episodes: null,
      synopsis: null,
      studio: null,
      airingDay: null,
      imageUrl: null,
      members: 0,
    })
  })

  it('uses the jpg cover when there is no webp one', () => {
    const show = toShow(
      jikanAnimeSchema.parse({ ...frieren, images: { jpg: { large_image_url: 'a.jpg' } } }),
    )
    expect(show.imageUrl).toBe('a.jpg')
  })

  it('rejects an anime without an id', () => {
    const withoutId: Partial<typeof frieren> = { ...frieren }
    delete withoutId.mal_id
    expect(() => jikanAnimeSchema.parse(withoutId)).toThrow()
  })

  it('rejects a season page without pagination', () => {
    expect(() => jikanSeasonPageSchema.parse({ data: [frieren] })).toThrow()
  })
})
