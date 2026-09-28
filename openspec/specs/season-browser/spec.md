# season-browser Specification

## Purpose

The home screen: browse the shows of the current or any other anime season and add them to
the watchlist.

## Requirements

### Requirement: Current season on home

The home page SHALL show the current season's label (e.g. "Fall 2026"), its number of shows,
and a grid of show cards with cover, title, studio, airing day and episode count.

#### Scenario: Home

- **WHEN** the user opens `/` during October 2026
- **THEN** the heading reads "Fall 2026" and a card is shown for each of that season's TV shows

#### Scenario: Unknown episode count

- **WHEN** a show's episode count is unknown
- **THEN** its card reads "? eps"

#### Scenario: Missing cover

- **WHEN** a show has no cover image, or the image fails to load
- **THEN** its card shows the placeholder cover with the title's first letter

### Requirement: Switch seasons

Previous and next buttons SHALL move to the adjacent season and update the URL to
`/season/<year>/<season>`.

#### Scenario: Next season

- **WHEN** the user is on Fall 2026 and activates "Next season"
- **THEN** the URL is `/season/2027/winter` and the heading reads "Winter 2027"

#### Scenario: Deep link

- **WHEN** the user opens `/season/2025/spring`
- **THEN** Spring 2025 is shown

#### Scenario: Malformed season URL

- **WHEN** the user opens `/season/2025/autumn`
- **THEN** the "Page not found" page is shown

### Requirement: Loading, empty and error states

The season page SHALL show skeleton cards while loading, "No shows found for this season."
when the season has no shows, and "Could not load the season. Try again." with a Retry
button when the request fails.

#### Scenario: Empty

- **WHEN** the season has no shows
- **THEN** "No shows found for this season." is shown and the season arrows still work

#### Scenario: Error then retry

- **WHEN** the request fails and the user activates "Retry", and it then succeeds
- **THEN** the grid of shows replaces the error message

### Requirement: Add to watchlist from a card

Each card SHALL offer "Add to watchlist". Once the show is on the watchlist, the card SHALL
read "In watchlist" and not offer adding again.

#### Scenario: Add

- **WHEN** the user activates "Add to watchlist" on a card
- **THEN** the card reads "In watchlist" and the show is on the watchlist

#### Scenario: Already added

- **WHEN** a show is already on the watchlist when the season loads
- **THEN** its card reads "In watchlist"

### Requirement: Featured hero

When a season has at least one show, the season page SHALL show a featured hero above the
season header for its most popular show, with a "FEATURED · <season label>" badge, the title,
studio · airing day · episodes, "Add to watchlist" and a "More info" link to the show's detail
page. On wide screens it SHALL also show a two-line synopsis and use the show's wide artwork
when there is one, with the app header drawn over the hero. The featured show SHALL also stay
in the grid.

#### Scenario: Most popular show is featured

- **WHEN** the season loads with shows
- **THEN** the hero features the show with the most MyAnimeList members, and that show also
  appears in the grid

#### Scenario: More info

- **WHEN** the user activates "More info" in the hero
- **THEN** the featured show's detail page opens

#### Scenario: Add from the hero

- **WHEN** the user activates the hero's add button
- **THEN** the show is on the watchlist, and both the hero and its card read "In watchlist"

#### Scenario: No hero without shows

- **WHEN** the season is loading, empty, or failed to load
- **THEN** no hero is shown

#### Scenario: Another season

- **WHEN** the user opens `/season/2025/spring` and it has shows
- **THEN** the badge reads "FEATURED · SPRING 2025"

#### Scenario: No wide artwork

- **WHEN** the featured show has no wide artwork
- **THEN** the hero uses its poster (or the placeholder when there is none)
