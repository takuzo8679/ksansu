import { test, expect } from '@playwright/test'

test('should navigate to practice page on button click', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/けいさんすう/)

  // Click the "れんしゅうをはじめる" button.
  await page.getByRole('button', { name: 'れんしゅうをはじめる' }).click()

  // Wait for the URL to change to the practice page.
  await page.waitForURL(/.*practice/)

  // Expects the URL to contain a practice.
  await expect(page).toHaveURL(/.*practice/)

  // Expects the heading to be "もんだい 1".
  await expect(page.getByRole('heading', { name: 'もんだい 1' })).toBeVisible()
})
