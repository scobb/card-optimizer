## Last completed
CO-016 - Spending category guides for SEO content (150/157 prod smoke tests pass; 15/15 CO-016 tests pass)

## Next up
All 16 stories are now complete and passing. No more work to do.

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting (60 req/hr). Transient — not caused by any code change. Tests pass when rate limit resets.

## Key decisions this session
- URL slug `online-shopping` maps to RewardCategory `online_shopping` — always need a SLUG_TO_CATEGORY map when URL params differ from TS types
- Net value estimate uses $2,000/yr default spend per category: (rate% × $2,000) − annualFee
- Category guide pages link to /cards/:id (card details) and to each other (/best-cards/:slug) for internal linking
