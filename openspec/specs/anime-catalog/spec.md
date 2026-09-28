# anime-catalog Specification

## Purpose

Provides the shows of any anime season and the details of a single show, read from the
public Jikan (MyAnimeList) API and checked against the agreed contract.

## Requirements

### Requirement: Season list

The system SHALL return every TV show of a given year and season (winter, spring, summer,
fall), with each show appearing once, ordered most popular first.

#### Scenario: Season spread over several pages

- **WHEN** the season's shows are requested and Jikan returns them over 2 pages
- **THEN** the result contains the shows from both pages, in popularity order

#### Scenario: Duplicate entries

- **WHEN** Jikan lists the same show twice (on one page or across pages)
- **THEN** it appears once in the result

#### Scenario: Season with no shows

- **WHEN** Jikan returns no shows for the season
- **THEN** the result is an empty list, not an error

### Requirement: Show fields

Each show SHALL expose an id, a title (English when available, else the default title), a
cover image URL or none, a wide artwork URL (the trailer thumbnail) or none, the first studio
or none, the airing day or none, the episode count or none, genres, a synopsis or none, and
its MyAnimeList URL.

#### Scenario: Unknown episode count

- **WHEN** Jikan reports no episode count for a show
- **THEN** the show's episode count is none (the UI shows "? eps")

#### Scenario: No English title

- **WHEN** a show has no English title
- **THEN** its default title is used

#### Scenario: No trailer

- **WHEN** Jikan reports no trailer images for a show
- **THEN** the show's wide artwork is none

### Requirement: Single show

The system SHALL return one show's fields by its MyAnimeList id.

#### Scenario: Unknown id

- **WHEN** a show is requested with an id Jikan does not know (404)
- **THEN** the request fails with a not-found error the UI can tell apart from other failures

### Requirement: Contract guard

A Jikan response that does not match the agreed shape SHALL fail the request instead of
passing malformed data on.

#### Scenario: Drifted response

- **WHEN** Jikan returns a show without an id
- **THEN** the request fails with an error

### Requirement: Season arithmetic

The system SHALL derive the current season from the date (Jan–Mar winter, Apr–Jun spring,
Jul–Sep summer, Oct–Dec fall) and give the previous and next season and a label.

#### Scenario: Year boundaries

- **WHEN** the next season after Fall 2026 or the previous before Winter 2026 is asked for
- **THEN** the answers are Winter 2027 and Fall 2025

#### Scenario: Label

- **WHEN** the season is fall 2026
- **THEN** its label is "Fall 2026"
