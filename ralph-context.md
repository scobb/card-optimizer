## Last completed
CO-023 - Email results via Resend API (262/269 prod tests pass; 7 CO-012 pre-existing)

## Next up
CO-024 - Social launch kit — draft HN post, tweets, Reddit posts
- Output: docs/launch-kit.md in the card-optimizer worktree
- Need: Show HN post, 5 tweet drafts, 3 Reddit drafts (r/personalfinance, r/creditcards, r/churning), Product Hunt listing draft
- All drafts link to cards.keylightdigital.dev
- No deployment needed (docs only) — but still run quality checks + commit
- No smoke tests needed (no deployable code changes)
- After completing CO-024, check if ALL stories pass → output COMPLETE

## Active issues
- CO-012 GitHub API smoke tests flaky (rate limiting). Pre-existing, transient.
- CDN warmup: 1-4 flaky tests on first prod run — normal, pass on retry.

## Key decisions this session
- Resend verified domain: keylightdigital.dev (NOT .com) — always use @keylightdigital.dev as sender
- D1 UPSERT: INSERT ... ON CONFLICT ... DO UPDATE SET works (SQLite syntax)
- Email rate limit test uses timestamp-based unique email to avoid cross-run interference
- Pages secrets: `wrangler pages secret put KEY --project-name card-optimizer` (prod) + `--env preview` (staging)
