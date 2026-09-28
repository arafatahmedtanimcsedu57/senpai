# Spec Delta

## Purpose

Remembers which shows the user has added to their watchlist, on this device, so every
screen can show and change that membership.

## ADDED Requirements

### Requirement: Add a show

The user SHALL be able to add a show to the watchlist; a new entry starts as "Plan to watch"
with 0 episodes watched and keeps the show's title, cover and episode count.

#### Scenario: Add

- **WHEN** the user adds a show that is not on the watchlist
- **THEN** the show is on the watchlist with status "Plan to watch" and 0 episodes watched

#### Scenario: Add twice

- **WHEN** the user adds a show that is already on the watchlist
- **THEN** nothing changes (no duplicate, status and progress kept)

### Requirement: Persist on this device

The watchlist SHALL survive a page reload in the same browser, with no account.

#### Scenario: Reload

- **WHEN** the user adds a show and reloads the page
- **THEN** the show is still on the watchlist
