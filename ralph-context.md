## Last completed
CO-022 - 'Annual Fee Credit Cards: When They Are Worth It' (251/258 prod tests pass; 7 CO-012 pre-existing)

## Next up
CO-023 - Email results — send optimized wallet via Resend API
- 'Email my results' button on wallet page
- POST /api/email-results endpoint sends formatted HTML email via Resend API
- Email includes: current wallet cards, per-category assignment, projected rewards, top 3 recommendations
- Optional opt-in checkbox for monthly card deals (stores email in D1)
- Rate limited: max 3 emails per address per day
- This is a server-side feature — needs a Cloudflare Pages Function in functions/api/email-results.ts

## Active issues
- CO-012 GitHub API smoke tests flaky due to rate limiting. Transient, pre-existing.
- CDN warmup causes 1-9 flaky tests on first run after deploy — all pass on retry. Normal.

## Key decisions this session
- Blog architecture fully established: BLOG_POSTS → BlogListingPage, POST_COMPONENTS → BlogPostPage, article → src/pages/blog/
- Each blog post needs: BLOG_POSTS entry, POST_COMPONENTS entry + title/description override, article file, sitemap entry
- CTAs in articles link to different destinations per story: /builder (CO-022), /upload (CO-020, CO-021)
- `data-break-even-table` on table wrapper, `tbody tr` counts data rows (no header inflation)
