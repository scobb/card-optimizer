## Last completed
CO-019 - FAQ page with structured data for featured snippets (195/204 prod smoke tests pass; 7 CO-012 GitHub rate-limit failures are pre-existing; all 20 CO-019 tests pass)

## Next up
CO-020 - Blog — 'How to Choose the Best Credit Card for Your Spending'
- Route: /blog (listing page) + /blog/how-to-choose-best-credit-card (full article, 2000+ words)
- Need: blog infrastructure (listing page), article route, Article JSON-LD, multiple CTAs to /upload
- Internal links to category guides (/best-cards/:category) and card detail pages (/cards/:slug)
- Sitemap update for blog routes

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting (60 req/hr). Transient — not caused by any code change.
- Cloudflare CDN caches static files briefly after deploy — if sitemap smoke tests fail on first run after deploy, wait ~30s and retry

## Key decisions this session
- FAQ page: 20 questions across 4 groups (About the Tool, Privacy & Data, Card Strategy, Rewards Basics)
- FAQPage JSON-LD injected via useEffect with id="faq-jsonld" for easy cleanup — same pattern as CO-017
- Brand is "CardOptimizer" (one word) — test regexes must use /cardoptimizer/i not /card optimizer/i
- Test helper `gotoFaq()` waits for [data-faq-page] to prevent flaky locator timeouts
- `expect(page).toHaveTitle()` auto-retries (use it); `await page.title()` is a one-shot snapshot (avoid for useEffect-set titles)
