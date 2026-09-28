import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowGridSkeleton } from './ShowGridSkeleton'

describe('ShowGridSkeleton', () => {
  it('tells assistive tech the shows are loading', () => {
    render(<ShowGridSkeleton />)
    expect(screen.getByRole('status', { name: 'Loading shows' })).toHaveTextContent('Loading shows')
  })
})
