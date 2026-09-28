# app-shell Specification

## Purpose

The frame around every page: the app's wordmark and navigation between its main sections,
on phones and desktops.

## Requirements

### Requirement: Header and navigation

Every page SHALL show the "senpai." wordmark linking to the home page, and a main navigation
listing the sections that exist, with the current section marked. On narrow screens the
navigation SHALL be a bottom tab bar; on wide screens (1280px design) it SHALL sit in the header.

#### Scenario: Current section

- **WHEN** the user is on any season page or a show's detail page
- **THEN** the "Season" navigation item is marked as the current page

#### Scenario: Wordmark

- **WHEN** the user activates the wordmark
- **THEN** the current season's home page is shown
