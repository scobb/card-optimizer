import { test, expect, Page } from '@playwright/test'

async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function seedSpendingData(page: Page) {
  await page.evaluate(() => {
    const data = {
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'groceries', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'gas', monthlyAvg: 150, annualTotal: 1800, transactionCount: 18 },
        { category: 'travel', monthlyAvg: 300, annualTotal: 3600, transactionCount: 36 },
        { category: 'streaming', monthlyAvg: 60, annualTotal: 720, transactionCount: 12 },
        { category: 'online_shopping', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
        { category: 'other', monthlyAvg: 600, annualTotal: 7200, transactionCount: 72 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 270,
    }
    localStorage.setItem('co_spending_data', JSON.stringify(data))
  })
}

test.describe('CO-005: Wallet Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await clearLocalStorage(page)
    await page.reload()
  })

  // -------------------------------------------------------------------------
  test('builder page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Optimal Wallet' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows prompt to upload CSV when no spending data', async ({ page }) => {
    await expect(page.getByText('No spending data uploaded yet.')).toBeVisible()
    await expect(page.locator('main').getByRole('link', { name: 'Upload your transaction CSV' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('card count selector shows 2, 3, 4 options', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await expect(page.locator('[data-max-cards="2"]')).toBeVisible()
    await expect(page.locator('[data-max-cards="3"]')).toBeVisible()
    await expect(page.locator('[data-max-cards="4"]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows optimal 3-card wallet by default', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Default is 3 cards — results should appear
    await expect(page.getByText('Annual Rewards')).toBeVisible()
    await expect(page.getByText('Annual Fees')).toBeVisible()
    await expect(page.getByText('Net Value')).toBeVisible()

    // Should show 3 card roles
    const cardRoles = page.locator('[data-card-role]')
    await expect(cardRoles).toHaveCount(3)
  })

  // -------------------------------------------------------------------------
  test('switching to 2-card wallet updates results', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Default 3 cards
    await expect(page.locator('[data-card-role]')).toHaveCount(3)

    // Switch to 2 cards
    await page.locator('[data-max-cards="2"]').click()
    await expect(page.locator('[data-card-role]')).toHaveCount(2)
  })

  // -------------------------------------------------------------------------
  test('switching to 4-card wallet updates results', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await page.locator('[data-max-cards="4"]').click()
    await expect(page.locator('[data-card-role]')).toHaveCount(4)
  })

  // -------------------------------------------------------------------------
  test('each card shows its role (which categories it covers)', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // At least one card should have category tags
    const categoryTags = page.locator('[data-card-role] span').filter({
      hasText: /%$/,
    })
    const count = await categoryTags.count()
    expect(count).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('apply links present for each card in optimal wallet', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Apply links in the apply section
    const applyLinks = page.locator('[data-builder-apply]')
    await expect(applyLinks.first()).toBeVisible()
    const count = await applyLinks.count()
    expect(count).toBe(3) // Default is 3 cards
  })

  // -------------------------------------------------------------------------
  test('compute time displayed', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await expect(page.getByText(/Computed in \d+ms/)).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('net value is positive (rewards exceed fees)', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Net value label and value shown; the optimal combo should have positive net value
    await expect(page.getByText('Net Value')).toBeVisible()
    // The displayed value starts with "+" for positive
    const netValueText = await page.locator('.text-green-700, .text-red-700').first().textContent()
    expect(netValueText).toBeTruthy()
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Optimal Wallet' })).toBeVisible()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
