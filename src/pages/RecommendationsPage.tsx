import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { loadSpendingData, loadWalletCards } from '../lib/storage'
import { getCardById, ALL_CARDS } from '../lib/cards'
import { recommendCards } from '../lib/recommender'
import type { CardRecommendation } from '../lib/recommender'
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

interface RecommendationCardProps {
  rec: CardRecommendation
  rank: number
}

function RecommendationCard({ rec, rank }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { card } = rec

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 p-4">
        {/* Rank badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
          {rank}
        </div>

        {/* Card info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{card.name}</h3>
              <p className="text-sm text-gray-500">
                {card.issuer} ·{' '}
                {card.annualFee === 0 ? 'No annual fee' : `$${card.annualFee}/yr`}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-green-600">
                +{fmt(rec.netAnnualValue)}
              </div>
              <div className="text-xs text-gray-500">net annual value</div>
            </div>
          </div>

          {/* Reason */}
          <p className="text-sm text-gray-700 mt-2 italic">"{rec.reason}"</p>

          {/* Value breakdown pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {rec.incrementalRewards > 0 && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-1">
                +{fmt(rec.incrementalRewards)} extra rewards/yr
              </span>
            )}
            {rec.bonusAmortized > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-1">
                +{fmt(rec.bonusAmortized)}/yr sign-up bonus
              </span>
            )}
            {card.annualFee > 0 && (
              <span className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-1">
                −${card.annualFee} annual fee
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between px-4 pb-3 gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 min-h-[44px]"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide' : 'Show'} category breakdown
        </button>
        <a
          href={card.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium min-h-[44px]"
          data-learn-more-link={card.id}
        >
          Learn More
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Category breakdown */}
      {expanded && rec.categoryGains.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wide">
                <th className="text-left px-4 py-2 font-medium">Category</th>
                <th className="text-right px-4 py-2 font-medium">Current</th>
                <th className="text-right px-4 py-2 font-medium">New</th>
                <th className="text-right px-4 py-2 font-medium">Extra/yr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rec.categoryGains.map((g) => (
                <tr key={g.category}>
                  <td className="px-4 py-2 text-gray-700 capitalize">
                    {g.categoryLabel}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500">
                    {fmtRate(g.currentRate)}
                  </td>
                  <td className="px-4 py-2 text-right text-green-600 font-medium">
                    {fmtRate(g.newRate)}
                  </td>
                  <td className="px-4 py-2 text-right text-green-600 font-medium">
                    +{fmt(g.incrementalRewards)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function RecommendationsPage() {
  const spendingData = loadSpendingData()
  const walletIds = loadWalletCards()
  const walletCards = useMemo(
    () => walletIds.map((id) => getCardById(id)).filter(Boolean) as typeof ALL_CARDS,
    [walletIds.join(',')],
  )

  const recommendations = useMemo(() => {
    if (!spendingData) return []
    return recommendCards(walletCards, spendingData.breakdown)
  }, [walletCards, spendingData])

  const savingsData = useMemo(() => {
    if (!spendingData || walletCards.length === 0) return null
    const optimization = optimizeWallet(walletCards, spendingData.breakdown)
    const baseline = spendingData.breakdown.reduce((sum, b) => sum + b.annualTotal * 0.01, 0)
    const totalSavings = optimization.totalAnnualRewards - baseline
    return { totalSavings, baseline }
  }, [walletCards, spendingData])

  if (!spendingData) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="text-amber-800 font-medium">No spending data uploaded yet.</p>
          <p className="text-amber-700 mt-1">
            <Link to="/upload" className="underline font-medium">
              Upload your transaction CSV
            </Link>{' '}
            to get personalized card recommendations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cards ranked by net annual value added to your{' '}
          {walletCards.length > 0
            ? `current ${walletCards.length}-card wallet`
            : 'spending profile'}
          . Sign-up bonuses amortized over 2 years.
        </p>
      </div>

      {/* CO-031: Annual Savings Banner */}
      {savingsData && (
        <div
          data-savings-banner
          className={`rounded-xl border p-5 text-center ${
            savingsData.totalSavings > 0
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {savingsData.totalSavings > 0 ? (
            <>
              <div className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
                Estimated Annual Savings
              </div>
              <div className="text-3xl font-bold text-green-700 leading-tight">
                <span data-savings-amount>{fmt(savingsData.totalSavings)}</span>
                <span className="text-lg font-normal text-green-600">/year</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                your current wallet vs. a 1% flat cashback baseline
              </div>
            </>
          ) : (
            <div className="text-gray-700 font-medium">
              Your current setup is already optimized
            </div>
          )}
        </div>
      )}

      {walletCards.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <strong>Tip:</strong> Add cards you already hold in the{' '}
          <Link to="/wallet" className="underline font-medium">
            Wallet
          </Link>{' '}
          tab to see truly incremental gains (not just raw rewards).
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          No cards found with positive net value given your current wallet and spending. Try
          removing some cards from your wallet to see more options.
        </div>
      )}

      <div className="space-y-4" data-testid="recommendations-list">
        {recommendations.map((rec, i) => (
          <RecommendationCard key={rec.card.id} rec={rec} rank={i + 1} />
        ))}
      </div>

      {recommendations.length > 0 && (
        <p className="text-xs text-gray-400 text-center pt-2" data-apply-disclosure>
          We link to card issuer websites. We are not compensated for referrals.
        </p>
      )}
    </div>
  )
}
