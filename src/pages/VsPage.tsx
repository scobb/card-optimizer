import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ExternalLink, TrendingUp, Shield, Users } from 'lucide-react'

interface CompetitorData {
  slug: string
  name: string
  url: string
  tagline: string
  description: string
  logoLabel: string
  ourAdvantages: string[]
  theirAdvantages: string[]
  intro: string
  body: React.ReactNode
  metaTitle: string
  metaDescription: string
}

const COMPETITORS: Record<string, CompetitorData> = {
  nerdwallet: {
    slug: 'nerdwallet',
    name: 'NerdWallet',
    url: 'https://www.nerdwallet.com',
    tagline: 'CardOptimizer vs NerdWallet: A Different Approach to Card Recommendations',
    description: 'CardOptimizer and NerdWallet both help you find the best credit cards — but they take fundamentally different approaches. Here is an honest comparison.',
    logoLabel: 'NerdWallet',
    metaTitle: 'CardOptimizer vs NerdWallet — 2026 Alternative Comparison',
    metaDescription: 'How CardOptimizer compares to NerdWallet for credit card recommendations. Privacy-first, personalized to YOUR spending, no account required. Honest comparison.',
    ourAdvantages: [
      'Personalized to YOUR actual spending — upload your CSV and see real numbers',
      'All analysis runs in your browser — zero data sent to servers',
      'No account, email, or sign-up required to use any feature',
      'No affiliate bias in rankings — cards ranked purely by math',
      'Wallet optimizer shows per-category card assignment for your exact spending mix',
      'Wallet Builder finds the optimal 2-4 card combination from the full catalog',
      'Open source — inspect exactly how recommendations are calculated',
      'No ads, no tracking pixels, no cookie banners',
    ],
    theirAdvantages: [
      'Extensive editorial content — thousands of long-form card reviews',
      'Broader financial product coverage (loans, mortgages, banking)',
      'Large editorial team with dedicated credit card experts',
      'Established brand with 10+ years of consumer trust',
      'More cards in database including secured and student cards',
      'Community reviews and user ratings for cards',
    ],
    intro: `NerdWallet is the dominant player in personal finance content. Millions of people visit it every month for credit card advice, and for good reason — its editorial team produces thorough, well-researched reviews. But the way NerdWallet recommends cards is fundamentally different from CardOptimizer, and for a meaningful subset of users, that difference matters a lot.`,
    body: (
      <div className="prose prose-sm text-gray-700 space-y-4 max-w-none">
        <h2 className="text-base font-bold text-gray-900">The Core Difference: Generic vs. Personalized</h2>
        <p>
          NerdWallet's card recommendations are <strong>generic</strong>. When you visit a page like
          "Best Travel Credit Cards," you see the same list whether you spend $200/month on travel or
          $2,000/month. The rankings reflect NerdWallet's editorial judgment — a combination of reward
          rates, bonus sizes, affiliate relationships, and editorial criteria — not your personal
          spending pattern.
        </p>
        <p>
          CardOptimizer takes the opposite approach: <strong>upload your actual transaction history</strong>{' '}
          (from Monarch, Copilot, Chase, Amex, or any CSV export) and the tool calculates exactly which
          cards would earn the most for your specific spending mix. If you spend $800/month on groceries
          and $150/month on dining, CardOptimizer tells you the Amex Gold earns you $1,140/year on those
          two categories alone — not a generalized "great for foodies" editorial take.
        </p>

        <h2 className="text-base font-bold text-gray-900">Privacy: A Fundamental Architectural Difference</h2>
        <p>
          To get personalized recommendations on NerdWallet, you typically need to create an account,
          provide your email, and in some cases connect financial accounts. NerdWallet collects this data
          to improve its product and target you with relevant financial offers.
        </p>
        <p>
          CardOptimizer was built on a different premise: <strong>your transaction data never leaves
          your browser</strong>. The CSV you upload is parsed entirely client-side using JavaScript.
          No data is sent to our servers. We have no database of your transactions. We cannot see your
          spending even if we wanted to. You can verify this by opening your browser's Network tab
          while uploading — you'll see zero outbound requests containing your transaction data.
        </p>
        <p>
          For many users — especially those wary of sharing financial data with ad-supported platforms —
          this is a meaningful distinction. Your spending patterns are some of the most sensitive
          personal data that exists. CardOptimizer's architecture means that data never exists anywhere
          except your local browser session.
        </p>

        <h2 className="text-base font-bold text-gray-900">What NerdWallet Does Better</h2>
        <p>
          Honesty requires acknowledging where NerdWallet excels. Its editorial depth is unmatched —
          if you want a 3,000-word review of the Chase Sapphire Reserve covering lounge access,
          foreign transaction fees, primary vs. secondary rental car insurance, and year-over-year
          changes to the card's benefits, NerdWallet has that content. We don't.
        </p>
        <p>
          NerdWallet also covers a much broader financial product universe: savings accounts, mortgages,
          student loans, investment accounts, insurance. CardOptimizer is focused exclusively on credit
          card reward optimization. If you need broader financial guidance, NerdWallet is a better
          starting point.
        </p>
        <p>
          Their database includes more cards than ours — particularly secured cards, student cards, and
          niche issuer products. Our catalog of 20+ cards covers the most popular reward-optimizing
          cards used by the majority of consumers, but we don't have every card in existence.
        </p>

        <h2 className="text-base font-bold text-gray-900">The Bottom Line</h2>
        <p>
          <strong>Use NerdWallet</strong> when you want comprehensive editorial coverage, a broad
          financial product universe, or detailed long-form card reviews.
        </p>
        <p>
          <strong>Use CardOptimizer</strong> when you want to know — based on your actual spending —
          exactly how much you'd earn with each card, which card to use for each spending category,
          and what the optimal combination of 2-4 cards is for your wallet. Especially if privacy
          matters to you.
        </p>
        <p>
          They are not mutually exclusive. Many users read NerdWallet for editorial context, then come
          to CardOptimizer to run the actual math on their own spending before applying.
        </p>
      </div>
    ),
  },
  'the-points-guy': {
    slug: 'the-points-guy',
    name: 'The Points Guy',
    url: 'https://thepointsguy.com',
    tagline: 'CardOptimizer vs The Points Guy: Data vs. Editorial',
    description: 'CardOptimizer and The Points Guy both help you maximize credit card rewards — but with very different tools. Here is an honest comparison.',
    logoLabel: 'The Points Guy',
    metaTitle: 'CardOptimizer vs The Points Guy — 2026 Alternative Comparison',
    metaDescription: 'How CardOptimizer compares to The Points Guy for credit card rewards optimization. Upload your spending data and get personalized recommendations — not generic editorial picks.',
    ourAdvantages: [
      'Personalized to YOUR actual spending — upload your CSV and see real numbers',
      'All analysis runs locally in your browser — no data sent to servers',
      'No account or email required — use all features anonymously',
      'Quantitative wallet optimization — per-category card assignment',
      'Wallet Builder finds optimal 2-4 card combinations from the catalog',
      'No travel-heavy editorial bias — equally useful for cash-back spenders',
      'No ads, no affiliate bias in the optimization math',
    ],
    theirAdvantages: [
      'Deep expertise in travel rewards — points valuations, transfer partners, sweet spots',
      'Premium travel coverage: airline alliances, hotel loyalty programs, airport lounges',
      'Large editorial team with specialized travel award booking knowledge',
      'Award booking guides, transfer partner analysis, and redemption walkthroughs',
      'Community and forum for travel rewards enthusiasts',
      'Coverage of limited-time transfer bonuses and card offer changes',
    ],
    intro: `The Points Guy built its reputation on travel rewards optimization — and within that niche, it remains one of the best resources available. But travel hacking is a specialized skill set, and most credit card holders aren't redeeming points for business-class flights to Tokyo. CardOptimizer was built for everyone else: people who want to earn more rewards on their actual spending, whether that's cash back on groceries, dining rewards, or gas.`,
    body: (
      <div className="prose prose-sm text-gray-700 space-y-4 max-w-none">
        <h2 className="text-base font-bold text-gray-900">Travel Enthusiasts vs. Everyday Optimizers</h2>
        <p>
          The Points Guy is built for a specific user: someone who is willing to invest significant
          time learning airline alliances, transfer partner ratios, and award chart sweet spots in
          exchange for potentially outsized redemption value. A reader who books business-class flights
          by transferring Chase points to Air France/KLM Flying Blue is getting tremendous value —
          but that user represents a small percentage of credit card holders.
        </p>
        <p>
          CardOptimizer is built for the majority: people who spend money on groceries, dining, gas,
          and streaming, and want to know which card — or combination of cards — earns the most
          rewards on that spending. The tool works equally well for cash-back maximizers (who prefer
          simplicity) and points collectors (who are comfortable managing multiple currencies).
        </p>

        <h2 className="text-base font-bold text-gray-900">Editorial Recommendations vs. Your Data</h2>
        <p>
          The Points Guy publishes monthly "best credit cards" lists that reflect editorial valuations
          of points currencies, bonus category rates, and sign-up bonus sizes. These lists are
          thoroughly researched, but they are <strong>generic</strong> — they don't know that you
          spend $1,200/month on groceries but almost nothing on travel. A card that ranks #1 on their
          "best travel cards" list might be the wrong choice for you if your spending is dominated
          by dining and gas.
        </p>
        <p>
          CardOptimizer's recommendations are <strong>specific to your spending mix</strong>. Upload
          a CSV from your bank or budgeting app and the tool tells you: given your exact category
          totals, the{' '}
          <Link to="/cards/amex-gold" className="text-blue-600 hover:underline">
            American Express Gold Card
          </Link>{' '}
          would earn you $1,140/year on dining and groceries, while the{' '}
          <Link to="/cards/capital-one-venture-x" className="text-blue-600 hover:underline">
            Capital One Venture X
          </Link>{' '}
          would earn $780/year on your current spending mix. That level of precision isn't possible
          with editorial content — it requires knowing your actual numbers.
        </p>

        <h2 className="text-base font-bold text-gray-900">Privacy and Data Handling</h2>
        <p>
          The Points Guy monetizes primarily through affiliate commissions — card application links.
          This creates an inherent incentive structure where cards that pay higher commissions may
          receive more prominent placement. The editorial team works to maintain independence from
          this pressure, and they are generally transparent about it, but the dynamic exists.
        </p>
        <p>
          CardOptimizer's recommendations come from pure math: effective reward rate × your spending
          in each category − annual fee + sign-up bonus amortized over 2 years. There are no
          affiliate relationships influencing the ranking order within the optimizer tool itself.
          (We may include apply links that carry referral tracking, but the optimization ranking
          is independent of that.)
        </p>
        <p>
          Your uploaded transaction data is processed entirely in your browser. We never see it,
          store it, or transmit it. The Points Guy, like most content platforms, runs advertising
          and collects behavioral data for targeting. If data privacy is a consideration, CardOptimizer's
          architecture provides stronger guarantees by design.
        </p>

        <h2 className="text-base font-bold text-gray-900">Where The Points Guy Wins</h2>
        <p>
          If you are a travel rewards power user — someone who books award flights, pursues elite
          status, or actively manages a portfolio of points currencies across airlines and hotels —
          The Points Guy is an essential resource. Its depth on transfer partner valuations,
          airline alliance routing rules, and hotel award chart sweet spots has no equivalent
          in CardOptimizer's scope.
        </p>
        <p>
          CardOptimizer is explicitly not trying to be a travel hacking guide. We don't publish
          "how to book Singapore Suites for 70,000 miles" content. Our focus is narrower:
          maximize annual rewards on everyday spending with a data-driven, privacy-preserving tool.
        </p>

        <h2 className="text-base font-bold text-gray-900">The Bottom Line</h2>
        <p>
          <strong>Use The Points Guy</strong> if you're a travel rewards enthusiast who wants deep
          expertise on points currencies, transfer partners, and award booking strategies.
        </p>
        <p>
          <strong>Use CardOptimizer</strong> if you want to know — based on your actual transaction
          history — which cards earn you the most money, what the optimal card combination looks like
          for your specific spending, and how to make those decisions without sharing your financial
          data with anyone.
        </p>
        <p>
          The two tools serve overlapping but distinct audiences. Many users follow The Points Guy
          for travel content and use CardOptimizer to run the numbers before applying for a new card.
        </p>
      </div>
    ),
  },
}

interface ComparisonRow {
  feature: string
  us: string
  them: string
  usWins?: boolean
  themWins?: boolean
}

function getComparisonTable(competitor: CompetitorData): ComparisonRow[] {
  if (competitor.slug === 'nerdwallet') {
    return [
      { feature: 'Personalized to your spending', us: 'Yes — upload your CSV', them: 'No — generic editorial picks', usWins: true },
      { feature: 'Data privacy', us: 'All processing in your browser, zero server upload', them: 'Account required, data collected for targeting', usWins: true },
      { feature: 'Sign-up required', us: 'None — fully anonymous', them: 'Account recommended for personalization', usWins: true },
      { feature: 'Editorial card reviews', us: 'Basic card detail pages', them: 'Thousands of in-depth reviews', themWins: true },
      { feature: 'Wallet optimizer (per-category)', us: 'Yes — optimize your full card stack', them: 'No', usWins: true },
      { feature: 'Cards in database', us: '20+ top reward cards', them: '500+ including niche/secured cards', themWins: true },
      { feature: 'Affiliate influence on rankings', us: 'None in optimizer math', them: 'Possible — affiliate relationships exist', usWins: true },
      { feature: 'Financial product coverage', us: 'Credit cards only', them: 'Cards, loans, banking, mortgages, investing', themWins: true },
      { feature: 'Cost to use', us: 'Free, no account', them: 'Free, but account required for some features', usWins: true },
      { feature: 'Open source / auditable', us: 'Yes', them: 'No', usWins: true },
    ]
  }
  return [
    { feature: 'Personalized to your spending', us: 'Yes — upload your CSV', them: 'No — editorial picks', usWins: true },
    { feature: 'Data privacy', us: 'All processing in-browser, zero server upload', them: 'Behavioral data collected for advertising', usWins: true },
    { feature: 'Best for cash-back users', us: 'Yes — fully supported', them: 'Partial — travel-heavy editorial focus', usWins: true },
    { feature: 'Travel rewards depth', us: 'Basic travel card data', them: 'Extensive — transfer partners, award charts, sweet spots', themWins: true },
    { feature: 'Wallet optimizer', us: 'Yes — per-category optimization', them: 'No', usWins: true },
    { feature: 'Sign-up required', us: 'None — fully anonymous', them: 'Account recommended', usWins: true },
    { feature: 'Affiliate influence on rankings', us: 'None in optimizer math', them: 'Exists — disclosed but present', usWins: true },
    { feature: 'Award booking guides', us: 'No', them: 'Extensive — core product offering', themWins: true },
    { feature: 'Open source / auditable', us: 'Yes', them: 'No', usWins: true },
    { feature: 'Community / forum', us: 'No', them: 'Yes — active travel hacker community', themWins: true },
  ]
}

export function VsPage() {
  const { competitor: competitorSlug } = useParams<{ competitor: string }>()
  const competitor = COMPETITORS[competitorSlug ?? '']

  useEffect(() => {
    if (competitor) {
      document.title = competitor.metaTitle
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', competitor.metaDescription)

      // Article JSON-LD
      const script = document.createElement('script')
      script.id = 'vs-page-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: competitor.tagline,
        description: competitor.metaDescription,
        author: { '@type': 'Organization', name: 'CardOptimizer by Keylight Digital' },
        publisher: { '@type': 'Organization', name: 'Keylight Digital', url: 'https://keylightdigital.com' },
        datePublished: '2026-04-13',
        dateModified: '2026-04-13',
        url: `https://cards.keylightdigital.dev/vs/${competitor.slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://cards.keylightdigital.dev/vs/${competitor.slug}` },
      })
      document.head.appendChild(script)
    } else {
      document.title = 'Page Not Found | Card Optimizer'
    }
    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', 'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.')
      const existing = document.getElementById('vs-page-jsonld')
      if (existing) existing.remove()
    }
  }, [competitor])

  if (!competitor) {
    return (
      <div className="text-center py-16">
        <Users size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Comparison not found</h1>
        <p className="text-gray-500 text-sm mb-6">We don't have a comparison page for that tool.</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          <ArrowLeft size={16} />
          Browse Card Catalog
        </Link>
      </div>
    )
  }

  const comparisonTable = getComparisonTable(competitor)

  return (
    <div className="space-y-6" data-vs-page={competitorSlug}>
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
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-blue-200" />
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Tool Comparison</p>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold leading-tight" data-vs-title>
          {competitor.tagline}
        </h1>
        <p className="mt-3 text-blue-100 text-sm leading-relaxed max-w-2xl">
          {competitor.description}
        </p>
      </div>

      {/* TL;DR comparison table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-comparison-table>
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <h2 className="font-semibold text-gray-900 text-sm">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-5 py-3 font-semibold text-gray-700 w-1/3">Feature</th>
                <th className="text-center px-4 py-3 font-semibold text-blue-700 w-1/3">CardOptimizer</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 w-1/3">{competitor.logoLabel}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-700 text-xs sm:text-sm">{row.feature}</td>
                  <td className={`px-4 py-3 text-center text-xs sm:text-sm ${row.usWins ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                    {row.usWins && <CheckCircle size={12} className="inline mr-1 text-green-500" />}
                    {row.us}
                  </td>
                  <td className={`px-4 py-3 text-center text-xs sm:text-sm ${row.themWins ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                    {row.themWins && <CheckCircle size={12} className="inline mr-1 text-green-500" />}
                    {row.them}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intro */}
      <div className="bg-white border border-gray-200 rounded-xl p-6" data-intro-section>
        <p className="text-sm text-gray-700 leading-relaxed">{competitor.intro}</p>
      </div>

      {/* Body content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6" data-body-section>
        {competitor.body}
      </div>

      {/* Advantages summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-advantages>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
            <Shield size={14} className="text-blue-600" />
            Where CardOptimizer Wins
          </h2>
          <ul className="space-y-2">
            {competitor.ourAdvantages.map((adv) => (
              <li key={adv} className="flex items-start gap-2 text-sm text-blue-900">
                <CheckCircle size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            <CheckCircle size={14} className="text-gray-500" />
            Where {competitor.logoLabel} Wins
          </h2>
          <ul className="space-y-2">
            {competitor.theirAdvantages.map((adv) => (
              <li key={adv} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Internal links */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3" data-internal-links>
        <h2 className="font-semibold text-gray-900 text-sm">Explore CardOptimizer</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/upload', label: 'Optimize My Rewards' },
            { to: '/catalog', label: 'Browse All Cards' },
            { to: '/best-cards/dining', label: 'Best for Dining' },
            { to: '/best-cards/travel', label: 'Best for Travel' },
            { to: '/best-cards/groceries', label: 'Best for Groceries' },
            { to: '/builder', label: 'Wallet Builder' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors min-h-[44px] flex items-center"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-700 rounded-xl p-6 text-white text-center space-y-3" data-cta-upload>
        <h2 className="text-lg font-bold">Try CardOptimizer — Free, No Account Required</h2>
        <p className="text-blue-100 text-sm max-w-lg mx-auto">
          Upload your transaction history and see personalized card recommendations based on your
          actual spending. All analysis stays in your browser.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
          data-cta-link
        >
          Optimize My Rewards
        </Link>
      </div>

      {/* External link to competitor */}
      <p className="text-xs text-gray-400 text-center pb-2">
        This page is for informational purposes only.{' '}
        <a
          href={competitor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
          data-competitor-link
        >
          Visit {competitor.name} <ExternalLink size={10} />
        </a>
        {' '}for their own product information. CardOptimizer is not affiliated with {competitor.name}.
      </p>
    </div>
  )
}
