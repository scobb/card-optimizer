## Last completed
CO-021 - 'Cash Back vs Points vs Miles: A Data-Driven Guide' article (234/241 prod smoke tests pass; 7 CO-012 GitHub rate-limit failures are pre-existing)

## Next up
CO-022 - Blog — 'Annual Fee Credit Cards: When They Are Worth It'
- Route: /blog/annual-fee-worth-it (add to BLOG_POSTS, POST_COMPONENTS, sitemap)
- 1500+ words with break-even analysis for 5+ annual-fee cards
- Break-even table: minimum monthly spend needed to offset annual fee for each card
- Compares each premium card against best no-annual-fee alternative
- CTA to /builder ('Find your optimal wallet combination')
- Article JSON-LD structured data

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting. Transient.
- CDN warmup causes 1-4 flaky test failures on first prod run — all pass on retry. Normal behavior.

## Key decisions this session
- Blog architecture is established: BLOG_POSTS in BlogListingPage.tsx, POST_COMPONENTS in BlogPostPage.tsx, article TSX in src/pages/blog/
- Each new article needs: BLOG_POSTS entry, POST_COMPONENTS entry, title/description override in BlogPostPage.tsx, sitemap entry, article file
- Wrap tables in div.overflow-x-auto for mobile
- `data-article-cta` on CTA buttons, `data-scenario-table` on scenario tables for smoke test targeting
- Article word count test: `[data-article-body]` textContent split on whitespace
