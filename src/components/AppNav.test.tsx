import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppNav } from './AppNav'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppNav />
    </MemoryRouter>,
  )
  return within(screen.getByRole('navigation', { name: 'Main' }))
}

describe('AppNav', () => {
  it.each(['/', '/season/2025/spring', '/anime/52991'])('marks Season as current on %s', (path) => {
    const nav = renderAt(path)
    expect(nav.getByRole('link', { name: 'Season' })).toHaveAttribute('aria-current', 'page')
  })

  it('links Season to the home page', () => {
    const nav = renderAt('/season/2025/spring')
    expect(nav.getByRole('link', { name: 'Season' })).toHaveAttribute('href', '/')
  })

  it('marks nothing as current elsewhere', () => {
    const nav = renderAt('/somewhere-else')
    expect(nav.getByRole('link', { name: 'Season' })).not.toHaveAttribute('aria-current')
  })

  it('links Watchlist and marks it current on /watchlist only', () => {
    const nav = renderAt('/watchlist')
    const watchlist = nav.getByRole('link', { name: 'Watchlist' })
    expect(watchlist).toHaveAttribute('href', '/watchlist')
    expect(watchlist).toHaveAttribute('aria-current', 'page')
    expect(nav.getByRole('link', { name: 'Season' })).not.toHaveAttribute('aria-current')
  })

  it('does not mark Watchlist current on the season page', () => {
    const nav = renderAt('/')
    expect(nav.getByRole('link', { name: 'Watchlist' })).not.toHaveAttribute('aria-current')
  })
})
