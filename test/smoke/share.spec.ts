import { test, expect, Page } from '@playwright/test'

async function seedSpendingAndWallet(page: Page) {
  await page.evaluate(() => {
    const spending = {
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'groceries', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'travel', monthlyAvg: 300, annualTotal: 3600, transactionCount: 36 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 168,
    }
    localStorage.setItem('co_spending_data', JSON.stringify(spending))
    localStorage.setItem(
      'co_wallet_cards',
      JSON.stringify(['chase-sapphire-preferred', 'citi-double-cash']),
    )
  })
}

function encodeShareUrl(
  spending: Array<{ cat: string; total: number }>,
  wallet: string[],
  base: string,
): string {
  const payload = { v: 1, spending, wallet }
  const json = JSON.stringify(payload)
  const b64 = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return base + '#share=' + b64
}

test.describe('CO-008: Share Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wallet')
    await page.evaluate(() => {
      localStorage.clear()
    })
  })

  // -------------------------------------------------------------------------
  test('share button visible when wallet and spending data present', async ({ page }) => {
    await seedSpendingAndWallet(page)
    await page.reload()

    await expect(page.locator('[data-share-button]')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('share button not visible without optimization results', async ({ page }) => {
    // No data at all — no results section shown
    await expect(page.locator('[data-share-button]')).not.toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('share URL contains #share= hash', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await seedSpendingAndWallet(page)
    await page.reload()

    await expect(page.locator('[data-share-button]')).toBeVisible()
    await page.locator('[data-share-button]').click()
    await expect(page.locator('[data-share-button]')).toContainText('Copied!')

    const clipText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipText).toContain('#share=')
  })

  // -------------------------------------------------------------------------
  test('opening share URL restores spending data', async ({ page }) => {
    const baseUrl = page.url().replace('/wallet', '')

    const shareUrl = encodeShareUrl(
      [
        { cat: 'dining', total: 6000 },
        { cat: 'groceries', total: 4800 },
      ],
      ['citi-double-cash'],
      baseUrl + '/wallet',
    )

    // Clear storage, then navigate to the share URL
    await page.evaluate(() => localStorage.clear())
    await page.goto(shareUrl)

    // After load, spending data should be restored (shows optimization results)
    await expect(page.getByText('Annual Rewards')).toBeVisible()
    await expect(page.getByText('Annual Fees')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('opening share URL restores wallet card selection', async ({ page }) => {
    const baseUrl = page.url().replace('/wallet', '')

    const shareUrl = encodeShareUrl(
      [{ cat: 'dining', total: 6000 }],
      ['citi-double-cash', 'chase-freedom-unlimited'],
      baseUrl + '/wallet',
    )

    await page.evaluate(() => localStorage.clear())
    await page.goto(shareUrl)

    // Citi Double Cash should be selected (its checkbox)
    const citiBtn = page.locator('[data-card-id="citi-double-cash"]')
    await expect(citiBtn).toBeVisible()
    // The button should have blue background indicating selected state
    const cls = await citiBtn.getAttribute('class')
    expect(cls).toContain('bg-blue-50')
  })

  // -------------------------------------------------------------------------
  test('hash is removed from URL after restoration', async ({ page }) => {
    const baseUrl = page.url().replace('/wallet', '')

    const shareUrl = encodeShareUrl(
      [{ cat: 'dining', total: 6000 }],
      ['citi-double-cash'],
      baseUrl + '/wallet',
    )

    await page.evaluate(() => localStorage.clear())
    await page.goto(shareUrl)

    // Wait for restoration
    await expect(page.getByText('Annual Rewards')).toBeVisible()

    // Hash should be gone
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('#share=')
  })

  // -------------------------------------------------------------------------
  test('invalid share hash is ignored gracefully', async ({ page }) => {
    await page.goto('/wallet#share=this-is-not-valid-base64!!!')

    // Page should render without crashing
    await expect(page.getByRole('heading', { name: 'My Wallet' })).toBeVisible()
    // No restoration happened — no spending data, no error
    await expect(page.locator('[data-share-button]')).not.toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('share link contains no transaction-level data', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await seedSpendingAndWallet(page)
    await page.reload()

    await expect(page.locator('[data-share-button]')).toBeVisible()
    await page.locator('[data-share-button]').click()
    const clipText = await page.evaluate(() => navigator.clipboard.readText())

    // Extract the hash payload and decode
    const hash = clipText.split('#share=')[1]
    const padded = hash.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice((hash.length % 4) || 4)
    const decoded = atob(padded)
    const payload = JSON.parse(decoded)

    // Should only contain aggregated totals, not individual transactions
    expect(payload.v).toBe(1)
    expect(Array.isArray(payload.spending)).toBe(true)
    expect(Array.isArray(payload.wallet)).toBe(true)
    // Each spending item only has cat + total (no merchant, date, description)
    for (const item of payload.spending) {
      expect(Object.keys(item).sort()).toEqual(['cat', 'total'])
    }
  })
})
