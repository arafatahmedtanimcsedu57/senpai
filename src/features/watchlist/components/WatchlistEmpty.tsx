import { LayoutGrid, List } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

/** The watchlist with nothing on it (copy from features.md). */
export function WatchlistEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center desktop:pt-30">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        <List aria-hidden="true" className="size-7 text-muted-foreground" />
      </div>
      <p className="max-w-80 text-[0.9375rem] leading-[1.375rem]">
        Your watchlist is empty — browse this season
      </p>
      <Button asChild>
        <Link to="/">
          <LayoutGrid aria-hidden="true" />
          Browse this season
        </Link>
      </Button>
    </div>
  )
}
