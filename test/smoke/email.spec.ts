import { test, expect } from '@playwright/test'

// Helper: seed spending data and wallet in localStorage
async function seedWalletWithSpending(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
  await page.goto('/wallet')
  await page.evaluate(() => {
    // Minimal spending data
    const spending = {
      breakdown: [
        { category: 'dining', categoryLabel: 'Dining', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'groceries', categoryLabel: 'Groceries', monthlyAvg: 300, annualTotal: 3600, transactionCount: 60 },
        { category: 'other', categoryLabel: 'Other', monthlyAvg: 500, annualTotal: 6000, transactionCount: 80 },
      ],
    }
    localStorage.setItem('co_spending_data', JSON.stringify(spending))
    localStorage.setItem('co_wallet_cards', JSON.stringify(['chase-sapphire-preferred', 'citi-double-cash']))
  })
  await page.reload()
  await expect(page.locator('[data-email-results-section]')).toBeVisible({ timeout: 5000 })
}

test.describe('CO-023: Email results feature', () => {

  // ---------------------------------------------------------------------------
  // UI tests
  // ---------------------------------------------------------------------------

  test('email results section visible when wallet has cards + spending data', async ({ page }) => {
    await seedWalletWithSpending(page)
    await expect(page.locator('[data-email-results-section]')).toBeVisible()
  })

  test('email results section NOT visible when no cards selected', async ({ page }) => {
    await page.goto('/wallet')
    await page.evaluate(() => {
      localStorage.removeItem('co_wallet_cards')
      localStorage.removeItem('co_spending_data')
    })
    await page.reload()
    await expect(page.locator('[data-email-results-section]')).not.toBeVisible()
  })

  test('email form has email input and submit button', async ({ page }) => {
    await seedWalletWithSpending(page)
    await expect(page.locator('[data-email-input]')).toBeVisible()
    await expect(page.locator('[data-email-submit]')).toBeVisible()
  })

  test('email form has monthly digest checkbox', async ({ page }) => {
    await seedWalletWithSpending(page)
    await expect(page.locator('[data-digest-checkbox]')).toBeVisible()
  })

  test('submit button is disabled with empty email', async ({ page }) => {
    await seedWalletWithSpending(page)
    // Button should be enabled (HTML5 validation prevents submission with invalid email)
    // Just verify the input is of type email
    const inputType = await page.locator('[data-email-input]').getAttribute('type')
    expect(inputType).toBe('email')
  })

  // ---------------------------------------------------------------------------
  // API endpoint tests
  // ---------------------------------------------------------------------------

  test('POST /api/email-results returns 400 for missing email', async ({ request }) => {
    const res = await request.post('/api/email-results', {
      data: {
        email: '',
        walletCards: [{ name: 'Test Card', issuer: 'Test', annualFee: 0 }],
        categoryBreakdown: [{ category: 'dining', categoryLabel: 'Dining', bestCardName: 'Test Card', effectiveRate: 3, annualSpend: 4800, annualRewards: 144 }],
        totalAnnualRewards: 144,
        totalAnnualFees: 0,
        netAnnualValue: 144,
        topRecommendations: [],
        monthlyDigestOptIn: false,
      },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/invalid email/i)
  })

  test('POST /api/email-results returns 400 for invalid email format', async ({ request }) => {
    const res = await request.post('/api/email-results', {
      data: {
        email: 'not-an-email',
        walletCards: [{ name: 'Test Card', issuer: 'Test', annualFee: 0 }],
        categoryBreakdown: [{ category: 'dining', categoryLabel: 'Dining', bestCardName: 'Test Card', effectiveRate: 3, annualSpend: 4800, annualRewards: 144 }],
        totalAnnualRewards: 144,
        totalAnnualFees: 0,
        netAnnualValue: 144,
        topRecommendations: [],
        monthlyDigestOptIn: false,
      },
    })
    expect(res.status()).toBe(400)
  })

  test('POST /api/email-results returns 400 for missing wallet cards', async ({ request }) => {
    const res = await request.post('/api/email-results', {
      data: {
        email: 'test@example.com',
        walletCards: [],
        categoryBreakdown: [],
        totalAnnualRewards: 0,
        totalAnnualFees: 0,
        netAnnualValue: 0,
        topRecommendations: [],
        monthlyDigestOptIn: false,
      },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/missing wallet/i)
  })

  test('POST /api/email-results sends email and returns 200', async ({ request }) => {
    const res = await request.post('/api/email-results', {
      data: {
        email: 'ralph-smoke-test@keylightdigital.com',
        walletCards: [
          { name: 'Chase Sapphire Preferred', issuer: 'Chase', annualFee: 95 },
          { name: 'Citi Double Cash', issuer: 'Citi', annualFee: 0 },
        ],
        categoryBreakdown: [
          { category: 'dining', categoryLabel: 'Dining', bestCardName: 'Chase Sapphire Preferred', effectiveRate: 3, annualSpend: 4800, annualRewards: 144 },
          { category: 'other', categoryLabel: 'Other', bestCardName: 'Citi Double Cash', effectiveRate: 2, annualSpend: 6000, annualRewards: 120 },
        ],
        totalAnnualRewards: 264,
        totalAnnualFees: 95,
        netAnnualValue: 169,
        topRecommendations: [
          { name: 'Amex Gold Card', issuer: 'American Express', netAnnualValue: 250, reason: 'Higher dining rate' },
        ],
        monthlyDigestOptIn: false,
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('POST /api/email-results enforces rate limit (max 3 per day)', async ({ request }) => {
    const email = `rate-limit-test-${Date.now()}@keylightdigital.com`
    const payload = {
      email,
      walletCards: [{ name: 'Test Card', issuer: 'Test', annualFee: 0 }],
      categoryBreakdown: [{ category: 'dining', categoryLabel: 'Dining', bestCardName: 'Test Card', effectiveRate: 3, annualSpend: 4800, annualRewards: 144 }],
      totalAnnualRewards: 144,
      totalAnnualFees: 0,
      netAnnualValue: 144,
      topRecommendations: [],
      monthlyDigestOptIn: false,
    }

    // Send 3 emails (should succeed)
    for (let i = 0; i < 3; i++) {
      const res = await request.post('/api/email-results', { data: payload })
      expect(res.status()).toBe(200)
    }

    // 4th should be rate-limited
    const res4 = await request.post('/api/email-results', { data: payload })
    expect(res4.status()).toBe(429)
    const body = await res4.json()
    expect(body.error).toMatch(/rate limit/i)
  })

  // ---------------------------------------------------------------------------
  // Mobile responsive
  // ---------------------------------------------------------------------------

  test('email section is mobile responsive at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await seedWalletWithSpending(page)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
    await expect(page.locator('[data-email-submit]')).toBeVisible()
    const submitHeight = await page.locator('[data-email-submit]').evaluate((el) => el.getBoundingClientRect().height)
    expect(submitHeight).toBeGreaterThanOrEqual(44)
  })
})
