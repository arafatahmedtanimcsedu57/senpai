import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/render'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { WatchlistEntry, WatchStatus } from '@/types/anime'

function entry(id: number, title: string, status: WatchStatus, progress = 0): WatchlistEntry {
  return {
    id,
    title,
    imageUrl: null,
    studio: null,
    airingDay: null,
    episodes: 12,
    status,
    progress,
    addedAt: `2026-09-0${id}T00:00:00.000Z`,
    updatedAt: `2026-09-0${id}T00:00:00.000Z`,
  }
}

function seed(...list: WatchlistEntry[]) {
  useWatchlistStore.setState({ entries: Object.fromEntries(list.map((e) => [e.id, e])) })
}

const rowTitles = () =>
  within(screen.getByRole('tabpanel'))
    .getAllByRole('heading', { level: 2 })
    .map((h) => h.textContent)

describe('WatchlistPage', () => {
  it('shows counts per status and opens on Watching, newest first', async () => {
    seed(
      entry(1, 'Dandadan', 'watching', 9),
      entry(2, 'Chainsaw Man', 'watching', 5),
      entry(3, 'Kaiju No. 8', 'watching', 3),
      entry(4, 'Frieren', 'plan-to-watch'),
    )
    renderRoute('/watchlist')
    expect(await screen.findByRole('heading', { level: 1, name: 'Your watchlist' })).toBeVisible()
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      'Watching 3',
      'Plan to watch 1',
      'Completed 0',
      'Dropped 0',
    ])
    expect(screen.getByRole('tab', { name: 'Watching 3' })).toHaveAttribute('aria-selected', 'true')
    expect(rowTitles()).toEqual(['Kaiju No. 8', 'Chainsaw Man', 'Dandadan'])
  })

  it('opens on the first tab that has shows', async () => {
    seed(entry(1, 'Frieren', 'plan-to-watch'))
    renderRoute('/watchlist')
    expect(await screen.findByRole('tab', { name: 'Plan to watch 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('says so when a tab has no shows', async () => {
    seed(entry(1, 'Frieren', 'plan-to-watch'))
    renderRoute('/watchlist')
    await userEvent.click(await screen.findByRole('tab', { name: 'Dropped 0' }))
    expect(screen.getByText('No shows here yet.')).toBeInTheDocument()
  })

  it('moves a planned show to Watching on its first +1, without switching tabs', async () => {
    seed(entry(1, 'Frieren', 'plan-to-watch'))
    renderRoute('/watchlist')
    await userEvent.click(await screen.findByRole('button', { name: 'Watched episode 1: Frieren' }))
    expect(screen.getByRole('tab', { name: 'Watching 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Plan to watch 0' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Frieren moved to Watching')
    expect(screen.getByRole('tabpanel')).toHaveFocus()
    await userEvent.click(screen.getByRole('tab', { name: 'Watching 1' }))
    expect(screen.getByText('1 / 12', { exact: false })).toBeInTheDocument()
  })

  it('moves a completed show to the Completed tab with every episode watched', async () => {
    seed(entry(1, 'Dandadan', 'watching', 5))
    renderRoute('/watchlist')
    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: 'Status: Dandadan' }),
      'Completed',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Dandadan moved to Completed')
    await userEvent.click(screen.getByRole('tab', { name: 'Completed 1' }))
    expect(screen.getByText('12 / 12', { exact: false })).toBeInTheDocument()
  })

  it('shows the empty state and no tabs when the list is empty', async () => {
    renderRoute('/watchlist')
    expect(
      await screen.findByText('Your watchlist is empty — browse this season'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse this season' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })
})
