import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle, Scale } from 'lucide-react'
import { getCardById, effectiveRate } from '../lib/cards'
import { CATEGORY_LABELS } from '../types'
import type { Card, RewardCategory } from '../types'

/** The 15 popular card comparison pairs (cardA-id, cardB-id) */
export const COMPARISON_PAIRS: [string, string][] = [
  ['chase-sapphire-preferred', 'amex-gold'],
  ['chase-sapphire-preferred', 'chase-sapphire-reserve'],
  ['chase-sapphire-preferred', 'capital-one-venture-x'],
  ['amex-gold', 'amex-platinum'],
  ['chase-freedom-unlimited', 'citi-double-cash'],
  ['amex-blue-cash-preferred', 'amex-blue-cash-everyday'],
  ['chase-sapphire-reserve', 'amex-platinum'],
  ['capital-one-venture', 'capital-one-venture-x'],
  ['citi-double-cash', 'wells-fargo-active-cash'],
  ['chase-freedom-flex', 'citi-custom-cash'],
  ['chase-sapphire-preferred', 'capital-one-venture'],
  ['amex-gold', 'capital-one-savor-one'],
  ['chase-ink-cash', 'chase-freedom-unlimited'],
  ['discover-it-cash-back', 'citi-double-cash'],
  ['bank-of-america-customized-cash', 'citi-custom-cash'],
]

export function comparisonSlug(a: string, b: string): string {
  return `${a}-vs-${b}`
}

export function comparisonUrl(a: string, b: string): string {
  return `/compare/${comparisonSlug(a, b)}`
}

/** Returns all comparison pages involving a given card ID */
export function getComparisonsForCard(cardId: string): Array<{ url: string; other: Card }> {
  const result: Array<{ url: string; other: Card }> = []
  for (const [a, b] of COMPARISON_PAIRS) {
    if (a === cardId) {
      const other = getCardById(b)
      if (other) result.push({ url: comparisonUrl(a, b), other })
    } else if (b === cardId) {
      const other = getCardById(a)
      if (other) result.push({ url: comparisonUrl(a, b), other })
    }
  }
  return result
}

function fmt(v: number): string {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtRate(r: number): string {
  return r.toFixed(2).replace(/\.?0+$/, '') + '%'
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as RewardCategory[]

export function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()

  // Parse slug: "cardA-id-vs-cardB-id" → split on first "-vs-"
  const dashVsIdx = slug ? slug.indexOf('-vs-') : -1
  const cardAId = dashVsIdx >= 0 ? slug!.slice(0, dashVsIdx) : ''
  const cardBId = dashVsIdx >= 0 ? slug!.slice(dashVsIdx + 4) : ''

  const cardA = getCardById(cardAId)
  const cardB = getCardById(cardBId)

  const pageTitle = cardA && cardB
    ? `${cardA.name} vs ${cardB.name} — 2026 Comparison | Card Optimizer`
    : 'Card Comparison | Card Optimizer'

  useEffect(() => {
    if (cardA && cardB) {
      document.title = pageTitle
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        const desc = `${cardA.name} vs ${cardB.name}: side-by-side comparison of reward rates, annual fees, sign-up bonuses, and perks. Find out which card is better for your spending.`
        metaDesc.setAttribute('content', desc.slice(0, 160))
      }
      // Inject JSON-LD structured data
      const existing = document.getElementById('comparison-jsonld')
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = 'comparison-jsonld'
      script.type = 'application/ld+json'
      const jsonld = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${cardA.name} vs ${cardB.name} — 2026 Comparison`,
        description: `Side-by-side comparison of ${cardA.name} and ${cardB.name} reward rates, fees, and perks.`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Product',
              name: cardA.name,
              description: `${cardA.name} by ${cardA.issuer}. Annual fee: ${cardA.annualFee === 0 ? 'none' : fmt(cardA.annualFee)}. Base reward rate: ${fmtRate(cardA.baseRate * cardA.pointValue)}.`,
              brand: { '@type': 'Brand', name: cardA.issuer },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Product',
              name: cardB.name,
              description: `${cardB.name} by ${cardB.issuer}. Annual fee: ${cardB.annualFee === 0 ? 'none' : fmt(cardB.annualFee)}. Base reward rate: ${fmtRate(cardB.baseRate * cardB.pointValue)}.`,
              brand: { '@type': 'Brand', name: cardB.issuer },
            },
          },
        ],
      }
      script.textContent = JSON.stringify(jsonld)
      document.head.appendChild(script)
    } else {
      document.title = 'Card Comparison Not Found | Card Optimizer'
    }
    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', 'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.')
      const jsonld = document.getElementById('comparison-jsonld')
      if (jsonld) jsonld.remove()
    }
  }, [cardA, cardB, pageTitle])

  if (!cardA || !cardB) {
    return (
      <div className="text-center py-16">
        <Scale size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Comparison not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          We couldn't find one or both cards in that comparison link.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={16} />
          Browse Card Catalog
        </Link>
      </div>
    )
  }

  // Compute verdict: which categories each card wins
  const categoryResults = ALL_CATEGORIES.map((cat) => {
    const rateA = effectiveRate(cardA, cat)
    const rateB = effectiveRate(cardB, cat)
    const winner: 'A' | 'B' | 'tie' = rateA > rateB ? 'A' : rateB > rateA ? 'B' : 'tie'
    return { cat, rateA, rateB, winner }
  })

  // Only show categories where at least one card has a boosted rate vs base
  const relevantCategories = categoryResults.filter(({ cat }) => {
    const baseA = cardA.baseRate * cardA.pointValue
    const baseB = cardB.baseRate * cardB.pointValue
    const rateA = effectiveRate(cardA, cat)
    const rateB = effectiveRate(cardB, cat)
    return rateA > baseA || rateB > baseB
  })

  // Always show all cats in the table if no category has boost (flat-rate card comparison)
  const tableCategories = relevantCategories.length > 0 ? relevantCategories : categoryResults

  const aWins = categoryResults.filter((r) => r.winner === 'A').length
  const bWins = categoryResults.filter((r) => r.winner === 'B').length
  const overallWinner = aWins > bWins ? cardA : bWins > aWins ? cardB : null

  // Other comparisons for each card
  const otherComparisonsA = getComparisonsForCard(cardA.id).filter((c) => !c.url.includes(cardB.id))
  const otherComparisonsB = getComparisonsForCard(cardB.id).filter((c) => !c.url.includes(cardA.id))

  return (
    <div className="space-y-6" data-comparison-page={slug}>
      {/* Back link */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        data-back-to-catalog
      >
        <ArrowLeft size={14} />
        Back to Card Catalog
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Side-by-Side Comparison</p>
        <h1 className="text-2xl font-bold mt-1" data-comparison-title>
          {cardA.name} vs {cardB.name}
        </h1>
        <p className="text-blue-100 text-sm mt-2">2026 head-to-head comparison — reward rates, fees, and perks.</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <a
            href={cardA.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
            data-apply-card-a
          >
            Apply for {cardA.name} <ExternalLink size={13} />
          </a>
          <a
            href={cardB.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
            data-apply-card-b
          >
            Apply for {cardB.name} <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Quick stats comparison */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4" data-quick-stats>
        <div className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide py-2" />
        <div className="text-center py-2">
          <p className="font-bold text-gray-900 text-sm leading-tight" data-card-a-name>{cardA.name}</p>
          <p className="text-xs text-gray-500">{cardA.issuer}</p>
        </div>
        <div className="text-center py-2">
          <p className="font-bold text-gray-900 text-sm leading-tight" data-card-b-name>{cardB.name}</p>
          <p className="text-xs text-gray-500">{cardB.issuer}</p>
        </div>

        {/* Annual Fee */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-500 font-medium flex items-center">Annual Fee</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900" data-annual-fee-a>
          {cardA.annualFee === 0 ? 'None' : fmt(cardA.annualFee)}
          {cardA.firstYearFeeWaived && <span className="block text-xs text-green-600 font-normal">1st yr free</span>}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900" data-annual-fee-b>
          {cardB.annualFee === 0 ? 'None' : fmt(cardB.annualFee)}
          {cardB.firstYearFeeWaived && <span className="block text-xs text-green-600 font-normal">1st yr free</span>}
        </div>

        {/* Base Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-500 font-medium flex items-center">Base Rate</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900">
          {fmtRate(cardA.baseRate * cardA.pointValue)}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900">
          {fmtRate(cardB.baseRate * cardB.pointValue)}
        </div>

        {/* Sign-up Bonus */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-500 font-medium flex items-center">Sign-Up Bonus</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900" data-signup-a>
          {cardA.signUpBonus ? fmt(cardA.signUpBonus.amount) : '—'}
          {cardA.signUpBonus && (
            <span className="block text-xs text-gray-400 font-normal">
              spend {fmt(cardA.signUpBonus.spendRequired)} / {cardA.signUpBonus.timeMonths}mo
            </span>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-bold text-gray-900" data-signup-b>
          {cardB.signUpBonus ? fmt(cardB.signUpBonus.amount) : '—'}
          {cardB.signUpBonus && (
            <span className="block text-xs text-gray-400 font-normal">
              spend {fmt(cardB.signUpBonus.spendRequired)} / {cardB.signUpBonus.timeMonths}mo
            </span>
          )}
        </div>

        {/* Reward Type */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-500 font-medium flex items-center">Reward Type</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-medium text-gray-900 capitalize text-sm">
          {cardA.rewardType === 'cashback' ? 'Cash Back' : 'Points'}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center font-medium text-gray-900 capitalize text-sm">
          {cardB.rewardType === 'cashback' ? 'Cash Back' : 'Points'}
        </div>
      </div>

      {/* Category rates comparison */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-rates-table>
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Reward Rates by Category</h2>
          <p className="text-xs text-gray-500 mt-0.5">Winner highlighted in blue</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide max-w-[100px]">
                  {cardA.name.split(' ').slice(0, 3).join(' ')}
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide max-w-[100px]">
                  {cardB.name.split(' ').slice(0, 3).join(' ')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableCategories.map(({ cat, rateA, rateB, winner }) => (
                <tr key={cat} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-gray-600">{CATEGORY_LABELS[cat]}</td>
                  <td className={`px-4 py-3 text-center font-semibold ${winner === 'A' ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}>
                    {fmtRate(rateA)}
                    {winner === 'A' && <CheckCircle size={12} className="inline ml-1 text-blue-600" />}
                  </td>
                  <td className={`px-4 py-3 text-center font-semibold ${winner === 'B' ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}>
                    {fmtRate(rateB)}
                    {winner === 'B' && <CheckCircle size={12} className="inline ml-1 text-blue-600" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Perks comparison */}
      {(cardA.perks.length > 0 || cardB.perks.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-perks-section>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 text-sm">{cardA.name} Perks</h2>
            {cardA.perks.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No notable perks</p>
            ) : (
              <ul className="space-y-2">
                {cardA.perks.map((perk) => (
                  <li key={perk.name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{perk.name}</span>
                    <span className="font-semibold text-green-600 flex-shrink-0 ml-2">+{fmt(perk.annualValue)}/yr</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 text-sm">{cardB.name} Perks</h2>
            {cardB.perks.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No notable perks</p>
            ) : (
              <ul className="space-y-2">
                {cardB.perks.map((perk) => (
                  <li key={perk.name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{perk.name}</span>
                    <span className="font-semibold text-green-600 flex-shrink-0 ml-2">+{fmt(perk.annualValue)}/yr</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Verdict */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4" data-verdict>
        <h2 className="font-semibold text-gray-900">The Verdict</h2>
        {overallWinner ? (
          <p className="text-sm text-gray-700">
            Based on category reward rates alone, <strong>{overallWinner.name}</strong> wins more categories
            ({overallWinner === cardA ? aWins : bWins} vs {overallWinner === cardA ? bWins : aWins}).
            But the best card depends on where you spend most.
          </p>
        ) : (
          <p className="text-sm text-gray-700">
            These two cards are evenly matched across categories. The right choice depends on your spending mix and whether perks justify the annual fee.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Choose {cardA.name} if you…
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              {categoryResults.filter((r) => r.winner === 'A').slice(0, 3).map(({ cat }) => (
                <li key={cat} className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  Spend heavily on {CATEGORY_LABELS[cat].toLowerCase()}
                </li>
              ))}
              {cardA.annualFee < cardB.annualFee && (
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  Prefer a lower annual fee
                </li>
              )}
              {cardA.annualFee === 0 && cardB.annualFee > 0 && (
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  Want no annual fee
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">
              Choose {cardB.name} if you…
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              {categoryResults.filter((r) => r.winner === 'B').slice(0, 3).map(({ cat }) => (
                <li key={cat} className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  Spend heavily on {CATEGORY_LABELS[cat].toLowerCase()}
                </li>
              ))}
              {cardB.annualFee < cardA.annualFee && (
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  Prefer a lower annual fee
                </li>
              )}
              {cardB.annualFee === 0 && cardA.annualFee > 0 && (
                <li className="flex items-start gap-1.5">
                  <CheckCircle size={13} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  Want no annual fee
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Card detail links */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/cards/${cardA.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
          data-detail-link-a
        >
          Full {cardA.name} Review →
        </Link>
        <Link
          to={`/cards/${cardB.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
          data-detail-link-b
        >
          Full {cardB.name} Review →
        </Link>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">Which is better for YOU?</p>
          <p className="text-sm text-gray-600 mt-0.5">
            Upload your transactions to see exactly which card earns more based on your real spending.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] flex-shrink-0 whitespace-nowrap"
          data-cta-upload
        >
          Try With My Spending
        </Link>
      </div>

      {/* Related comparisons */}
      {(otherComparisonsA.length > 0 || otherComparisonsB.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3" data-related-comparisons>
          <h2 className="font-semibold text-gray-900 text-sm">More Comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {otherComparisonsA.slice(0, 3).map(({ url, other }) => (
              <Link
                key={url}
                to={url}
                className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
              >
                {cardA.name.split(' ').slice(0, 2).join(' ')} vs {other.name.split(' ').slice(0, 2).join(' ')}
              </Link>
            ))}
            {otherComparisonsB.slice(0, 3).map(({ url, other }) => (
              <Link
                key={url}
                to={url}
                className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
              >
                {cardB.name.split(' ').slice(0, 2).join(' ')} vs {other.name.split(' ').slice(0, 2).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        Rates reflect effective cash-back percentage including point valuations.
        Estimates are for informational purposes only — not financial advice.
      </p>
    </div>
  )
}
