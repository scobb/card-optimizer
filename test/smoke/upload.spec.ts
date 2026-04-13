import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.resolve(__dirname, '../fixtures')

async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

test.describe('CO-002: CSV Upload and Spending Breakdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/upload')
    await clearLocalStorage(page)
    await page.reload()
  })

  // -------------------------------------------------------------------------
  test('upload page renders without errors', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()
    await expect(page.getByText('Drag & drop your transaction CSV')).toBeVisible()
    // Instructions shown when no data
    await expect(page.getByText('How to export your transactions:')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('generic CSV upload shows spending breakdown', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'sample-transactions.csv'))

    // Breakdown table appears
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })

    // Format detection shown
    await expect(page.getByText('Generic CSV format detected.')).toBeVisible()

    // Categories visible
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Groceries' })).toBeVisible()

    // Transaction count shown
    await expect(page.getByText(/transactions/i).first()).toBeVisible()

    // Annual total row visible (use role=rowgroup to target tfoot)
    await expect(page.getByRole('cell', { name: 'Total' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Monarch Money CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'monarch-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Monarch Money export detected.')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Chase CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'chase-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Chase bank export detected.')).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Capital One CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'capital-one-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Capital One export detected.')).toBeVisible()
    // Debit/Credit format: credits should be excluded
    await expect(page.getByRole('cell', { name: 'Groceries' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('spending data persists in localStorage', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'sample-transactions.csv'))

    // Wait for breakdown to appear
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })

    // Reload the page
    await page.reload()

    // Data should still be visible (from localStorage)
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/transactions/i).first()).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('clear data button removes stored data', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'sample-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })

    // Click clear data
    await page.getByRole('button', { name: /clear data/i }).click()

    // Upload zone should reappear
    await expect(page.getByText('Drag & drop your transaction CSV')).toBeVisible()
    await expect(page.getByRole('table')).not.toBeVisible()

    // Verify localStorage is cleared
    const stored = await page.evaluate(() => localStorage.getItem('co_spending_data'))
    expect(stored).toBeNull()
  })

  // -------------------------------------------------------------------------
  test('unknown CSV format shows manual column mapping', async ({ page }) => {
    const unknownCsvContent = [
      'tx_date,payee,spend,notes',
      '2025-01-01,Starbucks,5.75,coffee',
      '2025-01-02,Shell,40.00,gas',
    ].join('\n')

    // Use Playwright setInputFiles with a buffer (avoids DataTransfer hacks)
    await page.locator('[data-testid="csv-file-input"]').setInputFiles({
      name: 'unknown.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(unknownCsvContent),
    })

    await expect(page.getByText(/couldn't auto-detect/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/map the columns manually/i)).toBeVisible()

    // Column selects should appear — use label text (non-exact since label text is the visible text)
    await expect(page.getByText('Date column', { exact: true })).toBeVisible()
    await expect(page.getByText('Merchant / Description column', { exact: true })).toBeVisible()
    await expect(page.getByText('Amount column', { exact: true })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('mobile layout — no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('heading', { name: 'Upload Transactions' })).toBeVisible()

    // Check no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1px tolerance
  })
})
