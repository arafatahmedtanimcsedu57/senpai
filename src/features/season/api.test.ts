import { http, HttpResponse } from 'msw'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeStore } from '../../store'
import { apiBaseUrl } from '../../lib/env'
import { server } from '../../mocks/server'
import { rawAnime } from '../../mocks/fixtures/anime'
import { jikanTiming, seasonApi } from './api'

const fall = { year: 2026, season: 'fall' } as const
const seasonUrl = `${apiBaseUrl}/seasons/:year/:season`

beforeAll(() => {
  jikanTiming.pageGapMs = 0
  jikanTiming.retryAfterMs = 0
})
afterAll(() => {
  jikanTiming.pageGapMs = 350
  jikanTiming.retryAfterMs = 1000
})

function fetchSeason() {
  return makeStore().dispatch(seasonApi.endpoints.getSeason.initiate(fall))
}

describe('getSeason', () => {
  it('merges every page, drops duplicates and sorts by popularity', async () => {
    const { data } = await fetchSeason()
    expect(data).toHaveLength(rawAnime.length)
    expect(new Set(data!.map((show) => show.id)).size).toBe(rawAnime.length)
    const members = data!.map((show) => show.members)
    expect(members).toEqual([...members].sort((a, b) => b - a))
    expect(data![0].title).toBe('Jujutsu Kaisen')
  })

  it('asks Jikan for TV shows, safe for work', async () => {
    let query: URLSearchParams | undefined
    server.use(
      http.get(seasonUrl, ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.json({
          data: [],
          pagination: { last_visible_page: 1, has_next_page: false },
        })
      }),
    )
    await fetchSeason()
    expect(query?.get('filter')).toBe('tv')
    expect(query?.get('sfw')).toBe('true')
  })

  it('returns an empty list for a season with no shows', async () => {
    server.use(
      http.get(seasonUrl, () =>
        HttpResponse.json({ data: [], pagination: { last_visible_page: 1, has_next_page: false } }),
      ),
    )
    const { data, isError } = await fetchSeason()
    expect(isError).toBe(false)
    expect(data).toEqual([])
  })

  it('fails when the response breaks the contract', async () => {
    server.use(http.get(seasonUrl, () => HttpResponse.json({ data: [{ title: 'No id' }] })))
    const { error } = await fetchSeason()
    expect(error).toMatchObject({ status: 'CUSTOM_ERROR' })
  })

  it('fails on a server error', async () => {
    server.use(http.get(seasonUrl, () => new HttpResponse(null, { status: 500 })))
    const { error } = await fetchSeason()
    expect(error).toMatchObject({ status: 500 })
  })

  it('retries once after a 429', async () => {
    let calls = 0
    server.use(
      http.get(seasonUrl, () => {
        calls++
        if (calls === 1) return new HttpResponse(null, { status: 429 })
        return HttpResponse.json({
          data: [rawAnime[0]],
          pagination: { last_visible_page: 1, has_next_page: false },
        })
      }),
    )
    const { data } = await fetchSeason()
    expect(calls).toBe(2)
    expect(data).toHaveLength(1)
  })
})

describe('getAnime', () => {
  it('returns one show', async () => {
    const { data } = await makeStore().dispatch(seasonApi.endpoints.getAnime.initiate(57334))
    expect(data).toMatchObject({ id: 57334, title: 'Dan Da Dan', studio: 'Science SARU' })
  })

  it('fails with 404 for an unknown id', async () => {
    const { error } = await makeStore().dispatch(seasonApi.endpoints.getAnime.initiate(1))
    expect(error).toMatchObject({ status: 404 })
  })

  it('fails when the response breaks the contract', async () => {
    server.use(
      http.get(`${apiBaseUrl}/anime/:id`, () => HttpResponse.json({ data: { mal_id: 1 } })),
    )
    const { error } = await makeStore().dispatch(seasonApi.endpoints.getAnime.initiate(2))
    expect(error).toBeDefined()
  })
})
