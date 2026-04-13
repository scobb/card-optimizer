## Last completed
CO-034 - Card application links — make recommendations actionable

## Next up
CO-035 - Quick results preview on landing page — instant value for visitors
- Show pre-computed optimization for Average American spending ($4,500/mo) on landing page
- Top 3 recommended cards with names, reward rates, why recommended
- Estimated annual savings (from CO-031 calculator)
- CTA: "Try with your spending" links to upload page
- Section: below hero, above how-it-works
- Use optimizer.ts logic with preset spending breakdown; SPENDING_PRESETS from UploadPage.tsx

## Active issues
- Pre-existing failures (not blocking): CO-012 (GitHub repo tests), CO-023 (email rate limit)
- prod edge propagation: wait ~30s after deploy before running smoke tests

## Key decisions this session
- Card.url renamed to Card.learnMoreUrl everywhere (types, API, seed, all pages)
- DB column stays `url`; API maps to `learnMoreUrl` in response (no migration needed)
- data-apply-link renamed to data-learn-more-link on CardDetailPage and RecommendationsPage
- Catalog cards use [data-catalog-card] attribute (not [data-card-id])
- hasAnalysis() validates JSON shape (checks .breakdown is array) — not just key existence
- ClearDataButton uses window.location.assign('/upload') for full page reload
