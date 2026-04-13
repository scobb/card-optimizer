## Last completed
CO-014 - Add Beam analytics (128/128 prod smoke tests pass)

## Next up
CO-015 - Individual card detail pages for SEO — /cards/:slug routes with unique meta tags, full card detail, sitemap update, 'Add to Wallet' button, back link to /catalog.

## Active issues
- None

## Key decisions this session
- Beam site created via direct D1 insert (beam-analytics@keylightdigital.dev Pro account, beam-db prod database)
- Beam site ID for cards.keylightdigital.dev: 5587e834-9274-4f00-8c92-14d33018d847
- SPA nav tracking: BeamPageview component fires pageview payload (no `type` field) on each route change via useLocation; skips first render since beam.js script handles initial load
- BeamPageview must be first child inside <BrowserRouter> (before layout divs) to have router context
