import { test, expect } from '@playwright/test'

const BEAM_SITE_ID = '5587e834-9274-4f00-8c92-14d33018d847'

test.describe('CO-014: Beam analytics', () => {
  test('Beam script is present in index.html with correct src', async ({ page }) => {
    await page.goto('/')
    const beamSrc = await page.locator('script[src*="beam-privacy.com/js/beam.js"]').getAttribute('src')
    expect(beamSrc).toContain('beam-privacy.com/js/beam.js')
  })

  test('Beam script has correct site-id', async ({ page }) => {
    await page.goto('/')
    const siteId = await page.locator('script[data-site-id]').getAttribute('data-site-id')
    expect(siteId).toBe(BEAM_SITE_ID)
  })

  test('Beam script is deferred (async loading — no page load impact)', async ({ page }) => {
    await page.goto('/')
    const hasDefer = await page.locator('script[data-site-id]').getAttribute('defer')
    // defer attribute presence (empty string when set, null when absent)
    expect(hasDefer).not.toBeNull()
  })

  test('Beam fires a pageview request on initial load', async ({ page }) => {
    const beamRequests: string[] = []
    page.on('request', req => {
      if (req.url().includes('beam-privacy.com/api/collect')) {
        beamRequests.push(req.url())
      }
    })

    await page.goto('/')
    // Give beam.js time to fire after defer
    await page.waitForTimeout(2000)

    expect(beamRequests.length).toBeGreaterThanOrEqual(1)
  })

  test('Beam fires a pageview on SPA navigation', async ({ page }) => {
    const beamRequests: string[] = []
    page.on('request', req => {
      if (req.url().includes('beam-privacy.com/api/collect')) {
        beamRequests.push(req.url())
      }
    })

    await page.goto('/')
    await page.waitForTimeout(1500)
    const countAfterLoad = beamRequests.length

    // Navigate to another route
    await page.click('a[href="/upload"]')
    await page.waitForTimeout(1500)

    // Should have fired an additional pageview for the new route
    expect(beamRequests.length).toBeGreaterThan(countAfterLoad)
  })

  test('Beam script does not block page render (loads asynchronously)', async ({ page }) => {
    // Verify the script tag has defer so it doesn't block parsing
    await page.goto('/')
    // The page should render (hero or landing content visible) even if beam.js hasn't loaded
    const hasContent = await page.locator('body').textContent()
    expect(hasContent).toBeTruthy()
    expect(hasContent!.length).toBeGreaterThan(10)

    // Verify defer attribute is on the beam script
    const beamScript = page.locator('script[src*="beam-privacy.com"]')
    const defer = await beamScript.getAttribute('defer')
    expect(defer).not.toBeNull()
  })
})
