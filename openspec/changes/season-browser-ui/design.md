# Design

## Context

Built on `season-contract` (`useGetSeasonQuery`, `useWatchlistStore`, `src/lib/season.ts`).
Tailwind 4 + shadcn/ui; tokens are already in `src/styles/index.css` (`bg-primary`,
`bg-secondary`, `text-muted-foreground`, `font-heading`, `bg-muted`).

Claude Design: [senpai canvas](https://claude.ai/artifact/BBAn1TPTZbbKJqqXAgCxbY) → page
"Season browser". Artboards implemented:

- `season-browser/Default-mobile.dc.html`, `season-browser/Default-desktop.dc.html`
- `season-browser/Loading-mobile.dc.html`, `season-browser/Loading-desktop.dc.html`
- `season-browser/Empty-mobile.dc.html`, `season-browser/Empty-desktop.dc.html`
- `season-browser/Error-mobile.dc.html`, `season-browser/Error-desktop.dc.html`

The `Detail-*` artboards and the header / tab bar are `show-detail`'s.

## Goals / Non-Goals

**Goals:** match the artboards at 390 and 1280; a keyboard- and screen-reader-friendly grid.

**Non-Goals:** virtualised lists (a season is fewer than 100 cards); image optimisation
beyond `loading="lazy"`.

## Decisions

- **Route params are the state.** `SeasonPage` reads `:year/:season` (missing → `seasonOf(new
Date())`) and validates them with `isSeasonName` and a 4-digit year, throwing a 404
  response otherwise, so the existing `RouteError` renders "Page not found". The arrows are
  `<Link>`s to the adjacent season, which gives back/forward history for free. No Zustand
  state is needed.
- **Components** (`src/features/season/components/`):
  - `SeasonHeader`: eyebrow, `h1`, count, and the two arrow links with `aria-label`
    "Previous season: Summer 2026".
  - `ShowCard`: an `<article>` with an `h2` title clamped to 2 lines.
  - `ShowGrid`: 2 columns under the `desktop` breakpoint, 5 at or above it.
  - `ShowGridSkeleton`: `role="status"`, `aria-label="Loading shows"`.
  - `SeasonMessage`: the empty and error messages.
  - `AddToWatchlistButton`: a narrow store selector on `has(id)`.

  `CoverImage` is shared (`src/components/`) because Watchlist and Tier list reuse it. It
  renders the 2:3 image with a `bg-muted` placeholder and the first letter on missing or
  `onError`.

- **Button**: shadcn `button.tsx` with variants mapped to the design:
  - `default` = primary
  - `secondary` = secondary bg with primary text (card "Add to watchlist")
  - `outline` = done / ghost

  Sizes are `default` 44px and `sm` 36px, to keep touch targets at 44px.

- **Error vs empty:** any `isError` → Error (including contract drift); `data.length === 0` → Empty.

## Risks / Trade-offs

- [Cover images come from MAL's CDN (cdn.myanimelist.net)] → fine with no CSP today; note it
  if a CSP is added.
- [Without the header (arrives in `show-detail`) the page is chrome-less for one PR] → the
  PR's "Differences from the design" section says so.
