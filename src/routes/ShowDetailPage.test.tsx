import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { apiBaseUrl } from '@/lib/env'
import { server } from '@/mocks/server'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import { renderRoute } from '@/test/render'

const animeUrl = `${apiBaseUrl}/anime/:id`

describe('ShowDetailPage', () => {
  it('shows the show with its facts, synopsis and MyAnimeList link', async () => {
    renderRoute('/anime/57334')
    expect(await screen.findByRole('heading', { level: 1, name: 'Dan Da Dan' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Genres' })).toHaveTextContent('Supernatural')
    expect(screen.getByText('Episodes').nextElementSibling).toHaveTextContent('12')
    expect(screen.getByText(/Momo believes in ghosts/)).toBeInTheDocument()
    const mal = screen.getByRole('link', { name: 'View on MyAnimeList (opens in a new tab)' })
    expect(mal).toHaveAttribute('href', 'https://myanimelist.net/anime/57334')
    expect(mal).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Fall 2026' })).toHaveAttribute(
      'href',
      '/season/2026/fall',
    )
  })

  it('links back to "This season" when the show has no season', async () => {
    renderRoute('/anime/58939')
    await screen.findByRole('heading', { level: 1, name: 'Sakamoto Days' })
    expect(screen.getByRole('link', { name: 'This season' })).toHaveAttribute('href', '/')
  })

  it('adds the show to the watchlist', async () => {
    renderRoute('/anime/57334')
    await userEvent.click(await screen.findByRole('button', { name: 'Add to watchlist' }))
    expect(screen.getByRole('button', { name: 'In watchlist' })).toBeDisabled()
    expect(useWatchlistStore.getState().has(57334)).toBe(true)
  })

  it('says the show does not exist for an unknown id', async () => {
    renderRoute('/anime/999999999')
    expect(await screen.findByText("This show doesn't exist.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse this season' })).toHaveAttribute('href', '/')
  })

  it('shows the error, then the show after Retry', async () => {
    server.use(http.get(animeUrl, () => new HttpResponse(null, { status: 500 }), { once: true }))
    renderRoute('/anime/57334')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load this show. Try again.',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByRole('main')).toHaveFocus()
    expect(await screen.findByRole('heading', { level: 1, name: 'Dan Da Dan' })).toBeInTheDocument()
  })

  it('shows "Page not found" for a non-numeric id', async () => {
    renderRoute('/anime/abc')
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
