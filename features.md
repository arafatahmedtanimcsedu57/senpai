# Features

What we're building, in the user's words. **Owned by a human** — the agent may draft
entries, but a person confirms each one before it feeds an OpenSpec proposal.

For each feature, write behaviour and states, not implementation. If something is unknown,
write it under "Open questions" rather than letting the agent guess.

---

## App-wide (every page)

**Behaviour**

- Unknown URL: "Page not found" with a link to the home page.
- A page crashes while rendering: "Something went wrong" with a link to reload the home page.
- While a page's code is loading on first visit: "Loading…".
- A request answered with 401 ends the session (the token is cleared).

**Status:** shipped

---

## Season browser

**Who / why:** An anime fan wants to see what's airing this season and pick what to watch.

**Behaviour**

- Home shows the current season (e.g. "Fall 2026") as a grid of show cards: cover, title,
  studio, episode count, airing day.
- Prev / next arrows switch to other seasons.
- Each card has "Add to watchlist"; once added it reads "In watchlist ✓".
- Clicking a card opens a detail page: synopsis, genres, episodes, link to MyAnimeList.
- A featured hero tops the season (added on the canvas after the first build): the season's
  most popular show with wide key art, a "FEATURED · FALL 2026" badge, title, studio · day ·
  episodes, a two-line synopsis on desktop, and "Add to watchlist" + "More info" (opens its
  detail page). The show also stays in the grid.

**States**

- Loading: skeleton cards.
- Empty: "No shows found for this season."
- Error: "Could not load the season. Try again." with a retry button.

**Edge cases**

- Unknown episode count → "? eps".
- Missing cover → placeholder image.
- No wide artwork for the featured show → its poster fills the hero.

**Open questions**

- Filters / sort (genre, format TV/movie, popularity) in v1?
- (Answered: show data comes from Jikan — MyAnimeList's public API.)

**Status:** shipped — in 4 changes: `season-contract` (Jikan data + watchlist store),
`season-browser-ui` (season grid, prev/next, loading / empty / error), `show-detail` (header,
nav, detail page), `season-hero` (featured hero). Specs: `openspec/specs/{anime-catalog,
watchlist,season-browser,show-detail,app-shell}`.

---

## Watchlist + episode tracking

**Who / why:** A viewer keeps track of which episode they're on for each show.

**Behaviour**

- Watchlist page lists added shows with a status: Watching / Completed / Plan to watch /
  Dropped.
- Each row shows progress "5 / 12" with +1 / −1 buttons.
- Reaching the last episode asks "Mark as completed?".
- Remove a show with an undo toast.
- Tabs or a filter by status.

**States**

- Empty: "Your watchlist is empty — browse this season" (links to home).
- Save error: "Could not save progress." — the change is reverted.

**Edge cases**

- Progress can't go below 0 or above the total (unless the total is unknown).
- Adding a show already on the list is a no-op.

**Open questions**

- (Answered: local-only for v1 — stored in the browser, no accounts.)

**Status:** planned

---

## Tier list

**Who / why:** A fan ranks shows into S/A/B/C/D and shares the result.

**Behaviour**

- Rows S, A, B, C, D, plus an "Unranked" pool filled from the watchlist (or a chosen season).
- Drag a show between tiers or reorder within a tier; keyboard-accessible.
- Title for the list, e.g. "Fall 2026 ranking".
- "Share" — see open questions.

**States**

- Empty pool: "Add shows to your watchlist to start ranking."
- Shared list not found / invalid: "This tier list doesn't exist."

**Edge cases**

- A show appears at most once in a list.
- Long titles truncate on cards, full title on hover / focus.

**Open questions**

- Sharing without a backend: export as an image, or a link with the list encoded in the URL?
- Several tier lists per user, or one per season?
- Custom tier names / colours?

**Status:** planned
