## Last completed
CO-008 — Share link with encoded state. Staging 76/76 pass. Blocked on prod SSL (HTTP 526).

## Next up
All 8 stories implemented. All blocked on prod SSL — cards.keylightdigital.com returns HTTP 526.
Steve notified via CO-003 email. Once Steve fixes the custom domain SSL in Cloudflare Pages, all stories need to be re-verified against prod.

## Active issues
- ALL prod deploys blocked: cards.keylightdigital.com returns HTTP 526 (SSL error)
- Steve notified ONCE via CO-003 email — do NOT send more emails for same SSL issue
- All 8 stories now in blocked-stories.json with emailSent: true
- Staging fully working: 76/76 smoke tests pass

## Key decisions this session
- Capital One CSV detection MUST come before Chase in FORMAT_SIGNATURES
- Playwright smoke tests: navigate to a DIFFERENT path before navigating to hash-based URL (hash-only nav doesn't reload page)
- Share state restoration must be synchronous in main.tsx IIFE (not useEffect) — React components read localStorage during initial render
- All mobile smoke tests pass at 375px, all tap targets ≥ 44px confirmed
- Headings per page: /upload="Upload Transactions", /wallet="My Wallet", /recommendations="Recommendations", /builder="Optimal Wallet", /catalog="Card Catalog"
