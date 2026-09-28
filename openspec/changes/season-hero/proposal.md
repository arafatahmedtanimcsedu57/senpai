# Proposal

Risk tier: medium

Part 4 of 4 for the Season browser (`features.md` → Season browser).
depends on: show-detail (merged, #8): "More info" opens the detail page, and the desktop hero
sits under the app header.

## Why

The human added a featured hero to the season page's Default artboards after `/feature`. At
Gate 1 of `season-browser-ui` it was moved to its own change so that PR stayed under 400 lines.
It gives the season a face: the most popular show, big, with one-tap add and a way into
its details.

## What Changes

- A featured hero at the top of the season page, as drawn:
  - **Mobile:** a 440px rounded panel.
  - **Desktop:** a full-width 620px band. The app header sits on top of it, and the grid
    rises 96px into its bottom edge.
  - **Content:** a "FEATURED · <SEASON>" badge, the title, studio · day · episodes, a
    two-line synopsis (desktop only), "Add to watchlist" and "More info".
- The featured show is the season's most popular one, and it stays in the grid too.
- Contract: each show gains an optional wide image, Jikan's trailer thumbnail. The hero uses
  it on desktop and falls back to the poster.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `season-browser`: adds the featured hero requirement.
- `anime-catalog`: "Show fields" gains an optional wide artwork URL.

## Impact

- `src/features/season/schema.ts`, `src/types/anime.ts`: optional `trailer.images` → `Show.bannerUrl`.
- New `src/features/season/components/SeasonHero.tsx`. `SeasonPage.tsx` renders it above the header row.
- `src/routes/RootLayout.tsx`: on desktop, the header becomes transparent and sits over the page
  when the page opts in (season pages with a hero); everywhere else it's unchanged.
- `AddToWatchlistButton.tsx`: a light "hero" look.
- No new dependencies.

## Non-goals

- Rotating or carousel heroes, or letting the user pick the featured show.
- Playing the trailer.

## Open questions

Answered by arafat, 2026-09-29: all seven defaults accepted, including the optional `trailer.images`
contract field.

1. Contract change: add Jikan's optional `trailer.images` (a wide YouTube thumbnail) to the
   schema? **Default: yes, `Show.bannerUrl` = `maximum_image_url` ?? `large_image_url` ?? null.**
2. Which image goes where? **Default: mobile always uses the poster (the panel is portrait);
   desktop uses the wide image, or the poster when there is none.**
3. When is the hero shown? **Default: only once the season has loaded with at least one show.
   It's hidden during Loading, Empty and Error, as drawn.**
4. Does it show on seasons other than the current one? **Default: yes; the badge names that
   season ("FEATURED · SPRING 2025").**
5. The mobile button reads "Watchlist" and the desktop one "Add to watchlist". **Default: follow
   the design per width; the accessible name is "Add <title> to watchlist" at both widths.**
6. After adding, what does the hero button show? **Default: a disabled "In watchlist" in the
   same light style, like the cards.**
7. The desktop header over the hero: **Default: transparent with a dark top gradient, only on
   season pages that show a hero; every other page keeps the solid header.**
