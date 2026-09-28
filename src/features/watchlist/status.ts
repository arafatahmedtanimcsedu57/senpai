import type { WatchlistEntry, WatchStatus } from '@/types/anime'

/** Tab order; the status select lists them the same way. */
export const STATUS_ORDER: readonly WatchStatus[] = [
  'watching',
  'plan-to-watch',
  'completed',
  'dropped',
]

export const STATUS_LABEL: Record<WatchStatus, string> = {
  watching: 'Watching',
  'plan-to-watch': 'Plan to watch',
  completed: 'Completed',
  dropped: 'Dropped',
}

export function isWatchStatus(value: string): value is WatchStatus {
  return (STATUS_ORDER as readonly string[]).includes(value)
}

/** Entries per status, most recently added first. */
export function groupByStatus(
  entries: Record<number, WatchlistEntry>,
): Record<WatchStatus, WatchlistEntry[]> {
  const groups: Record<WatchStatus, WatchlistEntry[]> = {
    watching: [],
    'plan-to-watch': [],
    completed: [],
    dropped: [],
  }
  for (const entry of Object.values(entries)) groups[entry.status].push(entry)
  for (const list of Object.values(groups)) list.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  return groups
}

/** The tab the page opens on: the first, in tab order, that has shows. */
export function firstNonEmptyStatus(groups: Record<WatchStatus, WatchlistEntry[]>): WatchStatus {
  return STATUS_ORDER.find((status) => groups[status].length > 0) ?? STATUS_ORDER[0]
}
