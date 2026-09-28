import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { api } from '../../services/api'
import type { SeasonId, Show } from '../../types/anime'
import { jikanAnimeResponseSchema, jikanSeasonPageSchema, toShow } from './schema'

// Jikan allows 3 requests/s (architecture.md → API contract): space out page requests and
// retry once on 429. Mutable so tests can set them to 0.
export const jikanTiming = { pageGapMs: 350, retryAfterMs: 1000 }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function contractError(error: unknown): FetchBaseQueryError {
  return { status: 'CUSTOM_ERROR', error: `Jikan response broke the contract: ${String(error)}` }
}

/** One request; waits and retries once when Jikan answers 429 (rate limited). */
type JikanResult = { data?: unknown; error?: FetchBaseQueryError }
type JikanFetch = (args: string | FetchArgs) => JikanResult | PromiseLike<JikanResult>

async function fetchWithRetry(baseQuery: JikanFetch, args: string | FetchArgs) {
  const result = await baseQuery(args)
  if (result.error?.status !== 429) return result
  await sleep(jikanTiming.retryAfterMs)
  return baseQuery(args)
}

export const seasonApi = api.enhanceEndpoints({ addTagTypes: ['Show'] }).injectEndpoints({
  endpoints: (build) => ({
    /** Every TV show of the season, each once, most popular first. */
    getSeason: build.query<Show[], SeasonId>({
      async queryFn({ year, season }, _api, _extra, baseQuery) {
        const shows = new Map<number, Show>()
        for (let page = 1, lastPage = 1; page <= lastPage; page++) {
          if (page > 1) await sleep(jikanTiming.pageGapMs)
          const args = {
            url: `seasons/${year}/${season}`,
            params: { filter: 'tv', sfw: true, page },
          }
          const result = await fetchWithRetry(baseQuery, args)
          if (result.error) return { error: result.error }
          const parsed = jikanSeasonPageSchema.safeParse(result.data)
          if (!parsed.success) return { error: contractError(parsed.error) }
          for (const raw of parsed.data.data) shows.set(raw.mal_id, toShow(raw))
          lastPage = parsed.data.pagination.last_visible_page
        }
        return { data: [...shows.values()].sort((a, b) => b.members - a.members) }
      },
      providesTags: (_result, _error, { year, season }) => [
        { type: 'Show', id: `${year}-${season}` },
      ],
    }),
    /** One show; a 404 error means Jikan doesn't know the id. */
    getAnime: build.query<Show, number>({
      async queryFn(id, _api, _extra, baseQuery) {
        const result = await fetchWithRetry(baseQuery, `anime/${id}`)
        if (result.error) return { error: result.error }
        const parsed = jikanAnimeResponseSchema.safeParse(result.data)
        if (!parsed.success) return { error: contractError(parsed.error) }
        return { data: toShow(parsed.data.data) }
      },
      providesTags: (_result, _error, id) => [{ type: 'Show', id }],
    }),
  }),
})

export const { useGetSeasonQuery, useGetAnimeQuery } = seasonApi
