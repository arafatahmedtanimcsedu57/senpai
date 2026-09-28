import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { Show } from '@/types/anime'
import { AddToWatchlistButton } from './AddToWatchlistButton'

const show: Show = {
  id: 49596,
  title: 'Blue Lock',
  imageUrl: null,
  studio: 'Eight Bit',
  airingDay: 'Saturdays',
  episodes: 14,
  genres: [],
  synopsis: null,
  url: 'https://myanimelist.net/anime/49596',
  members: 1,
}

describe('AddToWatchlistButton', () => {
  it('adds the show and switches to a disabled "In watchlist"', async () => {
    render(<AddToWatchlistButton show={show} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add to watchlist' }))
    expect(useWatchlistStore.getState().entries[show.id]).toMatchObject({ status: 'plan-to-watch' })
    expect(screen.getByRole('button', { name: 'In watchlist' })).toBeDisabled()
  })

  it('only re-renders for its own show', async () => {
    render(<AddToWatchlistButton show={show} />)
    useWatchlistStore.getState().add({ ...show, id: 1, title: 'Another show' })
    expect(screen.getByRole('button', { name: 'Add to watchlist' })).toBeEnabled()
  })
})
