# show-detail Specification

## Purpose

Shows everything the app knows about one anime (synopsis, genres, episodes, airing,
studio) and lets the user add it to the watchlist or open it on MyAnimeList.

## Requirements

### Requirement: Open details from a card

Activating a show card's cover or title SHALL open `/anime/<id>` for that show.

#### Scenario: Card to detail

- **WHEN** the user activates the title of "Dandadan" on the season page
- **THEN** the URL is `/anime/<its id>` and the heading reads "Dandadan"

### Requirement: Detail content

The detail page SHALL show the cover, title, genres, episode count ("?" when unknown),
airing day, studio, season, synopsis, "Add to watchlist" (or "In watchlist" once added), and
a "View on MyAnimeList" link that opens the show's MyAnimeList page in a new tab.

#### Scenario: Add from detail

- **WHEN** the user activates "Add to watchlist" on the detail page
- **THEN** it reads "In watchlist" and the show is on the watchlist

#### Scenario: Missing fields

- **WHEN** the show has no synopsis or no studio
- **THEN** that part is left out rather than shown empty

### Requirement: Detail states

The detail page SHALL show a loading skeleton while loading, "Could not load this show. Try
again." with Retry when the request fails, and "This show doesn't exist." with a link to the
current season when the id is unknown.

#### Scenario: Unknown id

- **WHEN** the user opens `/anime/999999999`
- **THEN** "This show doesn't exist." is shown with a link to the current season

#### Scenario: Failure then retry

- **WHEN** the request fails and the user activates Retry, and it then succeeds
- **THEN** the show's details replace the error message
