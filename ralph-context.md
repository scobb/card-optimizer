## Last completed
CO-031 - Annual savings calculator — show dollar impact of optimal wallet

## Next up
CO-032 - LocalStorage wallet persistence — save and restore analysis

## Active issues
- email.spec.ts "POST /api/email-results sends email and returns 200" fails on staging/prod with HTTP 429 when rate limit (3 emails/day) is exhausted; pre-existing transient
- github.spec.ts CO-012 tests fail on prod with GitHub API rate limits (7 tests); pre-existing
- CO-001 through CO-008 in blocked-stories.json — OLD SSL blockers, all stories now passes=true, ignore

## Key decisions this session
- Savings banner on WalletPage has expandable category breakdown (data-savings-breakdown-toggle); RecommendationsPage shows banner only (no breakdown, since per-card breakdowns already exist there)
- savingsData useMemo depends on `optimization` (memoized) and `spendingData` — avoids recomputing wallet optimization a second time on WalletPage
- Banner not shown when no wallet cards selected (savings = 0 would be meaningless) or no spending data
- data attributes: data-savings-banner (banner container), data-savings-amount (dollar span), data-savings-breakdown-toggle (toggle button), data-savings-breakdown (expanded table)
- SPENDING_PRESETS export from UploadPage.tsx is available for CO-035 (landing page preview)
