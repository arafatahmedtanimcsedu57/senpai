import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { WatchlistEmpty } from './WatchlistEmpty'

describe('WatchlistEmpty', () => {
  it('points to this season', () => {
    render(
      <MemoryRouter>
        <WatchlistEmpty />
      </MemoryRouter>,
    )
    expect(screen.getByText('Your watchlist is empty — browse this season')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse this season' })).toHaveAttribute('href', '/')
  })
})
