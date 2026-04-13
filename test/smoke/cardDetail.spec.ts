import { test, expect } from '@playwright/test'

const TEST_CARD_SLUG = 'chase-sapphire-preferred'
const TEST_CARD_NAME = 'Chase Sapphire Preferred'

test.describe('CO-015: Card Detail Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/cards/${TEST_CARD_SLUG}`)
    await expect(page.locator(`[data-card-detail="${TEST_CARD_SLUG}"]`)).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('card detail page renders with card name', async ({ page }) => {
    await expect(page.locator('[data-card-name]')).toHaveText(TEST_CARD_NAME)
  })

  // -------------------------------------------------------------------------
  test('back link to /catalog is present', async ({ page }) => {
    const backLink = page.locator('[data-back-to-catalog]').first()
    await expect(backLink).toBeVisible()
    await expect(backLink).toContainText('Card Catalog')
    const href = await backLink.getAttribute('href')
    expect(href).toContain('/catalog')
  })

  // -------------------------------------------------------------------------
  test('back link navigates to catalog', async ({ page }) => {
    await page.locator('[data-back-to-catalog]').first().click()
    await expect(page).toHaveURL(/\/catalog/)
    await expect(page.getByRole('heading', { name: 'Card Catalog' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('add to wallet button is present', async ({ page }) => {
    await expect(page.locator('[data-add-to-wallet]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('add to wallet adds card and navigates to /wallet', async ({ page }) => {
    await page.locator('[data-add-to-wallet]').click()
    await expect(page).toHaveURL(/\/wallet/)
  })

  // -------------------------------------------------------------------------
  test('apply link is present and opens externally', async ({ page }) => {
    const applyLink = page.locator('[data-apply-link]')
    await expect(applyLink).toBeVisible()
    const target = await applyLink.getAttribute('target')
    expect(target).toBe('_blank')
    const href = await applyLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^https?:\/\//)
  })

  // -------------------------------------------------------------------------
  test('shows reward rates section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Reward Rates' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('unique page title includes card name', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain(TEST_CARD_NAME)
  })

  // -------------------------------------------------------------------------
  test('404 page for unknown card slug', async ({ page }) => {
    await page.goto('/cards/nonexistent-card-xyz')
    await expect(page.getByText('Card not found')).toBeVisible()
    const backLink = page.locator('[data-back-to-catalog]')
    await expect(backLink).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('catalog cards link to detail pages', async ({ page }) => {
    await page.goto('/catalog')
    const cardLink = page.locator(`[data-catalog-card-link="${TEST_CARD_SLUG}"]`)
    await expect(cardLink).toBeVisible()
    const href = await cardLink.getAttribute('href')
    expect(href).toContain(`/cards/${TEST_CARD_SLUG}`)
  })

  // -------------------------------------------------------------------------
  test('catalog card link navigates to detail page', async ({ page }) => {
    await page.goto('/catalog')
    await page.locator(`[data-catalog-card-link="${TEST_CARD_SLUG}"]`).click()
    await expect(page).toHaveURL(new RegExp(`/cards/${TEST_CARD_SLUG}`))
    await expect(page.locator('[data-card-name]')).toHaveText(TEST_CARD_NAME)
  })

  // -------------------------------------------------------------------------
  test('sitemap includes card detail URLs', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain(`/cards/${TEST_CARD_SLUG}`)
    // Should include all 20 card slugs
    expect(body).toContain('/cards/amex-gold')
    expect(body).toContain('/cards/capital-one-venture-x')
    expect(body).toContain('/cards/discover-it-cash-back')
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('all 20 card detail pages are accessible', async ({ page }) => {
    const slugs = [
      'chase-sapphire-preferred',
      'chase-freedom-unlimited',
      'chase-freedom-flex',
      'amex-gold',
      'amex-platinum',
      'amex-blue-cash-preferred',
      'citi-double-cash',
      'citi-custom-cash',
      'capital-one-venture-x',
      'capital-one-savor-one',
      'discover-it-cash-back',
      'wells-fargo-active-cash',
      'capital-one-venture',
      'chase-sapphire-reserve',
      'amex-blue-cash-everyday',
      'bank-of-america-customized-cash',
      'us-bank-altitude-go',
      'amex-green',
      'chase-ink-cash',
      'capital-one-quicksilver',
    ]
    for (const slug of slugs) {
      await page.goto(`/cards/${slug}`)
      await expect(page.locator(`[data-card-detail="${slug}"]`), `Card ${slug} detail page`).toBeVisible()
    }
  })
})
