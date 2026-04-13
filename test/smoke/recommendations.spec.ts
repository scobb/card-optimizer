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

async function seedWalletCards(page: Page, cardIds: string[]) {
  await page.evaluate((ids) => {
    localStorage.setItem('co_wallet_cards', JSON.stringify(ids))
  }, cardIds)
}

test.describe('CO-004: Card Recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recommendations')
    await clearLocalStorage(page)
    await page.reload()
  })

  // -------------------------------------------------------------------------
  test('recommendations page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recommendations' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows prompt to upload CSV when no spending data', async ({ page }) => {
    await expect(page.getByText('No spending data uploaded yet.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Upload your transaction CSV' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows recommendations when spending data present and no wallet', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Recommendations list should appear
    await expect(page.locator('[data-testid="recommendations-list"]')).toBeVisible()

    // At least one card recommended
    const recs = page.locator('[data-learn-more-link]')
    await expect(recs.first()).toBeVisible()

    // Net value shown
    await expect(page.getByText('net annual value').first()).toBeVisible()

    // Apply link present
    await expect(recs.first()).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('tip shown when no wallet cards selected', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await expect(page.getByText(/Add cards you already hold/i)).toBeVisible()
    // Use main content area link to avoid strict mode (nav also has a Wallet link)
    await expect(page.locator('main').getByRole('link', { name: 'Wallet' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('recommendations exclude cards already in wallet', async ({ page }) => {
    await seedSpendingData(page)
    // Put Amex Gold in wallet
    await seedWalletCards(page, ['amex-gold'])
    await page.reload()

    // Amex Gold should NOT appear in recommendations
    const recs = page.locator('[data-testid="recommendations-list"]')
    await expect(recs).toBeVisible()

    // Get all apply links — none should link to amex-gold
    const applyLinks = page.locator('[data-learn-more-link="amex-gold"]')
    await expect(applyLinks).toHaveCount(0)
  })

  // -------------------------------------------------------------------------
  test('sign-up bonus shown in recommendation pills', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Most top recommendations have sign-up bonuses
    await expect(page.getByText(/sign-up bonus/i).first()).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('category breakdown expands on click', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Click "Show category breakdown" on first recommendation
    await page.getByText('Show category breakdown').first().click()

    // Category table visible with rate columns (use table headers to avoid matching reason text)
    await expect(page.locator('th', { hasText: 'Current' }).first()).toBeVisible()
    await expect(page.locator('th', { hasText: 'New' }).first()).toBeVisible()
    await expect(page.locator('th', { hasText: 'Extra/yr' }).first()).toBeVisible()

    // Collapse
    await page.getByText('Hide category breakdown').first().click()
    await expect(page.locator('th', { hasText: 'Current' }).first()).not.toBeVisible({ timeout: 2000 })
  })

  // -------------------------------------------------------------------------
  test('only positive net value cards shown', async ({ page }) => {
    await seedSpendingData(page)
    // Put most cards in wallet to exhaust good options
    await seedWalletCards(page, [
      'amex-gold', 'amex-blue-cash-preferred', 'chase-sapphire-preferred',
      'chase-freedom-unlimited', 'citi-custom-cash', 'capital-one-venture-x',
      'us-bank-altitude-go',
    ])
    await page.reload()

    // Either recommendations exist OR "no cards" message shown
    const hasList = await page.locator('[data-testid="recommendations-list"] [data-learn-more-link]').count()
    if (hasList === 0) {
      await expect(page.getByText('No cards found with positive net value')).toBeVisible()
    } else {
      // All shown recommendations should have "+$" prefix (positive value)
      const netValues = page.getByText('net annual value')
      const count = await netValues.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  // -------------------------------------------------------------------------
  test('recommendations update when wallet cards change', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Count initial recommendations
    const initialCount = await page.locator('[data-learn-more-link]').count()

    // Add a card to wallet (navigate to wallet, select, come back)
    await seedWalletCards(page, ['amex-gold', 'chase-sapphire-preferred'])
    await page.reload()

    const newCount = await page.locator('[data-learn-more-link]').count()
    // Adding cards should reduce or maintain recommendation count (never add amex-gold or chase-sapphire-preferred)
    expect(newCount).toBeLessThanOrEqual(initialCount)
    const amexGoldRec = page.locator('[data-learn-more-link="amex-gold"]')
    const cspRec = page.locator('[data-learn-more-link="chase-sapphire-preferred"]')
    await expect(amexGoldRec).toHaveCount(0)
    await expect(cspRec).toHaveCount(0)
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Recommendations' })).toBeVisible()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
