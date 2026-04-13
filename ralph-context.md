## Last completed
CO-001 - Card catalog API — BLOCKED (not marked passes:true)

## Next up
CO-001 retry — after Steve fixes the Cloudflare API token permissions

## Active issues
- CO-001 BLOCKED: CLOUDFLARE_API_TOKEN lacks Pages:Edit permission; `wrangler pages deploy` fails with auth error 10000
- Pages project 'card-optimizer' also needs to be created (same token issue)
- Email sent to steve@keylightdigital.dev confirming the blocker
- Everything else for CO-001 is DONE (D1 DBs created, seeded, API written, build passes)

## Key decisions this session
- Use `--env preview` flag for wrangler d1 commands targeting `card-optimizer-db-staging` (it's in [env.preview] in wrangler.toml, not a top-level binding)
- Email from address: ralph@keylightdigital.dev (keylightdigital.com not verified on Resend)
- D1 prod ID: 86f6b550-adcb-4955-a48a-a103998971af
- D1 staging ID: bf05e6d6-cef0-4b0c-bb69-9a81ff641264
- When Steve resolves: remove CO-001 from blocked-stories.json and retry `bash deploy.sh staging`
