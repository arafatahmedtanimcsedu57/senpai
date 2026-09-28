# Tasks

Estimated reviewable lines: 380

## 1. Store

- [x] 1.1 `WatchlistEntry` + `studio`, `airingDay`, `updatedAt`; store `version: 2` + `migrate` from v1; `add` stores studio/day. Verify with `useWatchlistStore.test.ts` (a v1 localStorage payload migrates with nothing lost).
- [x] 1.2 `setStatus` + `step` (clamping, plan-to-watch → watching on +1, Completed → progress = total). Verify with store tests for every scenario in the delta spec.

## 2. UI

- [x] 2.1 `src/features/watchlist/status.ts` (order + labels) and `StatusTabs.tsx` (radix Tabs as pills with counts). Verify with `StatusTabs.test.tsx` (counts, arrow-key focus, selection).
- [x] 2.2 `EpisodeStepper.tsx` + `WatchlistRow.tsx` (cover, title link, meta, bar, status select, stepper) per the Default artboards. Verify with component tests (bounds disabled, "? " total, select changes status).
- [x] 2.3 `WatchlistEmpty.tsx` (copy + "Browse this season" link). Verify with a component test.

## 3. Page + wiring

- [x] 3.1 `src/routes/WatchlistPage.tsx` (initial tab = first non-empty; empty tab copy; empty list) + `watchlist` lazy route + "Watchlist" nav item (`List` icon, matches `/watchlist`). Verify with `WatchlistPage.test.tsx` via `renderRoute` (seeded store) and `AppNav.test.tsx`.
- [x] 3.2 `e2e/watchlist.spec.ts`: add from season → Watchlist tab shows it → +1 → reload keeps it; empty state; axe on both. Verify with `npm run test:e2e`.
- [x] 3.3 Visual self-check: Default + Empty at 390 and 1280 in `openspec/changes/watchlist-page/screenshots/`. Verify `npm run check` + `npm run build`.

approved: arafat, 2026-09-29
