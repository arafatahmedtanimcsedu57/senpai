import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('renders the home screen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'senpai' })).toBeVisible()
})

test('home screen has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'senpai' })).toBeVisible()
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})
