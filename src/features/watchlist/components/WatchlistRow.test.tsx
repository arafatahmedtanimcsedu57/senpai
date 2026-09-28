import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { WatchlistEntry } from '@/types/anime'
import { WatchlistRow } from './WatchlistRow'

const base: WatchlistEntry = {
  id: 57334,
  title: 'Dandadan',
  imageUrl: null,
  studio: 'Science SARU',
  airingDay: 'Thursdays',
  episodes: 12,
  status: 'watching',
  progress: 5,
  addedAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
}

// The row reads its entry from props; re-render from the store to see what an action did.
function Row({ id }: { id: number }) {
  const entry = useWatchlistStore((state) => state.entries[id])
  return (
    <ul>
      <WatchlistRow entry={entry} />
    </ul>
  )
}

function renderRow(patch: Partial<WatchlistEntry> = {}) {
  useWatchlistStore.setState({ entries: { [base.id]: { ...base, ...patch } } })
  render(
    <MemoryRouter>
      <Row id={base.id} />
    </MemoryRouter>,
  )
}

describe('WatchlistRow', () => {
  beforeEach(() => useWatchlistStore.setState({ entries: {} }))

  it('links the title to the show and shows its studio, day and progress', () => {
    renderRow()
    expect(screen.getByRole('link', { name: 'Dandadan' })).toHaveAttribute('href', '/anime/57334')
    expect(screen.getByText('Science SARU · Thursdays')).toBeInTheDocument()
    expect(screen.getByText('5 / 12', { exact: false })).toBeInTheDocument()
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: `${(5 / 12) * 100}%` })
  })

  it('leaves the meta line out when studio and day are unknown', () => {
    renderRow({ studio: null, airingDay: null })
    expect(screen.queryByText(/·/)).not.toBeInTheDocument()
  })

  it('draws a stub bar when the total is unknown', () => {
    renderRow({ episodes: null, progress: 3 })
    expect(screen.getByText('3 / ?', { exact: false })).toBeInTheDocument()
    expect(screen.getByTestId('progress-fill')).toHaveClass('w-[30%]')
  })

  it('steps the watched count', async () => {
    renderRow()
    await userEvent.click(screen.getByRole('button', { name: 'Watched episode 6: Dandadan' }))
    expect(screen.getByText('6 / 12', { exact: false })).toBeInTheDocument()
  })

  it('changes the status from the select', async () => {
    renderRow()
    const select = screen.getByRole('combobox', { name: 'Status: Dandadan' })
    expect(select).toHaveValue('watching')
    await userEvent.selectOptions(select, 'Completed')
    expect(useWatchlistStore.getState().entries[base.id]).toMatchObject({
      status: 'completed',
      progress: 12,
    })
    expect(screen.getByText('12 / 12', { exact: false })).toBeInTheDocument()
  })
})
