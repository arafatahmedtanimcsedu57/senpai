import { Link } from 'react-router'
import { CoverImage } from '@/components/CoverImage'
import { cn } from '@/lib/utils'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { WatchlistEntry, WatchStatus } from '@/types/anime'
import { isWatchStatus, STATUS_LABEL, STATUS_ORDER } from '../status'
import { EpisodeStepper } from './EpisodeStepper'

export interface WatchlistRowProps {
  entry: WatchlistEntry
  /** Called just before the show's status changes, so the page can keep focus and announce it. */
  onMove?: (entry: WatchlistEntry, status: WatchStatus) => void
}

// One grid, two layouts. Phones: title, status, bar, stepper stacked beside the cover.
// Desktop: title / meta / bar in the first column, then the status select, then the stepper.
export function WatchlistRow({ entry, onMove }: WatchlistRowProps) {
  const setStatus = useWatchlistStore((state) => state.setStatus)
  const step = useWatchlistStore((state) => state.step)
  const meta = [entry.studio, entry.airingDay].filter(Boolean).join(' · ')
  // Unknown total: a short grey stub, as drawn, rather than a guess.
  const percent = entry.episodes ? Math.min(100, (entry.progress / entry.episodes) * 100) : null

  return (
    <li className="flex gap-3 rounded-lg border border-border bg-card p-3 desktop:items-center desktop:gap-5 desktop:p-4">
      <CoverImage
        src={entry.imageUrl}
        title={entry.title}
        className="w-14 shrink-0 rounded-[0.5rem] p-1.5 [&_span]:text-2xl"
      />
      <div className="grid min-w-0 flex-1 content-start gap-2 desktop:grid-cols-[1fr_auto_auto] desktop:items-center desktop:gap-x-5">
        <h2 className="text-[0.9375rem] leading-5 font-semibold desktop:col-start-1 desktop:text-base desktop:leading-[1.375rem]">
          <Link to={`/anime/${entry.id}`} className="hover:text-primary hover:underline">
            {entry.title}
          </Link>
        </h2>
        {meta && (
          <span className="hidden text-[0.8125rem] text-muted-foreground desktop:col-start-1 desktop:block">
            {meta}
          </span>
        )}
        <select
          aria-label={`Status: ${entry.title}`}
          value={entry.status}
          onChange={(event) => {
            const next = event.target.value
            if (!isWatchStatus(next)) return
            onMove?.(entry, next)
            setStatus(entry.id, next)
          }}
          className="h-9 justify-self-start rounded-[0.5rem] border border-border bg-secondary px-2.5 text-[0.8125rem] font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background desktop:col-start-2 desktop:row-span-3 desktop:row-start-1"
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <div
          aria-hidden="true"
          className="h-1.5 overflow-hidden rounded-full bg-muted desktop:col-start-1 desktop:w-80"
        >
          <div
            data-testid="progress-fill"
            className={cn(
              'h-full rounded-full',
              percent === null ? 'w-[30%] bg-border' : 'bg-spark',
            )}
            style={percent === null ? undefined : { width: `${percent}%` }}
          />
        </div>
        <div className="desktop:col-start-3 desktop:row-span-3 desktop:row-start-1">
          <EpisodeStepper
            title={entry.title}
            progress={entry.progress}
            episodes={entry.episodes}
            onStep={(delta) => {
              if (delta === 1 && entry.status === 'plan-to-watch') onMove?.(entry, 'watching')
              step(entry.id, delta)
            }}
          />
        </div>
      </div>
    </li>
  )
}
