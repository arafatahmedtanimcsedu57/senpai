# Proposal

Risk tier: medium

Split 1 of 2 for Watchlist + episode tracking (`features.md`). Next: `watchlist-actions`.

## Why

Shows can be added from the season page, but there's nowhere to see them or track episodes.
This builds the Watchlist page as drawn.

## What Changes

- `/watchlist`, plus a "Watchlist" item in the main nav.
- Status tabs (Watching / Plan to watch / Completed / Dropped), each with its count.
- One row per show:
  - cover and title (linking to the detail page)
  - studio · day (desktop)
  - a progress bar and "5 / 12" with −1 / +1
  - a status select
- Empty state: "Your watchlist is empty — browse this season" with a "Browse this season" link.
- Store: set status and step progress (bounded; there's no upper bound when the total is
  unknown). Saved entries now also keep the studio and airing day (data version 1 → 2, with a
  migration).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `watchlist`: adds viewing the list by status, tracking progress and changing status.

## Impact

- `src/stores/useWatchlistStore.ts` (actions + v2 migration), `src/types/anime.ts`.
- New: `src/routes/WatchlistPage.tsx`, `src/features/watchlist/components/{StatusTabs,WatchlistRow,
EpisodeStepper,WatchlistEmpty}.tsx`, `src/features/watchlist/status.ts` (labels, order).
- `src/components/AppNav.tsx` (+ item), `src/routes/routes.tsx` (+ `watchlist` route).
- No new dependencies (`radix-ui` Tabs is already installed).

## Non-goals

- Remove + undo, "Mark as completed?", and the save-error toast (`watchlist-actions`).
- Sorting and search; syncing across devices.

## Open questions

Answered by arafat, 2026-09-29: all seven defaults accepted, including the saved-data v1 → v2 migration.

1. Which tab opens first? **Default: the first tab with shows, in the order Watching → Plan to
   watch → Completed → Dropped.**
2. A tab with no shows (while other tabs have some) isn't drawn. **Default: "No shows here yet."**
3. +1 on a "Plan to watch" show. **Default: it moves to Watching.**
4. The mobile artboard has no status select. **Default: show it on mobile too, under the title.**
5. Order inside a tab. **Default: most recently added first.**
6. Setting the status to Completed. **Default: progress jumps to the total when the total is known.**
7. The desktop rows show "studio · day", which saved entries don't have yet. **Default: store it from
   now on; existing entries are migrated with both unknown, so their line is left out.**
