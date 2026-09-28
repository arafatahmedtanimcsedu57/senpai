import { describe, expect, it } from 'vitest'
import type { WatchlistEntry } from '@/types/anime'
import { firstNonEmptyStatus, groupByStatus, isWatchStatus } from './status'

function entry(id: number, patch: Partial<WatchlistEntry> = {}): WatchlistEntry {
  return {
    id,
    title: `Show ${id}`,
    imageUrl: null,
    studio: null,
    airingDay: null,
    episodes: 12,
    status: 'watching',
    progress: 0,
    addedAt: `2026-09-0${id}T00:00:00.000Z`,
    updatedAt: `2026-09-0${id}T00:00:00.000Z`,
    ...patch,
  }
}

describe('groupByStatus', () => {
  it('groups entries by status, most recently added first', () => {
    const groups = groupByStatus({
      1: entry(1),
      2: entry(2, { status: 'dropped' }),
      3: entry(3),
    })
    expect(groups.watching.map((e) => e.id)).toEqual([3, 1])
    expect(groups.dropped.map((e) => e.id)).toEqual([2])
    expect(groups['plan-to-watch']).toEqual([])
    expect(groups.completed).toEqual([])
  })
})

describe('firstNonEmptyStatus', () => {
  it('picks the first status in tab order that has shows', () => {
    expect(firstNonEmptyStatus(groupByStatus({ 1: entry(1, { status: 'completed' }) }))).toBe(
      'completed',
    )
    expect(
      firstNonEmptyStatus(
        groupByStatus({
          1: entry(1, { status: 'dropped' }),
          2: entry(2, { status: 'plan-to-watch' }),
        }),
      ),
    ).toBe('plan-to-watch')
  })

  it('falls back to Watching for an empty list', () => {
    expect(firstNonEmptyStatus(groupByStatus({}))).toBe('watching')
  })
})

describe('isWatchStatus', () => {
  it('accepts only the four statuses', () => {
    expect(isWatchStatus('plan-to-watch')).toBe(true)
    expect(isWatchStatus('paused')).toBe(false)
  })
})
