import { describe, expect, it } from 'vitest'
import type { Show } from '../types/anime'
import { useWatchlistStore } from './useWatchlistStore'

const show: Show = {
  id: 57334,
  title: 'Dan Da Dan',
  imageUrl: null,
  studio: 'Science SARU',
  airingDay: 'Thursdays',
  episodes: 12,
  genres: [],
  synopsis: null,
  url: 'https://myanimelist.net/anime/57334',
  members: 1,
}

describe('useWatchlistStore', () => {
  it('adds a show as "Plan to watch" with no episodes watched', () => {
    useWatchlistStore.getState().add(show)
    expect(useWatchlistStore.getState().has(show.id)).toBe(true)
    expect(useWatchlistStore.getState().entries[show.id]).toMatchObject({
      title: 'Dan Da Dan',
      episodes: 12,
      status: 'plan-to-watch',
      progress: 0,
    })
  })

  it('leaves a show that is already on the list unchanged', () => {
    const { add } = useWatchlistStore.getState()
    add(show)
    useWatchlistStore.setState((state) => ({
      entries: { ...state.entries, [show.id]: { ...state.entries[show.id], progress: 5 } },
    }))
    add({ ...show, title: 'Changed' })
    expect(Object.keys(useWatchlistStore.getState().entries)).toHaveLength(1)
    expect(useWatchlistStore.getState().entries[show.id]).toMatchObject({
      title: 'Dan Da Dan',
      progress: 5,
    })
  })

  it('saves the list to localStorage so it survives a reload', () => {
    useWatchlistStore.getState().add(show)
    const saved = JSON.parse(localStorage.getItem('senpai.watchlist')!)
    expect(saved).toMatchObject({ version: 1, state: { entries: { [show.id]: { id: show.id } } } })
  })

  it('does not know shows that were never added', () => {
    expect(useWatchlistStore.getState().has(1)).toBe(false)
  })
})
