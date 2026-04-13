## Last completed
CO-017 - Card comparison pages — /compare/:cardA-vs-:cardB (175/175 prod smoke tests pass)

## Next up
CO-018 - IndexNow submission — push all URLs for Google/Bing indexing
- Needs: IndexNow API key file at well-known path, script to submit all public URLs
- All card detail, category guide, and now comparison pages need to be submitted too

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting (60 req/hr). Transient — not caused by any code change.

## Key decisions this session
- Comparison URL slug parsed with `indexOf('-vs-')` (not split) to avoid multi-part issues
- Card names in seed are full names: "American Express Gold Card", "Blue Cash Preferred", etc. — NOT short names like "Amex Gold"
- JSON-LD for comparison pages uses ItemList with two Product ListItems
- `COMPARISON_PAIRS` and `getComparisonsForCard()` exported from ComparisonPage.tsx, imported by CardDetailPage
- 15 pairs chosen to cover high-traffic head-to-head queries (CSP vs Amex Gold, etc.)
