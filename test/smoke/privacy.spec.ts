import { test, expect } from '@playwright/test'

test.describe('CO-011: Privacy policy and footer', () => {
  test('/privacy route renders privacy page', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('[data-privacy]')).toBeVisible()
  })

  test('privacy page has main heading', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeVisible()
  })

  test('privacy page explains no data sent to servers', async ({ page }) => {
    await page.goto('/privacy')
    const policy = page.locator('[data-privacy-policy]')
    await expect(policy).toBeVisible()
    await expect(policy.getByText(/never transmitted/i)).toBeVisible()
  })

  test('privacy page explains localStorage only', async ({ page }) => {
    await page.goto('/privacy')
    const policy = page.locator('[data-privacy-policy]')
    await expect(policy.getByText(/localStorage/i)).toBeVisible()
  })

  test('privacy page has no tracking statement', async ({ page }) => {
    await page.goto('/privacy')
    const policy = page.locator('[data-privacy-policy]')
    await expect(policy.getByText(/tracking pixels/i)).toBeVisible()
  })

  test('privacy page has not-financial-advice disclaimer', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('[data-privacy-disclaimer]')).toBeVisible()
    await expect(page.locator('[data-privacy-disclaimer]').getByText(/not financial advice/i)).toBeVisible()
  })

  test('footer visible on home page with Privacy link', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('[data-footer]')
    await expect(footer).toBeVisible()
    await expect(footer.locator('[data-footer-privacy]')).toBeVisible()
  })

  test('footer visible on upload page', async ({ page }) => {
    await page.goto('/upload')
    await expect(page.locator('[data-footer]')).toBeVisible()
  })

  test('footer Privacy link navigates to /privacy', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-footer-privacy]').click()
    await expect(page).toHaveURL(/\/privacy/)
    await expect(page.locator('[data-privacy]')).toBeVisible()
  })

  test('footer shows "Built by Keylight Digital"', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('[data-footer]')
    await expect(footer.getByText(/keylight digital/i).first()).toBeVisible()
  })

  test('mobile at 375px — privacy page no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/privacy')
    await expect(page.locator('[data-privacy]')).toBeVisible()
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })

  test('mobile at 375px — footer is visible and readable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('[data-footer]')).toBeVisible()
    await expect(page.locator('[data-footer-privacy]')).toBeVisible()
  })

  test('privacy highlights section visible (3 key facts)', async ({ page }) => {
    await page.goto('/privacy')
    const highlights = page.locator('[data-privacy-highlights]')
    await expect(highlights).toBeVisible()
    await expect(highlights.locator('h3')).toHaveCount(3)
  })
})
