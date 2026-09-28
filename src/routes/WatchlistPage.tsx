import { useMemo, useRef, useState } from 'react'
import { StatusTabs } from '@/features/watchlist/components/StatusTabs'
import { WatchlistEmpty } from '@/features/watchlist/components/WatchlistEmpty'
import { WatchlistRow } from '@/features/watchlist/components/WatchlistRow'
import { firstNonEmptyStatus, groupByStatus, STATUS_LABEL } from '@/features/watchlist/status'
import { useWatchlistStore } from '@/stores/useWatchlistStore'
import type { WatchlistEntry, WatchStatus } from '@/types/anime'

// `/watchlist`: the user's shows under status tabs. The list is saved in this browser and is
// already loaded on the first render, so there's no loading state.
export function WatchlistPage() {
  const entries = useWatchlistStore((state) => state.entries)
  const groups = useMemo(() => groupByStatus(entries), [entries])
  // Picked once: a show moving tabs (e.g. +1 on a planned show) doesn't move the user with it.
  const [tab, setTab] = useState<WatchStatus>(() => firstNonEmptyStatus(groupByStatus(entries)))
  const panelRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState('')
  const isEmpty = Object.keys(entries).length === 0

  // The row is about to leave this tab and take keyboard focus with it: keep focus in the
  // panel and say where the show went.
  function handleMove(entry: WatchlistEntry, status: WatchStatus) {
    if (status === tab || status === entry.status) return
    setAnnouncement(`${entry.title} moved to ${STATUS_LABEL[status]}`)
    panelRef.current?.focus()
  }
  const counts = {
    watching: groups.watching.length,
    'plan-to-watch': groups['plan-to-watch'].length,
    completed: groups.completed.length,
    dropped: groups.dropped.length,
  }

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pt-5 pb-10 desktop:px-10 desktop:pt-10">
      <h1 className="font-heading text-2xl leading-[1.875rem] font-semibold desktop:text-[1.75rem] desktop:leading-[2.125rem]">
        Your watchlist
      </h1>
      {isEmpty ? (
        <WatchlistEmpty />
      ) : (
        <StatusTabs value={tab} onValueChange={setTab} counts={counts} panelRef={panelRef}>
          {groups[tab].length > 0 ? (
            <ul className="flex flex-col gap-3">
              {groups[tab].map((entry) => (
                <WatchlistRow key={entry.id} entry={entry} onMove={handleMove} />
              ))}
            </ul>
          ) : (
            <p className="py-12 text-center text-[0.9375rem] text-muted-foreground">
              No shows here yet.
            </p>
          )}
        </StatusTabs>
      )}
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </main>
  )
}
