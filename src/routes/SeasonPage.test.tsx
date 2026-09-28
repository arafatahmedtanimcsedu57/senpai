import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { jikanTiming } from '@/features/season/api'
import { apiBaseUrl } from '@/lib/env'
import { rawAnime } from '@/mocks/fixtures/anime'
import { server } from '@/mocks/server'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import { renderRoute } from '@/test/render'

const seasonUrl = `${apiBaseUrl}/seasons/:year/:season`
const emptyPage = { data: [], pagination: { last_visible_page: 1, has_next_page: false } }

beforeAll(() => {
  jikanTiming.pageGapMs = 0
})
afterAll(() => {
  jikanTiming.pageGapMs = 350
})

describe('SeasonPage', () => {
  it('shows every show of the season as a card, most popular first', async () => {
    renderRoute('/season/2026/fall')
    expect(await screen.findByRole('status', { name: 'Loading shows' })).toBeInTheDocument()
    const titles = await screen.findAllByRole('heading', { level: 2 })
    expect(titles).toHaveLength(rawAnime.length)
    expect(titles[0]).toHaveTextContent('Jujutsu Kaisen')
    expect(screen.getByRole('heading', { level: 1, name: 'Fall 2026' })).toBeInTheDocument()
    expect(screen.getByText(`${rawAnime.length} shows`)).toBeInTheDocument()
  })

  it('adds a show to the watchlist from its card', async () => {
    renderRoute('/season/2026/fall')
    const card = (await screen.findByRole('heading', { name: 'Dan Da Dan' })).closest('article')!
    await userEvent.click(within(card).getByRole('button', { name: 'Add to watchlist' }))
    expect(within(card).getByRole('button', { name: 'In watchlist' })).toBeDisabled()
    expect(useWatchlistStore.getState().has(57334)).toBe(true)
  })

  it('shows the empty state for a season with no shows', async () => {
    server.use(http.get(seasonUrl, () => HttpResponse.json(emptyPage)))
    renderRoute('/season/1990/winter')
    expect(await screen.findByText('No shows found for this season.')).toBeInTheDocument()
    expect(screen.getByText('0 shows')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next season: Spring 1990' })).toBeInTheDocument()
  })

  it('shows the error, then the shows after Retry', async () => {
    server.use(http.get(seasonUrl, () => new HttpResponse(null, { status: 500 }), { once: true }))
    renderRoute('/season/2026/fall')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load the season. Try again.',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Fall 2026' })).toHaveFocus()
    expect(await screen.findAllByRole('heading', { level: 2 })).toHaveLength(rawAnime.length)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('moves to the next season', async () => {
    const { router } = renderRoute('/season/2026/fall')
    await userEvent.click(await screen.findByRole('link', { name: 'Next season: Winter 2027' }))
    expect(router.state.location.pathname).toBe('/season/2027/winter')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Winter 2027' }),
    ).toBeInTheDocument()
  })

  it('shows "Page not found" for a malformed season', async () => {
    renderRoute('/season/2025/autumn')
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
