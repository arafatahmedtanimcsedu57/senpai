import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { Show } from '@/types/anime'

export interface AddToWatchlistButtonProps {
  show: Show
  className?: string
}

/** "Add to watchlist", or a disabled "In watchlist" once the show is on it. */
export function AddToWatchlistButton({ show, className }: AddToWatchlistButtonProps) {
  const added = useWatchlistStore((state) => show.id in state.entries)
  const add = useWatchlistStore((state) => state.add)

  if (added) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={cn('text-muted-foreground', className)}
      >
        <Check aria-hidden="true" />
        In watchlist
      </Button>
    )
  }
  return (
    <Button variant="secondary" size="sm" onClick={() => add(show)} className={className}>
      <Plus aria-hidden="true" />
      Add to watchlist
    </Button>
  )
}
