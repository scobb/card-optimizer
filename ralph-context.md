## Last completed
ALL 8 stories — CO-001 through CO-008. All pass on prod (76/76 smoke tests at https://cards.keylightdigital.dev).

## SSL fix (resolved)
- keylightdigital.com is NOT in the Cloudflare account (different account, inaccessible)
- Fixed by using keylightdigital.dev instead (IS in account)
- Added CNAME: cards.keylightdigital.dev → card-optimizer.pages.dev
- Updated deploy.sh DEPLOY_URL to https://cards.keylightdigital.dev

## Active issues
- None — all stories passes=true, all 76 smoke tests green on prod

## Key decisions this session
- prod domain changed from cards.keylightdigital.com → cards.keylightdigital.dev
- Use keylightdigital.dev for all future projects (accessible via the API token)
- Share state restoration must be synchronous in main.tsx IIFE (not useEffect)
- Hash navigation (/wallet → /wallet#share=...) doesn't reload page — navigate away first in tests
