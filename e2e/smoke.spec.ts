import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seasonLabel, seasonOf } from '../src/lib/season'

const home = { level: 1, name: seasonLabel(seasonOf(new Date())) } as const

test('renders the home screen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', home)).toBeVisible()
})

test('home screen has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', home)).toBeVisible()
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})
