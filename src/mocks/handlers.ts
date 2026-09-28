import { http, HttpResponse, type RequestHandler } from 'msw'
import { apiBaseUrl } from '../lib/env'
import { rawAnime } from './fixtures/anime'

// Fixtures are parsed through the Zod schema (src/mocks/fixtures) so the mock can't drift
// from the contract. Jikan serves seasons in pages; the mock does too (PAGE_SIZE per page)
// and repeats one show on the last page, as the real API sometimes does.
export const PAGE_SIZE = 7

function seasonEntries() {
  return [...rawAnime, rawAnime[0]]
}

/** Restore the fixtures; called between tests so one test's writes don't leak into the next. */
export function resetMockData() {}

export const handlers: RequestHandler[] = [
  // Every season returns the fixtures in dev; tests override with server.use for other cases.
  http.get(`${apiBaseUrl}/seasons/:year/:season`, ({ request }) => {
    const entries = seasonEntries()
    const page = Number(new URL(request.url).searchParams.get('page') ?? '1')
    const lastPage = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
    return HttpResponse.json({
      data: entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      pagination: { last_visible_page: lastPage, has_next_page: page < lastPage },
    })
  }),
  http.get(`${apiBaseUrl}/anime/:id`, ({ params }) => {
    const found = rawAnime.find((raw) => raw.mal_id === Number(params.id))
    if (!found) return HttpResponse.json({ status: 404, message: 'Not Found' }, { status: 404 })
    return HttpResponse.json({ data: found })
  }),
]
