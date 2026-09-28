import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { SeasonHeader, type SeasonHeaderProps } from './SeasonHeader'

const fall = { year: 2026, season: 'fall' } as const

function renderHeader(props: Partial<SeasonHeaderProps> = {}) {
  render(
    <MemoryRouter>
      <SeasonHeader season={fall} isCurrent {...props} />
    </MemoryRouter>,
  )
}

describe('SeasonHeader', () => {
  it('shows the season, the count and links to both neighbours', () => {
    renderHeader({ count: 42 })
    expect(screen.getByRole('heading', { level: 1, name: 'Fall 2026' })).toBeInTheDocument()
    expect(screen.getByText('THIS SEASON')).toBeInTheDocument()
    expect(screen.getByText('42 shows')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Previous season: Summer 2026' })).toHaveAttribute(
      'href',
      '/season/2026/summer',
    )
    expect(screen.getByRole('link', { name: 'Next season: Winter 2027' })).toHaveAttribute(
      'href',
      '/season/2027/winter',
    )
  })

  it('says "SEASON" for a season that is not airing now', () => {
    renderHeader({ isCurrent: false })
    expect(screen.getByText('SEASON')).toBeInTheDocument()
  })

  it('uses the singular for one show', () => {
    renderHeader({ count: 1 })
    expect(screen.getByText('1 show')).toBeInTheDocument()
  })

  it('hides the count while it is unknown', () => {
    renderHeader()
    expect(screen.queryByText(/shows?$/)).not.toBeInTheDocument()
  })
})
