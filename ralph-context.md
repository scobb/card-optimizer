## Last completed
CO-010 - Landing page with value proposition and how-it-works

## Next up
CO-011 - Privacy policy and about page
- Add /privacy route with full privacy policy component
- Footer with links to Privacy and 'Built by Keylight Digital' on ALL pages (update App.tsx)
- Policy content: no data to servers, localStorage only, no cookies, no tracking, not financial advice
- Mobile responsive

## Active issues
- None — 95/95 smoke tests green on prod (https://cards.keylightdigital.dev)

## Key decisions this session
- Landing page lives inside existing max-w-4xl main container — no layout rework needed
- Stats count uses static ALL_CARDS.length as default, updates from /api/cards fetch
- Nav logo is now a <Link to="/"> — needs min-h-[44px] flex items-center to pass CO-007 tap target test
