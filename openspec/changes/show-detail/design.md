# Design

## Context

Builds on `season-contract` (`useGetAnimeQuery`, 404 passthrough) and `season-browser-ui`
(`CoverImage`, `AddToWatchlistButton`, `Button`, `ShowCard`).

Claude Design: [senpai canvas](https://claude.ai/artifact/BBAn1TPTZbbKJqqXAgCxbY) → page
"Season browser". Artboards implemented:

- `season-browser/Detail-mobile.dc.html`, `season-browser/Detail-desktop.dc.html`
- The header, nav and tab bar as drawn on every artboard of the page, e.g. `season-browser/Default-*.dc.html`.

The detail Loading / Error / Not-found states aren't drawn. They reuse the season page's
skeleton and message style (`SeasonMessage`) until the human adds artboards.

## Goals / Non-Goals

**Goals:** header and nav that later features extend by adding one item; a detail page
matching the artboards at 390 and 1280.

**Non-Goals:** a theme toggle; a nav for sections that don't exist yet.

## Decisions

- **Nav items are a typed array** in `AppNav.tsx` (`{ to, label, icon, match }`). Watchlist
  and Tier list append their own item. It renders `<nav aria-label="Main">` with `NavLink`
  (which sets `aria-current="page"`). It's placed in the header at ≥ `desktop` and fixed to
  the bottom below that. Main content gets bottom padding for the tab bar, using
  `env(safe-area-inset-bottom)`. Icons come from `lucide-react` (`LayoutGrid`), already a
  dependency.
- **"Season" matches `/`, `/season/*` and `/anime/*`** via `useMatch` checks, not path
  prefix alone, because the home route is `/`.
- **Detail data:** `useGetAnimeQuery(id)`. A non-numeric `:id` throws a 404 response, which
  RouteError shows as "Page not found". An API 404 shows "This show doesn't exist."
  (in-page, keeping the chrome). The back link goes to the show's own season when Jikan
  gives `season` + `year`, so `getAnime`'s mapping gains optional `season`/`year` (schema
  fields already optional in `season-contract`), else to `/`.
- **External link:** `<a href={url} target="_blank" rel="noopener noreferrer">` with visible
  text plus an icon and `aria-label` "View on MyAnimeList (opens in a new tab)".

## Risks / Trade-offs

- [The undrawn detail states could look off] → the PR says so under "Differences from the
  design"; the human can draw them and run `/sync-ui`.
- [A one-item nav looks sparse until Watchlist ships] → accepted; the Watchlist feature adds its item.
