import { test, expect } from '@playwright/test'

test.describe('CO-013: PWA manifest and installability', () => {
  test('manifest.json is served correctly (not SPA fallback)', async ({ page }) => {
    const response = await page.goto('/manifest.json')
    expect(response!.status()).toBe(200)
    const body = await response!.text()
    expect(body).not.toContain('<html')
    expect(body).not.toContain('<!DOCTYPE')
    const manifest = JSON.parse(body)
    expect(manifest).toBeTruthy()
  })

  test('manifest.json has required PWA fields', async ({ page }) => {
    const response = await page.goto('/manifest.json')
    const manifest = JSON.parse(await response!.text())
    expect(manifest.name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
    expect(manifest.start_url).toBeTruthy()
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBeTruthy()
    expect(manifest.icons).toBeInstanceOf(Array)
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)
  })

  test('manifest.json includes 192x192 and 512x512 icons', async ({ page }) => {
    const response = await page.goto('/manifest.json')
    const manifest = JSON.parse(await response!.text())
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })

  test('icon-192.png is accessible', async ({ page }) => {
    const response = await page.goto('/icon-192.png')
    expect(response!.status()).toBe(200)
    const contentType = response!.headers()['content-type']
    expect(contentType).toContain('image')
  })

  test('icon-512.png is accessible', async ({ page }) => {
    const response = await page.goto('/icon-512.png')
    expect(response!.status()).toBe(200)
    const contentType = response!.headers()['content-type']
    expect(contentType).toContain('image')
  })

  test('index.html links to manifest.json', async ({ page }) => {
    await page.goto('/')
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(manifestLink).toBe('/manifest.json')
  })

  test('index.html has theme-color meta tag', async ({ page }) => {
    await page.goto('/')
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content')
    expect(themeColor).toBeTruthy()
    expect(themeColor).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
