# CardOptimizer Launch Kit

Ready-to-post copy for Show HN, Twitter/X, Reddit, and Product Hunt.
All links point to **https://cards.keylightdigital.dev**.

---

## Show HN Post

**Title:**
```
Show HN: CardOptimizer – upload your transactions, get ranked card recommendations
```

**Body:**
```
I built CardOptimizer to answer a question I couldn't find a straight answer to: which credit cards actually earn me the most money given how I spend?

Most "best credit card" listicles are written for generic "travelers" or "foodies." They don't know you spend $800/month on groceries and $200 on dining, or that you already have the Chase Freedom Unlimited and want to know what to add next.

CardOptimizer is different: you upload a CSV export from your bank or budgeting app (Monarch, Copilot, Chase, Amex, Capital One, generic), it categorizes your transactions client-side (no server upload — zero bytes of financial data leave your browser), and shows you:

- Which cards in a 20+ card database earn the most for your specific spending
- Per-category optimization: which card to use at restaurants, grocery stores, gas, etc.
- Wallet builder: optimal 2–4 card combination from the full catalog
- New card recommendations ranked by net annual value (rewards minus annual fee, sign-up bonus amortized over 2 years)

Tech: React + TypeScript, Cloudflare Pages + D1, client-side CSV parsing with Papa Parse. The card catalog is in a D1 database served via Pages Functions.

All transaction analysis happens in the browser. The only server calls are to fetch the card catalog (read-only) and optionally email your results to yourself.

https://cards.keylightdigital.dev

Happy to answer questions about the optimization algorithm or the privacy model.
```

---

## Tweet Drafts

### Tweet 1 — Privacy angle
```
I built a credit card rewards optimizer that never sees your financial data.

Upload your CSV → categories detected in browser → best cards ranked by YOUR spending.

No account. No server upload. No data stored.

Try it: https://cards.keylightdigital.dev
```

### Tweet 2 — Savings angle
```
Most people are leaving $300–$800/year on the table with the wrong credit cards.

CardOptimizer tells you exactly which cards to use for dining, groceries, travel, and gas — based on YOUR transaction history, not a generic "typical spender."

Free tool → https://cards.keylightdigital.dev
```

### Tweet 3 — Data-driven angle
```
"Best credit card for dining" articles are useless if you don't know your actual dining spend.

CardOptimizer does the math:
→ Upload your CSV (stays in browser)
→ See your real category breakdown
→ Get card recs ranked by net annual $ value

https://cards.keylightdigital.dev
```

### Tweet 4 — Open source / developer angle
```
Built a credit card optimizer with:
- React + TypeScript
- Cloudflare Pages + D1 (SQLite at the edge)
- Client-side CSV parsing (Papa Parse)
- Zero transaction data hits the server

20+ card catalog. Wallet optimizer. Recommendation engine. All free.

https://cards.keylightdigital.dev
```

### Tweet 5 — Wallet builder angle
```
What's the optimal 2-card, 3-card, or 4-card credit card wallet for your spending?

CardOptimizer's wallet builder tries every combination from 20+ cards and shows the highest net annual value setup for your specific spending mix.

Free, private, no account needed → https://cards.keylightdigital.dev
```

---

## Reddit Post Drafts

### r/personalfinance

**Title:**
```
I built a free tool to find the best credit cards for your actual spending (no data sent to servers)
```

**Body:**
```
I got frustrated that every "best credit card" recommendation was based on a generic spending profile that had nothing to do with mine. So I built CardOptimizer.

**What it does:**

1. You upload a CSV from your bank or budgeting app (Monarch, Copilot, Chase, Amex, Capital One)
2. It categorizes your transactions locally in your browser — dining, groceries, travel, gas, streaming, online shopping
3. It shows you which cards from a 20+ card database would earn the most for YOUR spending
4. It recommends new cards ranked by net annual value (rewards earned minus annual fee, with sign-up bonus amortized over 2 years)

**Privacy:** Everything runs in your browser. Zero bytes of transaction data are sent to our servers. Your spending summary is stored in localStorage and never uploaded. You can verify this in DevTools.

**Features:**
- Per-category optimization (which card to use where)
- Wallet optimizer for cards you already hold
- Wallet builder: optimal 2–4 card combination from the full catalog
- Card catalog with 20+ cards and full reward rate details
- Individual card detail pages, category guides, comparison pages

I've been using it myself and it helped me realize I was using the wrong card for groceries and leaving about $180/year on the table.

**Link:** https://cards.keylightdigital.dev

Happy to answer questions about the methodology or the privacy model.
```

---

### r/creditcards

**Title:**
```
Built a rewards optimizer that uses your actual transaction data (client-side only) — feedback welcome
```

**Body:**
```
Most card recommendation tools ask you to estimate your spending ("I spend about $X on dining per month"). CardOptimizer takes a different approach: upload the CSV from your bank or budgeting app and it does the math precisely.

**The optimization engine:**

- Categorizes transactions using merchant keyword matching (same merchants that Monarch/YNAB use)
- Maps every spending category to the best card in your wallet
- Recommends new cards ranked by: (annual category rewards) + (sign-up bonus ÷ 2) − annual fee
- Wallet builder finds the optimal N-card combination from the full 20+ card catalog using exhaustive search

**Cards in the database:** Chase Sapphire Preferred/Reserve, Amex Gold/Platinum/BCP/BCE, Citi Double Cash/Custom Cash, Capital One Venture/Venture X/SavorOne, Wells Fargo Active Cash, Discover It, Bank of America Customized Cash, US Bank Altitude Go, Chase Freedom Unlimited/Flex/Ink Cash, Amex Green

**Privacy:** Client-side only. CSVs are parsed in your browser with Papa Parse. Nothing is uploaded. I'm happy to walk through the source if anyone wants to verify.

**Live:** https://cards.keylightdigital.dev

Would love feedback on the categorization logic — that's the hardest part and there are definitely merchants that get miscategorized.
```

---

### r/churning

**Title:**
```
Built a wallet optimizer that ranks card combos by net annual value — not just sign-up bonuses
```

**Body:**
```
Churning-focused tools are great for tracking sign-up bonuses, but I wanted something that optimizes ongoing rewards for a stable wallet — the cards you keep after the SUB posts.

CardOptimizer lets you:

1. Upload your transaction history (CSV from bank/budgeting app, stays in browser)
2. See per-category optimization across a 20+ card catalog
3. Find the optimal 2–4 card combination for your spending mix
4. Get new card recommendations ranked by: **(category rewards earned annually + SUB ÷ 2) − annual fee**

The SUB amortization is the key difference from most tools — it prevents a card with a $500 SUB and mediocre ongoing rates from ranking above a card with strong category bonuses that compounds year after year.

**Cards covered:** All the major Chase, Amex, Citi, Capital One, and no-fee options. Not focused on business cards or niche issuer cards yet.

**Not a replacement for award travel optimization** — this is purely for cash back and points-at-portal-value calculations. If you're optimizing for Hyatt transfers or partner awards, the math is different.

**Link:** https://cards.keylightdigital.dev

Curious if the wallet builder results match what the community generally recommends for high-dining/high-grocery households.
```

---

## Product Hunt Listing Draft

**Name:** CardOptimizer

**Tagline:**
```
Find the best credit cards for YOUR spending — not a generic traveler's
```

**Description:**
```
CardOptimizer analyzes your actual transaction history to find the best credit cards for your specific spending pattern. Upload a CSV from your bank or budgeting app, and the tool instantly shows you:

✓ Which cards in a 20+ card catalog earn the most for your spending mix
✓ Per-category optimization: the best card for dining, groceries, gas, travel, streaming, and more
✓ Wallet builder: the optimal 2–4 card combination from the full catalog
✓ New card recommendations ranked by net annual value (rewards minus fees, with sign-up bonus amortized)

**100% private:** All CSV parsing and spending analysis runs in your browser. Zero transaction data is sent to our servers. Your financial data never leaves your device.

Free, no account required.
```

**First comment (from maker):**
```
Hey PH! 👋

I built CardOptimizer because I was tired of credit card recommendation lists that assumed I was a generic "frequent traveler" or "foodie." I wanted to know which cards would actually earn me the most money based on how I actually spend — with real math.

The hardest part was the categorization engine: mapping raw merchant descriptions (like "WHOLEFDS #12345" or "SQ *BLUE BOTTLE COFFE") to reward categories (groceries, dining). I built a keyword-matching system trained on common merchant patterns from Monarch and Copilot exports.

The most surprising result from my own data: I was using my Chase Freedom Unlimited for groceries (1.5%) when I should have been using my Amex Blue Cash Everyday (3%). A $180/year mistake, compounding quietly for two years.

Try it on your own data and let me know what you find → https://cards.keylightdigital.dev

Happy to answer questions about the methodology, privacy model, or tech stack.
```

**Screenshots list:**
1. Landing page — hero section with CTA
2. Upload page — CSV drag-and-drop with format detection
3. Wallet optimizer — per-category table showing best card for each category
4. Recommendations page — cards ranked by net annual value with breakdown
5. Wallet builder — optimal combination result
6. Card catalog — searchable/filterable grid of all 20+ cards

**Topics:** Personal Finance, Productivity, Open Source

**Links:**
- Website: https://cards.keylightdigital.dev
- GitHub: https://github.com/scobb/card-optimizer
