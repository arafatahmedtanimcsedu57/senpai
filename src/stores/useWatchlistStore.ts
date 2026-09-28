import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Show, WatchlistEntry } from '../types/anime'

// The user's watchlist, kept in this browser only (architecture.md → user data). Bump
// `version` and add `migrate` when the entry shape changes.
interface WatchlistState {
  entries: Record<number, WatchlistEntry>
  /** Adds the show as "Plan to watch"; a show already on the list is left as it is. */
  add: (show: Show) => void
  has: (id: number) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      entries: {},
      add: (show) => {
        if (get().entries[show.id]) return
        const entry: WatchlistEntry = {
          id: show.id,
          title: show.title,
          imageUrl: show.imageUrl,
          episodes: show.episodes,
          status: 'plan-to-watch',
          progress: 0,
          addedAt: new Date().toISOString(),
        }
        set((state) => ({ entries: { ...state.entries, [show.id]: entry } }))
      },
      has: (id) => id in get().entries,
    }),
    {
      name: 'senpai.watchlist',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
)
