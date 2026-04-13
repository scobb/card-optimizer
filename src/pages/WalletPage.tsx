import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Check, ChevronDown, ChevronUp, TrendingUp, Share2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import type { Card } from '../types'
import { ALL_CARDS, getCardsByIssuer } from '../lib/cards'
import { loadSpendingData } from '../lib/storage'
import { saveWalletCards, loadWalletCards } from '../lib/storage'
import { optimizeWallet } from '../lib/optimizer'
import { encodeShareState } from '../lib/shareState'

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function fmtRate(rate: number): string {
  return rate.toFixed(2) + '%'
}

export function WalletPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const saved = loadWalletCards()
    return new Set(saved)
  })
  const [expandedIssuers, setExpandedIssuers] = useState<Set<string>>(
    () => new Set(['Chase', 'American Express', 'Capital One', 'Citi']),
  )
  const [showSavingsBreakdown, setShowSavingsBreakdown] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [monthlyDigest, setMonthlyDigest] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [emailError, setEmailError] = useState('')

  const spendingData = loadSpendingData()
  const cardsByIssuer = getCardsByIssuer()
  const issuers = Array.from(cardsByIssuer.keys()).sort()

  // Persist wallet to localStorage whenever selection changes
  useEffect(() => {
    saveWalletCards(Array.from(selectedIds))
  }, [selectedIds])

  function toggleCard(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleShare() {
    if (!spendingData) return
    const url = encodeShareState(spendingData.breakdown, Array.from(selectedIds))
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  async function handleEmailResults(e: React.FormEvent) {
    e.preventDefault()
    if (!optimization || !emailInput.trim()) return
    setEmailStatus('sending')
    setEmailError('')
    try {
      const res = await fetch('/api/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          walletCards: selectedCards.map((c) => ({
            name: c.name,
            issuer: c.issuer,
            annualFee: c.annualFee,
          })),
          categoryBreakdown: optimization.categoryBreakdown.map((c) => ({
            category: c.category,
            categoryLabel: c.categoryLabel,
            bestCardName: c.bestCard?.name ?? null,
            effectiveRate: c.effectiveRate,
            annualSpend: c.annualSpend,
            annualRewards: c.annualRewards,
          })),
          totalAnnualRewards: optimization.totalAnnualRewards,
          totalAnnualFees: optimization.totalAnnualFees,
          netAnnualValue: optimization.netAnnualValue,
          topRecommendations: [],
          monthlyDigestOptIn: monthlyDigest,
        }),
      })
      if (res.ok) {
        setEmailStatus('success')
      } else {
        const data = await res.json() as { error?: string }
        setEmailError(data.error ?? 'Failed to send email')
        setEmailStatus('error')
      }
    } catch {
      setEmailError('Network error. Please try again.')
      setEmailStatus('error')
    }
  }

  function toggleIssuer(issuer: string) {
    setExpandedIssuers((prev) => {
      const next = new Set(prev)
      if (next.has(issuer)) {
        next.delete(issuer)
      } else {
        next.add(issuer)
      }
      return next
    })
  }

  const selectedCards: Card[] = useMemo(
    () => ALL_CARDS.filter((c) => selectedIds.has(c.id)),
    [selectedIds],
  )

  const optimization = useMemo(() => {
    if (!spendingData || selectedCards.length === 0) return null
    return optimizeWallet(selectedCards, spendingData.breakdown)
  }, [selectedCards, spendingData])

  const savingsData = useMemo(() => {
    if (!optimization || !spendingData) return null
    const baseline = spendingData.breakdown.reduce((sum, b) => sum + b.annualTotal * 0.01, 0)
    const totalSavings = optimization.totalAnnualRewards - baseline
    const categorySavings = optimization.categoryBreakdown
      .filter((c) => c.annualSpend > 0)
      .map((c) => ({
        ...c,
        savings: c.annualRewards - c.annualSpend * 0.01,
      }))
      .sort((a, b) => b.savings - a.savings)
    return { totalSavings, baseline, categorySavings }
  }, [optimization, spendingData])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select the cards you hold and we'll show you the optimal card for each spending category.
        </p>
      </div>

      {/* Card picker */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <span className="font-medium text-gray-900 flex items-center gap-2">
            <CreditCard size={18} />
            Select Your Cards
          </span>
          {selectedIds.size > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedIds.size} card{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {issuers.map((issuer) => {
            const cards = cardsByIssuer.get(issuer) ?? []
            const isExpanded = expandedIssuers.has(issuer)
            const selectedCount = cards.filter((c) => selectedIds.has(c.id)).length

            return (
              <div key={issuer}>
                <button
                  onClick={() => toggleIssuer(issuer)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{issuer}</span>
                    {selectedCount > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-xs text-gray-400">{cards.length} cards</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {cards.map((card) => {
                      const isSelected = selectedIds.has(card.id)
                      return (
                        <button
                          key={card.id}
                          onClick={() => toggleCard(card.id)}
                          data-card-id={card.id}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 min-h-[56px] ${
                            isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {card.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {card.annualFee === 0
                                ? 'No annual fee'
                                : `$${card.annualFee}/yr`}{' '}
                              · {card.rewardType === 'cashback' ? 'Cash back' : 'Points'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-right flex-shrink-0">
                            {card.baseRate}
                            {card.rewardType === 'cashback' ? '%' : 'x'} base
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* No spending data prompt */}
      {!spendingData && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="text-amber-800 font-medium">No spending data uploaded yet.</p>
          <p className="text-amber-700 mt-1">
            <Link to="/upload" className="underline font-medium">
              Upload your transaction CSV
            </Link>{' '}
            to see per-category optimization.
          </p>
        </div>
      )}

      {/* No cards selected */}
      {spendingData && selectedCards.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          Select one or more cards above to see per-category optimization.
        </div>
      )}

      {/* Optimization results */}
      {optimization && (
        <div className="space-y-4">
          {/* CO-031: Annual Savings Banner */}
          {savingsData && (
            <div
              data-savings-banner
              className={`rounded-xl border p-5 ${
                savingsData.totalSavings > 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {savingsData.totalSavings > 0 ? (
                <div className="text-center">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
                    Estimated Annual Savings
                  </div>
                  <div className="text-3xl font-bold text-green-700 leading-tight">
                    <span data-savings-amount>{fmt(savingsData.totalSavings)}</span>
                    <span className="text-lg font-normal text-green-600">/year</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">vs. a 1% flat cashback baseline</div>
                  <button
                    data-savings-breakdown-toggle
                    onClick={() => setShowSavingsBreakdown((v) => !v)}
                    className="mt-3 flex items-center gap-1 text-xs text-green-700 hover:text-green-800 mx-auto min-h-[44px] px-3"
                  >
                    {showSavingsBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showSavingsBreakdown ? 'Hide' : 'Show'} category breakdown
                  </button>
                  {showSavingsBreakdown && (
                    <div className="mt-2 overflow-x-auto" data-savings-breakdown>
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-green-200">
                            <th className="py-2 pr-3 font-medium">Category</th>
                            <th className="py-2 pr-3 text-right font-medium">Your Rewards</th>
                            <th className="py-2 pr-3 text-right font-medium">Baseline (1%)</th>
                            <th className="py-2 text-right font-medium">Extra/yr</th>
                          </tr>
                        </thead>
                        <tbody>
                          {savingsData.categorySavings.map((c) => (
                            <tr key={c.category} className="border-b border-green-100 last:border-0">
                              <td className="py-2 pr-3 text-gray-800">{c.categoryLabel}</td>
                              <td className="py-2 pr-3 text-right text-gray-700">{fmt(c.annualRewards)}</td>
                              <td className="py-2 pr-3 text-right text-gray-500">{fmt(c.annualSpend * 0.01)}</td>
                              <td
                                className={`py-2 text-right font-medium ${
                                  c.savings >= 0 ? 'text-green-600' : 'text-red-500'
                                }`}
                              >
                                {c.savings >= 0 ? '+' : ''}
                                {fmt(c.savings)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-700 font-medium py-2">
                  Your current setup is already optimized
                </div>
              )}
            </div>
          )}

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Annual Rewards
              </div>
              <div className="text-xl font-bold text-green-600">
                {fmt(optimization.totalAnnualRewards)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Annual Fees
              </div>
              <div className="text-xl font-bold text-red-500">
                {fmt(optimization.totalAnnualFees)}
              </div>
            </div>
            <div
              className={`border rounded-lg p-4 text-center ${
                optimization.netAnnualValue >= 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Net Value
              </div>
              <div
                className={`text-xl font-bold ${
                  optimization.netAnnualValue >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {optimization.netAnnualValue >= 0 ? '+' : ''}
                {fmt(optimization.netAnnualValue)}
              </div>
            </div>
          </div>

          {/* Per-category table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="font-medium text-gray-900">Per-Category Optimization</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-2 font-medium">Category</th>
                    <th className="text-left px-4 py-2 font-medium">Best Card</th>
                    <th className="text-right px-4 py-2 font-medium">Rate</th>
                    <th className="text-right px-4 py-2 font-medium">Annual Spend</th>
                    <th className="text-right px-4 py-2 font-medium">Rewards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {optimization.categoryBreakdown
                    .filter((c) => c.annualSpend > 0)
                    .sort((a, b) => b.annualRewards - a.annualRewards)
                    .map((row) => (
                      <tr key={row.category} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.categoryLabel}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {row.bestCard ? (
                            <span className="text-blue-700 font-medium">
                              {row.bestCard.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {fmtRate(row.effectiveRate)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {fmt(row.annualSpend)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {fmt(row.annualRewards)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium border-t-2 border-gray-200">
                    <td className="px-4 py-3 text-gray-900" colSpan={4}>
                      Total Rewards
                    </td>
                    <td className="px-4 py-3 text-right text-green-600">
                      {fmt(optimization.totalAnnualRewards)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Selected cards summary */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-900">Cards in Wallet</span>
              <button
                onClick={handleShare}
                data-share-button
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors min-h-[44px]"
              >
                <Share2 size={14} />
                {shareCopied ? 'Copied!' : 'Share'}
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {selectedCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{card.name}</div>
                    <div className="text-xs text-gray-500">
                      {card.issuer} ·{' '}
                      {card.annualFee === 0 ? 'No fee' : `$${card.annualFee}/yr`}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCard(card.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors min-h-[44px] flex items-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email my results */}
          <div
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            data-email-results-section
          >
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Mail size={18} className="text-blue-600" />
              <span className="font-medium text-gray-900">Email My Results</span>
            </div>
            <div className="p-4">
              {emailStatus === 'success' ? (
                <div
                  className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm"
                  data-email-success
                >
                  <CheckCircle size={16} />
                  <span>Results sent! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleEmailResults} className="space-y-3" data-email-form>
                  <p className="text-sm text-gray-600">
                    Get a formatted summary of your wallet, per-category assignments, and projected rewards
                    sent to your inbox.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                      data-email-input
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === 'sending'}
                      className="flex-shrink-0 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
                      data-email-submit
                    >
                      <Mail size={14} />
                      {emailStatus === 'sending' ? 'Sending…' : 'Send Results'}
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer" data-digest-label>
                    <input
                      type="checkbox"
                      checked={monthlyDigest}
                      onChange={(e) => setMonthlyDigest(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      data-digest-checkbox
                    />
                    Send me monthly card deals and rewards tips
                  </label>
                  {emailStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm" data-email-error>
                      <AlertCircle size={14} />
                      {emailError}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
