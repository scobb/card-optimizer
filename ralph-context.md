## Last completed
CO-030 - Spending presets — one-click spending profiles without CSV upload

## Next up
CO-031 - Annual savings calculator — show dollar impact of optimal wallet

## Active issues
- email.spec.ts "POST /api/email-results sends email and returns 200" fails on staging/prod with HTTP 429 when rate limit (3 emails/day) is exhausted; pre-existing transient
- github.spec.ts CO-012 tests fail on prod with GitHub API rate limits (7 tests); pre-existing
- CO-001 through CO-008 in blocked-stories.json — OLD SSL blockers, all stories now passes=true, ignore

## Key decisions this session
- Spending presets store to localStorage with format='generic' and formatLabel='[Preset Name] spending profile'
- SpendingPresets component is in UploadPage.tsx alongside the SPENDING_PRESETS export constant (importable for future use in landing page CO-035)
- "Optimize My Wallet →" CTA is a React Link (not a navigate button) — tests must scope to `nav` when clicking the plain 'Wallet' nav link to avoid strict mode violation
- 4 preset IDs: 'average-american', 'frequent-traveler', 'online-shopper', 'foodie'
