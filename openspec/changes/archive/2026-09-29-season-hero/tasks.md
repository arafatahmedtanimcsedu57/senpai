# Tasks

Estimated reviewable lines: 190

## 1. Contract

- [x] 1.1 Add optional `trailer.images` to `jikanAnimeSchema` and `bannerUrl` to `toShow` / `Show`; add trailer images to a few fixtures (one without). Verify with `schema.test.ts` (maximum → large → null fallback).

## 2. UI

- [x] 2.1 `AddToWatchlistButton`: `look: 'card' | 'detail' | 'hero'` (replaces `prominent`) and on the hero an accessible name "Add to watchlist: <title>" / "In watchlist: <title>" (visible words first, WCAG 2.5.3). Update the existing tests plus a hero case.
- [x] 2.2 `src/features/season/components/SeasonHero.tsx` per both Default artboards (badge, h2, meta, 2-line synopsis on desktop, add + "More info" link; poster on mobile, `bannerUrl` ?? poster on desktop). Verify with `SeasonHero.test.tsx` (content, "More info" href, badge for another season, poster fallback).
- [x] 2.3 `RootLayout`: route `handle.heroHeader` → a transparent overlaid header with a top gradient at desktop; unchanged elsewhere. Set the handle on the index + season routes. Verify with a `routes.test.tsx` / `RootLayout` test (header styles switch by handle).

## 3. Page + integration

- [x] 3.1 `SeasonPage`: render `SeasonHero` for `shows[0]` when there are shows; pull the header row up 96px on desktop; top padding when there's no hero under the overlaid header. Verify with `SeasonPage.test.tsx` (hero features the most popular show; no hero while empty or on error; add from hero updates its card).
- [x] 3.2 `e2e/season-browser.spec.ts`: hero "More info" → detail; axe on Default still clean. Verify with `npm run test:e2e`.
- [x] 3.3 Visual self-check: Default at 390 and 1280 vs the artboards in `openspec/changes/season-hero/screenshots/`; header contrast over the hero ≥ 4.5:1. Verify `npm run check` + `npm run build`.

approved: arafat, 2026-09-29
