import { test, expect } from '@playwright/test'

test.describe('CO-027: Best Credit Cards of 2026 Roundup Page', () => {
  // -------------------------------------------------------------------------
  test('page renders at /best-cards-2026', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page.locator('[data-best-cards-2026]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('page has correct title', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page).toHaveTitle(/best credit cards of 2026/i)
  })

  // -------------------------------------------------------------------------
  test('page heading is present', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page.locator('[data-page-title]')).toContainText('Best Credit Cards of 2026')
  })

  // -------------------------------------------------------------------------
  test('shows at least 6 category picks', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const picks = page.locator('[data-pick]')
    const count = await picks.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  // -------------------------------------------------------------------------
  test('includes best overall pick for Chase Sapphire Preferred', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const bestOverall = page.locator('[data-pick="best-overall"]')
    await expect(bestOverall).toBeVisible()
    await expect(bestOverall.locator('[data-pick-card-name]')).toContainText(
      'Chase Sapphire Preferred'
    )
  })

  // -------------------------------------------------------------------------
  test('includes best cash back pick for Citi Double Cash', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pick = page.locator('[data-pick="best-cash-back"]')
    await expect(pick).toBeVisible()
    await expect(pick.locator('[data-pick-card-name]')).toContainText('Citi Double Cash')
  })

  // -------------------------------------------------------------------------
  test('includes best travel pick for Capital One Venture X', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pick = page.locator('[data-pick="best-travel"]')
    await expect(pick).toBeVisible()
    await expect(pick.locator('[data-pick-card-name]')).toContainText('Capital One Venture X')
  })

  // -------------------------------------------------------------------------
  test('includes best dining pick for Amex Gold', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pick = page.locator('[data-pick="best-dining"]')
    await expect(pick).toBeVisible()
    await expect(pick.locator('[data-pick-card-name]')).toContainText(
      'American Express Gold Card'
    )
  })

  // -------------------------------------------------------------------------
  test('includes best no annual fee pick for Wells Fargo Active Cash', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pick = page.locator('[data-pick="best-no-annual-fee"]')
    await expect(pick).toBeVisible()
    await expect(pick.locator('[data-pick-card-name]')).toContainText('Wells Fargo Active Cash')
  })

  // -------------------------------------------------------------------------
  test('includes best sign-up bonus pick for Amex Platinum', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pick = page.locator('[data-pick="best-signup-bonus"]')
    await expect(pick).toBeVisible()
    await expect(pick.locator('[data-pick-card-name]')).toContainText('American Express Platinum')
  })

  // -------------------------------------------------------------------------
  test('each pick shows top rate and welcome bonus', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const firstPick = page.locator('[data-pick]').first()
    await expect(firstPick.locator('[data-pick-top-rate]')).toBeVisible()
    await expect(firstPick.locator('[data-pick-bonus]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('each pick links to card detail page', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const pickCardNames = page.locator('[data-pick-card-name]')
    const count = await pickCardNames.count()
    expect(count).toBeGreaterThanOrEqual(6)

    // First pick should link to chase-sapphire-preferred
    const firstCardLink = page.locator('[data-pick="best-overall"] [data-pick-card-name]')
    const href = await firstCardLink.getAttribute('href')
    expect(href).toContain('/cards/chase-sapphire-preferred')
  })

  // -------------------------------------------------------------------------
  test('each pick has apply link with external href', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const applyLinks = page.locator('[data-pick-apply-link]')
    const count = await applyLinks.count()
    expect(count).toBeGreaterThanOrEqual(6)

    for (let i = 0; i < count; i++) {
      const link = applyLinks.nth(i)
      expect(await link.getAttribute('target')).toBe('_blank')
      const href = await link.getAttribute('href')
      expect(href).toMatch(/^https?:\/\//)
    }
  })

  // -------------------------------------------------------------------------
  test('each pick has a CTA linking to /upload', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const ctaLinks = page.locator('[data-pick-cta]')
    const count = await ctaLinks.count()
    expect(count).toBeGreaterThanOrEqual(6)

    for (let i = 0; i < count; i++) {
      const href = await ctaLinks.nth(i).getAttribute('href')
      expect(href).toContain('/upload')
    }
  })

  // -------------------------------------------------------------------------
  test('upload CTA button is present', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const cta = page.locator('[data-cta-upload]')
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('/upload')
  })

  // -------------------------------------------------------------------------
  test('introduction section is present', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page.locator('[data-introduction]')).toBeVisible()
    const text = await page.locator('[data-introduction]').textContent()
    expect(text?.length).toBeGreaterThan(200)
  })

  // -------------------------------------------------------------------------
  test('methodology section is present', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page.locator('[data-methodology]')).toBeVisible()
    const text = await page.locator('[data-methodology]').textContent()
    expect(text?.length).toBeGreaterThan(200)
  })

  // -------------------------------------------------------------------------
  test('category guide links section is present with 6 guide links', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await expect(page.locator('[data-category-guides]')).toBeVisible()
    const guideLinks = page.locator('[data-category-guide-link]')
    const count = await guideLinks.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  // -------------------------------------------------------------------------
  test('category guide links point to /best-cards/:category routes', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const diningLink = page.locator('[data-category-guide-link="dining"]')
    await expect(diningLink).toBeVisible()
    const href = await diningLink.getAttribute('href')
    expect(href).toContain('/best-cards/dining')
  })

  // -------------------------------------------------------------------------
  test('Article JSON-LD structured data is injected', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await page.waitForFunction(() => !!document.getElementById('best-cards-2026-jsonld'))
    const el = page.locator('script#best-cards-2026-jsonld')
    await expect(el).toBeAttached()
    const content = await el.textContent()
    expect(content).toBeTruthy()
    const parsed = JSON.parse(content!)
    expect(parsed['@type']).toBe('Article')
    expect(parsed.headline).toContain('Best Credit Cards of 2026')
  })

  // -------------------------------------------------------------------------
  test('back link to /catalog is present', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const backLink = page.locator('[data-back-to-catalog]')
    await expect(backLink).toBeVisible()
    const href = await backLink.getAttribute('href')
    expect(href).toContain('/catalog')
  })

  // -------------------------------------------------------------------------
  test('sitemap includes /best-cards-2026', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('/best-cards-2026')
  })

  // -------------------------------------------------------------------------
  test('page content is 1000+ words', async ({ page }) => {
    await page.goto('/best-cards-2026')
    const bodyText = await page.locator('[data-best-cards-2026]').textContent()
    const wordCount = bodyText?.split(/\s+/).filter(Boolean).length ?? 0
    expect(wordCount).toBeGreaterThan(1000)
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('mobile — upload CTA visible after scroll at 375px', async ({ page }) => {
    await page.goto('/best-cards-2026')
    await page.setViewportSize({ width: 375, height: 812 })
    const cta = page.locator('[data-upload-cta]')
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toBeVisible()
  })
})
