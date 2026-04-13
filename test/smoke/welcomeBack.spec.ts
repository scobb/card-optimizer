import { test, expect, Page } from '@playwright/test'

const SPENDING_KEY = 'co_spending_data'
const WALLET_KEY = 'co_wallet_cards'

const SAMPLE_SPENDING = JSON.stringify({
  breakdown: [
    { category: 'dining', monthlyAvg: 350, annualTotal: 4200, transactionCount: 120 },
    { category: 'groceries', monthlyAvg: 600, annualTotal: 7200, transactionCount: 48 },
    { category: 'travel', monthlyAvg: 200, annualTotal: 2400, transactionCount: 8 },
    { category: 'gas', monthlyAvg: 300, annualTotal: 3600, transactionCount: 16 },
    { category: 'other', monthlyAvg: 2350, annualTotal: 28200, transactionCount: 150 },
  ],
  format: 'generic',
  formatLabel: 'Average American spending profile',
  uploadedAt: new Date().toISOString(),
  transactionCount: 342,
})

const SAMPLE_WALLET = JSON.stringify(['chase-sapphire-preferred', 'amex-gold-card'])

async function seedAnalysis(page: Page) {
  await page.goto('/upload')
  await page.evaluate(
    ([sk, sv, wk, wv]) => {
      localStorage.setItem(sk, sv)
      localStorage.setItem(wk, wv)
    },
    [SPENDING_KEY, SAMPLE_SPENDING, WALLET_KEY, SAMPLE_WALLET] as const,
  )
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
}

async function clearAll(page: Page) {
  await page.goto('/upload')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
}

test.describe('CO-032: LocalStorage wallet persistence — welcome back', () => {
  test('welcome back banner appears when spending + wallet both saved', async ({ page }) => {
    await seedAnalysis(page)
    await expect(page.locator('[data-welcome-back]')).toBeVisible()
    await expect(page.getByText('Welcome back!')).toBeVisible()
  })

  test('welcome back banner shows View my results link to /wallet', async ({ page }) => {
    await seedAnalysis(page)
    const link = page.locator('[data-view-results]')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/wallet')
  })

  test('clicking View my results navigates to /wallet', async ({ page }) => {
    await seedAnalysis(page)
    await page.locator('[data-view-results]').click()
    await expect(page).toHaveURL('/wallet')
    await expect(page.getByRole('heading', { name: /wallet/i })).toBeVisible()
  })

  test('/wallet shows optimization results from saved analysis', async ({ page }) => {
    await seedAnalysis(page)
    await page.locator('[data-view-results]').click()
    await expect(page).toHaveURL('/wallet')
    // Selected cards from saved wallet should be shown
    await expect(page.locator('[data-card-id="chase-sapphire-preferred"]')).toBeVisible()
  })

  test('Start fresh button clears localStorage and hides banner', async ({ page }) => {
    await seedAnalysis(page)
    await expect(page.locator('[data-welcome-back]')).toBeVisible()
    await page.locator('[data-start-fresh]').click()
    // Banner disappears
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('After Start fresh localStorage keys are removed', async ({ page }) => {
    await seedAnalysis(page)
    await page.locator('[data-start-fresh]').click()
    const spendingRaw = await page.evaluate((k) => localStorage.getItem(k), SPENDING_KEY)
    const walletRaw = await page.evaluate((k) => localStorage.getItem(k), WALLET_KEY)
    expect(spendingRaw).toBeNull()
    expect(walletRaw).toBeNull()
  })

  test('After Start fresh presets and upload zone are shown', async ({ page }) => {
    await seedAnalysis(page)
    await page.locator('[data-start-fresh]').click()
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
    await expect(page.getByText('Drag & drop your transaction CSV')).toBeVisible()
  })

  test('banner does NOT show with only spending data (no wallet)', async ({ page }) => {
    await page.goto('/upload')
    await page.evaluate(
      ([k, v]) => { localStorage.setItem(k, v) },
      [SPENDING_KEY, SAMPLE_SPENDING] as const,
    )
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('banner does NOT show with only wallet cards (no spending)', async ({ page }) => {
    await page.goto('/upload')
    await page.evaluate(
      ([k, v]) => { localStorage.setItem(k, v) },
      [WALLET_KEY, SAMPLE_WALLET] as const,
    )
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('banner does NOT show on fresh visit (empty localStorage)', async ({ page }) => {
    await clearAll(page)
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
    // Normal state — presets visible
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
  })

  test('corrupted localStorage spending data does not crash the page', async ({ page }) => {
    await page.goto('/upload')
    await page.evaluate((k) => { localStorage.setItem(k, 'not-valid-json{{{') }, SPENDING_KEY)
    await page.evaluate((k) => { localStorage.setItem(k, '["chase-sapphire-preferred"]') }, WALLET_KEY)
    await page.reload()
    // Page loads without crash
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
    // Banner should not show (corrupted spending = hasAnalysis returns false)
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('corrupted localStorage wallet data does not crash the page', async ({ page }) => {
    await page.goto('/upload')
    await page.evaluate(
      ([k, v]) => { localStorage.setItem(k, v) },
      [SPENDING_KEY, SAMPLE_SPENDING] as const,
    )
    await page.evaluate(
      ([k, v]) => { localStorage.setItem(k, v) },
      [WALLET_KEY, 'INVALID{'] as const,
    )
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('Clear saved data option is accessible in footer', async ({ page }) => {
    await page.goto('/upload')
    await expect(page.locator('[data-clear-saved-data]')).toBeVisible()
    await expect(page.getByText('Clear saved data')).toBeVisible()
  })

  test('Clear saved data in footer clears localStorage and navigates to /upload', async ({ page }) => {
    await seedAnalysis(page)
    await page.locator('[data-clear-saved-data]').click()
    await expect(page).toHaveURL('/upload')
    const spendingRaw = await page.evaluate((k) => localStorage.getItem(k), SPENDING_KEY)
    const walletRaw = await page.evaluate((k) => localStorage.getItem(k), WALLET_KEY)
    expect(spendingRaw).toBeNull()
    expect(walletRaw).toBeNull()
  })

  test('Clear saved data in footer — welcome back banner gone on next load', async ({ page }) => {
    await seedAnalysis(page)
    // Scroll to footer and click clear
    await page.locator('[data-clear-saved-data]').click()
    await expect(page).toHaveURL('/upload')
    // After clearing and navigating back, no welcome back banner
    await expect(page.locator('[data-welcome-back]')).not.toBeVisible()
  })

  test('spending data saved after preset selection (existing behavior)', async ({ page }) => {
    await clearAll(page)
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    const stored = await page.evaluate((k) => localStorage.getItem(k), SPENDING_KEY)
    expect(stored).not.toBeNull()
  })

  test('mobile responsive at 375px — welcome back banner renders without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedAnalysis(page)
    await expect(page.locator('[data-welcome-back]')).toBeVisible()
    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('mobile — View my results button has 44px tap target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedAnalysis(page)
    const btn = page.locator('[data-view-results]')
    await expect(btn).toBeVisible()
    const box = await btn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  test('mobile — Start fresh button has 44px tap target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedAnalysis(page)
    const btn = page.locator('[data-start-fresh]')
    await expect(btn).toBeVisible()
    const box = await btn.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
})
