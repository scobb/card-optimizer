## Last completed
CO-003 - Wallet Optimization — implemented and deployed to staging (all 24 smoke tests pass). BLOCKED on prod (HTTP 526 SSL error on cards.keylightdigital.com). Steve notified via email.

## Next up
Once Steve fixes the prod SSL issue:
1. Remove CO-003 from blocked-stories.json
2. Run `bash deploy.sh prod` (code is already built and staged)
3. Run ALL smoke tests against prod: `BASE_URL=https://cards.keylightdigital.com npx playwright test`
4. If prod passes, mark CO-003 `passes: true` in prd.json

After CO-003 is resolved, next story is CO-001 (also marked resolved in blocked-stories.json — token is fixed, but CO-001 code was never verified on prod). Then CO-002.

## Active issues
- CO-003: prod domain cards.keylightdigital.com returns HTTP 526 (Cloudflare SSL error). Staging works fine.
- CO-001 and CO-002: marked `resolved: true` in blocked-stories.json (token fixed) but never verified on prod. Technically still `passes: false` in prd.json.
- Capital One CSV detection bug: FIXED in this iteration — Capital One format must come before Chase in FORMAT_SIGNATURES

## Key decisions this session
- Static card data bundled from seed/cards.json in src/lib/cards.ts — no API needed for client-side wallet features
- Wallet localStorage key: `co_wallet_cards` (array of card IDs)
- Optimization formula: `effectiveRate = (categoryMultiplier || baseRate) * pointValue` for both cashback and points cards
- Did NOT attempt to "fix" the prod SSL issue — per CLAUDE.md, prod failures require Steve to fix the environment
- NOTIFICATION_EMAIL from ralph-bootstrap/.env (steve@keylightdigital.dev) since no .env in project root
