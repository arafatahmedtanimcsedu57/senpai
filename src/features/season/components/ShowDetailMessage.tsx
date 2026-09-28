import { CircleAlert, RefreshCw, SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export interface ShowDetailMessageProps {
  kind: 'not-found' | 'error'
  /** Error only: try the request again. */
  onRetry?: () => void
}

/** The detail page's "unknown show" and "request failed" states. */
export function ShowDetailMessage({ kind, onRetry }: ShowDetailMessageProps) {
  const notFound = kind === 'not-found'
  return (
    <div
      role={notFound ? undefined : 'alert'}
      className="flex flex-col items-center gap-4 py-24 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        {notFound ? (
          <SearchX aria-hidden="true" className="size-7 text-muted-foreground" />
        ) : (
          <CircleAlert aria-hidden="true" className="size-7 text-destructive" />
        )}
      </div>
      {/* The page's h1 when there's no show to title it. */}
      <h1 className="text-[0.9375rem] leading-[1.375rem] font-normal">
        {notFound ? "This show doesn't exist." : 'Could not load this show. Try again.'}
      </h1>
      {notFound ? (
        <Button asChild>
          <Link to="/">Browse this season</Link>
        </Button>
      ) : (
        <Button onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  )
}
