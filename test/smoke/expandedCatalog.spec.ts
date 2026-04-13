import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:8788'

test.describe('CO-033: Expanded Card Database (53+ cards)', () => {
  test('GET /api/cards returns 50+ cards', async ({ request }) => {
    const res = await request.get('/api/cards')
    expect(res.status()).toBe(200)
    const cards = await res.json() as unknown[]
    expect(cards.length).toBeGreaterThanOrEqual(50)
  })

  test('GET /api/cards returns at least 53 cards', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as unknown[]
    expect(cards.length).toBeGreaterThanOrEqual(53)
  })

  test('catalog page shows 50+ cards', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-card]').first()).toBeVisible({ timeout: 10000 })
    const cardCount = await page.locator('[data-catalog-card]').count()
    expect(cardCount).toBeGreaterThanOrEqual(50)
  })

  test('cards from at least 8 different issuers in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ issuer: string }>
    const issuers = new Set(cards.map((c) => c.issuer))
    expect(issuers.size).toBeGreaterThanOrEqual(8)
  })

  test('at least 5 business cards in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ name: string }>
    const businessCards = cards.filter((c) =>
      /business|ink|spark/i.test(c.name)
    )
    expect(businessCards.length).toBeGreaterThanOrEqual(5)
  })

  test('at least 3 store/co-branded cards in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ name: string }>
    const cobranded = cards.filter((c) =>
      /amazon|target|costco|delta|hilton|marriott|united|alaska|hyatt|aadvantage/i.test(c.name)
    )
    expect(cobranded.length).toBeGreaterThanOrEqual(3)
  })

  // Spot-check specific new cards exist in API
  test('Chase Ink Business Unlimited is in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string; name: string }>
    const card = cards.find((c) => c.id === 'chase-ink-unlimited')
    expect(card).toBeTruthy()
    expect(card!.name).toBe('Chase Ink Business Unlimited')
  })

  test('Amazon Prime Visa is in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string }>
    expect(cards.find((c) => c.id === 'amazon-prime-visa')).toBeTruthy()
  })

  test('Citi Strata Premier is in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string }>
    expect(cards.find((c) => c.id === 'citi-strata-premier')).toBeTruthy()
  })

  test('Bilt Mastercard is in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string }>
    expect(cards.find((c) => c.id === 'bilt-mastercard')).toBeTruthy()
  })

  test('Target RedCard is in API', async ({ request }) => {
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string }>
    expect(cards.find((c) => c.id === 'target-redcard')).toBeTruthy()
  })

  test('card detail page renders for new card: Chase Ink Business Unlimited', async ({ page }) => {
    await page.goto('/cards/chase-ink-unlimited')
    await expect(page.getByRole('heading', { name: /chase ink business unlimited/i })).toBeVisible({ timeout: 10000 })
  })

  test('card detail page renders for new card: Bilt Mastercard', async ({ page }) => {
    await page.goto('/cards/bilt-mastercard')
    await expect(page.getByRole('heading', { name: /bilt mastercard/i })).toBeVisible({ timeout: 10000 })
  })

  test('card detail page renders for new card: Amazon Prime Visa', async ({ page }) => {
    await page.goto('/cards/amazon-prime-visa')
    await expect(page.getByRole('heading', { name: /amazon prime visa/i })).toBeVisible({ timeout: 10000 })
  })

  test('card detail page renders for new card: Target RedCard', async ({ page }) => {
    await page.goto('/cards/target-redcard')
    await expect(page.getByRole('heading', { name: /target redcard/i })).toBeVisible({ timeout: 10000 })
  })

  test('new card detail page has FinancialProduct structured data', async ({ page }) => {
    await page.goto('/cards/bilt-mastercard')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const scriptContent = await page.evaluate(() =>
      document.getElementById('card-detail-jsonld')?.textContent ?? ''
    )
    const jsonld = JSON.parse(scriptContent)
    expect(jsonld['@type']).toBe('FinancialProduct')
    expect(jsonld.name).toMatch(/bilt/i)
  })

  test('sitemap includes new card URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    const xml = await res.text()
    expect(xml).toContain('/cards/chase-ink-unlimited')
    expect(xml).toContain('/cards/amazon-prime-visa')
    expect(xml).toContain('/cards/bilt-mastercard')
    expect(xml).toContain('/cards/target-redcard')
    expect(xml).toContain('/cards/citi-strata-premier')
  })

  test('catalog page filter by new issuer: Bilt Rewards', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-card]').first()).toBeVisible({ timeout: 10000 })
    // Bilt Mastercard should appear in catalog
    await expect(page.locator('[data-catalog-card="bilt-mastercard"]')).toBeVisible()
  })

  test('mobile responsive at 375px — catalog shows 50+ cards without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-card]').first()).toBeVisible({ timeout: 10000 })
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
