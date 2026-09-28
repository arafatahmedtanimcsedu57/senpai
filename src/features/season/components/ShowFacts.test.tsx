import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Show } from '@/types/anime'
import { GenreChips } from './GenreChips'
import { ShowFacts } from './ShowFacts'

const show: Show = {
  id: 57334,
  title: 'Dan Da Dan',
  imageUrl: null,
  studio: 'Science SARU',
  airingDay: 'Thursdays',
  episodes: 12,
  genres: ['Action', 'Comedy'],
  synopsis: null,
  url: 'https://myanimelist.net/anime/57334',
  members: 1,
  seasonId: { year: 2026, season: 'fall' },
}

function fact(term: string) {
  return screen.getByText(term).nextElementSibling
}

describe('ShowFacts', () => {
  it('lists episodes, airing day, studio and season', () => {
    render(<ShowFacts show={show} />)
    expect(fact('Episodes')).toHaveTextContent('12')
    expect(fact('Airs')).toHaveTextContent('Thursdays')
    expect(fact('Studio')).toHaveTextContent('Science SARU')
    expect(fact('Season')).toHaveTextContent('Fall 2026')
  })

  it('shows "?" episodes and leaves out unknown facts', () => {
    render(<ShowFacts show={{ ...show, episodes: null, studio: null, seasonId: null }} />)
    expect(fact('Episodes')).toHaveTextContent('?')
    expect(screen.queryByText('Studio')).not.toBeInTheDocument()
    expect(screen.queryByText('Season')).not.toBeInTheDocument()
  })
})

describe('GenreChips', () => {
  it('lists every genre', () => {
    render(<GenreChips genres={['Action', 'Comedy']} />)
    expect(screen.getByRole('list', { name: 'Genres' })).toHaveTextContent('ActionComedy')
  })

  it('renders nothing without genres', () => {
    const { container } = render(<GenreChips genres={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
