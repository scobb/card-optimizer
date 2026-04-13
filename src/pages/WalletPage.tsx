import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Check, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import type { Card } from '../types'
import { ALL_CARDS, getCardsByIssuer } from '../lib/cards'
import { loadSpendingData } from '../lib/storage'
import { saveWalletCards, loadWalletCards } from '../lib/storage'
import { optimizeWallet } from '../lib/optimizer'

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
            <div className="px-4 py-3 border-b border-gray-200">
              <span className="font-medium text-gray-900">Cards in Wallet</span>
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
        </div>
      )}
    </div>
  )
}
