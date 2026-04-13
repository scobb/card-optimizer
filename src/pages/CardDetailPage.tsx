import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Star, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { getCardById, effectiveRate } from '../lib/cards'
import { saveWalletCards, loadWalletCards } from '../lib/storage'
import { getComparisonsForCard } from './ComparisonPage'
import { CATEGORY_LABELS } from '../types'
import type { RewardCategory } from '../types'

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function fmtRate(rate: number): string {
  return rate.toFixed(2).replace(/\.?0+$/, '') + '%'
}

/** Derive simple pros/cons from card data. */
function getProsAndCons(card: ReturnType<typeof getCardById>): { pros: string[]; cons: string[] } {
  if (!card) return { pros: [], cons: [] }
  const pros: string[] = []
  const cons: string[] = []

  if (card.annualFee === 0) pros.push('No annual fee')
  if (card.firstYearFeeWaived) pros.push('First year fee waived')
  if (card.signUpBonus && card.signUpBonus.amount >= 500) pros.push(`Strong sign-up bonus: ${fmt(card.signUpBonus.amount)}`)
  if (card.signUpBonus && card.signUpBonus.amount > 0 && card.signUpBonus.amount < 500) pros.push(`Sign-up bonus: ${fmt(card.signUpBonus.amount)}`)

  const highCatRates = card.categoryRates.filter((cr) => cr.multiplier * card.pointValue >= 3)
  for (const cr of highCatRates.slice(0, 3)) {
    const label = CATEGORY_LABELS[cr.category as RewardCategory] ?? cr.category
    pros.push(`${fmtRate(cr.multiplier * card.pointValue)} back on ${label.toLowerCase()}`)
  }

  const topPerks = card.perks.filter((p) => p.annualValue >= 100)
  for (const perk of topPerks.slice(0, 2)) {
    pros.push(`${perk.name} (${fmt(perk.annualValue)}/yr value)`)
  }

  if (card.rewardType === 'cashback') pros.push('Simple cashback — no points to manage')
  if (card.rewardType === 'points' && card.pointValue >= 1.5) pros.push('Points worth up to ' + fmtRate(card.pointValue) + ' each')

  if (card.annualFee >= 500) cons.push(`High annual fee: ${fmt(card.annualFee)}/yr`)
  else if (card.annualFee >= 95) cons.push(`Annual fee: ${fmt(card.annualFee)}/yr`)

  if (card.signUpBonus && card.signUpBonus.spendRequired >= 4000) {
    cons.push(`Spend ${fmt(card.signUpBonus.spendRequired)} in ${card.signUpBonus.timeMonths} months to earn sign-up bonus`)
  }

  if (card.baseRate * card.pointValue < 1.5 && card.categoryRates.length === 0) {
    cons.push('Low base reward rate on everyday purchases')
  }

  return { pros: pros.slice(0, 5), cons: cons.slice(0, 3) }
}

export function CardDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const card = getCardById(slug ?? '')

  useEffect(() => {
    if (card) {
      document.title = `${card.name} — Rewards & Benefits | Card Optimizer`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        const desc = `${card.name} review: ${fmtRate(card.baseRate * card.pointValue)} base rewards, ${card.annualFee === 0 ? 'no annual fee' : fmt(card.annualFee) + '/yr fee'}${card.signUpBonus ? `, ${fmt(card.signUpBonus.amount)} sign-up bonus` : ''}. Full breakdown of reward rates, perks, and whether it belongs in your wallet.`
        metaDesc.setAttribute('content', desc.slice(0, 160))
      }
    } else {
      document.title = 'Card Not Found | Card Optimizer'
    }
    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', 'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.')
    }
  }, [card])

  function handleAddToWallet() {
    if (!card) return
    const current = loadWalletCards()
    if (!current.includes(card.id)) {
      saveWalletCards([...current, card.id])
    }
    navigate('/wallet')
  }

  if (!card) {
    return (
      <div className="text-center py-16">
        <CreditCard size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Card not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          We couldn't find a card with that URL. It may have been removed or the link may be incorrect.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          data-back-to-catalog
        >
          <ArrowLeft size={16} />
          Back to Card Catalog
        </Link>
      </div>
    )
  }

  const { pros, cons } = getProsAndCons(card)
  const allCategories = Object.keys(CATEGORY_LABELS) as RewardCategory[]

  return (
    <div className="space-y-6" data-card-detail={card.id}>
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium">{card.issuer}</p>
            <h1 className="text-2xl font-bold mt-1" data-card-name>{card.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
              <span className="bg-white/20 rounded-full px-3 py-1">
                {card.annualFee === 0 ? 'No annual fee' : `${fmt(card.annualFee)}/yr`}
                {card.firstYearFeeWaived && ' (1st yr free)'}
              </span>
              <span className="bg-white/20 rounded-full px-3 py-1 capitalize">
                {card.rewardType === 'cashback' ? 'Cash Back' : 'Points'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <button
              onClick={handleAddToWallet}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
              data-add-to-wallet
            >
              <Star size={14} />
              Add to Wallet
            </button>
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-800/60 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-800/80 transition-colors min-h-[44px]"
              data-apply-link
            >
              <ExternalLink size={14} />
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {/* Sign-up bonus */}
      {card.signUpBonus && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800 mb-1">Sign-Up Bonus</p>
          <p className="text-2xl font-bold text-green-700">{fmt(card.signUpBonus.amount)}</p>
          <p className="text-sm text-green-600 mt-1">
            After spending {fmt(card.signUpBonus.spendRequired)} in {card.signUpBonus.timeMonths} months
          </p>
        </div>
      )}

      {/* Reward rates */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Reward Rates</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Base rate (everything else)</span>
            <span className="font-semibold text-gray-900">{fmtRate(card.baseRate * card.pointValue)}</span>
          </div>
          {allCategories
            .map((cat) => {
              const rate = effectiveRate(card, cat)
              const base = card.baseRate * card.pointValue
              const isBoosted = rate > base
              const catRate = card.categoryRates.find((cr) => cr.category === cat)
              if (!catRate && !isBoosted) return null
              return { cat, rate, catRate }
            })
            .filter(Boolean)
            .sort((a, b) => b!.rate - a!.rate)
            .map((item) => {
              const { cat, rate } = item!
              return (
                <div key={cat} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{CATEGORY_LABELS[cat]}</span>
                  <span className="font-semibold text-blue-700">{fmtRate(rate)}</span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Perks */}
      {card.perks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Annual Perks & Credits</h2>
          <div className="space-y-2">
            {card.perks.map((perk) => (
              <div key={perk.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{perk.name}</span>
                <span className="font-semibold text-green-600">+{fmt(perk.annualValue)}/yr</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium text-gray-700">Total annual perk value</span>
              <span className="font-bold text-green-700">
                +{fmt(card.perks.reduce((sum, p) => sum + p.annualValue, 0))}/yr
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pros / Cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pros.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <h2 className="font-semibold text-gray-900">Pros</h2>
              <ul className="space-y-2">
                {pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <h2 className="font-semibold text-gray-900">Cons</h2>
              <ul className="space-y-2">
                {cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Comparison links */}
      {(() => {
        const comparisons = getComparisonsForCard(card.id)
        if (comparisons.length === 0) return null
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3" data-card-comparisons>
            <h2 className="font-semibold text-gray-900 text-sm">Compare {card.name}</h2>
            <div className="flex flex-wrap gap-2">
              {comparisons.map(({ url, other }) => (
                <Link
                  key={url}
                  to={url}
                  className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors min-h-[44px] flex items-center"
                  data-comparison-link={other.id}
                >
                  vs {other.name}
                </Link>
              ))}
            </div>
          </div>
        )
      })()}

      {/* CTA footer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">Ready to optimize your wallet?</p>
          <p className="text-sm text-gray-600 mt-0.5">
            See how {card.name} stacks up against your actual spending.
          </p>
        </div>
        <button
          onClick={handleAddToWallet}
          className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] flex-shrink-0"
        >
          <Star size={14} />
          Add to My Wallet
        </button>
      </div>
    </div>
  )
}
