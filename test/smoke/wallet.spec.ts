import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.resolve(__dirname, '../fixtures')

async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function seedSpendingData(page: Page) {
  // Seed localStorage with spending data so wallet optimization works
  await page.evaluate(() => {
    const data = {
      breakdown: [
        { category: 'dining', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        { category: 'groceries', monthlyAvg: 300, annualTotal: 3600, transactionCount: 36 },
        { category: 'gas', monthlyAvg: 100, annualTotal: 1200, transactionCount: 12 },
        { category: 'travel', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
        { category: 'streaming', monthlyAvg: 50, annualTotal: 600, transactionCount: 12 },
        { category: 'other', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
      ],
      format: 'generic',
      formatLabel: 'Generic CSV',
      uploadedAt: new Date().toISOString(),
      transactionCount: 192,
    }
    localStorage.setItem('co_spending_data', JSON.stringify(data))
  })
}

test.describe('CO-003: Wallet Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wallet')
    await clearLocalStorage(page)
    await page.reload()
  })

  // -------------------------------------------------------------------------
  test('wallet page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Wallet' })).toBeVisible()
    await expect(page.getByText('Select Your Cards')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows prompt to upload CSV when no spending data', async ({ page }) => {
    await expect(page.getByText('No spending data uploaded yet.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Upload your transaction CSV' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows prompt to select cards when spending data exists but no cards selected', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()
    // Look for the specific "no cards selected" prompt (not the optimization placeholder)
    await expect(page.getByText('Select one or more cards above to see per-category optimization.')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('card picker lists issuers with cards', async ({ page }) => {
    // Use exact issuer group button text patterns to avoid strict mode violations
    await expect(page.getByRole('button', { name: /^Chase \d+ cards$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^American Express \d+ cards$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Capital One \d+ cards$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Citi \d+ cards$/ })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('can select and deselect a card', async ({ page }) => {
    // Chase is expanded by default; click Chase Sapphire Preferred
    const cspButton = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await expect(cspButton).toBeVisible()
    await cspButton.click()

    // Should show 1 selected
    await expect(page.getByText('1 card selected')).toBeVisible()

    // Deselect
    await cspButton.click()
    await expect(page.getByText('1 card selected')).not.toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('shows optimization results when cards selected and spending data present', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Select Chase Sapphire Preferred
    const cspButton = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await expect(cspButton).toBeVisible()
    await cspButton.click()

    // Optimization table should appear
    await expect(page.getByText('Per-Category Optimization')).toBeVisible()
    await expect(page.getByText('Annual Rewards')).toBeVisible()
    await expect(page.getByText('Annual Fees')).toBeVisible()
    await expect(page.getByText('Net Value')).toBeVisible()

    // Category table rows visible
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Groceries' })).toBeVisible()

    // Best card column should show the selected card name
    await expect(page.getByText('Chase Sapphire Preferred').first()).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('net value updates when additional card added', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    // Select one card
    const csp = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await csp.click()

    // Optimization section appears
    await expect(page.getByText('Net Value')).toBeVisible()

    // Select a second card — Amex Gold is in American Express group (already expanded by default)
    const amexGold = page.locator('[data-card-id="amex-gold"]')
    await expect(amexGold).toBeVisible()
    await amexGold.click()

    // Should now show 2 cards selected
    await expect(page.getByText('2 cards selected')).toBeVisible()

    // Cards in Wallet section shows both cards
    await expect(page.getByText('Cards in Wallet')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('wallet selection persists in localStorage across reload', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    const csp = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await csp.click()
    await expect(page.getByText('1 card selected')).toBeVisible()

    // Reload
    await page.reload()

    // Selection should persist
    await expect(page.getByText('1 card selected')).toBeVisible()
    await expect(page.getByText('Per-Category Optimization')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('remove card from wallet via cards-in-wallet section', async ({ page }) => {
    await seedSpendingData(page)
    await page.reload()

    const csp = page.locator('[data-card-id="chase-sapphire-preferred"]')
    await csp.click()
    await expect(page.getByText('Cards in Wallet')).toBeVisible()

    // Click Remove button in the wallet summary
    await page.getByRole('button', { name: 'Remove' }).click()

    // Net Value summary cards should disappear (optimization gone)
    await expect(page.getByText('Annual Rewards')).not.toBeVisible({ timeout: 5000 })
    // "Select cards" prompt should appear
    await expect(page.getByText('Select one or more cards above to see per-category optimization.')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'My Wallet' })).toBeVisible()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  // -------------------------------------------------------------------------
  test('CSV upload then wallet flow', async ({ page }) => {
    // Navigate to upload, upload a CSV, then go to wallet
    await page.goto('/upload')
    await clearLocalStorage(page)
    await page.reload()

    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'sample-transactions.csv'))
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })

    // Navigate to wallet
    await page.getByRole('link', { name: 'Wallet' }).click()
    await expect(page.getByRole('heading', { name: 'My Wallet' })).toBeVisible()

    // Should NOT show "no spending data" prompt
    await expect(page.getByText('No spending data uploaded yet.')).not.toBeVisible()
    await expect(page.getByText('Select one or more cards above to see per-category optimization.')).toBeVisible()
  })
})
