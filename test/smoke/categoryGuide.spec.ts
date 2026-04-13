import { test, expect } from '@playwright/test'

const CATEGORIES = [
  { slug: 'dining', label: 'Dining' },
  { slug: 'groceries', label: 'Groceries' },
  { slug: 'travel', label: 'Travel' },
  { slug: 'gas', label: 'Gas' },
  { slug: 'online-shopping', label: 'Online Shopping' },
  { slug: 'streaming', label: 'Streaming' },
]

test.describe('CO-016: Category Guide Pages', () => {
  // -------------------------------------------------------------------------
  test('dining guide renders with correct title', async ({ page }) => {
    await page.goto('/best-cards/dining')
    await expect(page.locator('[data-category-guide="dining"]')).toBeVisible()
    await expect(page.locator('[data-category-title]')).toContainText('Best Credit Cards for Dining')
  })

  // -------------------------------------------------------------------------
  test('all 6 category guides render', async ({ page }) => {
    for (const { slug, label } of CATEGORIES) {
      await page.goto(`/best-cards/${slug}`)
      await expect(
        page.locator(`[data-category-guide="${slug}"]`),
        `Category guide for ${slug}`
      ).toBeVisible()
      await expect(page.locator('[data-category-title]')).toContainText(label)
    }
  })

  // -------------------------------------------------------------------------
  test('each guide lists top 5 ranked cards', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const cards = page.locator('[data-ranked-card]')
    await expect(cards).toHaveCount(5)
  })

  // -------------------------------------------------------------------------
  test('each card entry shows category rate, annual fee, and net value', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const firstCard = page.locator('[data-ranked-card]').first()
    await expect(firstCard.locator('[data-category-rate]')).toBeVisible()
    await expect(firstCard.locator('[data-net-value]')).toBeVisible()
    // Annual fee shows "None" or a dollar amount
    const text = await firstCard.textContent()
    expect(text).toMatch(/Annual Fee/)
  })

  // -------------------------------------------------------------------------
  test('card entries link to card detail pages', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const cardLink = page.locator('[data-card-link]').first()
    await expect(cardLink).toBeVisible()
    const href = await cardLink.getAttribute('href')
    expect(href).toMatch(/^\/cards\//)
  })

  // -------------------------------------------------------------------------
  test('clicking card link navigates to card detail page', async ({ page }) => {
    await page.goto('/best-cards/dining')
    await page.locator('[data-card-link]').first().click()
    await expect(page).toHaveURL(/\/cards\//)
    await expect(page.locator('[data-card-name]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('back link to /catalog is present', async ({ page }) => {
    await page.goto('/best-cards/groceries')
    const backLink = page.locator('[data-back-to-catalog]')
    await expect(backLink).toBeVisible()
    const href = await backLink.getAttribute('href')
    expect(href).toContain('/catalog')
  })

  // -------------------------------------------------------------------------
  test('apply links open externally', async ({ page }) => {
    await page.goto('/best-cards/travel')
    const applyLinks = page.locator('[data-apply-link]')
    const count = await applyLinks.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const target = await applyLinks.nth(i).getAttribute('target')
      expect(target).toBe('_blank')
      const href = await applyLinks.nth(i).getAttribute('href')
      expect(href).toMatch(/^https?:\/\//)
    }
  })

  // -------------------------------------------------------------------------
  test('unique page title per category', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const diningTitle = await page.title()
    expect(diningTitle).toContain('Dining')

    await page.goto('/best-cards/groceries')
    const groceriesTitle = await page.title()
    expect(groceriesTitle).toContain('Groceries')

    expect(diningTitle).not.toBe(groceriesTitle)
  })

  // -------------------------------------------------------------------------
  test('internal links to other category guides are present', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const otherCategoryLinks = page.locator('[data-other-categories] [data-category-link]')
    const count = await otherCategoryLinks.count()
    // Should show 5 other categories (all except dining)
    expect(count).toBe(5)
  })

  // -------------------------------------------------------------------------
  test('other category links navigate correctly', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const groceriesLink = page.locator('[data-category-link="groceries"]')
    await expect(groceriesLink).toBeVisible()
    await groceriesLink.click()
    await expect(page).toHaveURL(/\/best-cards\/groceries/)
    await expect(page.locator('[data-category-guide="groceries"]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('404 for unknown category', async ({ page }) => {
    await page.goto('/best-cards/unknown-category')
    await expect(page.getByText('Category not found')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('sitemap includes all category guide URLs', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    for (const { slug } of CATEGORIES) {
      expect(body, `sitemap missing /best-cards/${slug}`).toContain(`/best-cards/${slug}`)
    }
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.goto('/best-cards/dining')
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('CTA button to upload is present', async ({ page }) => {
    await page.goto('/best-cards/dining')
    const cta = page.getByRole('link', { name: /Optimize My Rewards/i })
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('/upload')
  })
})
