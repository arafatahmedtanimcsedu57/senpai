# Spec Delta

## ADDED Requirements

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
