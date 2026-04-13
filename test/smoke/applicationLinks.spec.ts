import { test, expect } from '@playwright/test'

test.describe('CO-034: Card application links', () => {
  // -------------------------------------------------------------------------
  test('GET /api/cards includes learnMoreUrl for all cards', async ({ request }) => {
    const res = await request.get('/api/cards')
    expect(res.status()).toBe(200)
    const cards = await res.json() as Array<{ id: string; learnMoreUrl: string }>
    expect(cards.length).toBeGreaterThanOrEqual(30)
    // All cards should have a learnMoreUrl
    const missing = cards.filter((c) => !c.learnMoreUrl)
    expect(missing.length).toBe(0)
  })

  // -------------------------------------------------------------------------
  test('learnMoreUrl values are valid https URLs', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string; learnMoreUrl: string }>
    const invalid = cards.filter((c) => !c.learnMoreUrl.startsWith('https://'))
    expect(invalid.length).toBe(0)
  })

  // -------------------------------------------------------------------------
  test('at least 30 cards have valid learnMoreUrl', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string; learnMoreUrl: string }>
    const withUrl = cards.filter((c) => c.learnMoreUrl && c.learnMoreUrl.startsWith('https://'))
    expect(withUrl.length).toBeGreaterThanOrEqual(30)
  })

  // -------------------------------------------------------------------------
  test('card detail page shows Learn More at [Issuer] button', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await expect(page.locator('[data-learn-more-link]')).toBeVisible()
    const text = await page.locator('[data-learn-more-link]').textContent()
    expect(text).toMatch(/Learn More at/i)
    expect(text).toMatch(/Chase/i)
  })

  // -------------------------------------------------------------------------
  test('card detail learn more link opens in new tab', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    const link = page.locator('[data-learn-more-link]')
    expect(await link.getAttribute('target')).toBe('_blank')
    expect(await link.getAttribute('rel')).toContain('noopener')
  })

  // -------------------------------------------------------------------------
  test('card detail learn more link has valid href', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    const href = await page.locator('[data-learn-more-link]').getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^https:\/\//)
  })

  // -------------------------------------------------------------------------
  test('card detail page shows disclosure text', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await expect(page.locator('[data-apply-disclosure]')).toBeVisible()
    const text = await page.locator('[data-apply-disclosure]').textContent()
    expect(text).toMatch(/not compensated/i)
  })

  // -------------------------------------------------------------------------
  test('recommendations page shows Learn More links when cards recommended', async ({ page }) => {
    // Seed spending + wallet data so recommendations appear
    const SPENDING = JSON.stringify({
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'groceries', monthlyAvg: 300, annualTotal: 3600, transactionCount: 36 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 120,
    })
    await page.goto('/upload')
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_spending_data', SPENDING] as const)

    await page.goto('/recommendations')
    // Wait for recommendations list
    await expect(page.locator('[data-testid="recommendations-list"]')).toBeVisible({ timeout: 10000 })
    const learnMoreLinks = page.locator('[data-learn-more-link]')
    const count = await learnMoreLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('recommendations page Learn More links open in new tab', async ({ page }) => {
    const SPENDING = JSON.stringify({
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 80,
    })
    await page.goto('/upload')
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_spending_data', SPENDING] as const)

    await page.goto('/recommendations')
    await expect(page.locator('[data-testid="recommendations-list"]')).toBeVisible({ timeout: 10000 })
    const firstLink = page.locator('[data-learn-more-link]').first()
    expect(await firstLink.getAttribute('target')).toBe('_blank')
    expect(await firstLink.getAttribute('rel')).toContain('noopener')
  })

  // -------------------------------------------------------------------------
  test('recommendations page shows disclosure text', async ({ page }) => {
    const SPENDING = JSON.stringify({
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 80,
    })
    await page.goto('/upload')
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_spending_data', SPENDING] as const)

    await page.goto('/recommendations')
    await expect(page.locator('[data-testid="recommendations-list"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-apply-disclosure]')).toBeVisible()
    const text = await page.locator('[data-apply-disclosure]').textContent()
    expect(text).toMatch(/not compensated/i)
  })

  // -------------------------------------------------------------------------
  test('catalog page apply links have valid href', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
    const firstApply = page.locator('[data-catalog-apply]').first()
    const href = await firstApply.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^https:\/\//)
  })

  // -------------------------------------------------------------------------
  test('mobile — Learn More button is usable at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/cards/chase-sapphire-preferred')
    const link = page.locator('[data-learn-more-link]')
    await expect(link).toBeVisible()
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    // Button height >= 44px (tap target)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    // Button should be at least 200px wide on mobile (full-width or near)
    expect(box!.width).toBeGreaterThanOrEqual(200)
  })

  // -------------------------------------------------------------------------
  test('card detail page for Amex Gold shows Learn More at American Express', async ({ page }) => {
    await page.goto('/cards/amex-gold')
    await expect(page.locator('[data-learn-more-link]')).toBeVisible()
    const text = await page.locator('[data-learn-more-link]').textContent()
    expect(text).toMatch(/Learn More at/i)
    expect(text).toMatch(/American Express/i)
  })
})
