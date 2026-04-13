import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const BEAM_ENDPOINT = 'https://beam-privacy.com/api/collect'
const BEAM_SITE_ID = '5587e834-9274-4f00-8c92-14d33018d847'

// Fires a pageview to Beam on each SPA route change.
// The initial pageview on page load is handled by the <script defer> tag in index.html.
// This component handles subsequent navigations within the React SPA.
export function BeamPageview() {
  const location = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    // Skip the first render — the beam.js script already tracked the initial load
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (navigator.doNotTrack === '1') return

    const payload = {
      site_id: BEAM_SITE_ID,
      path: location.pathname,
      referrer: document.referrer,
      screen_width: screen.width,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(BEAM_ENDPOINT, new Blob([body], { type: 'application/json' }))
    } else {
      fetch(BEAM_ENDPOINT, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      })
    }
  }, [location.pathname])

  return null
}
