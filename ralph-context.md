## Last completed
CO-027 - Best Credit Cards of 2026 roundup page at /best-cards-2026

## Next up
CO-028 - FinancialProduct structured data on card detail pages
- Add JSON-LD FinancialProduct (or CreditCard) schema to each /cards/:slug page dynamically from card data
- Must not conflict with CO-009 global WebApplication schema — use a separate script tag with a unique ID
- All 20 card pages should get markup dynamically (no hardcoding per card)
- Key pattern: useEffect in CardDetailPage.tsx, same inject/cleanup pattern used by ComparisonPage and FaqPage
- Test: check JSON-LD script is present, @type is FinancialProduct or similar, includes name/provider/fees

## Active issues
- email.spec.ts test "POST /api/email-results sends email and returns 200" fails on staging with HTTP 429 when rate limit (3 emails/day) is exhausted from multiple suite runs; passes fresh on prod — pre-existing transient issue, not a blocker
- CO-001 through CO-008 in blocked-stories.json — OLD SSL blockers, all stories now passes=true, ignore

## Key decisions this session
- BestCards2026 picks are hardcoded in PICKS array (not computed from cards.json) for editorial quality — why-it-wins text is specific to each card
- Article JSON-LD uses same inject/cleanup pattern as ComparisonPage and FaqPage (createElement + document.head.appendChild with ID for cleanup)
- 8 flaky (CDN cold-start on staging, all passed on retry) is normal for new routes — not a real failure
