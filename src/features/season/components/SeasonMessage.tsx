import { CircleAlert, LayoutGrid, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface SeasonMessageProps {
  kind: 'empty' | 'error'
  /** Error only: try the request again. */
  onRetry?: () => void
}

/** The season page's empty and error states (copy from features.md). */
export function SeasonMessage({ kind, onRetry }: SeasonMessageProps) {
  const isError = kind === 'error'
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center desktop:py-30">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        {isError ? (
          <CircleAlert aria-hidden="true" className="size-7 text-destructive" />
        ) : (
          <LayoutGrid aria-hidden="true" className="size-7 text-muted-foreground" />
        )}
      </div>
      <p
        role={isError ? 'alert' : undefined}
        className="max-w-80 text-[0.9375rem] leading-[1.375rem]"
      >
        {isError ? 'Could not load the season. Try again.' : 'No shows found for this season.'}
      </p>
      {isError && (
        <Button onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  )
}
