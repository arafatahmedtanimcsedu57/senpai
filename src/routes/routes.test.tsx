import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderRoute } from '../test/render'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { reportError } from '../lib/monitoring'
import { seasonLabel, seasonOf } from '../lib/season'

vi.mock('../lib/monitoring', () => ({ reportError: vi.fn() }))

describe('routes', () => {
  beforeEach(() => vi.mocked(reportError).mockClear())

  it('renders the current season at /', async () => {
    renderRoute('/')
    const label = seasonLabel(seasonOf(new Date()))
    expect(await screen.findByRole('heading', { level: 1, name: label })).toBeInTheDocument()
  })

  it('overlays the header on season pages only', async () => {
    const { container } = renderRoute('/season/2026/fall')
    await screen.findByRole('heading', { level: 1, name: 'Fall 2026' })
    expect(container.querySelector('header')).toHaveAttribute('data-hero', 'true')
  })

  it('keeps the solid header on other pages', async () => {
    const { container } = renderRoute('/anime/57334')
    await screen.findByRole('heading', { level: 1, name: 'Dan Da Dan' })
    expect(container.querySelector('header')).not.toHaveAttribute('data-hero')
  })

  it('shows "Page not found" for an unknown URL', async () => {
    renderRoute('/does-not-exist')
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument()
    expect(reportError).not.toHaveBeenCalled()
  })

  it('catches a page that crashes while rendering', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function Broken(): never {
      throw new Error('boom')
    }
    renderRoute('/', [
      {
        path: '/',
        Component: RootLayout,
        errorElement: <RouteError />,
        children: [{ index: true, Component: Broken }],
      },
    ])
    expect(await screen.findByRole('heading', { name: /something went wrong/i })).toBeVisible()
    expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }))
  })
})
