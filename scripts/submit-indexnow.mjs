#!/usr/bin/env node
/**
 * submit-indexnow.mjs
 *
 * Submits all card-optimizer public URLs to the IndexNow API so that
 * Bing, Google (via indexnow.org), and other participating search engines
 * index new/updated content faster.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs           # live submission
 *   node scripts/submit-indexnow.mjs --dry-run # print URLs only, no API call
 *
 * Re-runnable: safe to run after any content addition (new cards, comparisons, etc.)
 */

const HOST = 'cards.keylightdigital.dev'
const INDEXNOW_KEY = 'c7b4ca1d-7cf8-45e5-9f9a-5ee4c2caf71a'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

const DRY_RUN = process.argv.includes('--dry-run')

// ---------------------------------------------------------------------------
// Card IDs (mirrors the seed data — add new cards here when catalog expands)
// ---------------------------------------------------------------------------
const CARD_IDS = [
  'chase-sapphire-preferred',
  'chase-freedom-unlimited',
  'chase-freedom-flex',
  'amex-gold',
  'amex-platinum',
  'amex-blue-cash-preferred',
  'citi-double-cash',
  'citi-custom-cash',
  'capital-one-venture-x',
  'capital-one-savor-one',
  'discover-it-cash-back',
  'wells-fargo-active-cash',
  'capital-one-venture',
  'chase-sapphire-reserve',
  'amex-blue-cash-everyday',
  'bank-of-america-customized-cash',
  'us-bank-altitude-go',
  'amex-green',
  'chase-ink-cash',
  'capital-one-quicksilver',
]

// ---------------------------------------------------------------------------
// Category guide slugs
// ---------------------------------------------------------------------------
const CATEGORY_SLUGS = [
  'dining',
  'groceries',
  'travel',
  'gas',
  'online-shopping',
  'streaming',
]

// ---------------------------------------------------------------------------
// Comparison pairs
// ---------------------------------------------------------------------------
const COMPARISON_SLUGS = [
  'chase-sapphire-preferred-vs-amex-gold',
  'chase-sapphire-preferred-vs-chase-sapphire-reserve',
  'chase-sapphire-preferred-vs-capital-one-venture-x',
  'amex-gold-vs-amex-platinum',
  'chase-freedom-unlimited-vs-citi-double-cash',
  'amex-blue-cash-preferred-vs-amex-blue-cash-everyday',
  'chase-sapphire-reserve-vs-amex-platinum',
  'capital-one-venture-vs-capital-one-venture-x',
  'citi-double-cash-vs-wells-fargo-active-cash',
  'chase-freedom-flex-vs-citi-custom-cash',
  'chase-sapphire-preferred-vs-capital-one-venture',
  'amex-gold-vs-capital-one-savor-one',
  'chase-ink-cash-vs-chase-freedom-unlimited',
  'discover-it-cash-back-vs-citi-double-cash',
  'bank-of-america-customized-cash-vs-citi-custom-cash',
]

// ---------------------------------------------------------------------------
// Build complete URL list
// ---------------------------------------------------------------------------
function buildUrlList() {
  const base = `https://${HOST}`

  const staticPages = [
    '/',
    '/upload',
    '/wallet',
    '/recommendations',
    '/builder',
    '/catalog',
    '/privacy',
    '/faq',
  ]

  const cardPages = CARD_IDS.map((id) => `/cards/${id}`)
  const categoryPages = CATEGORY_SLUGS.map((slug) => `/best-cards/${slug}`)
  const comparisonPages = COMPARISON_SLUGS.map((slug) => `/compare/${slug}`)

  return [
    ...staticPages,
    ...cardPages,
    ...categoryPages,
    ...comparisonPages,
  ].map((path) => `${base}${path}`)
}

// ---------------------------------------------------------------------------
// Submit to IndexNow
// ---------------------------------------------------------------------------
async function submitToIndexNow(urlList) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })

  return response
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const urlList = buildUrlList()

  console.log(`IndexNow submission — ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Host: ${HOST}`)
  console.log(`Key: ${INDEXNOW_KEY}`)
  console.log(`Endpoint: ${INDEXNOW_ENDPOINT}`)
  console.log(`URLs to submit: ${urlList.length}`)
  console.log('')
  urlList.forEach((url) => console.log(`  ${url}`))
  console.log('')

  if (DRY_RUN) {
    console.log('Dry run — no API call made.')
    console.log(`SUCCESS: ${urlList.length} URLs listed (dry run)`)
    process.exit(0)
  }

  let successCount = 0
  let failureCount = 0

  try {
    const response = await submitToIndexNow(urlList)

    // IndexNow returns 200 (accepted) or 202 (OK) for successful batch submissions
    // 400 = invalid format, 403 = key mismatch, 422 = URL not on host, 429 = rate limited
    if (response.status === 200 || response.status === 202) {
      successCount = urlList.length
      console.log(`✓ IndexNow accepted all ${urlList.length} URLs (HTTP ${response.status})`)
    } else {
      const body = await response.text()
      failureCount = urlList.length
      console.error(`✗ IndexNow returned HTTP ${response.status}: ${body}`)
    }
  } catch (err) {
    failureCount = urlList.length
    console.error(`✗ Network error submitting to IndexNow: ${err.message}`)
  }

  console.log('')
  console.log(`Results: ${successCount} succeeded, ${failureCount} failed`)

  if (failureCount > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
