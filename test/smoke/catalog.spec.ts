import { test, expect } from '@playwright/test'

test.describe('Card Catalog API', () => {
  test('GET /api/health returns healthy', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('healthy')
  })

  test('GET /api/cards returns card list', async ({ request }) => {
    const res = await request.get('/api/cards')
    expect(res.status()).toBe(200)
    const cards = await res.json()
    expect(Array.isArray(cards)).toBe(true)
    expect(cards.length).toBeGreaterThanOrEqual(20)

    // Verify card structure
    const card = cards[0]
    expect(card).toHaveProperty('id')
    expect(card).toHaveProperty('name')
    expect(card).toHaveProperty('issuer')
    expect(card).toHaveProperty('annualFee')
    expect(card).toHaveProperty('rewardType')
    expect(card).toHaveProperty('baseRate')
    expect(card).toHaveProperty('categoryRates')
    expect(card).toHaveProperty('signUpBonus')
    expect(card).toHaveProperty('perks')

    // Verify Cache-Control header
    expect(res.headers()['cache-control']).toContain('max-age')
  })

  test('GET /api/cards/:id returns single card', async ({ request }) => {
    const res = await request.get('/api/cards/citi-double-cash')
    expect(res.status()).toBe(200)
    const card = await res.json()
    expect(card.name).toBe('Citi Double Cash')
    expect(card.baseRate).toBe(2)
    expect(card).toHaveProperty('signUpBonus')
    expect(card).toHaveProperty('perks')
    expect(card).toHaveProperty('categoryRates')

    // Verify Cache-Control header
    expect(res.headers()['cache-control']).toContain('max-age')
  })

  test('GET /api/cards/:id returns 404 for unknown card', async ({ request }) => {
    const res = await request.get('/api/cards/nonexistent-card')
    expect(res.status()).toBe(404)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})
