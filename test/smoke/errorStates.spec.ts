import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import os from 'os'

async function uploadTempFile(page: ReturnType<typeof page>, content: string, filename: string) {
  const tmpDir = os.tmpdir()
  const tmpPath = path.join(tmpDir, filename)
  fs.writeFileSync(tmpPath, content)
  const input = page.locator('input[type="file"]')
  await input.setInputFiles(tmpPath)
  fs.unlinkSync(tmpPath)
}

// Suppress the TypeScript error for page parameter
declare function page(): { locator: (s: string) => unknown }

test.describe('CO-036: Error states and edge cases', () => {
  // -------------------------------------------------------------------------
  test('empty CSV file shows File appears empty error', async ({ page }) => {
    await page.goto('/upload')
    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, 'empty-test.csv')
    fs.writeFileSync(tmpPath, '')
    try {
      const input = page.locator('input[type="file"]')
      await input.setInputFiles(tmpPath)
      await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
      const text = await page.locator('[data-upload-error]').textContent()
      expect(text).toMatch(/appears empty/i)
    } finally {
      fs.unlinkSync(tmpPath)
    }
  })

  // -------------------------------------------------------------------------
  test('whitespace-only CSV file shows File appears empty error', async ({ page }) => {
    await page.goto('/upload')
    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, 'whitespace-test.csv')
    fs.writeFileSync(tmpPath, '   \n\n  ')
    try {
      const input = page.locator('input[type="file"]')
      await input.setInputFiles(tmpPath)
      await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
      const text = await page.locator('[data-upload-error]').textContent()
      expect(text).toMatch(/appears empty/i)
    } finally {
      fs.unlinkSync(tmpPath)
    }
  })

  // -------------------------------------------------------------------------
  test('error message is dismissible with X button', async ({ page }) => {
    await page.goto('/upload')
    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, 'empty-dismiss.csv')
    fs.writeFileSync(tmpPath, '')
    try {
      const input = page.locator('input[type="file"]')
      await input.setInputFiles(tmpPath)
      await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
      // Click dismiss button
      await page.locator('[data-dismiss-error]').click()
      await expect(page.locator('[data-upload-error]')).not.toBeVisible()
    } finally {
      fs.unlinkSync(tmpPath)
    }
  })

  // -------------------------------------------------------------------------
  test('CSV with only headers and no data rows shows no transactions error', async ({ page }) => {
    await page.goto('/upload')
    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, 'headers-only.csv')
    // Chase format headers but no data
    fs.writeFileSync(tmpPath, 'Transaction Date,Post Date,Description,Category,Type,Amount,Memo\n')
    try {
      const input = page.locator('input[type="file"]')
      await input.setInputFiles(tmpPath)
      await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
      const text = await page.locator('[data-upload-error]').textContent()
      expect(text).toMatch(/no transactions found/i)
    } finally {
      fs.unlinkSync(tmpPath)
    }
  })

  // -------------------------------------------------------------------------
  test('non-CSV file type shows format error on drop', async ({ page }) => {
    await page.goto('/upload')
    // Simulate drag-drop of a non-CSV file using browser evaluate
    await page.evaluate(() => {
      const zone = document.querySelector('[aria-label="Upload CSV file"]') as HTMLElement
      if (!zone) return
      const dt = new DataTransfer()
      const file = new File(['not a csv'], 'test.txt', { type: 'text/plain' })
      dt.items.add(file)
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }))
    })
    await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
    const text = await page.locator('[data-upload-error]').textContent()
    expect(text).toMatch(/\.csv/i)
  })

  // -------------------------------------------------------------------------
  test('recommendations page shows no-data state without spending upload', async ({ page }) => {
    await page.goto('/recommendations')
    // Clear any stored data
    await page.evaluate(() => {
      localStorage.removeItem('co_spending_data')
      localStorage.removeItem('co_wallet_cards')
    })
    await page.reload()
    await expect(page.getByText(/no spending data/i)).toBeVisible()
  })

  // -------------------------------------------------------------------------
  test('recommendations shows no-match state when all cards are already in wallet', async ({ page, request }) => {
    // Fetch all card IDs and put them all in the wallet — leaves nothing to recommend
    const res = await request.get('/api/cards')
    const cards = await res.json() as Array<{ id: string }>
    const allIds = cards.map((c) => c.id)

    const SPENDING = JSON.stringify({
      breakdown: [
        { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
        { category: 'other', monthlyAvg: 200, annualTotal: 2400, transactionCount: 24 },
      ],
      format: 'generic',
      formatLabel: 'Test',
      uploadedAt: new Date().toISOString(),
      transactionCount: 84,
    })
    await page.goto('/upload')
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_spending_data', SPENDING] as const)
    await page.evaluate(([k, v]) => { localStorage.setItem(k, v) }, ['co_wallet_cards', JSON.stringify(allIds)] as const)
    await page.goto('/recommendations')
    await expect(page.locator('[data-no-recommendations]')).toBeVisible({ timeout: 10000 })
    const text = await page.locator('[data-no-recommendations]').textContent()
    expect(text).toMatch(/no cards found/i)
  })

  // -------------------------------------------------------------------------
  test('mobile — error message is readable at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/upload')
    const tmpDir = os.tmpdir()
    const tmpPath = path.join(tmpDir, 'mobile-error.csv')
    fs.writeFileSync(tmpPath, '')
    try {
      const input = page.locator('input[type="file"]')
      await input.setInputFiles(tmpPath)
      await expect(page.locator('[data-upload-error]')).toBeVisible({ timeout: 5000 })
      // No overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    } finally {
      fs.unlinkSync(tmpPath)
    }
  })
})
