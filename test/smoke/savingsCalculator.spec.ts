import { test, expect, Page } from '@playwright/test'

async function seedSpendingAndWallet(page: Page) {
  await page.evaluate(() => {
    const spendingData = {
      breakdown: [
        { category: 'dining', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'groceries', monthlyAvg: 300, annualTotal: 3600, transactionCount: 36 },
        { category: 'gas', monthlyAvg: 100, annualTotal: 1200, transactionCount: 12 },
        { category: 'travel', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
        { category: 'streaming', monthlyAvg: 50, annualTotal: 600, transactionCount: 12 },
        { category: 'other', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 192,
    }
    localStorage.setItem('co_spending_data', JSON.stringify(spendingData))
    localStorage.setItem('co_wallet_cards', JSON.stringify(['chase-sapphire-preferred', 'amex-gold']))
  })
}

async function seedSpendingOnly(page: Page) {
  await page.evaluate(() => {
    const spendingData = {
      breakdown: [
        { category: 'dining', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'other', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 108,
    }
    localStorage.setItem('co_spending_data', JSON.stringify(spendingData))
    localStorage.setItem('co_wallet_cards', JSON.stringify([]))
  })
}

test.describe('CO-031: Annual Savings Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  // ---------------------------------------------------------------------------
  test('savings banner visible on wallet page after optimization', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('savings amount shows a dollar figure', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    const amountEl = page.locator('[data-savings-amount]')
    await expect(amountEl).toBeVisible()
    const text = await amountEl.textContent()
    expect(text).toMatch(/\$[\d,]+/)
  })

  // ---------------------------------------------------------------------------
  test('savings banner shows /year suffix', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    const banner = page.locator('[data-savings-banner]')
    await expect(banner).toBeVisible()
    const text = await banner.textContent()
    expect(text?.toLowerCase()).toContain('/year')
  })

  // ---------------------------------------------------------------------------
  test('savings banner mentions 1% baseline comparison', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    const banner = page.locator('[data-savings-banner]')
    await expect(banner).toBeVisible()
    const text = await banner.textContent()
    expect(text).toContain('1%')
  })

  // ---------------------------------------------------------------------------
  test('savings dollar amount uses no cents (integer formatting)', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    const amountText = await page.locator('[data-savings-amount]').textContent()
    expect(amountText).toMatch(/\$[\d,]+/)
    // No decimal cents
    expect(amountText).not.toMatch(/\.\d{2}/)
  })

  // ---------------------------------------------------------------------------
  test('category breakdown toggle expands to show savings table', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
    // Breakdown not visible by default
    await expect(page.locator('[data-savings-breakdown]')).not.toBeVisible()
    // Click toggle
    await page.locator('[data-savings-breakdown-toggle]').click()
    await expect(page.locator('[data-savings-breakdown]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('category breakdown shows spending categories', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    await page.locator('[data-savings-breakdown-toggle]').click()
    const breakdown = page.locator('[data-savings-breakdown]')
    await expect(breakdown).toBeVisible()
    const text = await breakdown.textContent()
    expect(text).toContain('Dining')
    expect(text).toContain('Groceries')
  })

  // ---------------------------------------------------------------------------
  test('savings banner not shown when no cards selected', async ({ page }) => {
    await seedSpendingOnly(page)
    await page.goto('/wallet')
    await expect(page.locator('[data-savings-banner]')).not.toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('savings banner not shown when no spending data', async ({ page }) => {
    await page.goto('/wallet')
    await expect(page.locator('[data-savings-banner]')).not.toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('savings banner appears on recommendations page when wallet has cards', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/recommendations')
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('recommendations savings banner shows dollar figure', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/recommendations')
    const amountEl = page.locator('[data-savings-amount]')
    await expect(amountEl).toBeVisible()
    const text = await amountEl.textContent()
    expect(text).toMatch(/\$[\d,]+/)
  })

  // ---------------------------------------------------------------------------
  test('savings banner not shown on recommendations page when no wallet cards', async ({ page }) => {
    await seedSpendingOnly(page)
    await page.goto('/recommendations')
    await expect(page.locator('[data-savings-banner]')).not.toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('savings amount is positive for good cards (CSP + Amex Gold vs 1% baseline)', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    const amountEl = page.locator('[data-savings-amount]')
    await expect(amountEl).toBeVisible()
    const text = await amountEl.textContent()
    // Chase Sapphire Preferred + Amex Gold should earn much more than 1% flat
    // Total annual spend: $18,600; baseline 1% = $186; expect savings > $0
    expect(text).toMatch(/\$[\d,]+/)
    // Amount should be more than $0 (the $ sign followed by at least one non-zero digit or a comma)
    expect(text).not.toBe('$0')
  })

  // ---------------------------------------------------------------------------
  test('preset-to-wallet flow shows savings banner', async ({ page }) => {
    await page.goto('/upload')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    // Select Average American preset
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    // Go to wallet
    await page.locator('[data-optimize-link]').click()
    await expect(page).toHaveURL('/wallet')
    // Select a card
    const csp = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await expect(csp).toBeVisible()
    await csp.click()
    // Savings banner appears
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
    const amountEl = page.locator('[data-savings-amount]')
    await expect(amountEl).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('mobile responsive at 375px — savings banner visible, no overflow on wallet page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedSpendingAndWallet(page)
    await page.goto('/wallet')
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // ---------------------------------------------------------------------------
  test('mobile responsive at 375px — savings banner visible on recommendations page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedSpendingAndWallet(page)
    await page.goto('/recommendations')
    await expect(page.locator('[data-savings-banner]')).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
