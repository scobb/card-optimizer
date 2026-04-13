import { test, expect } from '@playwright/test'

test.describe('CO-026: Cross-promotion footer', () => {
  test('footer has cross-promo section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-footer-cross-promo]')).toBeVisible()
  })

  test('cross-promo section has "Also from Keylight Digital" heading', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('[data-footer-cross-promo]')
    await expect(section.getByText(/also from keylight digital/i)).toBeVisible()
  })

  test('Beam link is present with correct href', async ({ page }) => {
    await page.goto('/')
    const beam = page.locator('[data-footer-beam]')
    await expect(beam).toBeVisible()
    await expect(beam).toHaveAttribute('href', 'https://beam-privacy.com')
  })

  test('Beam link opens in new tab', async ({ page }) => {
    await page.goto('/')
    const beam = page.locator('[data-footer-beam]')
    await expect(beam).toHaveAttribute('target', '_blank')
    await expect(beam).toHaveAttribute('rel', /noopener/)
  })

  test('Nexus link is present with correct href', async ({ page }) => {
    await page.goto('/')
    const nexus = page.locator('[data-footer-nexus]')
    await expect(nexus).toBeVisible()
    await expect(nexus).toHaveAttribute('href', 'https://nexus.keylightdigital.dev')
  })

  test('Nexus link opens in new tab', async ({ page }) => {
    await page.goto('/')
    const nexus = page.locator('[data-footer-nexus]')
    await expect(nexus).toHaveAttribute('target', '_blank')
    await expect(nexus).toHaveAttribute('rel', /noopener/)
  })

  test('ProfitTracker link is present with correct href', async ({ page }) => {
    await page.goto('/')
    const pt = page.locator('[data-footer-profittracker]')
    await expect(pt).toBeVisible()
    await expect(pt).toHaveAttribute('href', 'https://profittracker.io')
  })

  test('ProfitTracker link opens in new tab', async ({ page }) => {
    await page.goto('/')
    const pt = page.locator('[data-footer-profittracker]')
    await expect(pt).toHaveAttribute('target', '_blank')
    await expect(pt).toHaveAttribute('rel', /noopener/)
  })

  test('cross-promo section appears on non-root pages too', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-footer-cross-promo]')).toBeVisible()
  })

  test('existing footer links still present alongside cross-promo', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('[data-footer]')
    await expect(footer.locator('[data-footer-privacy]')).toBeVisible()
    await expect(footer.locator('[data-footer-terms]')).toBeVisible()
    await expect(footer.locator('[data-footer-cross-promo]')).toBeVisible()
  })

  test('mobile at 375px — cross-promo section has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })

  test('mobile at 375px — all three product links visible after scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('[data-footer-beam]')).toBeVisible()
    await expect(page.locator('[data-footer-nexus]')).toBeVisible()
    await expect(page.locator('[data-footer-profittracker]')).toBeVisible()
  })
})
