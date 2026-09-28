import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { WatchStatus } from '@/types/anime'
import { StatusTabs } from './StatusTabs'

const counts = { watching: 3, 'plan-to-watch': 1, completed: 0, dropped: 0 }

function Harness({ initial = 'watching' }: { initial?: WatchStatus }) {
  const [value, setValue] = useState<WatchStatus>(initial)
  return (
    <StatusTabs value={value} onValueChange={setValue} counts={counts}>
      <p>Panel: {value}</p>
    </StatusTabs>
  )
}

describe('StatusTabs', () => {
  it('shows every status with its count, and the selected one', () => {
    render(<Harness />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Watching 3',
      'Plan to watch 1',
      'Completed 0',
      'Dropped 0',
    ])
    expect(screen.getByRole('tab', { name: 'Watching 3' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel: watching')
  })

  it('selects a tab on click', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('tab', { name: 'Completed 0' }))
    expect(screen.getByRole('tab', { name: 'Completed 0' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel: completed')
  })

  it('moves between tabs with the arrow keys', async () => {
    render(<Harness />)
    await userEvent.tab()
    expect(screen.getByRole('tab', { name: 'Watching 3' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Plan to watch 1' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Plan to watch 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Dropped 0' })).toHaveFocus()
  })
})
