import { test, expect } from '@playwright/test'

test.describe('CO-022: Annual Fee Credit Cards blog article', () => {
  const SLUG = 'annual-fee-worth-it'

  async function gotoArticle(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
    await page.goto(`/blog/${SLUG}`)
    await expect(page.locator('[data-blog-post-page]')).toBeVisible()
  }

  // ---------------------------------------------------------------------------
  test('/blog listing shows annual-fee-worth-it post', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator('[data-blog-listing]')).toBeVisible()
    await expect(page.locator(`[data-blog-post="${SLUG}"]`)).toBeVisible()
  })

  test('/blog/:slug route renders the article', async ({ page }) => {
    await gotoArticle(page)
    await expect(page.locator('[data-article-body]')).toBeVisible()
  })

  test('article h1 title mentions annual fee', async ({ page }) => {
    await gotoArticle(page)
    await expect(page.locator('[data-article-title]')).toContainText(/annual fee/i)
  })

  test('article has unique title tag', async ({ page }) => {
    await gotoArticle(page)
    await expect(page).toHaveTitle(/annual fee/i)
  })

  test('article has H2 headings (structure)', async ({ page }) => {
    await gotoArticle(page)
    const h2s = page.locator('[data-article-body] h2')
    const count = await h2s.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('article has H3 headings for card analysis', async ({ page }) => {
    await gotoArticle(page)
    const h3s = page.locator('[data-article-body] h3')
    const count = await h3s.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('article has break-even table', async ({ page }) => {
    await gotoArticle(page)
    await expect(page.locator('[data-break-even-table]')).toBeVisible()
  })

  test('break-even table shows at least 5 cards', async ({ page }) => {
    await gotoArticle(page)
    const rows = page.locator('[data-break-even-table] tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('article has multiple CTAs linking to /builder', async ({ page }) => {
    await gotoArticle(page)
    const ctas = page.locator('[data-article-cta]')
    const count = await ctas.count()
    expect(count).toBeGreaterThanOrEqual(3)
    // All CTAs should link to /builder
    for (let i = 0; i < count; i++) {
      const href = await ctas.nth(i).getAttribute('href')
      expect(href).toContain('/builder')
    }
  })

  test('article has internal links to card detail pages', async ({ page }) => {
    await gotoArticle(page)
    const cardLinks = page.locator('[data-article-body] a[href*="/cards/"]')
    const count = await cardLinks.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('article mentions Amex Blue Cash Preferred', async ({ page }) => {
    await gotoArticle(page)
    await expect(page.locator('[data-article-body]')).toContainText(/amex blue cash preferred/i)
  })

  test('article mentions Chase Sapphire', async ({ page }) => {
    await gotoArticle(page)
    await expect(page.locator('[data-article-body]')).toContainText(/chase sapphire/i)
  })

  test('article has Article JSON-LD structured data', async ({ page }) => {
    await gotoArticle(page)
    await page.waitForFunction(() => !!document.getElementById('blog-post-jsonld'))
    const jsonld = await page.evaluate(() => {
      const el = document.getElementById('blog-post-jsonld')
      return el ? JSON.parse(el.textContent ?? '{}') : {}
    })
    expect(jsonld['@type']).toBe('Article')
    expect(jsonld.headline).toMatch(/annual fee/i)
    expect(jsonld.datePublished).toBeTruthy()
  })

  test('article content is 1500+ words', async ({ page }) => {
    await gotoArticle(page)
    const wordCount = await page.evaluate(() => {
      const body = document.querySelector('[data-article-body]')
      if (!body) return 0
      return (body.textContent ?? '').trim().split(/\s+/).length
    })
    expect(wordCount).toBeGreaterThanOrEqual(1500)
  })

  test('back link navigates to /blog', async ({ page }) => {
    await gotoArticle(page)
    await page.locator('[data-back-to-blog]').click()
    expect(page.url()).toContain('/blog')
  })

  test('sitemap includes /blog/annual-fee-worth-it', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    expect(res?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain(`/blog/${SLUG}`)
  })

  test('mobile responsive at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoArticle(page)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })
})
