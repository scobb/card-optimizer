import { test, expect } from '@playwright/test'

test.describe('CO-020: Blog listing page and article', () => {
  // Helper: navigate to /blog and wait for the listing page to render
  async function gotoBlog(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
    await page.goto('/blog')
    await expect(page.locator('[data-blog-listing]')).toBeVisible()
  }

  // Helper: navigate to the how-to-choose article
  async function gotoHowToChoose(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
    await page.goto('/blog/how-to-choose-best-credit-card')
    await expect(page.locator('[data-blog-post-page]')).toBeVisible()
  }

  // ---------------------------------------------------------------------------
  // Blog listing page
  // ---------------------------------------------------------------------------

  test('/blog route renders the blog listing page', async ({ page }) => {
    await gotoBlog(page)
    await expect(page.locator('[data-blog-listing]')).toBeVisible()
  })

  test('/blog listing page has h1 heading', async ({ page }) => {
    await gotoBlog(page)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/credit card strategy/i)
  })

  test('/blog listing page shows at least one post', async ({ page }) => {
    await gotoBlog(page)
    const posts = page.locator('[data-blog-post]')
    const count = await posts.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('/blog listing page shows the how-to-choose article', async ({ page }) => {
    await gotoBlog(page)
    await expect(
      page.locator('[data-blog-post="how-to-choose-best-credit-card"]')
    ).toBeVisible()
  })

  test('/blog listing post link navigates to article', async ({ page }) => {
    await gotoBlog(page)
    await page.locator('[data-post-link="how-to-choose-best-credit-card"]').click()
    await expect(page.locator('[data-blog-post-page]')).toBeVisible()
    expect(page.url()).toContain('/blog/how-to-choose-best-credit-card')
  })

  test('/blog listing has CTA to /upload', async ({ page }) => {
    await gotoBlog(page)
    const cta = page.locator('[data-blog-listing-cta]')
    await expect(cta).toBeVisible()
    await cta.click()
    expect(page.url()).toContain('/upload')
  })

  // ---------------------------------------------------------------------------
  // Blog post page — /blog/how-to-choose-best-credit-card
  // ---------------------------------------------------------------------------

  test('/blog/how-to-choose-best-credit-card renders article', async ({ page }) => {
    await gotoHowToChoose(page)
    await expect(page.locator('[data-article-body]')).toBeVisible()
  })

  test('article has correct h1 title', async ({ page }) => {
    await gotoHowToChoose(page)
    await expect(page.locator('[data-article-title]')).toContainText(
      /how to choose the best credit card/i
    )
  })

  test('article page has unique title tag', async ({ page }) => {
    await gotoHowToChoose(page)
    await expect(page).toHaveTitle(/how to choose the best credit card/i)
  })

  test('article body has H2 headings (proper structure)', async ({ page }) => {
    await gotoHowToChoose(page)
    const h2s = page.locator('[data-article-body] h2')
    const count = await h2s.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('article body has H3 headings', async ({ page }) => {
    await gotoHowToChoose(page)
    const h3s = page.locator('[data-article-body] h3')
    const count = await h3s.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('article has multiple CTAs linking to /upload', async ({ page }) => {
    await gotoHowToChoose(page)
    const ctas = page.locator('[data-article-cta]')
    const count = await ctas.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('article has internal links to category guide pages', async ({ page }) => {
    await gotoHowToChoose(page)
    const categoryLinks = page.locator('[data-article-body] a[href*="/best-cards/"]')
    const count = await categoryLinks.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('article has internal links to card detail pages', async ({ page }) => {
    await gotoHowToChoose(page)
    const cardLinks = page.locator('[data-article-body] a[href*="/cards/"]')
    const count = await cardLinks.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('article has Article JSON-LD structured data', async ({ page }) => {
    await gotoHowToChoose(page)
    await page.waitForFunction(() => !!document.getElementById('blog-post-jsonld'))
    const jsonld = await page.evaluate(() => {
      const el = document.getElementById('blog-post-jsonld')
      return el ? JSON.parse(el.textContent ?? '{}') : {}
    })
    expect(jsonld['@type']).toBe('Article')
    expect(jsonld.headline).toMatch(/how to choose/i)
    expect(jsonld.datePublished).toBeTruthy()
    expect(jsonld.author).toBeTruthy()
  })

  test('back link navigates to /blog', async ({ page }) => {
    await gotoHowToChoose(page)
    await page.locator('[data-back-to-blog]').click()
    expect(page.url()).toContain('/blog')
    await expect(page.locator('[data-blog-listing]')).toBeVisible()
  })

  test('article content is 2000+ words', async ({ page }) => {
    await gotoHowToChoose(page)
    const wordCount = await page.evaluate(() => {
      const body = document.querySelector('[data-article-body]')
      if (!body) return 0
      return (body.textContent ?? '').trim().split(/\s+/).length
    })
    expect(wordCount).toBeGreaterThanOrEqual(2000)
  })

  // ---------------------------------------------------------------------------
  // SEO & sitemap
  // ---------------------------------------------------------------------------

  test('sitemap includes /blog', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    expect(res?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('/blog')
  })

  test('sitemap includes /blog/how-to-choose-best-credit-card', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    expect(res?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('/blog/how-to-choose-best-credit-card')
  })

  // ---------------------------------------------------------------------------
  // Mobile responsive
  // ---------------------------------------------------------------------------

  test('/blog listing is mobile responsive at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoBlog(page)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('/blog/how-to-choose-best-credit-card is mobile responsive at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoHowToChoose(page)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })
})
