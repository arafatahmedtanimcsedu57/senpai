# Spec Delta

## ADDED Requirements

### Requirement: Watchlist page

The watchlist page SHALL list the user's shows under status tabs (Watching, Plan to watch,
Completed, Dropped), each tab showing how many shows it holds. It SHALL open on the first tab
that has shows. Each row SHALL show the cover, the title (linking to the show's detail page),
the progress as "<watched> / <total>" ("?" when the total is unknown) and a progress bar.

#### Scenario: Tabs and counts

- **WHEN** the user has 3 shows Watching and 1 Plan to watch
- **THEN** the tabs read "Watching 3", "Plan to watch 1", "Completed 0", "Dropped 0" and Watching is selected

#### Scenario: Opens on a tab with shows

- **WHEN** every show on the list is "Plan to watch"
- **THEN** the Plan to watch tab is selected

#### Scenario: Empty tab

- **WHEN** the user selects a tab with no shows while the list has others
- **THEN** "No shows here yet." is shown

#### Scenario: Empty list

- **WHEN** the watchlist is empty
- **THEN** "Your watchlist is empty — browse this season" is shown with a link to the season page, and no tabs

### Requirement: Track episodes

Each row SHALL let the user step the watched count by one in either direction, never below 0
and never above the total when the total is known. The first +1 on a "Plan to watch" show
SHALL move it to Watching. Changes SHALL be saved on this device.

#### Scenario: Step up

- **WHEN** the user activates +1 on a show at 5 / 12
- **THEN** it reads 6 / 12 and stays 6 / 12 after a reload

#### Scenario: Bounds

- **WHEN** a show is at 0 / 12 or 12 / 12
- **THEN** −1 or +1 respectively is disabled

#### Scenario: Unknown total

- **WHEN** a show's total is unknown
- **THEN** +1 is never disabled and the count reads "<n> / ?"

#### Scenario: Starting a planned show

- **WHEN** the user activates +1 on a "Plan to watch" show at 0
- **THEN** it reads 1 / <total> and moves to the Watching tab

### Requirement: Change status

Each row SHALL let the user set the show's status. Setting Completed SHALL set the watched count
to the total when the total is known.

#### Scenario: Complete a show

- **WHEN** the user sets a show at 5 / 12 to Completed
- **THEN** it moves to the Completed tab and reads 12 / 12
