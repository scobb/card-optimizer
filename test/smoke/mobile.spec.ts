import { test, expect, Page } from '@playwright/test'

const PAGES = [
  { path: '/upload', heading: 'Upload Transactions' },
  { path: '/wallet', heading: 'My Wallet' },
  { path: '/recommendations', heading: 'Recommendations' },
  { path: '/builder', heading: 'Optimal Wallet' },
  { path: '/catalog', heading: 'Card Catalog' },
]

async function setMobile(page: Page) {
  await page.setViewportSize({ width: 375, height: 812 })
}

async function noHorizontalOverflow(page: Page): Promise<boolean> {
  const result = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }))
  return result.sw <= result.cw + 1
}

test.describe('CO-007: Mobile Responsive at 375px', () => {
  // -------------------------------------------------------------------------
  for (const { path, heading } of PAGES) {
    test(`${path} — no horizontal overflow at 375px`, async ({ page }) => {
      await setMobile(page)
      await page.goto(path)
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
      expect(await noHorizontalOverflow(page)).toBe(true)
    })
  }

  // -------------------------------------------------------------------------
  test('navigation — all links reachable at 375px', async ({ page }) => {
    await setMobile(page)
    await page.goto('/upload')

    // All 5 nav links must be in the DOM and visible
    const navLinks = ['Upload', 'Wallet', 'Recommendations', 'Builder', 'Cards']
    for (const name of navLinks) {
      await expect(page.getByRole('link', { name }).first()).toBeVisible()
    }
  })

  // -------------------------------------------------------------------------
  test('navigation — links have sufficient tap target height (≥44px)', async ({ page }) => {
    await setMobile(page)
    await page.goto('/upload')

    const heights = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('nav a'))
      return links.map((el) => (el as HTMLElement).getBoundingClientRect().height)
    })

    expect(heights.length).toBeGreaterThan(0)
    for (const h of heights) {
      expect(h).toBeGreaterThanOrEqual(44)
    }
  })

  // -------------------------------------------------------------------------
  test('navigation — can navigate between pages on mobile', async ({ page }) => {
    await setMobile(page)
    await page.goto('/upload')

    await page.getByRole('link', { name: 'Cards' }).first().click()
    await expect(page.getByRole('heading', { name: 'Card Catalog' })).toBeVisible()
    expect(await noHorizontalOverflow(page)).toBe(true)

    await page.getByRole('link', { name: 'Builder' }).first().click()
    await expect(page.getByRole('heading', { name: 'Optimal Wallet' })).toBeVisible()
    expect(await noHorizontalOverflow(page)).toBe(true)
  })

  // -------------------------------------------------------------------------
  test('catalog search input usable at 375px', async ({ page }) => {
    await setMobile(page)
    await page.goto('/catalog')
    await expect(page.locator('[data-catalog-count]')).toBeVisible()

    await page.locator('[data-catalog-search]').fill('chase')
    const cards = page.locator('[data-catalog-card]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    expect(await noHorizontalOverflow(page)).toBe(true)
  })

  // -------------------------------------------------------------------------
  test('card count buttons usable at 375px on builder page', async ({ page }) => {
    await setMobile(page)
    await page.goto('/builder')

    await page.evaluate(() => {
      localStorage.setItem('co_spending_data', JSON.stringify({
        breakdown: [
          { category: 'dining', monthlyAvg: 500, annualTotal: 6000, transactionCount: 60 },
          { category: 'groceries', monthlyAvg: 400, annualTotal: 4800, transactionCount: 48 },
        ],
        format: 'generic',
        formatLabel: 'Generic CSV',
        uploadedAt: new Date().toISOString(),
        transactionCount: 108,
      }))
    })
    await page.reload()

    const btn2 = page.locator('[data-max-cards="2"]')
    await expect(btn2).toBeVisible()
    const height = await btn2.evaluate((el) => (el as HTMLElement).getBoundingClientRect().height)
    expect(height).toBeGreaterThanOrEqual(44)
    expect(await noHorizontalOverflow(page)).toBe(true)
  })
})
