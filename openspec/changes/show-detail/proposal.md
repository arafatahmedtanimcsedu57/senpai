# Proposal

Risk tier: medium

Split 3 of 3 for the Season browser feature.
depends on: season-browser-ui

## Why

Clicking a card should open the show's details (synopsis, genres, episodes, a link to
MyAnimeList), and every page needs the app header and nav drawn on the canvas.

## What Changes

- An app header on every page, as drawn: the "senpai." wordmark (links home). On desktop the
  nav sits in the header; on mobile it's a bottom tab bar.
- `/anime/:id` is the show detail page, as drawn:
  - a back link to the season
  - cover, title, genre chips
  - Episodes / Airs / Studio / Season facts
  - the synopsis
  - "Add to watchlist"
  - "View on MyAnimeList"
- Season cards link to their detail page.

## Capabilities

### New Capabilities

- `show-detail`: viewing one show's details and adding it to the watchlist from there.
- `app-shell`: the header and navigation shared by every page.

### Modified Capabilities

None. The `season-browser` spec isn't archived yet; "card opens detail" is covered here.

## Impact

- `src/routes/RootLayout.tsx` (header, nav, tab bar), new `src/components/AppNav.tsx`.
- `src/features/season/schema.ts` + `src/types/anime.ts`: optional `season` / `year` on a show
  (Jikan already sends them), used by the back link.
- New `src/routes/ShowDetailPage.tsx`, `src/features/season/components/ShowFacts.tsx`, `GenreChips.tsx`.
- `ShowCard.tsx`: cover and title become a link to `/anime/:id`.
- `routes.tsx`: `anime/:id` lazy route.

## Non-goals

- Watchlist and Tier list pages (their nav items arrive with them).
- Related shows, trailers, characters, reviews.

## Open questions

Answered by arafat, 2026-09-29: all defaults accepted, including adding optional `season` / `year`
to the contract for the back link.

1. Nav items before Watchlist and Tier list exist? **Default: show only "Season" now; each
   later feature adds its own item, so no nav link leads to "Page not found".**
2. Detail page states aren't in `features.md` or the canvas. **Defaults:**
   - loading: skeleton in the detail layout
   - request fails: "Could not load this show. Try again." + Retry
   - unknown id (404): "This show doesn't exist." + a link back to the current season
3. What does the back link say? **Default: "Back to <season label>" for the show's own
   season (e.g. "Fall 2026"), linking to that season. With no season, "Back to this season".**
