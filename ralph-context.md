## Last completed
CO-018 - IndexNow submission — push all URLs for Google/Bing indexing (184/184 prod smoke tests pass, 49 URLs submitted HTTP 202)

## Next up
CO-019 - FAQ page with structured data for featured snippets
- Route: /faq — expandable questions, FAQPage JSON-LD, 15+ questions grouped by topic
- /faq already in sitemap.xml (added in CO-018)
- Pattern: inject JSON-LD via useEffect with cleanup (same as CO-017 comparison pages)

## Active issues
- CO-012 GitHub API smoke tests are flaky due to unauthenticated API rate limiting (60 req/hr). Transient — not caused by any code change.
- Cloudflare CDN caches static files briefly after deploy — if sitemap smoke tests fail on first run after deploy, wait ~30s and retry (CDN clears quickly)

## Key decisions this session
- IndexNow key: c7b4ca1d-7cf8-45e5-9f9a-5ee4c2caf71a (file at public/{key}.txt, served at root)
- Submit script at scripts/submit-indexnow.mjs — run `node scripts/submit-indexnow.mjs` to resubmit after new content
- 49 total URLs submitted: 8 static + 20 cards + 6 category guides + 15 comparisons
- /privacy was missing from sitemap — fixed in CO-018 (added both /privacy and /faq)
