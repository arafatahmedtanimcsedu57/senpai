# Tasks

Estimated reviewable lines: 240

## 1. Contract

- [x] 1.1 Zod schemas for the raw Jikan anime object, season page (`data` + `pagination`) and single-anime response in `src/features/season/schema.ts`, plus the `Show`/`SeasonId` types in `src/features/season/types.ts` and a `toShow` mapper. Verify with `schema.test.ts` (valid fixture parses; missing `mal_id` throws; `title_english` null → default title; null episodes → null).
- [x] 1.2 Fixtures in `src/mocks/fixtures/anime.ts` (~12 raw objects parsed through the schema, one duplicate, one with no episodes, one with no English title). MSW handlers for `GET /seasons/:year/:season` (2 pages; other seasons → empty) and `GET /anime/:id` (404 when unknown) in `src/mocks/handlers.ts`. Verify by running `npm run test` (setup uses `onUnhandledRequest: 'error'`).

## 2. Logic

- [x] 2.1 `src/lib/season.ts`: `seasonOf(date)`, `prevSeason`, `nextSeason`, `seasonLabel`, `isSeasonName`. Verify with `season.test.ts` covering every month boundary and both year wraps.
- [x] 2.2 `src/features/season/api.ts`: inject `getSeason({year, season})` (queryFn: all pages, 350 ms spacing, one 429 retry, dedupe, sort by members) and `getAnime(id)` (transformResponse guard) into `services/api`, with a `Show` tag. Verify with `api.test.ts` against MSW (two pages merged + deduped + sorted; empty season → []; malformed payload → error; 404 → error with status 404; one 429 then 200 → success).
- [x] 2.3 `src/stores/useWatchlistStore.ts` (Zustand `persist`, key `senpai.watchlist`, v1) with `add(show)` and `has(id)`; reset it in `src/test/setup.ts`. Verify with `useWatchlistStore.test.ts` (add → Plan to watch / 0; add twice → unchanged; state is written to localStorage).

## 3. Docs + wiring

- [x] 3.1 `.env.example`: comment showing `VITE_API_URL=https://api.jikan.moe/v4` with `VITE_API_MOCKING=disabled` for real data. Verify `npm run dev` with mocking enabled still serves the fixtures (`/api/seasons/2026/fall`).
- [x] 3.2 Run `npm run check`. Verify it is green with coverage floors met.

approved: arafat, 2026-09-29
