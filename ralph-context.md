## Last completed
CO-004 — Card recommendations. Implemented, staging 34/34 pass. BLOCKED on prod SSL.

## Next up
CO-005 (priority 5): Wallet builder — optimal N-card combination finder.
CO-001, CO-002, CO-003, CO-004 all blocked on prod SSL (cards.keylightdigital.com HTTP 526).

## Active issues
- ALL prod deploys blocked: cards.keylightdigital.com returns HTTP 526 (SSL error)
- Steve notified ONCE via CO-003 email — do NOT send more emails for same SSL issue
- 4 stories now in blocked-stories.json for SSL
- Next unblocked story to implement: CO-005

## Key decisions this session
- Recommendation engine: incremental value = sum((new_rate - current_best_rate) * spend) per category where new card wins
- Sign-up bonus amortized over 2 years added to net value
- Only positive net annual value recommendations shown
- nav + main both have 'Wallet' link → use page.locator('main') to scope
- For table headers, use locator('th', { hasText }) not getByText()
