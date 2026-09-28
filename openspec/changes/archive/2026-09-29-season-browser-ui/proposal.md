# Proposal

Risk tier: medium

Split 2 of 3 for the Season browser feature.
depends on: season-contract

## Why

Fans need to see what's airing this season and add shows to their watchlist. This is the
app's home screen and the entry point to the other two features.

## What Changes

- The home page (`/`) shows the current season as a grid of show cards, as drawn in the
  Claude Design page `season-browser`: cover, title, studio · airing day · episodes, and
  "Add to watchlist" / "In watchlist".
- `/season/:year/:season` shows any other season; the previous and next arrows move between them.
- Loading (skeleton cards), Empty ("No shows found for this season.") and Error ("Could not
  load the season. Try again." + Retry) states.
- A shared cover image with a placeholder for a missing or broken cover.
- The shadcn/ui `Button` primitive, installed via the shadcn CLI (its dependencies are
  already installed).

## Capabilities

### New Capabilities

- `season-browser`: browsing a season's shows, moving between seasons, and adding shows to
  the watchlist from the grid.

### Modified Capabilities

None.

## Impact

- New: `src/routes/SeasonPage.tsx`, `src/features/season/components/*`,
  `src/components/CoverImage.tsx`, `src/components/ui/button.tsx`.
- `src/routes/routes.tsx`: the index route and `season/:year/:season` render `SeasonPage`.
  The placeholder `HomePage` is removed.
- `e2e/`: a season-browser spec (grid, next/prev, add to watchlist, axe per state).

## Non-goals

- The featured hero on the Default artboards (`season-hero`).

- The app header and nav, and the show detail page (`show-detail`). Until then, cards
  don't link anywhere.
- Filters and sorting (open in `features.md`).
- Removing a show from the watchlist (Watchlist feature).

## Open questions

Answered by arafat, 2026-09-29: all defaults accepted, including three about the featured hero
the human added to the Default artboards after `/feature`:

- The hero goes in a new change, `season-hero`, after `show-detail`. This change ships the grid
  without it and lists the hero under "Differences from the design".
- The featured show is the season's most popular.
- The hero image is the show's trailer thumbnail when there is one, else the poster. That adds
  an optional contract field, done in `season-hero`.

1. URLs? **Default: `/` is the current season, `/season/2026/fall` is any season, and a
   malformed year or season shows the existing "Page not found".**
2. How far can prev / next go? **Default: no limit. A season Jikan has nothing for shows
   the Empty state.**
3. The design shows a count ("42 shows") under the season title; `features.md` doesn't
   mention it. **Default: keep it.**
4. Once added, is "In watchlist ✓" clickable (to remove)? **Default: no. It's a disabled
   state here; removing happens on the Watchlist page.**
