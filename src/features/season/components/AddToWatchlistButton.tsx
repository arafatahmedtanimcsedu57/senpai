import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { Show } from '@/types/anime'

export interface AddToWatchlistButtonProps {
  show: Show
  /**
   * card: small secondary button under a season card. detail: full-size pink button.
   * hero: light button on the featured hero ("Watchlist" on phones, "Add to watchlist" wider).
   */
  look?: 'card' | 'detail' | 'hero'
  className?: string
}

const HERO =
  'h-11 flex-1 rounded-sm text-[0.9375rem] desktop:h-13 desktop:flex-none desktop:px-6.5 desktop:text-[1.0625rem]'

/** "Add to watchlist", or a disabled "In watchlist" once the show is on it. */
export function AddToWatchlistButton({
  show,
  look = 'card',
  className,
}: AddToWatchlistButtonProps) {
  const added = useWatchlistStore((state) => show.id in state.entries)
  const add = useWatchlistStore((state) => state.add)
  const size = look === 'card' ? 'sm' : 'default'
  // "Watchlist" alone is ambiguous on the hero: name the button with the title too, keeping the
  // visible words at the start (WCAG 2.5.3 label in name).
  const heroName = (label: string) => (look === 'hero' ? `${label}: ${show.title}` : undefined)

  if (added) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        aria-label={heroName('In watchlist')}
        className={cn(
          'text-muted-foreground',
          look === 'hero' && [HERO, 'border-transparent bg-foreground/15 text-foreground'],
          className,
        )}
      >
        <Check aria-hidden="true" />
        In watchlist
      </Button>
    )
  }
  return (
    <Button
      variant={look === 'detail' ? 'default' : 'secondary'}
      size={size}
      onClick={() => add(show)}
      aria-label={heroName('Add to watchlist')}
      className={cn(
        look === 'hero' && [HERO, 'bg-foreground text-background hover:bg-foreground/85'],
        className,
      )}
    >
      <Plus aria-hidden="true" />
      {look === 'hero' ? (
        <span>
          <span className="desktop:hidden">Watchlist</span>
          <span className="hidden desktop:inline">Add to watchlist</span>
        </span>
      ) : (
        'Add to watchlist'
      )}
    </Button>
  )
}
