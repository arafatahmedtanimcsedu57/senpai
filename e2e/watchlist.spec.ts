import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// The dev server runs with MSW mocks (playwright.config.ts); Dan Da Dan has 12 episodes.
async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
}

test('an empty watchlist points back to the season', async ({ page }) => {
  await page.goto('/watchlist')
  await expect(page.getByText('Your watchlist is empty — browse this season')).toBeVisible()
  await expect(page.getByRole('tablist')).toHaveCount(0)
  await expectNoAxeViolations(page)
  await page.getByRole('link', { name: 'Browse this season' }).click()
  await expect(page).toHaveURL('/')
})

test('a show added from the season can be tracked on the watchlist', async ({ page }) => {
  await page.goto('/season/2026/fall')
  const card = page.getByRole('article').filter({ hasText: 'Dan Da Dan' })
  await card.getByRole('button', { name: 'Add to watchlist' }).click()

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Watchlist' })
    .click()
  await expect(page).toHaveURL('/watchlist')
  await expect(page.getByRole('tab', { name: 'Plan to watch 1' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('heading', { level: 2, name: 'Dan Da Dan' })).toBeVisible()
  await expect(page.getByText('0 / 12', { exact: false })).toBeVisible()
  await expectNoAxeViolations(page)

  await page.getByRole('button', { name: 'Watched episode 1: Dan Da Dan' }).click()
  await expect(page.getByRole('tab', { name: 'Watching 1' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('tab', { name: 'Watching 1' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByText('1 / 12', { exact: false })).toBeVisible()
})
