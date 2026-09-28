import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { renderWithStore } from '@/test/render'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { Show } from '@/types/anime'
import { ShowCard } from './ShowCard'

const show: Show = {
  id: 52991,
  title: "Frieren: Beyond Journey's End",
  imageUrl: null,
  studio: 'Madhouse',
  airingDay: 'Fridays',
  episodes: 28,
  genres: [],
  synopsis: null,
  url: 'https://myanimelist.net/anime/52991',
  members: 1,
}

describe('ShowCard', () => {
  it('links the cover and title to the detail page', () => {
    renderWithStore(
      <MemoryRouter>
        <ShowCard show={show} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: show.title })).toHaveAttribute('href', '/anime/52991')
  })

  it('shows the title and "studio · day · episodes"', () => {
    renderWithStore(
      <MemoryRouter>
        <ShowCard show={show} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: show.title })).toBeInTheDocument()
    expect(screen.getByText('Madhouse · Fridays · 28 eps')).toBeInTheDocument()
  })

  it('shows "? eps" for an unknown count and leaves out unknown parts', () => {
    renderWithStore(
      <MemoryRouter>
        <ShowCard show={{ ...show, episodes: null, airingDay: null }} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Madhouse · ? eps')).toBeInTheDocument()
  })

  it('adds the show to the watchlist, then reads "In watchlist"', async () => {
    renderWithStore(
      <MemoryRouter>
        <ShowCard show={show} />
      </MemoryRouter>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Add to watchlist' }))
    expect(useWatchlistStore.getState().has(show.id)).toBe(true)
    expect(screen.getByRole('button', { name: 'In watchlist' })).toBeDisabled()
  })

  it('reads "In watchlist" for a show that is already on the list', () => {
    useWatchlistStore.getState().add(show)
    renderWithStore(
      <MemoryRouter>
        <ShowCard show={show} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'In watchlist' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Add to watchlist' })).not.toBeInTheDocument()
  })
})
