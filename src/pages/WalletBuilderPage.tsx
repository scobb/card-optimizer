import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Zap, CreditCard, Clock } from 'lucide-react'
import { loadSpendingData } from '../lib/storage'
import { findOptimalWallet } from '../lib/walletBuilder'

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function WalletBuilderPage() {
  const [maxCards, setMaxCards] = useState<2 | 3 | 4>(3)
  const spendingData = loadSpendingData()

  const result = useMemo(() => {
    if (!spendingData) return null
    return findOptimalWallet(spendingData.breakdown, maxCards)
  }, [spendingData, maxCards])

  if (!spendingData) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Optimal Wallet</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="text-amber-800 font-medium">No spending data uploaded yet.</p>
          <p className="text-amber-700 mt-1">
            <Link to="/upload" className="underline font-medium">
              Upload your transaction CSV
            </Link>{' '}
            to find your optimal card combination.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Optimal Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">
          Find the best combination of cards from the full catalog for your spending pattern.
        </p>
      </div>

      {/* Max cards selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How many cards in your wallet?
        </label>
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((n) => (
            <button
              key={n}
              onClick={() => setMaxCards(n)}
              data-max-cards={n}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors min-h-[44px] ${
                maxCards === n
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {n} cards
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Annual Rewards</div>
              <div className="text-xl font-bold text-green-600">{fmt(result.totalAnnualRewards)}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Annual Fees</div>
              <div className="text-xl font-bold text-red-500">{fmt(result.totalAnnualFees)}</div>
            </div>
            <div
              className={`border rounded-lg p-4 text-center ${
                result.netAnnualValue >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Value</div>
              <div
                className={`text-xl font-bold ${
                  result.netAnnualValue >= 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {result.netAnnualValue >= 0 ? '+' : ''}{fmt(result.netAnnualValue)}
              </div>
            </div>
          </div>

          {/* Compute time badge */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            Computed in {result.computeTimeMs.toFixed(0)}ms across all card combinations
          </div>

          {/* Card roles */}
          <div className="space-y-3">
            {result.cardRoles.map((role, idx) => (
              <div
                key={role.card.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
                data-card-role={role.card.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{role.card.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {role.card.issuer} ·{' '}
                        {role.card.annualFee === 0 ? 'No annual fee' : `$${role.card.annualFee}/yr`}
                      </div>
                      {role.categories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.categories.map((c) => (
                            <span
                              key={c.category}
                              className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5"
                            >
                              {c.label} {c.rate.toFixed(1)}%
                            </span>
                          ))}
                        </div>
                      )}
                      {role.categories.length === 0 && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          Base rate card (catches uncovered categories)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-green-600">{fmt(role.annualRewards)}</div>
                    <div className="text-xs text-gray-400">rewards/yr</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Apply links */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Apply for these cards:</p>
            <div className="flex flex-wrap gap-3">
              {result.cards.map((card) => (
                <a
                  key={card.id}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium min-h-[44px]"
                  data-builder-apply={card.id}
                >
                  <CreditCard size={14} />
                  {card.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Zap size={16} />
          Select a card count above to compute the optimal wallet.
        </div>
      )}
    </div>
  )
}
