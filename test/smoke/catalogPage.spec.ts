import { test, expect } from '@playwright/test'

test.describe('CO-006: Card Catalog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog')
    // Wait for card grid to be fully rendered before each test
    await expect(page.locator('[data-catalog-count]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('catalog page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Card Catalog' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows all 50+ cards by default', async ({ page }) => {
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(50)
  })

  // -------------------------------------------------------------------------
  test('count badge shows total cards', async ({ page }) => {
    const text = await page.locator('[data-catalog-count]').textContent()
    expect(text).toBeTruthy()
    // Should show a number >= 50 in the badge text
    const match = text!.match(/(\d+)/)
    expect(match).not.toBeNull()
    expect(parseInt(match![1], 10)).toBeGreaterThanOrEqual(50)
  })

  // -------------------------------------------------------------------------
  test('search by card name filters results', async ({ page }) => {
    await page.locator('[data-catalog-search]').fill('sapphire')
    // Should show Sapphire cards only
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    // Should be far fewer than total catalog
    expect(count).toBeLessThan(10)
    // Count badge updates — shows filtered count out of total
    await expect(page.locator('[data-catalog-count]')).toContainText('of')
  })

  // -------------------------------------------------------------------------
  test('search returns no results shows empty state', async ({ page }) => {
    await page.locator('[data-catalog-search]').fill('zzz-nonexistent-card-xyz')
    await expect(page.getByText('No cards match your search.')).toBeVisible()
    await expect(page.locator('[data-catalog-count]')).toContainText('0 of')
  })

  // -------------------------------------------------------------------------
  test('filter by issuer narrows results', async ({ page }) => {
    await page.locator('[data-catalog-issuer-filter]').selectOption('Chase')
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    // Chase has ~10 cards, much less than 50+
    expect(count).toBeLessThan(50)
  })

  // -------------------------------------------------------------------------
  test('issuer filter + search combine', async ({ page }) => {
    await page.locator('[data-catalog-issuer-filter]').selectOption('Chase')
    await page.locator('[data-catalog-search]').fill('sapphire')
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('each card shows name, issuer, annual fee', async ({ page }) => {
    const firstCard = page.locator('[data-catalog-card]').first()
    // Card has content — issuer info and fee info in text
    await expect(firstCard).toBeVisible()
    const text = await firstCard.textContent()
    expect(text).toBeTruthy()
    // Should have either "No annual fee" or "/yr"
    expect(text).toMatch(/No annual fee|\/yr/)
  })

  // -------------------------------------------------------------------------
  test('each card shows reward rates', async ({ page }) => {
    const firstCard = page.locator('[data-catalog-card]').first()
    // Base rate chip
    await expect(firstCard.getByText(/^Base \d/)).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('each card has an apply link', async ({ page }) => {
    const applyLinks = page.locator('[data-catalog-apply]')
    const count = await applyLinks.count()
    expect(count).toBeGreaterThanOrEqual(50)
    await expect(applyLinks.first()).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('apply link opens in new tab', async ({ page }) => {
    const firstApply = page.locator('[data-catalog-apply]').first()
    const target = await firstApply.getAttribute('target')
    expect(target).toBe('_blank')
  })

  // -------------------------------------------------------------------------
  test('resetting filter to All issuers shows all cards', async ({ page }) => {
    await page.locator('[data-catalog-issuer-filter]').selectOption('Chase')
    await page.locator('[data-catalog-issuer-filter]').selectOption('all')
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(50)
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Card Catalog' })).toBeVisible()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
