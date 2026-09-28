import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SeasonMessage } from './SeasonMessage'

describe('SeasonMessage', () => {
  it('shows the empty message without a retry', () => {
    render(<SeasonMessage kind="empty" />)
    expect(screen.getByText('No shows found for this season.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('announces the error and retries on request', async () => {
    const onRetry = vi.fn()
    render(<SeasonMessage kind="error" onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load the season. Try again.')
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
