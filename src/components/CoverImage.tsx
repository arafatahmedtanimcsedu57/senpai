import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface CoverImageProps {
  src: string | null
  /** Used for the placeholder's letter; the cover itself is decorative (the title sits beside it). */
  title: string
  className?: string
}

/** A 2:3 show cover; a muted tile with the title's first letter when there's no image or it fails. */
export function CoverImage({ src, title, className }: CoverImageProps) {
  // Remember which URL failed rather than a boolean, so a new `src` gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const frame = cn('aspect-[2/3] w-full overflow-hidden rounded-sm bg-muted', className)

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailedSrc(src)}
        className={cn(frame, 'object-cover')}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      data-testid="cover-placeholder"
      className={cn(frame, 'flex items-end p-3')}
    >
      <span className="font-heading text-[3.5rem] leading-[0.9] font-extrabold text-foreground/30">
        {/* First letter or digit, so "[Oshi no Ko]" shows "O", not "[". */}
        {title.match(/[\p{L}\p{N}]/u)?.[0] ?? ''}
      </span>
    </div>
  )
}
