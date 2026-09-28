# Spec Delta

## MODIFIED Requirements

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
