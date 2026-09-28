import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { nextSeason, seasonLabel, seasonOf, seasonPath } from '../src/lib/season'

// The dev server runs with MSW mocks (playwright.config.ts): every season has 12 shows.
const current = seasonOf(new Date())
const next = nextSeason(current)

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
}

test('home shows the current season as a grid of shows', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: seasonLabel(current) })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(12)
  await expect(page.getByText('12 shows')).toBeVisible()
  await expectNoAxeViolations(page)
})

test('the next-season arrow changes the season and the URL', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: `Next season: ${seasonLabel(next)}` }).click()
  await expect(page).toHaveURL(seasonPath(next))
  await expect(page.getByRole('heading', { level: 1, name: seasonLabel(next) })).toBeVisible()
})

test('a show added to the watchlist stays added after a reload', async ({ page }) => {
  await page.goto('/season/2026/fall')
  const card = page.getByRole('article').filter({ hasText: 'Dan Da Dan' })
  await card.getByRole('button', { name: 'Add to watchlist' }).click()
  await expect(card.getByRole('button', { name: 'In watchlist' })).toBeDisabled()
  await page.reload()
  await expect(
    page.getByRole('article').filter({ hasText: 'Dan Da Dan' }).getByRole('button', {
      name: 'In watchlist',
    }),
  ).toBeDisabled()
})

test.describe('with the API answered by the test', () => {
  // Requests handled by the MSW service worker never reach page.route, so block it here.
  test.use({ serviceWorkers: 'block' })

  test('empty season', async ({ page }) => {
    await page.route('**/api/seasons/**', (route) =>
      route.fulfill({
        json: { data: [], pagination: { last_visible_page: 1, has_next_page: false } },
      }),
    )
    await page.goto('/season/1990/winter')
    await expect(page.getByText('No shows found for this season.')).toBeVisible()
    await expectNoAxeViolations(page)
  })

  test('error, then Retry', async ({ page }) => {
    let fail = true
    await page.route('**/api/seasons/**', (route) =>
      fail
        ? route.fulfill({ status: 500 })
        : route.fulfill({
            json: { data: [], pagination: { last_visible_page: 1, has_next_page: false } },
          }),
    )
    await page.goto('/season/2026/fall')
    await expect(page.getByRole('alert')).toHaveText('Could not load the season. Try again.')
    await expectNoAxeViolations(page)
    fail = false
    await page.getByRole('button', { name: 'Retry' }).click()
    await expect(page.getByText('No shows found for this season.')).toBeVisible()
  })
})
