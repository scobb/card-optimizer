import { test, expect } from '@playwright/test'

test.describe('CO-035: Quick results preview on landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-landing]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('landing page has a See It In Action section', async ({ page }) => {
    await expect(page.locator('[data-landing-preview]')).toBeVisible()
    await expect(page.getByRole('heading', { name: /see it in action/i })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('preview section shows Average American spending profile', async ({ page }) => {
    const preview = page.locator('[data-landing-preview]')
    await expect(preview).toContainText('Average American')
    await expect(preview).toContainText('$4,500/mo')
  })

  // -------------------------------------------------------------------------
  test('preview shows 3 recommended card names', async ({ page }) => {
    const cards = page.locator('[data-preview-card]')
    await expect(cards).toHaveCount(3)
    for (let i = 0; i < 3; i++) {
      const name = cards.nth(i).locator('[data-preview-card-name]')
      const text = await name.textContent()
      expect(text).toBeTruthy()
      expect(text!.length).toBeGreaterThan(3)
    }
  })

  // -------------------------------------------------------------------------
  test('each preview card shows a net annual value', async ({ page }) => {
    const cards = page.locator('[data-preview-card]')
    const count = await cards.count()
    expect(count).toBe(3)
    for (let i = 0; i < count; i++) {
      const cardText = await cards.nth(i).textContent()
      // Should contain a dollar amount like $XXX/yr
      expect(cardText).toMatch(/\$[\d,]+\/yr/)
    }
  })

  // -------------------------------------------------------------------------
  test('preview shows estimated annual savings vs 1% baseline', async ({ page }) => {
    const savings = page.locator('[data-preview-savings]')
    await expect(savings).toBeVisible()
    const text = await savings.textContent()
    expect(text).toMatch(/\$[\d,]+/)
    // Savings should be positive
    const amount = parseInt(text!.replace(/[^0-9]/g, ''), 10)
    expect(amount).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('preview CTA button links to /upload', async ({ page }) => {
    const cta = page.locator('[data-preview-cta]')
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('/upload')
  })

  // -------------------------------------------------------------------------
  test('preview CTA says Try with your spending', async ({ page }) => {
    const cta = page.locator('[data-preview-cta]')
    const text = await cta.textContent()
    expect(text).toMatch(/try with your spending/i)
  })

  // -------------------------------------------------------------------------
  test('preview section is above how-it-works section', async ({ page }) => {
    const previewBox = await page.locator('[data-landing-preview]').boundingBox()
    const howBox = await page.locator('[data-landing-how]').boundingBox()
    expect(previewBox).not.toBeNull()
    expect(howBox).not.toBeNull()
    expect(previewBox!.y).toBeLessThan(howBox!.y)
  })

  // -------------------------------------------------------------------------
  test('mobile responsive at 375px — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('[data-landing-preview]')).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('mobile — CTA has min 44px tap target', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const cta = page.locator('[data-preview-cta]')
    await expect(cta).toBeVisible()
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  // -------------------------------------------------------------------------
  test('clicking preview CTA navigates to upload page', async ({ page }) => {
    await page.locator('[data-preview-cta]').click()
    await expect(page).toHaveURL(/\/upload/)
  })
})
