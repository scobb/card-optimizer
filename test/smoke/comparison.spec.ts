import { test, expect } from '@playwright/test'

const PAIRS = [
  { slug: 'chase-sapphire-preferred-vs-amex-gold', cardAName: 'Chase Sapphire Preferred', cardBName: 'Amex Gold' },
  { slug: 'chase-sapphire-preferred-vs-chase-sapphire-reserve', cardAName: 'Chase Sapphire Preferred', cardBName: 'Chase Sapphire Reserve' },
  { slug: 'chase-sapphire-preferred-vs-capital-one-venture-x', cardAName: 'Chase Sapphire Preferred', cardBName: 'Capital One Venture X' },
  { slug: 'amex-gold-vs-amex-platinum', cardAName: 'Amex Gold', cardBName: 'Amex Platinum' },
  { slug: 'chase-freedom-unlimited-vs-citi-double-cash', cardAName: 'Chase Freedom Unlimited', cardBName: 'Citi Double Cash' },
  { slug: 'amex-blue-cash-preferred-vs-amex-blue-cash-everyday', cardAName: 'Amex Blue Cash Preferred', cardBName: 'Amex Blue Cash Everyday' },
  { slug: 'chase-sapphire-reserve-vs-amex-platinum', cardAName: 'Chase Sapphire Reserve', cardBName: 'Amex Platinum' },
  { slug: 'capital-one-venture-vs-capital-one-venture-x', cardAName: 'Capital One Venture', cardBName: 'Capital One Venture X' },
  { slug: 'citi-double-cash-vs-wells-fargo-active-cash', cardAName: 'Citi Double Cash', cardBName: 'Wells Fargo Active Cash' },
  { slug: 'chase-freedom-flex-vs-citi-custom-cash', cardAName: 'Chase Freedom Flex', cardBName: 'Citi Custom Cash' },
  { slug: 'chase-sapphire-preferred-vs-capital-one-venture', cardAName: 'Chase Sapphire Preferred', cardBName: 'Capital One Venture' },
  { slug: 'amex-gold-vs-capital-one-savor-one', cardAName: 'Amex Gold', cardBName: 'Capital One SavorOne' },
  { slug: 'chase-ink-cash-vs-chase-freedom-unlimited', cardAName: 'Chase Ink Business Cash', cardBName: 'Chase Freedom Unlimited' },
  { slug: 'discover-it-cash-back-vs-citi-double-cash', cardAName: 'Discover it Cash Back', cardBName: 'Citi Double Cash' },
  { slug: 'bank-of-america-customized-cash-vs-citi-custom-cash', cardAName: 'Bank of America Customized Cash Rewards', cardBName: 'Citi Custom Cash' },
]

test.describe('CO-017: Card Comparison Pages', () => {
  // -------------------------------------------------------------------------
  test('comparison page renders with correct title', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-comparison-page]')).toBeVisible()
    await expect(page.locator('[data-comparison-title]')).toContainText('Chase Sapphire Preferred')
    await expect(page.locator('[data-comparison-title]')).toContainText('Amex Gold')
  })

  // -------------------------------------------------------------------------
  test('all 15 comparison pages render', async ({ page }) => {
    for (const { slug, cardAName } of PAIRS) {
      await page.goto(`/compare/${slug}`)
      await expect(
        page.locator(`[data-comparison-page="${slug}"]`),
        `Comparison page for ${slug}`
      ).toBeVisible()
      await expect(page.locator('[data-comparison-title]')).toContainText(cardAName)
    }
  })

  // -------------------------------------------------------------------------
  test('shows annual fee for both cards', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-quick-stats]')).toBeVisible()
    await expect(page.locator('[data-annual-fee-a]')).toBeVisible()
    await expect(page.locator('[data-annual-fee-b]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows sign-up bonus for both cards', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-signup-a]')).toBeVisible()
    await expect(page.locator('[data-signup-b]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('reward rates table is present', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-rates-table]')).toBeVisible()
    const rows = page.locator('[data-rates-table] tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('verdict section is present', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-verdict]')).toBeVisible()
    const verdictText = await page.locator('[data-verdict]').textContent()
    expect(verdictText).toMatch(/Choose/)
  })

  // -------------------------------------------------------------------------
  test('perks section is present', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await expect(page.locator('[data-perks-section]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('CTA links to /upload', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const cta = page.locator('[data-cta-upload]')
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('/upload')
  })

  // -------------------------------------------------------------------------
  test('apply links for both cards are present and open externally', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const applyA = page.locator('[data-apply-card-a]')
    const applyB = page.locator('[data-apply-card-b]')
    await expect(applyA).toBeVisible()
    await expect(applyB).toBeVisible()
    expect(await applyA.getAttribute('target')).toBe('_blank')
    expect(await applyB.getAttribute('target')).toBe('_blank')
    expect(await applyA.getAttribute('href')).toMatch(/^https?:\/\//)
    expect(await applyB.getAttribute('href')).toMatch(/^https?:\/\//)
  })

  // -------------------------------------------------------------------------
  test('unique page title per comparison', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const title1 = await page.title()
    expect(title1).toContain('Chase Sapphire Preferred')
    expect(title1).toContain('Amex Gold')

    await page.goto('/compare/amex-gold-vs-amex-platinum')
    const title2 = await page.title()
    expect(title2).toContain('Amex Platinum')

    expect(title1).not.toBe(title2)
  })

  // -------------------------------------------------------------------------
  test('JSON-LD structured data is injected', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const jsonldEl = await page.locator('script#comparison-jsonld').first()
    await expect(jsonldEl).toBeAttached()
    const content = await jsonldEl.textContent()
    expect(content).toBeTruthy()
    const parsed = JSON.parse(content!)
    expect(parsed['@type']).toBe('ItemList')
    expect(parsed.itemListElement).toHaveLength(2)
  })

  // -------------------------------------------------------------------------
  test('links to card detail pages for both cards', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const detailLinkA = page.locator('[data-detail-link-a]')
    const detailLinkB = page.locator('[data-detail-link-b]')
    await expect(detailLinkA).toBeVisible()
    await expect(detailLinkB).toBeVisible()
    expect(await detailLinkA.getAttribute('href')).toContain('/cards/chase-sapphire-preferred')
    expect(await detailLinkB.getAttribute('href')).toContain('/cards/amex-gold')
  })

  // -------------------------------------------------------------------------
  test('card detail page links to relevant comparisons', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await expect(page.locator('[data-card-comparisons]')).toBeVisible()
    // Chase Sapphire Preferred appears in 4 comparison pairs
    const links = page.locator('[data-comparison-link]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  test('clicking comparison link from card detail navigates to comparison page', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    const firstComparisonLink = page.locator('[data-comparison-link]').first()
    await firstComparisonLink.click()
    await expect(page).toHaveURL(/\/compare\//)
    await expect(page.locator('[data-comparison-title]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('back link to /catalog is present', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    const backLink = page.locator('[data-back-to-catalog]')
    await expect(backLink).toBeVisible()
    expect(await backLink.getAttribute('href')).toContain('/catalog')
  })

  // -------------------------------------------------------------------------
  test('sitemap includes all 15 comparison URLs', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    for (const { slug } of PAIRS) {
      expect(body, `sitemap missing /compare/${slug}`).toContain(`/compare/${slug}`)
    }
  })

  // -------------------------------------------------------------------------
  test('404 for unknown card comparison', async ({ page }) => {
    await page.goto('/compare/fake-card-vs-another-fake-card')
    await expect(page.getByText('Comparison not found')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.goto('/compare/chase-sapphire-preferred-vs-amex-gold')
    await page.setViewportSize({ width: 375, height: 812 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
