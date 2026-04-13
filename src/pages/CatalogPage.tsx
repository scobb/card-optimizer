import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Search } from 'lucide-react'
import { ALL_CARDS } from '../lib/cards'
import { CATEGORY_LABELS } from '../types'
import type { RewardCategory } from '../types'

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

// Update monthly
const DATA_LAST_VERIFIED = 'April 2026'

const ALL_ISSUERS = Array.from(new Set(ALL_CARDS.map((c) => c.issuer))).sort()

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [issuerFilter, setIssuerFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ALL_CARDS.filter((card) => {
      if (issuerFilter !== 'all' && card.issuer !== issuerFilter) return false
      if (q && !card.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [search, issuerFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Card Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse all{' '}
          <span data-catalog-db-count>{ALL_CARDS.length} cards</span>
          {' '}in our database with full reward details.
        </p>
        <p className="text-xs text-gray-400 mt-1" data-catalog-freshness>
          Data sourced from card issuer websites · Last verified: {DATA_LAST_VERIFIED}
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search cards…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-catalog-search
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={issuerFilter}
          onChange={(e) => setIssuerFilter(e.target.value)}
          data-catalog-issuer-filter
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All issuers</option>
          {ALL_ISSUERS.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500" data-catalog-count>
        {filtered.length === ALL_CARDS.length
          ? `${ALL_CARDS.length} cards`
          : `${filtered.length} of ${ALL_CARDS.length} cards`}
      </p>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CreditCard size={32} className="mx-auto mb-3 opacity-40" />
          <p>No cards match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
              data-catalog-card={card.id}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/cards/${card.id}`}
                    className="font-semibold text-gray-900 text-sm hover:text-blue-700 transition-colors"
                    data-catalog-card-link={card.id}
                  >
                    {card.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {card.issuer} ·{' '}
                    {card.annualFee === 0 ? 'No annual fee' : `${fmt(card.annualFee)}/yr`}
                    {card.firstYearFeeWaived && (
                      <span className="ml-1 text-green-600">(1st yr free)</span>
                    )}
                  </p>
                </div>
                <a
                  href={card.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 min-h-[44px] px-2"
                  data-catalog-apply={card.id}
                >
                  <CreditCard size={12} />
                  Apply
                </a>
              </div>

              {/* Reward rates */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5">Reward Rates</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                    Base {card.baseRate * card.pointValue}%
                  </span>
                  {card.categoryRates.map((cr) => (
                    <span
                      key={cr.category}
                      className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5"
                    >
                      {CATEGORY_LABELS[cr.category as RewardCategory] ?? cr.category}{' '}
                      {(cr.multiplier * card.pointValue).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Sign-up bonus */}
              {card.signUpBonus && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Sign-up bonus:</span>{' '}
                  <span className="text-green-700 font-semibold">
                    {fmt(card.signUpBonus.amount)}
                  </span>{' '}
                  after spending {fmt(card.signUpBonus.spendRequired)} in{' '}
                  {card.signUpBonus.timeMonths} months
                </div>
              )}

              {/* Perks */}
              {card.perks.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Perks</p>
                  <ul className="space-y-0.5">
                    {card.perks.map((perk) => (
                      <li key={perk.name} className="text-xs text-gray-600 flex justify-between">
                        <span>{perk.name}</span>
                        <span className="text-green-600 font-medium">+{fmt(perk.annualValue)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
