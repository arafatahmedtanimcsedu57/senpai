import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it.each(['default', 'secondary', 'outline', 'ghost'] as const)(
    'renders the %s variant as a button',
    (variant) => {
      render(<Button variant={variant}>Save</Button>)
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    },
  )

  it('renders its child instead with asChild', () => {
    render(
      <Button asChild>
        <a href="/next">Next</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/next')
  })
})
