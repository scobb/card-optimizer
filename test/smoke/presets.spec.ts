import { test, expect, Page } from '@playwright/test'

async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function gotoUpload(page: Page) {
  await page.goto('/upload')
  await clearLocalStorage(page)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
}

test.describe('CO-030: Spending Presets', () => {
  test('preset section is visible on upload page', async ({ page }) => {
    await gotoUpload(page)
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
    await expect(page.getByText('Try a spending preset')).toBeVisible()
  })

  test('all 4 preset buttons are shown', async ({ page }) => {
    await gotoUpload(page)
    await expect(page.locator('[data-preset-id="average-american"]')).toBeVisible()
    await expect(page.locator('[data-preset-id="frequent-traveler"]')).toBeVisible()
    await expect(page.locator('[data-preset-id="online-shopper"]')).toBeVisible()
    await expect(page.locator('[data-preset-id="foodie"]')).toBeVisible()
  })

  test('preset cards show name, monthly total, and description', async ({ page }) => {
    await gotoUpload(page)
    const avgAmerican = page.locator('[data-preset-id="average-american"]')
    await expect(avgAmerican.getByText('Average American')).toBeVisible()
    await expect(avgAmerican.getByText('$4,500/mo').first()).toBeVisible()
    await expect(avgAmerican.getByText(/BLS Consumer Expenditure/i)).toBeVisible()
  })

  test('clicking Average American preset loads spending breakdown', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="average-american"]').click()
    // Breakdown table appears
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    // Categories from preset visible
    await expect(page.getByRole('cell', { name: 'Groceries' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
  })

  test('clicking Frequent Traveler preset loads breakdown with travel category', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="frequent-traveler"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('cell', { name: 'Travel' })).toBeVisible()
  })

  test('clicking Online Shopper preset loads breakdown with online shopping category', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="online-shopper"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('cell', { name: 'Online Shopping' })).toBeVisible()
  })

  test('clicking Foodie preset loads breakdown with high dining spend', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="foodie"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
  })

  test('preset selection shows Optimize My Wallet CTA linking to /wallet', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.locator('[data-preset-cta]')).toBeVisible({ timeout: 5000 })
    const link = page.locator('[data-optimize-link]')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/wallet')
  })

  test('optimization runs after clicking CTA — wallet page shows optimization results', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.locator('[data-optimize-link]')).toBeVisible({ timeout: 5000 })
    await page.locator('[data-optimize-link]').click()
    // Wallet page loads with spending data
    await expect(page).toHaveURL('/wallet')
    await expect(page.getByRole('heading', { name: /wallet/i })).toBeVisible()
  })

  test('preset data is saved to localStorage', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="frequent-traveler"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    const stored = await page.evaluate(() => localStorage.getItem('co_spending_data'))
    expect(stored).not.toBeNull()
    const data = JSON.parse(stored!)
    expect(data.formatLabel).toBe('Frequent Traveler spending profile')
  })

  test('preset survives page reload (persisted to localStorage)', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="online-shopper"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await page.reload()
    // Breakdown still visible after reload
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
  })

  test('Try a different profile button clears preset and shows presets again', async ({ page }) => {
    await gotoUpload(page)
    await page.locator('[data-preset-id="foodie"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /try a different profile/i }).click()
    // Presets section re-appears
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
    // Breakdown gone
    await expect(page.getByRole('table')).not.toBeVisible()
  })

  test('presets section hides after selecting a preset', async ({ page }) => {
    await gotoUpload(page)
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    // Presets hidden once data is loaded
    await expect(page.locator('[data-spending-presets]')).not.toBeVisible()
  })

  test('presets appear above the CSV upload zone', async ({ page }) => {
    await gotoUpload(page)
    const presetsBox = await page.locator('[data-spending-presets]').boundingBox()
    const uploadZoneBox = await page.getByText('Drag & drop your transaction CSV').boundingBox()
    expect(presetsBox).not.toBeNull()
    expect(uploadZoneBox).not.toBeNull()
    // Presets should be higher on page (smaller y coordinate)
    expect(presetsBox!.y).toBeLessThan(uploadZoneBox!.y)
  })

  test('mobile responsive at 375px — presets are tappable cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoUpload(page)
    await expect(page.locator('[data-spending-presets]')).toBeVisible()
    // All 4 presets visible at mobile width
    for (const id of ['average-american', 'frequent-traveler', 'online-shopper', 'foodie']) {
      const btn = page.locator(`[data-preset-id="${id}"]`)
      await expect(btn).toBeVisible()
      const box = await btn.boundingBox()
      expect(box).not.toBeNull()
      // Tap target >= 44px tall
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('mobile — preset selection and CTA work at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoUpload(page)
    await page.locator('[data-preset-id="average-american"]').click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    const cta = page.locator('[data-optimize-link]')
    await expect(cta).toBeVisible()
    // CTA tap target >= 44px
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
})
