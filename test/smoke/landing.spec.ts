import { test, expect } from '@playwright/test'

test.describe('CO-010: Landing page', () => {
  test('/ renders landing page (not redirect to /upload)', async ({ page }) => {
    await page.goto('/')
    // Should stay at / — not redirect
    expect(page.url()).not.toContain('/upload')
    await expect(page.locator('[data-landing]')).toBeVisible()
  })

  test('hero section is visible with headline and CTA', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('[data-landing-hero]')
    await expect(hero).toBeVisible()
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('[data-landing-cta]')).toBeVisible()
  })

  test('CTA button links to /upload', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-landing-cta]').click()
    await expect(page).toHaveURL(/\/upload/)
  })

  test('how-it-works section has 3 steps', async ({ page }) => {
    await page.goto('/')
    const how = page.locator('[data-landing-how]')
    await expect(how).toBeVisible()
    // 3 step headings inside how-it-works
    const steps = how.locator('h3')
    await expect(steps).toHaveCount(3)
  })

  test('features section lists key capabilities', async ({ page }) => {
    await page.goto('/')
    const features = page.locator('[data-landing-features]')
    await expect(features).toBeVisible()
    await expect(features.getByText('Wallet Optimizer')).toBeVisible()
    await expect(features.getByText('Card Recommendations')).toBeVisible()
    await expect(features.getByText('Wallet Builder')).toBeVisible()
    await expect(features.getByText('Share Your Results')).toBeVisible()
  })

  test('privacy section is prominent', async ({ page }) => {
    await page.goto('/')
    const privacy = page.locator('[data-landing-privacy]')
    await expect(privacy).toBeVisible()
    await expect(privacy.getByText(/browser/i)).toBeVisible()
  })

  test('stats section shows card count', async ({ page }) => {
    await page.goto('/')
    const stats = page.locator('[data-landing-stats]')
    await expect(stats).toBeVisible()
    const cardStat = page.locator('[data-stat-cards]')
    await expect(cardStat).toBeVisible()
    const text = await cardStat.textContent()
    // Should show a number like "22+"
    expect(text).toMatch(/\d+/)
  })

  test('mobile at 375px — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('[data-landing]')).toBeVisible()
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })

  test('mobile at 375px — CTA button visible above fold', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const cta = page.locator('[data-landing-cta]')
    await expect(cta).toBeVisible()
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    // CTA bottom should be within viewport (above fold = within 812px)
    expect(box!.y + box!.height).toBeLessThanOrEqual(812)
  })

  test('mobile at 375px — CTA is tappable (height ≥ 44px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const cta = page.locator('[data-landing-cta]')
    const box = await cta.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
})
