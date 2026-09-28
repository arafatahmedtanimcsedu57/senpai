# Design

## Context

Builds on `season-browser-ui` (`SeasonPage`, `CoverImage`, `AddToWatchlistButton`) and
`show-detail` (`/anime/:id`, the app header in `RootLayout`). The contract is Jikan v4, case 1
(partial); `trailer.images.*` is present on every anime object, and its fields are null when
there's no trailer.

Claude Design: [senpai canvas](https://claude.ai/artifact/BBAn1TPTZbbKJqqXAgCxbY) → page
"Season browser". Artboards implemented (the hero part only; the rest is already built):

- `season-browser/Default-mobile.dc.html`: the 358×440 hero panel, radius 12, a 1px light ring,
  a bottom gradient, centred content, and a two-button row ("Watchlist" + "More info").
- `season-browser/Default-desktop.dc.html`: the full-bleed 1280×620 band, the header overlaid
  with a top gradient, content bottom-left (580px wide, 140px from the bottom), 52px buttons,
  and the grid pulled up 96px.

## Goals / Non-Goals

**Goals:** match both Default artboards; no layout shift from Loading to Default beyond the
hero appearing; the header change stays opt-in.

**Non-Goals:** image optimisation or preloading beyond `fetchpriority="high"` on the hero image.

## Decisions

- **Hero data comes from the season query.** It's `shows[0]` (already sorted by members), so
  there's no extra request.
- **Wide artwork:** `bannerUrl = trailer.images.maximum_image_url ?? large_image_url ?? null`.
  YouTube thumbnails are 16:9 and drawn with `object-cover` in the desktop band. On mobile the
  panel is portrait, so it always uses `imageUrl` (the poster), which crops much better.
- **The header over the hero** is a layout opt-in, not a per-page copy of the header.
  `RootLayout` reads a route `handle` (`{ heroHeader: true }` on the season routes) through
  `useMatches`. Pages without the handle keep the solid header. When the handle is set and the
  width is desktop, the header is `absolute` + transparent with the drawn gradient, and
  `SeasonPage` renders the hero full-bleed. When the season has no shows, the page
  adds top padding so the header doesn't cover the heading. The absolute header is inert
  space, so this is done with the page's padding rather than JS.
- **Components:**
  - `SeasonHero.tsx` (feature): `<section aria-labelledby>` with an `h2` title, the badge,
    the meta line, the synopsis clamped to 2 lines at desktop, `AddToWatchlistButton
look="hero"`, and "More info" as a `Link` styled as a translucent button.
  - `AddToWatchlistButton` gains `look?: 'card' | 'detail' | 'hero'`, replacing `prominent`,
    and an `aria-label` including the title.
- **Grid overlap:** on desktop the season header row gets `-mt-24 relative` when the hero is
  shown, as drawn.

## Risks / Trade-offs

- [Trailer thumbnails can be letterboxed or low-res for some shows] → the gradients hide the
  edges; the fallback is the poster. This can be revisited with real data.
- [The overlaid header lowers contrast over bright art] → the drawn top gradient (0.9 → 0)
  keeps the wordmark and nav at 4.5:1 or better; the visual self-check verifies it.
