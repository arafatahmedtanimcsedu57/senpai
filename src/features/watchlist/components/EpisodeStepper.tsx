import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EpisodeStepperProps {
  /** Names the buttons, e.g. "One episode back: Dandadan". */
  title: string
  progress: number
  /** null when the total isn't known: shown as "?" and +1 never runs out. */
  episodes: number | null
  onStep: (delta: 1 | -1) => void
}

// At a bound the button is aria-disabled, not disabled, so keyboard focus stays on it.
const BOUNDED = 'aria-disabled:cursor-not-allowed aria-disabled:opacity-40'

/** −1 · "5 / 12" · +1 */
export function EpisodeStepper({ title, progress, episodes, onStep }: EpisodeStepperProps) {
  const atStart = progress <= 0
  const atEnd = episodes !== null && progress >= episodes
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={cn('size-9', BOUNDED)}
        aria-label={`One episode back: ${title}`}
        aria-disabled={atStart || undefined}
        onClick={() => !atStart && onStep(-1)}
      >
        <Minus aria-hidden="true" />
      </Button>
      <span
        aria-live="polite"
        className="min-w-14 text-center text-[0.9375rem] font-semibold tabular-nums"
      >
        <span className="sr-only">{title}: </span>
        {progress} / {episodes ?? '?'}
      </span>
      <Button
        variant="secondary"
        size="icon"
        className={cn('size-9', BOUNDED)}
        aria-label={`Watched episode ${progress + 1}: ${title}`}
        aria-disabled={atEnd || undefined}
        onClick={() => !atEnd && onStep(1)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  )
}
