## Last completed
CO-015 - Individual card detail pages for SEO (142/142 prod smoke tests pass)

## Next up
CO-016 - Spending category guides for SEO content — /best-cards/:category pages for dining, groceries, travel, gas, online-shopping, streaming. Content generated from card database (top 5 cards per category ranked by reward rate). Unique title/meta per page. Sitemap entries. Internal links to card detail pages (/cards/:slug). Mobile responsive.

## Active issues
- None

## Key decisions this session
- Card IDs (e.g., `chase-sapphire-preferred`) are used directly as route slugs — no mapping needed
- Pros/cons derived from card data (no separate field needed)
- effectiveRate(card, category) returns base rate for unboosted categories — filter to only show boosted categories in rate table
