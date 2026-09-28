# Design

## Context

The store `src/stores/useWatchlistStore.ts` (persisted, v1) holds entries with
`{id,title,imageUrl,episodes,status,progress,addedAt}` and only `add` / `has`. The app shell,
`CoverImage`, `Button`, and the Tailwind 4 tokens are in place.

Claude Design: [senpai canvas](https://claude.ai/artifact/BBAn1TPTZbbKJqqXAgCxbY) → page
"Watchlist + episode tracking". Artboards implemented:

- `watchlist/Default-mobile.dc.html`, `watchlist/Default-desktop.dc.html`
- `watchlist/Empty-mobile.dc.html`, `watchlist/Empty-desktop.dc.html`

(`SaveError`, `Complete` and `Removed` are `watchlist-actions`'. Their remove buttons are drawn
on every row, but they ship in `watchlist-actions`.)

## Goals / Non-Goals

**Goals:** match both widths; keyboard-operable tabs; persisted changes; a migration that never
loses an entry.

**Non-Goals:** remove / undo / dialogs / toasts (`watchlist-actions`).

## Decisions

- **Store actions:**
  - `setStatus(id, status)`: Completed with a known total sets `progress = episodes`.
  - `step(id, +1|-1)`: clamps to `[0, episodes ?? ∞]`; +1 from `plan-to-watch` sets `watching`.
  - Both touch `updatedAt`. Components select narrowly (`entries` once in the page; each row
    gets its own entry).
- **Migration:** `version: 2` with `migrate(v1) → entries + { studio: null, airingDay: null, updatedAt: addedAt }`.
  `add()` now stores `studio` / `airingDay` from `Show`.
- **Tabs:** `radix-ui` `Tabs` (roving focus and arrow keys built in), styled as the drawn pills.
  The selected tab is local `useState`, initialised to the first non-empty status. Tab state
  doesn't need to survive navigation.
- **Rows:** `WatchlistRow`. Mobile: cover | title + remove slot, bar, stepper; status select
  under the title. Desktop: cover | title, meta, 320px bar | status select | stepper | remove
  slot. `EpisodeStepper` holds the −/+ buttons (aria-labels as drawn: "One episode back: <t>",
  "Watched episode <n+1>: <t>") and the `tabular-nums` count. The bar is `spark`, and a
  `border`-coloured 30% stub when the total is unknown, as drawn.
- **Status labels / order** live in `src/features/watchlist/status.ts`; the tabs and select share them.

## Risks / Trade-offs

- [The migration runs on every existing user's saved data] → unit-tested with a v1 payload and
  malformed ones. `migrate` never throws: a throw would leave the store empty, and its next
  write would erase the saved list.
- [~380 lines is close to the cap] → the remove, dialog and toasts are already moved to
  `watchlist-actions`.
