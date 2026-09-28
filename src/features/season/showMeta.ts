import type { Show } from '@/types/anime'

/** "Madhouse · Fridays · 28 eps"; unknown parts are left out, an unknown count is "? eps". */
export function showMeta({ studio, airingDay, episodes }: Show) {
  return [studio, airingDay, `${episodes ?? '?'} eps`].filter(Boolean).join(' · ')
}
