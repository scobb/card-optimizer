## Last completed
CO-009 - SEO foundation — meta tags, OG, robots.txt, sitemap

## Next up
CO-010 - Landing page with value proposition and how-it-works
- Currently / redirects to /upload — replace with real landing page component
- Must have hero, how-it-works, features, privacy, stats sections
- Stats section should fetch /api/cards count (live data)
- Must be mobile responsive at 375px
- CTA button visible above the fold on mobile

## Active issues
- None — 85/85 smoke tests green on prod (https://cards.keylightdigital.dev)

## Key decisions this session
- Meta description changed from 164 to 156 chars to satisfy ≤160 AC
- public/ directory created — all static assets (robots.txt, sitemap.xml, og-image.png, favicon.svg) go here; Vite copies verbatim to dist/
- OG image is a 1200x630 gradient PNG generated with ImageMagick (magick command, not convert)
- Favicon is SVG (credit card icon in #1d4ed8)
- prod domain remains https://cards.keylightdigital.dev
