import { test, expect } from '@playwright/test'

// A representative sample of card IDs to verify structured data is dynamic
const SAMPLE_CARDS = [
  { id: 'chase-sapphire-preferred', name: 'Chase Sapphire Preferred', issuer: 'Chase' },
  { id: 'amex-gold', name: 'American Express Gold Card', issuer: 'American Express' },
  { id: 'citi-double-cash', name: 'Citi Double Cash', issuer: 'Citi' },
  { id: 'capital-one-venture-x', name: 'Capital One Venture X', issuer: 'Capital One' },
  { id: 'wells-fargo-active-cash', name: 'Wells Fargo Active Cash', issuer: 'Wells Fargo' },
]

test.describe('CO-028: FinancialProduct structured data on card detail pages', () => {
  // -------------------------------------------------------------------------
  test('card detail page injects FinancialProduct JSON-LD', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const el = page.locator('script#card-detail-jsonld')
    await expect(el).toBeAttached()
    const content = await el.textContent()
    expect(content).toBeTruthy()
    const parsed = JSON.parse(content!)
    expect(parsed['@type']).toBe('FinancialProduct')
  })

  // -------------------------------------------------------------------------
  test('JSON-LD includes correct name and issuer', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const content = await page.locator('script#card-detail-jsonld').textContent()
    const parsed = JSON.parse(content!)
    expect(parsed.name).toBe('Chase Sapphire Preferred')
    expect(parsed.brand?.name).toBe('Chase')
    expect(parsed.provider?.name).toBe('Chase')
  })

  // -------------------------------------------------------------------------
  test('JSON-LD includes annual fee in offers', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const content = await page.locator('script#card-detail-jsonld').textContent()
    const parsed = JSON.parse(content!)
    expect(parsed.offers).toBeTruthy()
    expect(parsed.offers['@type']).toBe('Offer')
    expect(parsed.offers.priceCurrency).toBe('USD')
    // Chase Sapphire Preferred has $95 annual fee
    expect(parsed.offers.price).toBe('95')
  })

  // -------------------------------------------------------------------------
  test('JSON-LD includes description', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const content = await page.locator('script#card-detail-jsonld').textContent()
    const parsed = JSON.parse(content!)
    expect(parsed.description).toBeTruthy()
    expect(typeof parsed.description).toBe('string')
    expect(parsed.description.length).toBeGreaterThan(20)
  })

  // -------------------------------------------------------------------------
  test('JSON-LD is valid JSON (parseable)', async ({ page }) => {
    await page.goto('/cards/amex-gold')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const content = await page.locator('script#card-detail-jsonld').textContent()
    expect(() => JSON.parse(content!)).not.toThrow()
    const parsed = JSON.parse(content!)
    expect(parsed['@context']).toBe('https://schema.org')
  })

  // -------------------------------------------------------------------------
  test('JSON-LD is dynamic — different cards have different data', async ({ page }) => {
    // Amex Gold: $250 annual fee
    await page.goto('/cards/amex-gold')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const contentA = await page.locator('script#card-detail-jsonld').textContent()
    const parsedA = JSON.parse(contentA!)
    expect(parsedA.name).toBe('American Express Gold Card')
    expect(parsedA.offers.price).toBe('250')

    // Citi Double Cash: $0 annual fee
    await page.goto('/cards/citi-double-cash')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const contentB = await page.locator('script#card-detail-jsonld').textContent()
    const parsedB = JSON.parse(contentB!)
    expect(parsedB.name).toBe('Citi Double Cash')
    expect(parsedB.offers.price).toBe('0')

    // Confirm the two are different
    expect(parsedA.name).not.toBe(parsedB.name)
  })

  // -------------------------------------------------------------------------
  test('all 5 sample card pages have FinancialProduct JSON-LD', async ({ page }) => {
    for (const { id, name, issuer } of SAMPLE_CARDS) {
      await page.goto(`/cards/${id}`)
      await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
      const content = await page.locator('script#card-detail-jsonld').textContent()
      const parsed = JSON.parse(content!)
      expect(parsed['@type'], `${id} @type`).toBe('FinancialProduct')
      expect(parsed.name, `${id} name`).toBe(name)
      expect(parsed.brand?.name, `${id} brand`).toBe(issuer)
    }
  })

  // -------------------------------------------------------------------------
  test('JSON-LD does not conflict with global WebApplication schema', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))

    // Global schema (from index.html) has no ID — check it's still present
    const globalScript = page.locator('script[type="application/ld+json"]').first()
    await expect(globalScript).toBeAttached()
    const globalContent = await globalScript.textContent()
    const globalParsed = JSON.parse(globalContent!)
    // The global schema is WebApplication; card-specific is FinancialProduct
    expect(globalParsed['@type']).toBe('WebApplication')

    // The card-specific schema is FinancialProduct
    const cardScript = page.locator('script#card-detail-jsonld')
    const cardContent = await cardScript.textContent()
    const cardParsed = JSON.parse(cardContent!)
    expect(cardParsed['@type']).toBe('FinancialProduct')
  })

  // -------------------------------------------------------------------------
  test('JSON-LD is cleaned up on navigation away from card page', async ({ page }) => {
    await page.goto('/cards/chase-sapphire-preferred')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    await expect(page.locator('script#card-detail-jsonld')).toBeAttached()

    // Navigate away to catalog
    await page.goto('/catalog')
    // Should be removed
    const jsonld = await page.locator('script#card-detail-jsonld').count()
    expect(jsonld).toBe(0)
  })

  // -------------------------------------------------------------------------
  test('no-annual-fee card has price of 0 in offers', async ({ page }) => {
    await page.goto('/cards/wells-fargo-active-cash')
    await page.waitForFunction(() => !!document.getElementById('card-detail-jsonld'))
    const content = await page.locator('script#card-detail-jsonld').textContent()
    const parsed = JSON.parse(content!)
    expect(parsed.offers.price).toBe('0')
  })
})
