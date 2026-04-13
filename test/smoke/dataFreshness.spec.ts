import { test, expect } from '@playwright/test'

test.describe('CO-037: Card data freshness and trust indicators', () => {
  // -------------------------------------------------------------------------
  test('catalog page shows data last verified text', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    await expect(page.locator('[data-catalog-freshness]')).toBeVisible()
    const text = await page.locator('[data-catalog-freshness]').textContent()
    expect(text).toMatch(/last verified/i)
    expect(text).toMatch(/2026/i)
  })

  // -------------------------------------------------------------------------
  test('catalog page shows data sourced from issuer websites', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    const text = await page.locator('[data-catalog-freshness]').textContent()
    expect(text).toMatch(/card issuer/i)
  })

  // -------------------------------------------------------------------------
  test('catalog page shows N cards in database count', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    const dbCount = page.locator('[data-catalog-db-count]')
    await expect(dbCount).toBeVisible()
    const text = await dbCount.textContent()
    expect(text).toMatch(/\d+ cards/)
    const num = parseInt(text!.match(/(\d+)/)![1], 10)
    expect(num).toBeGreaterThanOrEqual(50)
  })

  // -------------------------------------------------------------------------
  test('card detail page shows last verified text', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await expect(page.locator('[data-card-freshness]')).toBeVisible()
    const text = await page.locator('[data-card-freshness]').textContent()
    expect(text).toMatch(/last verified/i)
    expect(text).toMatch(/2026/i)
  })

  // -------------------------------------------------------------------------
  test('card detail freshness text mentions issuer websites', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    const text = await page.locator('[data-card-freshness]').textContent()
    expect(text).toMatch(/card issuer/i)
  })

  // -------------------------------------------------------------------------
  test('wallet optimization results show freshness text', async ({ page }) => {
    // Seed spending and wallet data
    const SPENDING = JSON.stringify({
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Test',
      uploadedAt: new Date().toISOString(),
      transactionCount: 84,
    })
    const WALLET = JSON.stringify(['chase-sapphire-preferred'])
    await page.goto('/upload')
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_spending_data', SPENDING] as const)
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_wallet_cards', WALLET] as const)
    await page.goto('/wallet')
    // Wait for optimization to show
    await expect(page.locator('[data-wallet-optimization]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-wallet-freshness]')).toBeVisible()
    const text = await page.locator('[data-wallet-freshness]').textContent()
    expect(text).toMatch(/last verified/i)
    expect(text).toMatch(/2026/i)
  })

  // -------------------------------------------------------------------------
  test('freshness indicators are subtle — small text', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    const freshness = page.locator('[data-catalog-freshness]')
    await expect(freshness).toBeVisible()
    // Check it has a small text class (text-xs or text-sm)
    const classes = await freshness.getAttribute('class')
    expect(classes).toMatch(/text-xs|text-sm/)
  })

  // -------------------------------------------------------------------------
  test('mobile — catalog freshness text visible at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    await expect(page.locator('[data-catalog-freshness]')).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
