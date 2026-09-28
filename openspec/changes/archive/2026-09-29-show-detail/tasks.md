# Tasks

Estimated reviewable lines: 290

## 1. Contract touch-up

- [x] 1.1 Add optional `season`/`year` to the Jikan schema + `toShow` in `src/features/season/schema.ts` and to `Show` in `src/types/anime.ts`. Verify with a `schema.test.ts` case (present → mapped; absent or unknown → null).

## 2. App shell

- [x] 2.1 `src/components/AppNav.tsx` (typed items; "Season" only; header on desktop, bottom tab bar on mobile; `aria-current`) and the wordmark header in `src/routes/RootLayout.tsx`. Verify with `AppNav.test.tsx` (Season is current on `/`, `/season/2025/spring` and `/anime/1`; wordmark links to `/`).

## 3. Detail page

- [x] 3.1 `GenreChips.tsx` and `ShowFacts.tsx` (`<dl>`: Episodes / Airs / Studio / Season; "?" episodes; missing facts omitted). Verify with component tests.
- [x] 3.2 `src/routes/ShowDetailPage.tsx` (back link, cover, title, chips, facts, synopsis, `AddToWatchlistButton`, external MAL link; loading skeleton, error + Retry, 404 → "This show doesn't exist."); `routes.tsx` gets a lazy `anime/:id` route. Verify with `ShowDetailPage.test.tsx` via `renderRoute` + MSW (content, add, 404 copy, 500 → Retry → content, `/anime/abc` → Page not found).
- [x] 3.3 `ShowCard.tsx`: cover + title link to `/anime/:id`. The add button stays outside the link. Update `ShowCard.test.tsx` (link href; button still adds).

## 4. Integration

- [x] 4.1 `e2e/show-detail.spec.ts`: season → card → detail → add → back → the card reads "In watchlist"; axe on the detail page and the 404 state. Verify with `npm run test:e2e`.
- [x] 4.2 Visual self-check of Detail at 390 and 1280 plus the header/tab bar on Default, in `openspec/changes/show-detail/screenshots/`. Verify `npm run check` and `npm run build` pass.

approved: arafat, 2026-09-29
