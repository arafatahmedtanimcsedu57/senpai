# Tasks

Estimated reviewable lines: 370

## 1. Primitives

- [x] 1.1 Add the shadcn `button` (`npx shadcn@latest add button`) → `src/components/ui/button.tsx`; adjust variants/sizes to the design (primary, secondary = pink text on secondary, outline; 44/36px). Verify with `button.test.tsx` (renders each variant as a `<button>`).
- [x] 1.2 `src/components/CoverImage.tsx`: 2:3 image, `loading="lazy"`, alt = title; placeholder with the first letter when `src` is null or on error. Verify with `CoverImage.test.tsx` (null src → placeholder; `error` event → placeholder).

## 2. Season UI

- [x] 2.1 `SeasonHeader.tsx` (eyebrow "THIS SEASON", `h1` label, "N shows", prev/next links with season-name aria-labels). Verify with a component test (links point to `/season/2026/summer` and `/season/2027/winter` from Fall 2026).
- [x] 2.2 `ShowCard.tsx` + `AddToWatchlistButton.tsx` ("studio · day · N eps", "? eps", missing parts omitted; add → "In watchlist", disabled). Verify with component tests using `renderWithStore` + `useWatchlistStore`.
- [x] 2.3 `ShowGrid.tsx`, `ShowGridSkeleton.tsx`, `SeasonMessage.tsx` (empty + error with Retry calling `refetch`). Verify with component tests by role/text.

## 3. Page + wiring

- [x] 3.1 `src/routes/SeasonPage.tsx` (params → season, 404 on malformed, states from `useGetSeasonQuery`); `routes.tsx`: index + `season/:year/:season` lazy → `SeasonPage`; remove `HomePage.tsx` and update `routes.test.tsx`. Verify with `SeasonPage.test.tsx` via `renderRoute` + MSW (default grid, empty season, 500 → error → Retry → grid, `/season/2025/autumn` → Page not found).
- [x] 3.2 `e2e/season-browser.spec.ts`: home grid, next season changes heading + URL, add to watchlist survives reload, axe on default/empty/error (MSW overrides). Update `e2e/smoke.spec.ts` for the new home heading. Verify with `npm run test:e2e`.
- [x] 3.3 Visual self-check: screenshots of Default/Loading/Empty/Error at 390 and 1280 in `openspec/changes/season-browser-ui/screenshots/`, compared with the artboards; list remaining differences for the PR. Verify `npm run check` and `npm run build` pass.

approved: arafat, 2026-09-29
