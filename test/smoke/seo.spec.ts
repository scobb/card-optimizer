import { test, expect } from '@playwright/test'

test.describe('CO-009: SEO foundation', () => {
  test('meta description is present and under 160 chars', async ({ page }) => {
    await page.goto('/')
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDesc).toBeTruthy()
    expect(metaDesc!.length).toBeLessThanOrEqual(160)
    expect(metaDesc!.toLowerCase()).toContain('credit card')
  })

  test('OG tags are present with correct values', async ({ page }) => {
    await page.goto('/')
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')

    expect(ogTitle).toBeTruthy()
    expect(ogDesc).toBeTruthy()
    expect(ogType).toBe('website')
    expect(ogUrl).toBeTruthy()
    expect(ogImage).toContain('og-image.png')
  })

  test('Twitter card tags are present', async ({ page }) => {
    await page.goto('/')
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    const twitterDesc = await page.locator('meta[name="twitter:description"]').getAttribute('content')

    expect(twitterCard).toBe('summary_large_image')
    expect(twitterTitle).toBeTruthy()
    expect(twitterDesc).toBeTruthy()
  })

  test('canonical URL tag is present', async ({ page }) => {
    await page.goto('/')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toContain('keylightdigital')
  })

  test('JSON-LD structured data is present and valid', async ({ page }) => {
    await page.goto('/')
    const ldJson = await page.locator('script[type="application/ld+json"]').textContent()
    expect(ldJson).toBeTruthy()
    const parsed = JSON.parse(ldJson!)
    expect(parsed['@type']).toBe('WebApplication')
    expect(parsed['name']).toBeTruthy()
    expect(parsed['applicationCategory']).toBeTruthy()
  })

  test('robots.txt is served correctly (not SPA fallback)', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response!.status()).toBe(200)
    const body = await response!.text()
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Allow: /')
    expect(body).toContain('Sitemap:')
    // Must be plain text, not an HTML SPA fallback
    expect(body).not.toContain('<html')
    expect(body).not.toContain('<!DOCTYPE')
  })

  test('sitemap.xml is served and lists required routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response!.status()).toBe(200)
    const body = await response!.text()
    // Must be XML, not SPA fallback
    expect(body).not.toContain('<html')
    expect(body).toContain('<urlset')
    // Check required routes
    for (const route of ['/', '/upload', '/wallet', '/recommendations', '/builder', '/catalog']) {
      expect(body).toContain(route)
    }
  })

  test('og-image.png is accessible', async ({ page }) => {
    const response = await page.goto('/og-image.png')
    expect(response!.status()).toBe(200)
    const contentType = response!.headers()['content-type']
    expect(contentType).toContain('image')
  })

  test('favicon is accessible', async ({ page }) => {
    const response = await page.goto('/favicon.svg')
    expect(response!.status()).toBe(200)
    const contentType = response!.headers()['content-type']
    expect(contentType).toContain('svg')
  })
})
