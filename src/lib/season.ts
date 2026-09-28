import type { SeasonId, SeasonName } from '../types/anime'

// Anime seasons follow the calendar quarters: Jan–Mar winter … Oct–Dec fall.
const ORDER: readonly SeasonName[] = ['winter', 'spring', 'summer', 'fall']

export function isSeasonName(value: string): value is SeasonName {
  return (ORDER as readonly string[]).includes(value)
}

export function seasonOf(date: Date): SeasonId {
  return { year: date.getFullYear(), season: ORDER[Math.floor(date.getMonth() / 3)] }
}

function shift({ year, season }: SeasonId, by: 1 | -1): SeasonId {
  const index = ORDER.indexOf(season) + by
  if (index < 0) return { year: year - 1, season: 'fall' }
  if (index >= ORDER.length) return { year: year + 1, season: 'winter' }
  return { year, season: ORDER[index] }
}

export const prevSeason = (id: SeasonId) => shift(id, -1)
export const nextSeason = (id: SeasonId) => shift(id, 1)

/** "Fall 2026" */
export function seasonLabel({ year, season }: SeasonId) {
  return `${season[0].toUpperCase()}${season.slice(1)} ${year}`
}
