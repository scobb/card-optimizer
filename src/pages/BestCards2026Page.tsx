import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Award, TrendingUp, Star } from 'lucide-react'
import { ALL_CARDS } from '../lib/cards'

interface Pick {
  category: string
  pickId: string
  cardId: string
  annualFee: number
  topRate: string
  signUpBonus: string
  whyItWins: string
  rateHighlight: string
  proTip?: string
  categoryGuideSlug?: string
}

const PICKS: Pick[] = [
  {
    category: 'Best Overall',
    pickId: 'best-overall',
    cardId: 'chase-sapphire-preferred',
    annualFee: 95,
    topRate: '3.75% on dining & streaming',
    signUpBonus: '$750 after $4,000 spend in 3 months',
    whyItWins:
      'The Chase Sapphire Preferred has earned its reputation as the gold-standard starter travel card for good reason. It delivers elevated rewards across the categories most people actually spend on — dining, streaming, and travel — without requiring premium-card-level annual fee commitment. Chase Ultimate Rewards points are among the most flexible in the industry: you can redeem them at 1.25¢/pt through Chase Travel, transfer them to United, Hyatt, Southwest, and other partners, or simply cash out. For most people optimizing a single card, the Sapphire Preferred is still the answer in 2026.',
    rateHighlight: '3.75% effective on dining and streaming (3× points at 1.25¢/pt)',
    proTip:
      'Pair with Chase Freedom Unlimited to earn 1.5% on all other purchases, then pool points into the Sapphire Preferred for 1.25× travel redemptions.',
  },
  {
    category: 'Best Cash Back',
    pickId: 'best-cash-back',
    cardId: 'citi-double-cash',
    annualFee: 0,
    topRate: '2% on all purchases',
    signUpBonus: '$200 after $1,500 spend in 6 months',
    whyItWins:
      'If you want strong, reliable rewards without tracking categories or juggling multiple cards, the Citi Double Cash is the best cash back card available at no annual fee. Its structure is elegantly simple: 1% back when you make a purchase, 1% back when you pay it off — effectively 2% on everything. No rotating categories to activate, no spending caps, no tiered structures to memorize. For the majority of everyday spenders, a 2% flat rate beats most category-based cards once you average across all spending.',
    rateHighlight: '2% effective on every purchase — the highest unlimited flat rate at $0 fee',
    proTip:
      'Convert your cash back to Citi ThankYou points and transfer to travel partners like Turkish Airlines or Singapore KrisFlyer for potentially higher value.',
  },
  {
    category: 'Best Travel',
    pickId: 'best-travel',
    cardId: 'capital-one-venture-x',
    annualFee: 395,
    topRate: '10× on hotels, 5× on flights (Capital One Travel)',
    signUpBonus: '$750 after $4,000 spend in 3 months',
    whyItWins:
      "The Capital One Venture X redefines what a premium travel card should cost. The headline $395 annual fee is almost entirely offset by two annual benefits: a $300 Capital One Travel credit (usable on any booking) and 10,000 anniversary bonus miles worth $100. That brings the effective net fee to roughly $0 for anyone who travels even a few times a year. Add unlimited Priority Pass lounge access, a 2× baseline on all purchases, 10× on hotels through Capital One Travel, 5× on flights, and you have a card that competes directly with the Amex Platinum at less than two-thirds the price.",
    rateHighlight: '10× on hotels, 5× on flights via Capital One Travel; 2× on everything else',
    proTip:
      "Book hotels and flights through Capital One Travel to hit the 10×/5× bonus rates and make the most of the $300 annual credit.",
    categoryGuideSlug: 'travel',
  },
  {
    category: 'Best Dining',
    pickId: 'best-dining',
    cardId: 'amex-gold',
    annualFee: 250,
    topRate: '4% on dining & groceries',
    signUpBonus: '$600 after $6,000 spend in 6 months',
    whyItWins:
      'No card rewards food spending more generously than the American Express Gold Card, full stop. The 4× Membership Rewards on dining and U.S. supermarkets is the highest category rate available for those two categories from any major issuer. For a household spending $600/month on groceries and $500/month dining out, that is approximately $1,344/year in rewards (at 1¢/pt). Subtract the $120 annual dining credit ($10/month at eligible restaurants) and $120 Uber Cash, and your effective net cost is as low as $10/year — a nearly unbeatable value for food-heavy spenders.',
    rateHighlight: '4% effective on dining and groceries — highest in class for both categories',
    proTip:
      'Set up the $10/month dining credit on Grubhub to spend automatically — it disappears if unused. Activate $10/month Uber Cash for Uber Eats orders.',
    categoryGuideSlug: 'dining',
  },
  {
    category: 'Best No Annual Fee',
    pickId: 'best-no-annual-fee',
    cardId: 'wells-fargo-active-cash',
    annualFee: 0,
    topRate: '2% on all purchases',
    signUpBonus: '$200 after $500 spend in 3 months',
    whyItWins:
      'The Wells Fargo Active Cash delivers 2% cash rewards on every purchase with no annual fee and no hoops to jump through. What sets it apart from other 2% cards is the combination of simplicity and added perks: the $200 welcome bonus requires only $500 in purchases — one of the lowest thresholds available for a reward this size. Cardholders also receive cell phone protection (up to $600) when they pay their monthly phone bill with the card, a tangible benefit most competitors at this fee level simply do not offer.',
    rateHighlight: '2% cash rewards on all purchases; $200 bonus after just $500 spend',
    proTip:
      'Pay your cell phone bill with this card every month to activate $600 cell phone theft and damage protection (subject to a $25 deductible).',
  },
  {
    category: 'Best Sign-Up Bonus',
    pickId: 'best-signup-bonus',
    cardId: 'amex-platinum',
    annualFee: 695,
    topRate: '5.5% on flights booked directly',
    signUpBonus: '$800 after $8,000 spend in 6 months',
    whyItWins:
      "The American Express Platinum carries the largest welcome bonus in our database — $800 in statement credits — and pairs it with over $1,500/year in ongoing annual credits that can significantly offset the $695 fee. For frequent travelers willing to engage with the card's benefit ecosystem (airline fees, hotel stays, digital entertainment, Uber Cash, Saks credits, Global Entry reimbursement), the net annual value can easily turn positive. The card also unlocks premium lounge access at Centurion Lounges, Delta Sky Clubs (on Delta flights), and Priority Pass locations worldwide.",
    rateHighlight: '5.5% effective on flights (5× Membership Rewards at ~1.1¢/pt)',
    proTip:
      "To hit the $8,000 spend requirement in 6 months (~$1,333/month), use the card for large planned purchases: insurance premiums, property taxes, home repairs, or business expenses.",
    categoryGuideSlug: 'travel',
  },
]

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function BestCards2026Page() {
  useEffect(() => {
    document.title = 'Best Credit Cards of 2026 — CardOptimizer'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Data-driven picks for the best credit cards of 2026. Top cards for cash back, travel, dining, no annual fee, and more — ranked by real reward rates.'
      )
    }

    // Article structured data
    const script = document.createElement('script')
    script.id = 'best-cards-2026-jsonld'
    script.type = 'application/ld+json'
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Best Credit Cards of 2026',
      description:
        'Data-driven picks for the best credit cards of 2026. Top cards for cash back, travel, dining, no annual fee, and more — ranked by real reward rates.',
      author: {
        '@type': 'Organization',
        name: 'CardOptimizer by Keylight Digital',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Keylight Digital',
        url: 'https://keylightdigital.com',
      },
      datePublished: '2026-04-13',
      dateModified: '2026-04-13',
      url: 'https://cards.keylightdigital.dev/best-cards-2026',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://cards.keylightdigital.dev/best-cards-2026',
      },
    }
    script.textContent = JSON.stringify(jsonld)
    document.head.appendChild(script)

    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const desc = document.querySelector('meta[name="description"]')
      if (desc) {
        desc.setAttribute(
          'content',
          'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.'
        )
      }
      const existing = document.getElementById('best-cards-2026-jsonld')
      if (existing) existing.remove()
    }
  }, [])

  return (
    <div className="space-y-8" data-best-cards-2026>
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
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award size={18} className="text-yellow-300" />
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Editors' Picks</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-page-title>
          Best Credit Cards of 2026
        </h1>
        <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-2xl">
          Our data-driven picks for the best credit cards this year — selected based on real reward
          rates, annual fee math, and sign-up bonus value from our database of 20+ cards.
        </p>
        <p className="mt-2 text-blue-200 text-xs">
          Last updated: April 2026. Reward rates reflect effective cash-back percentage including
          point valuations. Not financial advice.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4" data-introduction>
        <h2 className="text-lg font-bold text-gray-900">How We Pick the Best Cards</h2>
        <div className="prose prose-sm text-gray-600 space-y-3 max-w-none">
          <p>
            The best credit card is the one that earns the most rewards <em>for your specific
            spending pattern</em> — not the one with the flashiest marketing or the highest headline
            bonus. Our picks are grounded in data: we pull reward rates directly from our card
            database, compute effective cash-back percentages (including point valuations), and model
            realistic annual reward totals based on average U.S. household spending.
          </p>
          <p>
            We evaluate each card across four dimensions: <strong>earning rate</strong> (how much
            you earn per dollar spent in key categories), <strong>annual fee math</strong> (whether
            the fee is truly offset by rewards and credits), <strong>welcome bonus value</strong>{' '}
            (amortized over two years at conservative redemption values), and{' '}
            <strong>flexibility</strong> (can you actually use the rewards without complex transfer
            gymnastics?).
          </p>
          <p>
            No card on this list pays us for inclusion. These are the cards that win on the
            numbers — backed by the same engine that powers our{' '}
            <Link to="/upload" className="text-blue-600 hover:underline">
              personalized card optimizer
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Picks */}
      <div className="space-y-6" data-picks-list>
        {PICKS.map((pick, index) => {
          const card = ALL_CARDS.find((c) => c.id === pick.cardId)
          const cardUrl = card?.url ?? '#'

          return (
            <div
              key={pick.pickId}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              data-pick={pick.pickId}
            >
              {/* Pick header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-5 py-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <Star size={14} className="text-yellow-500 flex-shrink-0" />
                  <span
                    className="text-sm font-bold text-blue-800 uppercase tracking-wide"
                    data-pick-category
                  >
                    {pick.category}
                  </span>
                </div>
              </div>

              {/* Pick body */}
              <div className="p-5 space-y-4">
                {/* Card name + stats */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5" data-pick-issuer>
                      {card?.issuer ?? ''}
                    </p>
                    <Link
                      to={`/cards/${pick.cardId}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-700 transition-colors"
                      data-pick-card-name
                    >
                      {card?.name ?? pick.cardId}
                    </Link>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Annual Fee</p>
                        <p className="font-bold text-gray-900">
                          {pick.annualFee === 0 ? 'None' : fmt(pick.annualFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Top Rate</p>
                        <p className="font-bold text-blue-700" data-pick-top-rate>
                          {pick.topRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Welcome Bonus</p>
                        <p className="font-bold text-green-700" data-pick-bonus>
                          {pick.signUpBonus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <a
                      href={cardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] whitespace-nowrap"
                      data-pick-apply-link={pick.pickId}
                    >
                      Apply <ExternalLink size={12} />
                    </a>
                    <Link
                      to={`/cards/${pick.cardId}`}
                      className="inline-flex items-center justify-center gap-1 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] whitespace-nowrap"
                    >
                      Full Review
                    </Link>
                  </div>
                </div>

                {/* Why it wins */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Why It Wins
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed" data-pick-why-it-wins>
                    {pick.whyItWins}
                  </p>
                </div>

                {/* Rate highlight */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-start gap-2">
                  <TrendingUp size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 font-medium" data-pick-rate-highlight>
                    {pick.rateHighlight}
                  </p>
                </div>

                {/* Pro tip */}
                {pick.proTip && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
                      Pro Tip
                    </p>
                    <p className="text-sm text-amber-900">{pick.proTip}</p>
                  </div>
                )}

                {/* CTA + category guide link */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to="/upload"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    data-pick-cta={pick.pickId}
                  >
                    See if this card fits your spending →
                  </Link>
                  {pick.categoryGuideSlug && (
                    <Link
                      to={`/best-cards/${pick.categoryGuideSlug}`}
                      className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                    >
                      See all best {pick.categoryGuideSlug} cards →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Methodology deep-dive */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4" data-methodology>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" />
          Our Methodology
        </h2>
        <div className="prose prose-sm text-gray-600 space-y-3 max-w-none">
          <p>
            Every card in our database is evaluated using the same transparent formula. We compute an{' '}
            <strong>effective cash-back percentage</strong> for each spending category by multiplying
            the category reward multiplier by the card's point value (in cents per point for rewards
            cards, or face value for cash-back cards). A 3× multiplier on a card with 1.25¢/pt
            valuation yields 3.75% effective — higher than most competing cash-back cards at first
            glance.
          </p>
          <p>
            For <strong>annual fee analysis</strong>, we model a realistic portfolio of annual
            credits and subtract them from the stated fee to arrive at a net effective cost. We use
            conservative estimates: we only count credits you are likely to use naturally, not ones
            that require unusual spending behavior.
          </p>
          <p>
            <strong>Sign-up bonuses</strong> are amortized over two years at conservative redemption
            values (1¢/pt for most rewards currencies, slightly higher for programs with documented
            transfer partner value). This gives us a levelized annual bonus value that makes it fair
            to compare cards across different bonus sizes and spend requirements.
          </p>
          <p>
            The best way to apply this methodology to your own situation is to{' '}
            <Link to="/upload" className="text-blue-600 hover:underline">
              upload your transaction history
            </Link>{' '}
            and let CardOptimizer compute exact projections based on your actual spending mix — not
            the averages we use here.
          </p>
        </div>
      </div>

      {/* Category guide links */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3" data-category-guides>
        <h2 className="font-semibold text-gray-900 text-sm">Explore by Spending Category</h2>
        <p className="text-sm text-gray-500">
          See the top 5 cards ranked by effective reward rate for each major spending category.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'dining', label: 'Best for Dining' },
            { slug: 'groceries', label: 'Best for Groceries' },
            { slug: 'travel', label: 'Best for Travel' },
            { slug: 'gas', label: 'Best for Gas' },
            { slug: 'online-shopping', label: 'Best for Online Shopping' },
            { slug: 'streaming', label: 'Best for Streaming' },
          ].map(({ slug, label }) => (
            <Link
              key={slug}
              to={`/best-cards/${slug}`}
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors min-h-[44px] flex items-center"
              data-category-guide-link={slug}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Upload CTA */}
      <div
        className="bg-blue-700 rounded-xl p-6 text-white text-center space-y-3"
        data-upload-cta
      >
        <h2 className="text-lg font-bold">Find the Best Card for YOUR Spending</h2>
        <p className="text-blue-100 text-sm max-w-lg mx-auto">
          Our picks are based on average spending patterns. Upload your real transaction history and
          CardOptimizer will show you exactly which cards — from our full catalog of 20+ — would
          earn the most for how you actually spend money.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
          data-cta-upload
        >
          Optimize My Rewards
        </Link>
        <p className="text-blue-200 text-xs mt-1">
          Free. Private. No account required. All analysis happens in your browser.
        </p>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center pb-2">
        Reward rates and sign-up bonuses are based on publicly available card terms as of April 2026.
        Annual benefits and credits are subject to change. This page is for informational purposes
        only and does not constitute financial advice. CardOptimizer may earn referral fees from card
        applications — this does not influence our rankings.
      </p>
    </div>
  )
}
