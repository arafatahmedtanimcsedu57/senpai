import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EpisodeStepper } from './EpisodeStepper'

describe('EpisodeStepper', () => {
  it('shows the count and steps either way', async () => {
    const onStep = vi.fn()
    render(<EpisodeStepper title="Dandadan" progress={9} episodes={12} onStep={onStep} />)
    expect(screen.getByText('9 / 12', { exact: false })).toHaveTextContent('Dandadan: 9 / 12')
    await userEvent.click(screen.getByRole('button', { name: 'Watched episode 10: Dandadan' }))
    await userEvent.click(screen.getByRole('button', { name: 'One episode back: Dandadan' }))
    expect(onStep.mock.calls).toEqual([[1], [-1]])
  })

  it('disables −1 at 0 and +1 at the total, keeping them focusable', async () => {
    const onStep = vi.fn()
    const { rerender } = render(
      <EpisodeStepper title="Dandadan" progress={0} episodes={12} onStep={onStep} />,
    )
    const back = screen.getByRole('button', { name: /One episode back/ })
    expect(back).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: /Watched episode/ })).not.toHaveAttribute(
      'aria-disabled',
    )
    await userEvent.click(back)
    expect(back).toHaveFocus()
    expect(onStep).not.toHaveBeenCalled()

    rerender(<EpisodeStepper title="Dandadan" progress={12} episodes={12} onStep={onStep} />)
    const forward = screen.getByRole('button', { name: /Watched episode/ })
    expect(forward).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(forward)
    expect(onStep).not.toHaveBeenCalled()
  })

  it('reads "?" and never runs out when the total is unknown', () => {
    render(<EpisodeStepper title="Kaiju No. 8" progress={300} episodes={null} onStep={() => {}} />)
    expect(screen.getByText('300 / ?', { exact: false })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Watched episode 301: Kaiju No. 8' }),
    ).not.toHaveAttribute('aria-disabled')
  })
})
