import { test, expect } from '@playwright/test'

const COMPETITORS = [
  {
    slug: 'nerdwallet',
    name: 'NerdWallet',
    titleContains: 'NerdWallet',
  },
  {
    slug: 'the-points-guy',
    name: 'The Points Guy',
    titleContains: 'Points Guy',
  },
]

test.describe('CO-029: Tool comparison pages /vs/nerdwallet and /vs/the-points-guy', () => {
  // -------------------------------------------------------------------------
  test('/vs/nerdwallet renders comparison page', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    await expect(page.locator('[data-vs-page="nerdwallet"]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('/vs/the-points-guy renders comparison page', async ({ page }) => {
    await page.goto('/vs/the-points-guy')
    await expect(page.locator('[data-vs-page="the-points-guy"]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('each page has unique title targeting competitor name', async ({ page }) => {
    for (const { slug, titleContains } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      await expect(page).toHaveTitle(new RegExp(titleContains, 'i'))
    }
  })

  // -------------------------------------------------------------------------
  test('/vs/nerdwallet title and meta target nerdwallet alternative searches', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const title = await page.title()
    expect(title.toLowerCase()).toContain('nerdwallet')
    expect(title.toLowerCase()).toContain('cardoptimizer')
  })

  // -------------------------------------------------------------------------
  test('/vs/the-points-guy title and meta target the-points-guy alternative searches', async ({ page }) => {
    await page.goto('/vs/the-points-guy')
    const title = await page.title()
    expect(title.toLowerCase()).toMatch(/points guy/i)
  })

  // -------------------------------------------------------------------------
  test('each page has comparison table (feature/us/them)', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      await expect(
        page.locator('[data-comparison-table]'),
        `Comparison table on /vs/${slug}`
      ).toBeVisible()
      const rows = page.locator('[data-comparison-table] tbody tr')
      const count = await rows.count()
      expect(count, `table rows on /vs/${slug}`).toBeGreaterThan(5)
    }
  })

  // -------------------------------------------------------------------------
  test('comparison table has CardOptimizer and competitor columns', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const headers = page.locator('[data-comparison-table] thead th')
    const count = await headers.count()
    expect(count).toBeGreaterThanOrEqual(3) // Feature + us + them
    const headerText = await page.locator('[data-comparison-table] thead').textContent()
    expect(headerText).toContain('CardOptimizer')
    expect(headerText).toContain('NerdWallet')
  })

  // -------------------------------------------------------------------------
  test('advantages section lists where CardOptimizer wins', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const advantages = page.locator('[data-advantages]')
    await expect(advantages).toBeVisible()
    const text = await advantages.textContent()
    expect(text).toMatch(/CardOptimizer/i)
  })

  // -------------------------------------------------------------------------
  test('intro section is present with 200+ chars', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      await expect(page.locator('[data-intro-section]')).toBeVisible()
      const text = await page.locator('[data-intro-section]').textContent()
      expect(text?.length, `intro length on /vs/${slug}`).toBeGreaterThan(200)
    }
  })

  // -------------------------------------------------------------------------
  test('body section is present with 800+ words', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      const pageText = await page.locator('[data-vs-page]').textContent()
      const wordCount = pageText?.split(/\s+/).filter(Boolean).length ?? 0
      expect(wordCount, `word count on /vs/${slug}`).toBeGreaterThan(800)
    }
  })

  // -------------------------------------------------------------------------
  test('CTA section links to /upload', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      const cta = page.locator('[data-cta-upload]')
      await expect(cta, `CTA on /vs/${slug}`).toBeVisible()
      const ctaLink = page.locator('[data-cta-link]')
      const href = await ctaLink.getAttribute('href')
      expect(href, `CTA href on /vs/${slug}`).toContain('/upload')
    }
  })

  // -------------------------------------------------------------------------
  test('internal links section is present', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      await expect(
        page.locator('[data-internal-links]'),
        `Internal links on /vs/${slug}`
      ).toBeVisible()
    }
  })

  // -------------------------------------------------------------------------
  test('external link to competitor is present', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const competitorLink = page.locator('[data-competitor-link]')
    await expect(competitorLink).toBeVisible()
    const href = await competitorLink.getAttribute('href')
    expect(href).toMatch(/nerdwallet\.com/)
    expect(await competitorLink.getAttribute('target')).toBe('_blank')
  })

  // -------------------------------------------------------------------------
  test('Article JSON-LD is injected on both pages', async ({ page }) => {
    for (const { slug } of COMPETITORS) {
      await page.goto(`/vs/${slug}`)
      await page.waitForFunction(() => !!document.getElementById('vs-page-jsonld'))
      const el = page.locator('script#vs-page-jsonld')
      await expect(el).toBeAttached()
      const content = await el.textContent()
      const parsed = JSON.parse(content!)
      expect(parsed['@type'], `@type on /vs/${slug}`).toBe('Article')
    }
  })

  // -------------------------------------------------------------------------
  test('back link to /catalog is present', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const backLink = page.locator('[data-back-to-catalog]')
    await expect(backLink).toBeVisible()
    const href = await backLink.getAttribute('href')
    expect(href).toContain('/catalog')
  })

  // -------------------------------------------------------------------------
  test('sitemap includes /vs/nerdwallet and /vs/the-points-guy', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('/vs/nerdwallet')
    expect(body).toContain('/vs/the-points-guy')
  })

  // -------------------------------------------------------------------------
  test('the two pages have different titles', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    const title1 = await page.title()
    await page.goto('/vs/the-points-guy')
    const title2 = await page.title()
    expect(title1).not.toBe(title2)
  })

  // -------------------------------------------------------------------------
  test('404-style for unknown competitor slug', async ({ page }) => {
    await page.goto('/vs/unknown-tool')
    await expect(page.getByText('Comparison not found')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px on NerdWallet page', async ({ page }) => {
    await page.goto('/vs/nerdwallet')
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px on The Points Guy page', async ({ page }) => {
    await page.goto('/vs/the-points-guy')
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
