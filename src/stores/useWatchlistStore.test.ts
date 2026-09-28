import { describe, expect, it } from 'vitest'
import type { Show } from '../types/anime'
import { migrateWatchlist, useWatchlistStore } from './useWatchlistStore'

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
      studio: 'Science SARU',
      airingDay: 'Thursdays',
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
    expect(saved).toMatchObject({ version: 2, state: { entries: { [show.id]: { id: show.id } } } })
  })

  it('does not know shows that were never added', () => {
    expect(useWatchlistStore.getState().has(1)).toBe(false)
  })

  describe('step', () => {
    const at = (progress: number, patch: Partial<Show> = {}, status = 'watching' as const) => {
      useWatchlistStore.getState().add({ ...show, ...patch })
      useWatchlistStore.setState((state) => ({
        entries: { ...state.entries, [show.id]: { ...state.entries[show.id], progress, status } },
      }))
    }
    const entry = () => useWatchlistStore.getState().entries[show.id]

    it('adds one watched episode and saves it', () => {
      at(5)
      useWatchlistStore.getState().step(show.id, 1)
      expect(entry().progress).toBe(6)
      const saved = JSON.parse(localStorage.getItem('senpai.watchlist')!)
      expect(saved.state.entries[show.id].progress).toBe(6)
    })

    it('never goes below 0 or above the total', () => {
      at(0)
      useWatchlistStore.getState().step(show.id, -1)
      expect(entry().progress).toBe(0)
      at(12)
      useWatchlistStore.getState().step(show.id, 1)
      expect(entry().progress).toBe(12)
    })

    it('has no upper bound when the total is unknown', () => {
      at(40, { episodes: null })
      useWatchlistStore.getState().step(show.id, 1)
      expect(entry().progress).toBe(41)
    })

    it('moves a planned show to Watching on the first +1', () => {
      useWatchlistStore.getState().add(show)
      useWatchlistStore.getState().step(show.id, 1)
      expect(entry()).toMatchObject({ progress: 1, status: 'watching' })
    })

    it('touches updatedAt', () => {
      at(5)
      useWatchlistStore.setState((state) => ({
        entries: { ...state.entries, [show.id]: { ...entry(), updatedAt: '2000-01-01T00:00:00Z' } },
      }))
      useWatchlistStore.getState().step(show.id, -1)
      expect(entry().updatedAt).not.toBe('2000-01-01T00:00:00Z')
    })

    it('ignores shows that are not on the list', () => {
      useWatchlistStore.getState().step(1, 1)
      expect(useWatchlistStore.getState().entries).toEqual({})
    })
  })

  describe('setStatus', () => {
    it('sets the status', () => {
      useWatchlistStore.getState().add(show)
      useWatchlistStore.getState().setStatus(show.id, 'dropped')
      expect(useWatchlistStore.getState().entries[show.id]).toMatchObject({
        status: 'dropped',
        progress: 0,
      })
    })

    it('marks every episode watched when completing a show with a known total', () => {
      useWatchlistStore.getState().add(show)
      useWatchlistStore.getState().step(show.id, 1)
      useWatchlistStore.getState().setStatus(show.id, 'completed')
      expect(useWatchlistStore.getState().entries[show.id]).toMatchObject({
        status: 'completed',
        progress: 12,
      })
    })

    it('keeps the count when completing a show with an unknown total', () => {
      useWatchlistStore.getState().add({ ...show, episodes: null })
      useWatchlistStore.getState().step(show.id, 1)
      useWatchlistStore.getState().setStatus(show.id, 'completed')
      expect(useWatchlistStore.getState().entries[show.id].progress).toBe(1)
    })
  })

  describe('migration from v1', () => {
    const v1Entry = {
      id: 57334,
      title: 'Dan Da Dan',
      imageUrl: null,
      episodes: 12,
      status: 'watching',
      progress: 5,
      addedAt: '2026-09-01T10:00:00.000Z',
    }

    it('keeps every entry and fills in the new fields', () => {
      const migrated = migrateWatchlist(
        { entries: { 57334: v1Entry, 1: { ...v1Entry, id: 1 } } },
        1,
      )
      expect(Object.keys(migrated.entries)).toHaveLength(2)
      expect(migrated.entries[57334]).toEqual({
        ...v1Entry,
        studio: null,
        airingDay: null,
        updatedAt: v1Entry.addedAt,
      })
    })

    it('never throws on a malformed v1 list', () => {
      expect(migrateWatchlist(null, 1)).toEqual({ entries: {} })
      expect(migrateWatchlist({ entries: { 1: null, 57334: v1Entry } }, 1).entries).toEqual({
        57334: expect.objectContaining({ id: 57334, progress: 5 }),
      })
    })

    it('loads a saved v1 list on rehydrate', async () => {
      localStorage.setItem(
        'senpai.watchlist',
        JSON.stringify({ version: 1, state: { entries: { 57334: v1Entry } } }),
      )
      await useWatchlistStore.persist.rehydrate()
      expect(useWatchlistStore.getState().entries[57334]).toMatchObject({
        progress: 5,
        status: 'watching',
        studio: null,
      })
    })
  })
})
