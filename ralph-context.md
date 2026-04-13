## Last completed
CO-025 - Terms of Service page (/terms, footer link, sitemap)

## Next up
CO-026 - Cross-promotion footer — link all Keylight Digital products
- Add "Also from Keylight Digital" section in footer: Beam (beam-privacy.com), Nexus (nexus.keylightdigital.dev), ProfitTracker (profittracker.io)
- Links open in new tab (target=_blank rel=noopener)
- Visually consistent with existing footer style (currently: flex row, text-sm text-gray-500)
- Footer is in src/App.tsx — modify the existing `<footer>` element

## Active issues
- CDN cold-start flakiness on prod is pre-existing and benign — all tests pass on retry (1 retry configured in playwright)
- CO-001 through CO-008 in blocked-stories.json — these are OLD SSL blockers that were resolved; stories are now passes=true, ignore the blocked entries

## Key decisions this session
- Used PrivacyPage.tsx as the template for TermsPage — same gradient header, 3-card highlights, amber disclaimer pattern
- `getByText(/phrase/i).first()` needed when the phrase appears in both a heading and paragraph body
