## Last completed
CO-032 - LocalStorage wallet persistence — save and restore analysis

## Next up
CO-033 - Expand card database to 50+ cards

## Active issues
- email.spec.ts "POST /api/email-results sends email and returns 200" fails on staging/prod with HTTP 429 when rate limit (3 emails/day) is exhausted; pre-existing transient
- github.spec.ts CO-012 tests fail on prod with GitHub API rate limits (7 tests); pre-existing

## Key decisions this session
- hasAnalysis() validates JSON shape (checks .breakdown is array) — not just key existence
- ClearDataButton uses window.location.assign('/upload') for full page reload (React Router navigate to same route doesn't remount components)
- Welcome back banner is above all other upload page content; shown only when BOTH spending + valid wallet cards exist
- "Start fresh" clears both co_spending_data and co_wallet_cards keys
- Existing keys (co_spending_data, co_wallet_cards) are kept — renaming would silently break existing users
- SPENDING_PRESETS export from UploadPage.tsx is available for CO-035 (landing page preview)
