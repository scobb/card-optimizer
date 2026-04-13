## Last completed
CO-029 - Tool comparison pages at /vs/nerdwallet and /vs/the-points-guy

## Next up
All stories in prd.json now have passes: true. No remaining work.

## Active issues
- email.spec.ts "POST /api/email-results sends email and returns 200" fails on staging with HTTP 429 when rate limit (3 emails/day) is exhausted; passes fresh on prod — pre-existing transient
- github.spec.ts CO-012 tests fail on prod with GitHub API rate limits (7 tests); pre-existing, unrelated to current stories
- CO-001 through CO-008 in blocked-stories.json — OLD SSL blockers, all stories now passes=true, ignore

## Key decisions this session
- VsPage uses React.ReactNode for body content to allow internal Links within the long-form text (TypeScript-safe, avoids dangerouslySetInnerHTML)
- Comparison table uses `overflow-x-auto` wrapper for mobile — table content scrolls internally, no page-level overflow
- Title tests must use `expect(page).toHaveTitle(/pattern/i)` not `page.title()` — the latter snapshots before useEffect fires
