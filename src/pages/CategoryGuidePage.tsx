import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, TrendingUp } from 'lucide-react'
import { ALL_CARDS, effectiveRate } from '../lib/cards'
import { CATEGORY_LABELS } from '../types'
import type { RewardCategory } from '../types'

/** Supported categories and their URL slugs */
const SLUG_TO_CATEGORY: Record<string, RewardCategory> = {
  dining: 'dining',
  groceries: 'groceries',
  travel: 'travel',
  gas: 'gas',
  'online-shopping': 'online_shopping',
  streaming: 'streaming',
}

/** Human-friendly description for each category guide */
const CATEGORY_DESCRIPTIONS: Record<RewardCategory, string> = {
  dining: 'Find the best credit cards for restaurants, takeout, and food delivery. The right dining card can earn 3–5% back on every meal.',
  groceries: 'Grocery spending is one of the highest-volume categories for most households. These cards maximize your rewards at supermarkets and grocery stores.',
  travel: 'Whether you fly frequently or book the occasional hotel, these cards offer the strongest returns on airfare, hotels, and travel purchases.',
  gas: 'Gas cards can save you hundreds per year at the pump. These top picks earn 3–5% back on fuel at gas stations.',
  online_shopping: 'Online shopping is surging. These cards deliver elevated rewards on e-commerce, marketplace purchases, and digital subscriptions.',
  streaming: 'If you pay for Netflix, Spotify, Disney+, or other streaming services, these cards turn those monthly bills into meaningful rewards.',
  transit: 'Commuting and rideshares add up. These cards offer solid returns on subway, bus, Uber, Lyft, and other transit spending.',
  entertainment: 'From concerts to sporting events, these cards earn more on entertainment and recreation spending.',
  other: 'For everyday spending with no specific category boost, these flat-rate cards keep it simple.',
}

/** Default annual spend used to compute net value estimate (per category) */
const DEFAULT_ANNUAL_SPEND = 2000

const ALL_CATEGORY_SLUGS: Array<{ slug: string; label: string }> = [
  { slug: 'dining', label: 'Dining' },
  { slug: 'groceries', label: 'Groceries' },
  { slug: 'travel', label: 'Travel' },
  { slug: 'gas', label: 'Gas' },
  { slug: 'online-shopping', label: 'Online Shopping' },
  { slug: 'streaming', label: 'Streaming' },
]

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function fmtRateFull(rate: number): string {
  return rate.toFixed(2) + '%'
}

export function CategoryGuidePage() {
  const { category: categorySlug } = useParams<{ category: string }>()
  const category = SLUG_TO_CATEGORY[categorySlug ?? '']
  const categoryLabel = category ? CATEGORY_LABELS[category] : null

  useEffect(() => {
    if (categoryLabel) {
      document.title = `Best Credit Cards for ${categoryLabel} | Card Optimizer`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        const desc = `Compare the top credit cards for ${categoryLabel.toLowerCase()} spending. See reward rates, annual fees, and estimated net value — based on real card data.`
        metaDesc.setAttribute('content', desc.slice(0, 160))
      }
    } else {
      document.title = 'Category Not Found | Card Optimizer'
    }
    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.')
      }
    }
  }, [categoryLabel])

  if (!category || !categoryLabel) {
    return (
      <div className="text-center py-16">
        <TrendingUp size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Category not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          We don't have a guide for that category yet.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Card Catalog
        </Link>
      </div>
    )
  }

  // Top 5 cards ranked by effective rate in this category
  const rankedCards = [...ALL_CARDS]
    .map((card) => ({
      card,
      rate: effectiveRate(card, category),
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)

  const description = CATEGORY_DESCRIPTIONS[category] ?? `Top credit cards for ${categoryLabel.toLowerCase()} spending.`
  const otherCategories = ALL_CATEGORY_SLUGS.filter((c) => c.slug !== categorySlug)

  return (
    <div className="space-y-6" data-category-guide={categorySlug}>
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
        <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Category Guide</p>
        <h1 className="text-2xl font-bold mt-1" data-category-title>
          Best Credit Cards for {categoryLabel}
        </h1>
        <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-xl">
          {description}
        </p>
        <p className="mt-3 text-blue-200 text-xs">
          Net value estimate based on ${DEFAULT_ANNUAL_SPEND.toLocaleString()} annual {categoryLabel.toLowerCase()} spend.
        </p>
      </div>

      {/* Card list */}
      <div className="space-y-4" data-card-list>
        {rankedCards.map(({ card, rate }, index) => {
          const annualRewards = (rate / 100) * DEFAULT_ANNUAL_SPEND
          const netValue = annualRewards - card.annualFee
          return (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
              data-ranked-card={card.id}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-gray-500 truncate">{card.issuer}</span>
                  </div>
                  <Link
                    to={`/cards/${card.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                    data-card-link={card.id}
                  >
                    {card.name}
                  </Link>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <div>
                      <span className="text-xs text-gray-500">Rate</span>
                      <p className="text-lg font-bold text-blue-700" data-category-rate>
                        {fmtRateFull(rate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Annual Fee</span>
                      <p className="text-lg font-bold text-gray-900">
                        {card.annualFee === 0 ? 'None' : fmt(card.annualFee)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Est. Net Value</span>
                      <p className={`text-lg font-bold ${netValue >= 0 ? 'text-green-600' : 'text-red-500'}`} data-net-value>
                        {netValue >= 0 ? '+' : ''}{fmt(netValue)}/yr
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 sm:items-end flex-shrink-0">
                  <a
                    href={card.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px]"
                    data-apply-link={card.id}
                  >
                    Apply <ExternalLink size={13} />
                  </a>
                  <Link
                    to={`/cards/${card.id}`}
                    className="inline-flex items-center justify-center gap-1 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">See which card wins for YOUR spending</p>
          <p className="text-sm text-gray-600 mt-0.5">
            Upload your transaction history for a personalized recommendation based on real numbers.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] flex-shrink-0 whitespace-nowrap"
        >
          Optimize My Rewards
        </Link>
      </div>

      {/* Browse other categories */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3" data-other-categories>
        <h2 className="font-semibold text-gray-900 text-sm">Browse Other Category Guides</h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map(({ slug, label }) => (
            <Link
              key={slug}
              to={`/best-cards/${slug}`}
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors min-h-[44px] flex items-center"
              data-category-link={slug}
            >
              Best for {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <p className="text-xs text-gray-400 text-center">
        Rates reflect effective cash-back percentage including point valuations.
        Net value estimated at ${DEFAULT_ANNUAL_SPEND.toLocaleString()}/yr {categoryLabel.toLowerCase()} spend.
        Estimates are for informational purposes only — not financial advice.
      </p>
    </div>
  )
}
