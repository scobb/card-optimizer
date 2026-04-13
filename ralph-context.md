## Last completed
CO-020 - Blog listing page + 'How to Choose Best Credit Card' article (215/225 prod smoke tests pass; 7 CO-012 GitHub rate-limit failures are pre-existing)

## Next up
CO-021 - Blog — 'Cash Back vs Points vs Miles: A Data-Driven Guide'
- Route: /blog/cash-back-vs-points-vs-miles (article only — /blog listing page already exists)
- Need: add new BLOG_POSTS entry in BlogListingPage.tsx, create src/pages/blog/CashBackVsPointsVsMiles.tsx, add to POST_COMPONENTS in BlogPostPage.tsx
- 1500+ words with data tables comparing reward types
- Scenario analysis: when each type wins
- Real examples from card catalog (Chase Freedom Unlimited 1.5% cash back, Amex Gold 4x dining)
- CTA to /upload throughout
- Update sitemap.xml with /blog/cash-back-vs-points-vs-miles

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting (60 req/hr). Transient — not caused by any code change.
- CDN warmup: blog tests had 3 flaky tests on first prod run after deploy. All passed on retry. CDN clears within ~30s — expect same for future blog posts.

## Key decisions this session
- Blog architecture: BLOG_POSTS metadata in BlogListingPage.tsx, POST_COMPONENTS map in BlogPostPage.tsx, individual article files in src/pages/blog/
- Article JSON-LD injected via useEffect with id="blog-post-jsonld" — same cleanup pattern as FAQ/comparison pages
- Article word count verified via page.evaluate() on [data-article-body] textContent
- Inline ArticleCTA component defined inside article TSX file — keeps article self-contained
- `expect(page).toHaveTitle()` auto-retries (use it); `await page.title()` is one-shot snapshot (avoid)
