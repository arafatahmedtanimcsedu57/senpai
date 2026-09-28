import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Show, WatchlistEntry, WatchStatus } from '../types/anime'

// The user's watchlist, kept in this browser only (architecture.md → user data). Bump
// `version` and extend `migrate` when the entry shape changes.
interface WatchlistState {
  entries: Record<number, WatchlistEntry>
  /** Adds the show as "Plan to watch"; a show already on the list is left as it is. */
  add: (show: Show) => void
  has: (id: number) => boolean
  /** Completed with a known total also marks every episode watched. */
  setStatus: (id: number, status: WatchStatus) => void
  /** One episode forward or back, kept within 0…total; the first +1 starts a planned show. */
  step: (id: number, delta: 1 | -1) => void
}

type PersistedWatchlist = Pick<WatchlistState, 'entries'>
type WatchlistEntryV1 = Omit<WatchlistEntry, 'studio' | 'airingDay' | 'updatedAt'>

/**
 * v1 entries had no studio, airing day or updatedAt; keep every entry and fill those in.
 * Never throws: a throw leaves the store empty, and its next write would erase the saved list.
 */
export function migrateWatchlist(persisted: unknown, version: number): PersistedWatchlist {
  if (version >= 2) return persisted as PersistedWatchlist
  const v1 = (persisted ?? {}) as { entries?: Record<number, WatchlistEntryV1 | null> }
  const entries: Record<number, WatchlistEntry> = {}
  for (const [id, entry] of Object.entries(v1.entries ?? {})) {
    if (typeof entry !== 'object' || entry === null) continue
    entries[Number(id)] = { studio: null, airingDay: null, updatedAt: entry.addedAt, ...entry }
  }
  return { entries }
}

/** Applies `change` to one entry and stamps updatedAt; an unknown id leaves the state as it is. */
function patchEntry(
  state: WatchlistState,
  id: number,
  change: (entry: WatchlistEntry) => Partial<WatchlistEntry>,
): Partial<WatchlistState> {
  const entry = state.entries[id]
  if (!entry) return state
  const next = { ...entry, ...change(entry), updatedAt: new Date().toISOString() }
  return { entries: { ...state.entries, [id]: next } }
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      entries: {},
      add: (show) => {
        if (get().entries[show.id]) return
        const now = new Date().toISOString()
        const entry: WatchlistEntry = {
          id: show.id,
          title: show.title,
          imageUrl: show.imageUrl,
          studio: show.studio,
          airingDay: show.airingDay,
          episodes: show.episodes,
          status: 'plan-to-watch',
          progress: 0,
          addedAt: now,
          updatedAt: now,
        }
        set((state) => ({ entries: { ...state.entries, [show.id]: entry } }))
      },
      has: (id) => id in get().entries,
      setStatus: (id, status) =>
        set((state) =>
          patchEntry(state, id, (entry) =>
            status === 'completed' && entry.episodes !== null
              ? { status, progress: entry.episodes }
              : { status },
          ),
        ),
      step: (id, delta) =>
        set((state) =>
          patchEntry(state, id, (entry) => {
            const progress = Math.min(
              entry.episodes ?? Infinity,
              Math.max(0, entry.progress + delta),
            )
            const starts = delta === 1 && entry.status === 'plan-to-watch'
            return starts ? { progress, status: 'watching' } : { progress }
          }),
        ),
    }),
    {
      name: 'senpai.watchlist',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ entries: state.entries }),
      migrate: migrateWatchlist,
    },
  ),
)
