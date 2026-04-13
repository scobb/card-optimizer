import { test, expect } from '@playwright/test'

test.describe('CO-019: FAQ page with structured data', () => {
  // ---------------------------------------------------------------------------
  test('/faq route renders FAQ page', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('[data-faq-page]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has h1 heading', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/frequently asked questions/i)
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has 4 topic groups', async ({ page }) => {
    await page.goto('/faq')
    const groups = page.locator('[data-faq-group]')
    await expect(groups).toHaveCount(4)
  })

  // ---------------------------------------------------------------------------
  test('FAQ groups are: About the Tool, Privacy & Data, Card Strategy, Rewards Basics', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('[data-faq-group="About the Tool"]')).toBeVisible()
    await expect(page.locator('[data-faq-group="Privacy & Data"]')).toBeVisible()
    await expect(page.locator('[data-faq-group="Card Strategy"]')).toBeVisible()
    await expect(page.locator('[data-faq-group="Rewards Basics"]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has at least 15 questions total', async ({ page }) => {
    await page.goto('/faq')
    // Count all accordion buttons (each question is a button)
    const buttons = page.locator('[data-faq-page] button[aria-expanded]')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(15)
  })

  // ---------------------------------------------------------------------------
  test('accordion items are collapsed by default', async ({ page }) => {
    await page.goto('/faq')
    const answers = page.locator('[data-faq-answer]')
    await expect(answers).toHaveCount(0)
  })

  // ---------------------------------------------------------------------------
  test('accordion expands on click', async ({ page }) => {
    await page.goto('/faq')
    const firstButton = page.locator('[data-faq-page] button[aria-expanded]').first()
    await firstButton.click()
    await expect(page.locator('[data-faq-answer]').first()).toBeVisible()
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  // ---------------------------------------------------------------------------
  test('accordion collapses on second click', async ({ page }) => {
    await page.goto('/faq')
    const firstButton = page.locator('[data-faq-page] button[aria-expanded]').first()
    await firstButton.click()
    await expect(page.locator('[data-faq-answer]').first()).toBeVisible()
    await firstButton.click()
    await expect(page.locator('[data-faq-answer]')).toHaveCount(0)
  })

  // ---------------------------------------------------------------------------
  test('multiple items can be open simultaneously', async ({ page }) => {
    await page.goto('/faq')
    const buttons = page.locator('[data-faq-page] button[aria-expanded]')
    await buttons.nth(0).click()
    await buttons.nth(1).click()
    const answers = page.locator('[data-faq-answer]')
    await expect(answers).toHaveCount(2)
  })

  // ---------------------------------------------------------------------------
  test('Privacy & Data group mentions "transaction data" privacy answer', async ({ page }) => {
    await page.goto('/faq')
    // Open the first question in the Privacy group
    const privacyGroup = page.locator('[data-faq-group="Privacy & Data"]')
    await privacyGroup.locator('button[aria-expanded]').first().click()
    await expect(privacyGroup.locator('[data-faq-answer]').first()).toContainText(/never/)
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has internal links to card detail pages', async ({ page }) => {
    await page.goto('/faq')
    // Expand Card Strategy group to reveal card links
    const strategyGroup = page.locator('[data-faq-group="Card Strategy"]')
    const strategyButtons = strategyGroup.locator('button[aria-expanded]')
    for (let i = 0; i < await strategyButtons.count(); i++) {
      await strategyButtons.nth(i).click()
    }
    const cardLinks = strategyGroup.locator('a[href^="/cards/"]')
    await expect(cardLinks.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has internal links to category guide pages', async ({ page }) => {
    await page.goto('/faq')
    const strategyGroup = page.locator('[data-faq-group="Card Strategy"]')
    const strategyButtons = strategyGroup.locator('button[aria-expanded]')
    for (let i = 0; i < await strategyButtons.count(); i++) {
      await strategyButtons.nth(i).click()
    }
    const guideLinks = strategyGroup.locator('a[href^="/best-cards/"]')
    await expect(guideLinks.first()).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has unique document title', async ({ page }) => {
    await page.goto('/faq')
    const title = await page.title()
    expect(title).toMatch(/faq/i)
    expect(title).toMatch(/card optimizer/i)
  })

  // ---------------------------------------------------------------------------
  test('FAQ page has FAQPage JSON-LD structured data', async ({ page }) => {
    await page.goto('/faq')
    const jsonld = await page.evaluate(() => {
      const el = document.getElementById('faq-jsonld')
      if (!el) return null
      try { return JSON.parse(el.textContent || '') } catch { return null }
    })
    expect(jsonld).not.toBeNull()
    expect(jsonld['@type']).toBe('FAQPage')
    expect(Array.isArray(jsonld.mainEntity)).toBe(true)
    expect(jsonld.mainEntity.length).toBeGreaterThanOrEqual(15)
  })

  // ---------------------------------------------------------------------------
  test('FAQPage JSON-LD has valid Question/Answer structure', async ({ page }) => {
    await page.goto('/faq')
    const jsonld = await page.evaluate(() => {
      const el = document.getElementById('faq-jsonld')
      if (!el) return null
      try { return JSON.parse(el.textContent || '') } catch { return null }
    })
    const first = jsonld.mainEntity[0]
    expect(first['@type']).toBe('Question')
    expect(typeof first.name).toBe('string')
    expect(first.acceptedAnswer['@type']).toBe('Answer')
    expect(typeof first.acceptedAnswer.text).toBe('string')
  })

  // ---------------------------------------------------------------------------
  test('FAQ page CTA links to /upload', async ({ page }) => {
    await page.goto('/faq')
    const cta = page.locator('[data-faq-cta]')
    await expect(cta).toBeVisible()
    await expect(cta.locator('a[href="/upload"]')).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  test('sitemap includes /faq', async ({ request }) => {
    const resp = await request.get('/sitemap.xml')
    expect(resp.status()).toBe(200)
    const body = await resp.text()
    expect(body).toContain('/faq')
  })

  // ---------------------------------------------------------------------------
  test('mobile at 375px — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/faq')
    await expect(page.locator('[data-faq-page]')).toBeVisible()
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })

  // ---------------------------------------------------------------------------
  test('mobile at 375px — accordion buttons have adequate tap targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/faq')
    const firstButton = page.locator('[data-faq-page] button[aria-expanded]').first()
    const box = await firstButton.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  // ---------------------------------------------------------------------------
  test('mobile — accordion expands and answer is readable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/faq')
    await page.locator('[data-faq-page] button[aria-expanded]').first().click()
    await expect(page.locator('[data-faq-answer]').first()).toBeVisible()
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })
})
