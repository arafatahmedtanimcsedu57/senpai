# Design

## Context

`architecture.md` → API contract fixes Jikan v4, case 1 (partial): hand-written RTK Query
endpoints, Zod schemas of only the fields we use, `transformResponse` guard, MSW in dev and
tests. Jikan limits clients to 3 requests/s and 60/min, needs no auth and allows CORS. There
is no UI in this change; nothing here is drawn on the canvas.

## Goals / Non-Goals

**Goals:** one typed source of show data for all three features; mocks that can't drift
from the schema; a watchlist store the later features extend without migrating data.

**Non-Goals:** caching beyond RTK Query's defaults; offline support; retry and backoff
beyond a single 429 retry.

## Decisions

- **Endpoints use `/seasons/{year}/{season}` only, never `/seasons/now`.** The route and
  label need the year and season up front, and `src/lib/season.ts` computes them from the
  date. One endpoint shape is simpler to mock. (Alternative: `/seasons/now` for home. That
  needs a second code path and doesn't say which season it returned.)
- **Every page is fetched in one `queryFn`.** It loops over `page=1..last_visible_page`
  with `filter=tv&sfw=true&limit=25`, about 350 ms apart to stay under 3 requests/s, then
  de-duplicates by `mal_id` and sorts by `members` descending. It retries once after 1 s on
  a 429. The cache key is `{year, season}`. (Alternative: infinite scroll or "Show more".
  That isn't in the design and adds UI states.)
- **Zod parses raw Jikan and maps to `Show`** (`src/features/season/types.ts`). Components
  never see Jikan's shape. `transformResponse` / the `queryFn` call `schema.parse`, so drift
  throws and RTK Query surfaces it as an error, which the UI shows in its Error state.
- **Field mapping:**
  - `title_english ?? title`
  - `images.webp.large_image_url ?? images.jpg.large_image_url ?? null`
  - `studios[0]?.name ?? null`
  - `broadcast.day` (Jikan already says "Fridays") `?? null`
  - `episodes ?? null`
  - `genres[].name`
  - `synopsis ?? null`
  - `url`
  - `members ?? 0`
- **Not found:** `getAnime` passes RTK Query's `{status: 404}` error through, and
  `show-detail` checks `status === 404`.
- **Watchlist store** is `src/stores/useWatchlistStore.ts`, shared because three features
  use it. It's Zustand with `persist` under localStorage key `senpai.watchlist`, version 1,
  and holds `entries: Record<id, {id, title, imageUrl, episodes, status, progress, addedAt}>`.
  This change only needs `add` and `has`. The full entry shape is defined now so the
  Watchlist feature needs no migration.
- **Mocks:** `src/mocks/fixtures/anime.ts` holds about 12 raw Jikan objects parsed through
  the schema. Handlers serve `GET {apiBaseUrl}/seasons/:year/:season` (split into two pages
  to exercise paging; an empty list for any other season) and `GET {apiBaseUrl}/anime/:id`
  (404 when unknown). Both honour `page`.

## Risks / Trade-offs

- [A large season (~60 TV shows, 3 pages) takes about 1 s to load] → acceptable in v1, and
  the Loading skeleton covers it; revisit if filters add formats.
- [Jikan is community-run and sometimes slow or down] → the Error state plus Retry; RTK
  Query keeps a loaded season cached for 60 s by default.
- [A localStorage shape change later] → `persist` `version` + `migrate` are in place from day one.
