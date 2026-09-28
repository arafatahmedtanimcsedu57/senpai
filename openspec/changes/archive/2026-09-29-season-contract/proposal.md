# Proposal

Risk tier: medium

Split 1 of 3 for the Season browser feature (`features.md` → Season browser). Next:
`season-browser-ui`, then `show-detail`.

## Why

The Season browser, Watchlist and Tier list all need show data from Jikan and a place to
keep the user's watchlist. This change establishes that contract and data layer first, so
the UI changes build against a typed, validated, mocked source.

## What Changes

- Zod schemas for the Jikan v4 fields we use (season list page, single anime), mapped to a
  small app-level `Show` type.
- RTK Query endpoints: a season's shows (every page, de-duplicated, most popular first) and
  one show by id. Each response is checked by the Zod schema at runtime.
- Pure season helpers: the current season from a date, previous and next season, and a
  label such as "Fall 2026".
- MSW handlers + fixtures for both endpoints, valid against the schemas, used in dev and tests.
- A persisted watchlist store (browser localStorage) with `add` and `has`. The Watchlist
  feature extends it later.
- `.env.example` documents pointing `VITE_API_URL` at Jikan.

## Capabilities

### New Capabilities

- `anime-catalog`: reading a season's shows and a single show from Jikan, with contract
  validation and error handling.
- `watchlist`: remembering which shows the user added, across reloads, on this device.

### Modified Capabilities

None.

## Impact

- New: `src/features/season/{schema,types,api}.ts`, `src/lib/season.ts`,
  `src/stores/useWatchlistStore.ts`, `src/mocks/fixtures/anime.ts`, plus handlers in
  `src/mocks/handlers.ts`.
- `src/test/setup.ts` resets the watchlist store between tests.
- No UI. No new dependencies (Zustand `persist` ships with zustand).

## Non-goals

- Any screen: that's `season-browser-ui` and `show-detail`.
- Watchlist status, progress, removal and syncing between devices (Watchlist feature).
- Filters and sorting controls.

## Open questions

Answered by arafat, 2026-09-29: all four defaults accepted.

1. Which formats does a season list include? **Default: TV only (Jikan `filter=tv`).** Movies,
   ONAs and specials wait for the filters decision.
2. Which title is shown? **Default: the English title when Jikan has one, else the default
   (romaji) title.**
3. What order are shows in? **Default: most popular first (MAL members).**
4. What status does a show get when added from the season? **Default: "Plan to watch", 0
   episodes watched.**
