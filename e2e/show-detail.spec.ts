import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// The dev server runs with MSW mocks (playwright.config.ts).
async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
}

test('season → show detail → add → back: the card reads "In watchlist"', async ({ page }) => {
  await page.goto('/season/2026/fall')
  await page.getByRole('link', { name: 'Dan Da Dan' }).click()
  await expect(page).toHaveURL('/anime/57334')
  await expect(page.getByRole('heading', { level: 1, name: 'Dan Da Dan' })).toBeVisible()
  await expectNoAxeViolations(page)

  await page.getByRole('button', { name: 'Add to watchlist' }).click()
  await expect(page.getByRole('button', { name: 'In watchlist' })).toBeDisabled()

  await page.getByRole('link', { name: 'Fall 2026' }).click()
  await expect(page).toHaveURL('/season/2026/fall')
  await expect(
    page.getByRole('article').filter({ hasText: 'Dan Da Dan' }).getByRole('button', {
      name: 'In watchlist',
    }),
  ).toBeDisabled()
})

test('the nav marks Season as the current section', async ({ page }) => {
  await page.goto('/anime/57334')
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Season' }),
  ).toHaveAttribute('aria-current', 'page')
})

test('an unknown show says it does not exist', async ({ page }) => {
  await page.goto('/anime/999999999')
  await expect(page.getByText("This show doesn't exist.")).toBeVisible()
  await expectNoAxeViolations(page)
})
