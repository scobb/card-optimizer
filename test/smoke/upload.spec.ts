import { test, expect, Page } from '@playwright/test'
import path from 'path'

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
    await expect(page.getByText(/format detected|Generic CSV/i)).toBeVisible()

    // Categories visible
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Groceries' })).toBeVisible()

    // Transaction count shown
    await expect(page.getByText(/transactions/i)).toBeVisible()

    // Annual total row visible
    await expect(page.getByRole('row', { name: /total/i })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Monarch Money CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'monarch-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Monarch Money/i)).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Dining' })).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Chase CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'chase-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Chase/i)).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('Capital One CSV auto-detected', async ({ page }) => {
    const input = page.locator('[data-testid="csv-file-input"]')
    await input.setInputFiles(path.join(FIXTURES, 'capital-one-transactions.csv'))

    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Capital One/i)).toBeVisible()
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
    await expect(page.getByText(/transactions/i)).toBeVisible()
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
    const unknownCsv = [
      'tx_date,payee,spend,notes',
      '2025-01-01,Starbucks,5.75,coffee',
      '2025-01-02,Shell,40.00,gas',
    ].join('\n')

    // Write unknown CSV to a temp file via page evaluate + blob trick
    await page.evaluate((csv) => {
      window.__testCsv = csv
    }, unknownCsv)

    // Use file input with blob
    await page.evaluate(() => {
      const csv = (window as unknown as { __testCsv: string }).__testCsv
      const blob = new Blob([csv], { type: 'text/csv' })
      const file = new File([blob], 'unknown.csv', { type: 'text/csv' })
      const dt = new DataTransfer()
      dt.items.add(file)
      const input = document.querySelector('[data-testid="csv-file-input"]') as HTMLInputElement
      Object.defineProperty(input, 'files', { value: dt.files })
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    await expect(page.getByText(/couldn't auto-detect/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/map the columns manually/i)).toBeVisible()

    // Column selects should appear
    await expect(page.getByLabel('Date column')).toBeVisible()
    await expect(page.getByLabel('Merchant / Description column')).toBeVisible()
    await expect(page.getByLabel('Amount column')).toBeVisible()
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
