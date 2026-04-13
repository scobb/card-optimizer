import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { decodeShareHash } from './lib/shareState'
import { saveSpendingData, saveWalletCards } from './lib/storage'
import type { SpendingBreakdown, RewardCategory } from './types'

// Restore share state synchronously before React mounts so components
// read the correct localStorage values on their initial render.
;(function restoreShareOnLoad() {
  const hash = window.location.hash
  if (!hash.startsWith('#share=')) return
  const payload = decodeShareHash(hash)
  if (!payload) return

  const breakdown: SpendingBreakdown[] = payload.spending.map((s) => ({
    category: s.cat as RewardCategory,
    monthlyAvg: s.total / 12,
    annualTotal: s.total,
    transactionCount: 0,
  }))
  const annualTotal = breakdown.reduce((sum, b) => sum + b.annualTotal, 0)
  saveSpendingData({
    breakdown,
    format: 'generic',
    formatLabel: 'Shared link',
    uploadedAt: new Date().toISOString(),
    transactionCount: annualTotal > 0 ? 1 : 0,
  })
  saveWalletCards(payload.wallet)
  history.replaceState(null, '', window.location.pathname + window.location.search)
})()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
