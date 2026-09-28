import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CoverImage } from './CoverImage'

describe('CoverImage', () => {
  it('shows the cover as a decorative image', () => {
    const { container } = render(<CoverImage src="https://example.com/a.webp" title="Dandadan" />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('src', 'https://example.com/a.webp')
    expect(img).toHaveAttribute('alt', '')
  })

  it('shows the placeholder with the first letter when there is no cover', () => {
    render(<CoverImage src={null} title="Dandadan" />)
    expect(screen.getByTestId('cover-placeholder')).toHaveTextContent('D')
  })

  it('skips leading punctuation for the placeholder letter', () => {
    render(<CoverImage src={null} title="[Oshi no Ko]" />)
    expect(screen.getByTestId('cover-placeholder')).toHaveTextContent(/^O$/)
  })

  it('falls back to the placeholder when the image fails to load', () => {
    const { container } = render(<CoverImage src="https://example.com/x.webp" title="Blue Lock" />)
    fireEvent.error(container.querySelector('img')!)
    expect(screen.getByTestId('cover-placeholder')).toHaveTextContent('B')
  })
})
