import { fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithStore } from '@/test/render'
import type { SeasonId, Show } from '@/types/anime'
import { SeasonHero } from './SeasonHero'

const show: Show = {
  id: 52991,
  title: "Frieren: Beyond Journey's End",
  imageUrl: 'https://example.com/poster.webp',
  bannerUrl: 'https://example.com/wide.jpg',
  studio: 'Madhouse',
  airingDay: 'Fridays',
  episodes: 28,
  genres: [],
  synopsis: 'An elf mage outlives her party.',
  url: 'https://myanimelist.net/anime/52991',
  members: 1,
}

function renderHero(
  overrides: Partial<Show> = {},
  season: SeasonId = { year: 2026, season: 'fall' },
) {
  const { container } = renderWithStore(
    <MemoryRouter>
      <SeasonHero show={{ ...show, ...overrides }} season={season} />
    </MemoryRouter>,
  )
  return {
    img: () => container.querySelector('img'),
    wide: () => container.querySelector('source')?.getAttribute('srcset') ?? null,
  }
}

describe('SeasonHero', () => {
  it('features the show with its season, meta, synopsis and actions', () => {
    renderHero()
    expect(screen.getByRole('region', { name: show.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: show.title })).toBeInTheDocument()
    expect(screen.getByText('FEATURED', { exact: false })).toHaveTextContent('FALL 2026')
    expect(screen.getByText('Madhouse · Fridays · 28 eps')).toBeInTheDocument()
    expect(screen.getByText(show.synopsis!)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /More info/ })).toHaveAttribute('href', '/anime/52991')
    expect(screen.getByRole('button', { name: `Add to watchlist: ${show.title}` })).toBeEnabled()
  })

  it('names the season it features', () => {
    renderHero({}, { year: 2025, season: 'spring' })
    expect(screen.getByText('FEATURED', { exact: false })).toHaveTextContent('SPRING 2025')
  })

  it('uses the poster on phones and the wide art on desktop', () => {
    const art = renderHero()
    expect(art.img()).toHaveAttribute('src', 'https://example.com/poster.webp')
    expect(art.wide()).toBe('https://example.com/wide.jpg')
  })

  it('uses the poster at every width when there is no wide art', () => {
    const art = renderHero({ bannerUrl: null })
    expect(art.img()).toHaveAttribute('src', 'https://example.com/poster.webp')
    expect(art.wide()).toBeNull()
  })

  it('drops art that fails to load', () => {
    const art = renderHero({ bannerUrl: null })
    fireEvent.error(art.img()!)
    expect(art.img()).toBeNull()
  })

  it('shows only the tinted panel when there is no art at all', () => {
    expect(renderHero({ bannerUrl: null, imageUrl: null }).img()).toBeNull()
  })
})
