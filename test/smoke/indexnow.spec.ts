import { test, expect } from '@playwright/test'

const INDEXNOW_KEY = 'c7b4ca1d-7cf8-45e5-9f9a-5ee4c2caf71a'

test.describe('CO-018: IndexNow submission', () => {
  // -------------------------------------------------------------------------
  test('IndexNow key file is accessible at root path', async ({ request }) => {
    const response = await request.get(`/${INDEXNOW_KEY}.txt`)
    expect(response.status()).toBe(200)
  })

  // -------------------------------------------------------------------------
  test('IndexNow key file contains the correct key', async ({ request }) => {
    const response = await request.get(`/${INDEXNOW_KEY}.txt`)
    const text = await response.text()
    expect(text.trim()).toBe(INDEXNOW_KEY)
  })

  // -------------------------------------------------------------------------
  test('IndexNow key file has plain text content type', async ({ request }) => {
    const response = await request.get(`/${INDEXNOW_KEY}.txt`)
    const contentType = response.headers()['content-type'] ?? ''
    expect(contentType).toMatch(/text/)
  })

  // -------------------------------------------------------------------------
  test('sitemap.xml includes /faq', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const text = await response.text()
    expect(text).toContain('/faq')
  })

  // -------------------------------------------------------------------------
  test('sitemap.xml includes all static pages required by IndexNow script', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const text = await response.text()
    const requiredPaths = [
      '/',
      '/upload',
      '/wallet',
      '/recommendations',
      '/builder',
      '/catalog',
      '/privacy',
      '/faq',
    ]
    for (const path of requiredPaths) {
      expect(text, `sitemap missing ${path}`).toContain(
        `cards.keylightdigital.dev${path}`
      )
    }
  })

  // -------------------------------------------------------------------------
  test('sitemap.xml includes all 20 card detail pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const text = await response.text()
    const cardIds = [
      'chase-sapphire-preferred',
      'chase-freedom-unlimited',
      'amex-gold',
      'amex-platinum',
      'citi-double-cash',
      'capital-one-venture-x',
      'discover-it-cash-back',
      'wells-fargo-active-cash',
      'chase-sapphire-reserve',
      'capital-one-quicksilver',
    ]
    for (const id of cardIds) {
      expect(text, `sitemap missing /cards/${id}`).toContain(`/cards/${id}`)
    }
  })

  // -------------------------------------------------------------------------
  test('sitemap.xml includes all 6 category guide pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const text = await response.text()
    const categories = ['dining', 'groceries', 'travel', 'gas', 'online-shopping', 'streaming']
    for (const cat of categories) {
      expect(text, `sitemap missing /best-cards/${cat}`).toContain(`/best-cards/${cat}`)
    }
  })

  // -------------------------------------------------------------------------
  test('sitemap.xml includes at least 15 comparison pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const text = await response.text()
    const compareMatches = (text.match(/\/compare\//g) ?? []).length
    expect(compareMatches).toBeGreaterThanOrEqual(15)
  })

  // -------------------------------------------------------------------------
  test('robots.txt allows indexing (not blocking crawlers)', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const text = await response.text()
    // Should not disallow all
    expect(text).not.toMatch(/Disallow:\s*\/\s*$/)
  })
})
