import { describe, expect, it } from 'vitest'
import {
  isSameSeason,
  isSeasonName,
  parseSeasonParams,
  nextSeason,
  prevSeason,
  seasonLabel,
  seasonOf,
  seasonPath,
} from './season'

describe('seasonOf', () => {
  it.each([
    [0, 'winter'],
    [2, 'winter'],
    [3, 'spring'],
    [5, 'spring'],
    [6, 'summer'],
    [8, 'summer'],
    [9, 'fall'],
    [11, 'fall'],
  ])('month index %i is %s', (month, season) => {
    expect(seasonOf(new Date(2026, month, 15))).toEqual({ year: 2026, season })
  })
})

describe('prevSeason / nextSeason', () => {
  it('steps within a year', () => {
    expect(nextSeason({ year: 2026, season: 'spring' })).toEqual({ year: 2026, season: 'summer' })
    expect(prevSeason({ year: 2026, season: 'summer' })).toEqual({ year: 2026, season: 'spring' })
  })

  it('wraps across years', () => {
    expect(nextSeason({ year: 2026, season: 'fall' })).toEqual({ year: 2027, season: 'winter' })
    expect(prevSeason({ year: 2026, season: 'winter' })).toEqual({ year: 2025, season: 'fall' })
  })
})

describe('seasonLabel', () => {
  it('capitalises the season', () => {
    expect(seasonLabel({ year: 2026, season: 'fall' })).toBe('Fall 2026')
  })
})

describe('isSeasonName', () => {
  it('accepts the four seasons only', () => {
    expect(isSeasonName('summer')).toBe(true)
    expect(isSeasonName('autumn')).toBe(false)
  })
})

describe('seasonPath / isSameSeason', () => {
  it('builds the season URL', () => {
    expect(seasonPath({ year: 2027, season: 'winter' })).toBe('/season/2027/winter')
  })

  it('compares seasons by year and name', () => {
    expect(isSameSeason({ year: 2026, season: 'fall' }, { year: 2026, season: 'fall' })).toBe(true)
    expect(isSameSeason({ year: 2026, season: 'fall' }, { year: 2025, season: 'fall' })).toBe(false)
  })
})

describe('parseSeasonParams', () => {
  it('reads a valid year and season', () => {
    expect(parseSeasonParams({ year: '2025', season: 'spring' })).toEqual({
      year: 2025,
      season: 'spring',
    })
  })

  it.each([
    [{ year: '2025', season: 'autumn' }],
    [{ year: '25', season: 'fall' }],
    [{ year: 'abcd', season: 'fall' }],
    [{}],
  ])('rejects %j', (params) => {
    expect(parseSeasonParams(params)).toBeNull()
  })
})
