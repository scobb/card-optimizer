import { test, expect } from '@playwright/test'

async function gotoTerms(page: Parameters<Parameters<typeof test>[1]>[0]) {
  await page.goto('/terms')
  await page.waitForSelector('[data-terms]')
}

test.describe('CO-025: Terms of Service page', () => {
  test('/terms route renders terms page', async ({ page }) => {
    await gotoTerms(page)
    await expect(page.locator('[data-terms]')).toBeVisible()
  })

  test('terms page has main heading', async ({ page }) => {
    await gotoTerms(page)
    await expect(page.getByRole('heading', { level: 1, name: /terms of service/i })).toBeVisible()
  })

  test('terms page has service description section', async ({ page }) => {
    await gotoTerms(page)
    const policy = page.locator('[data-terms-policy]')
    await expect(policy).toBeVisible()
    await expect(policy.getByText(/keylight digital llc/i).first()).toBeVisible()
  })

  test('terms page covers data handling (client-side processing)', async ({ page }) => {
    await gotoTerms(page)
    const policy = page.locator('[data-terms-policy]')
    await expect(policy.getByText(/client.?side/i).first()).toBeVisible()
  })

  test('terms page has no financial advice disclaimer section', async ({ page }) => {
    await gotoTerms(page)
    await expect(page.locator('[data-terms-disclaimer]')).toBeVisible()
    await expect(page.locator('[data-terms-disclaimer]').getByText(/not financial advice/i)).toBeVisible()
  })

  test('terms page covers acceptable use', async ({ page }) => {
    await gotoTerms(page)
    const policy = page.locator('[data-terms-policy]')
    await expect(policy.getByText(/acceptable use/i)).toBeVisible()
  })

  test('terms page covers limitation of liability', async ({ page }) => {
    await gotoTerms(page)
    const policy = page.locator('[data-terms-policy]')
    await expect(policy.getByText(/limitation of liability/i).first()).toBeVisible()
  })

  test('terms page covers modification terms', async ({ page }) => {
    await gotoTerms(page)
    const policy = page.locator('[data-terms-policy]')
    await expect(policy.getByText(/modifications to these terms/i)).toBeVisible()
  })

  test('terms page references Keylight Digital LLC', async ({ page }) => {
    await gotoTerms(page)
    await expect(page.getByText(/keylight digital llc/i).first()).toBeVisible()
  })

  test('footer has Terms of Service link', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('[data-footer]')
    await expect(footer).toBeVisible()
    await expect(footer.locator('[data-footer-terms]')).toBeVisible()
  })

  test('footer Terms of Service link navigates to /terms', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-footer-terms]').click()
    await expect(page).toHaveURL(/\/terms/)
    await expect(page.locator('[data-terms]')).toBeVisible()
  })

  test('footer still has Privacy Policy link alongside Terms', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('[data-footer]')
    await expect(footer.locator('[data-footer-privacy]')).toBeVisible()
    await expect(footer.locator('[data-footer-terms]')).toBeVisible()
  })

  test('sitemap.xml includes /terms', async ({ page }) => {
    await page.goto('/sitemap.xml')
    const content = await page.content()
    expect(content).toContain('/terms')
  })

  test('mobile at 375px — terms page no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await gotoTerms(page)
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1)
  })

  test('mobile at 375px — footer terms link is visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('[data-footer-terms]')).toBeVisible()
  })

  test('terms highlights section shows 3 key facts', async ({ page }) => {
    await gotoTerms(page)
    const highlights = page.locator('[data-terms-highlights]')
    await expect(highlights).toBeVisible()
    await expect(highlights.locator('h3')).toHaveCount(3)
  })
})
