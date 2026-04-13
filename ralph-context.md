## Last completed
CO-028 - FinancialProduct JSON-LD structured data on all card detail pages

## Next up
CO-029 - Tool comparison pages — /vs/nerdwallet and /vs/the-points-guy
- Two pages comparing card-optimizer to NerdWallet and The Points Guy
- Each page: comparison table (feature/us/them), honest positioning, 800+ words
- Unique meta title/description targeting '[competitor] alternative' searches
- Article JSON-LD on each page
- Sitemap updated with /vs/nerdwallet and /vs/the-points-guy
- Internal links to card detail pages and category guides
- Mobile responsive at 375px

## Active issues
- email.spec.ts test "POST /api/email-results sends email and returns 200" fails on staging with HTTP 429 when rate limit (3 emails/day) is exhausted from multiple suite runs; passes fresh on prod — pre-existing transient issue, not a blocker
- CO-001 through CO-008 in blocked-stories.json — OLD SSL blockers, all stories now passes=true, ignore

## Key decisions this session
- FinancialProduct JSON-LD injected inside existing useEffect in CardDetailPage.tsx (not a separate useEffect) — cleaner, same cleanup boundary
- script tag ID is 'card-detail-jsonld' — used consistently in cleanup and tests
- Global WebApplication JSON-LD from index.html has no ID — reference it as `script[type="application/ld+json"]:first` in tests
