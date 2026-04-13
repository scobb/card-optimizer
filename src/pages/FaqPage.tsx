import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

interface FaqItem {
  q: string
  a: React.ReactNode
  plain: string // plain text for JSON-LD
}

interface FaqGroup {
  group: string
  items: FaqItem[]
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    group: 'About the Tool',
    items: [
      {
        q: 'What is CardOptimizer and how does it work?',
        a: (
          <>
            CardOptimizer is a free, privacy-first tool that analyzes your credit card spending and
            recommends the best cards for your habits. You upload a CSV export from your bank or
            budgeting app (Monarch, Copilot, Chase, Amex, Capital One, or a generic format), and the
            tool categorizes your transactions by type — dining, groceries, travel, gas, and more.
            It then calculates which cards from its database of 20+ cards would earn the most rewards
            for your specific spending pattern.
          </>
        ),
        plain:
          'CardOptimizer is a free, privacy-first tool that analyzes your credit card spending and recommends the best cards for your habits. You upload a CSV export from your bank or budgeting app (Monarch, Copilot, Chase, Amex, Capital One, or a generic format), and the tool categorizes your transactions by type — dining, groceries, travel, gas, and more. It then calculates which cards from its database of 20+ cards would earn the most rewards for your specific spending pattern.',
      },
      {
        q: 'Is CardOptimizer free to use?',
        a: (
          <>
            Yes, CardOptimizer is completely free. There are no accounts, subscriptions, or hidden
            fees. All features — CSV upload, wallet optimizer, card recommendations, wallet builder,
            and the card catalog — are available at no cost.
          </>
        ),
        plain:
          'Yes, CardOptimizer is completely free. There are no accounts, subscriptions, or hidden fees. All features — CSV upload, wallet optimizer, card recommendations, wallet builder, and the card catalog — are available at no cost.',
      },
      {
        q: 'Which CSV formats does CardOptimizer support?',
        a: (
          <>
            CardOptimizer auto-detects and supports exports from:{' '}
            <strong>Monarch Money</strong>, <strong>Copilot</strong>,{' '}
            <strong>Chase</strong>, <strong>American Express</strong>,{' '}
            <strong>Capital One</strong>, and <strong>generic CSV</strong> files with date,
            description, and amount columns. If auto-detection fails, you can manually map columns.
          </>
        ),
        plain:
          'CardOptimizer auto-detects and supports exports from: Monarch Money, Copilot, Chase, American Express, Capital One, and generic CSV files with date, description, and amount columns. If auto-detection fails, you can manually map columns.',
      },
      {
        q: 'How many credit cards are in the database?',
        a: (
          <>
            The database includes 20+ popular credit cards from major issuers including Chase, American
            Express, Citi, Capital One, Discover, Wells Fargo, and Bank of America. You can browse all
            cards on the{' '}
            <Link to="/catalog" className="text-blue-600 hover:underline">
              card catalog page
            </Link>
            .
          </>
        ),
        plain:
          'The database includes 20+ popular credit cards from major issuers including Chase, American Express, Citi, Capital One, Discover, Wells Fargo, and Bank of America.',
      },
      {
        q: 'What is the Wallet Builder feature?',
        a: (
          <>
            The Wallet Builder finds the optimal combination of 2–4 cards from the full catalog for
            your spending pattern. Instead of optimizing your existing wallet, it searches the entire
            card database to find which group of cards maximizes your total annual rewards. Navigate
            to the{' '}
            <Link to="/builder" className="text-blue-600 hover:underline">
              Builder page
            </Link>{' '}
            after uploading your transactions.
          </>
        ),
        plain:
          'The Wallet Builder finds the optimal combination of 2–4 cards from the full catalog for your spending pattern. Instead of optimizing your existing wallet, it searches the entire card database to find which group of cards maximizes your total annual rewards.',
      },
    ],
  },
  {
    group: 'Privacy & Data',
    items: [
      {
        q: 'Does CardOptimizer store my transaction data?',
        a: (
          <>
            No. CardOptimizer processes your CSV entirely in your browser using JavaScript. Your
            transaction data never leaves your device and is never sent to any server. Only aggregated
            spending totals (category subtotals, not individual transactions) are saved — and only in
            your browser's localStorage. See the full{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              privacy policy
            </Link>{' '}
            for details.
          </>
        ),
        plain:
          'No. CardOptimizer processes your CSV entirely in your browser using JavaScript. Your transaction data never leaves your device and is never sent to any server. Only aggregated spending totals are saved — and only in your browser\'s localStorage.',
      },
      {
        q: 'Is it safe to upload my bank statements to CardOptimizer?',
        a: (
          <>
            Yes. Unlike many financial tools, CardOptimizer never transmits your data. All CSV parsing
            and analysis happens locally in your browser. Even if our servers were compromised, your
            transaction data would not be at risk because we never have it. Your data is safer here
            than with most budgeting apps.
          </>
        ),
        plain:
          'Yes. Unlike many financial tools, CardOptimizer never transmits your data. All CSV parsing and analysis happens locally in your browser. Even if our servers were compromised, your transaction data would not be at risk because we never have it.',
      },
      {
        q: 'Does CardOptimizer use cookies or track me?',
        a: (
          <>
            CardOptimizer does not use cookies, third-party analytics, or tracking pixels. We use{' '}
            <strong>Beam</strong>, a privacy-first analytics tool that collects anonymous page view
            counts without any personally identifiable information. We do not build user profiles or
            sell data to advertisers.
          </>
        ),
        plain:
          'CardOptimizer does not use cookies, third-party analytics, or tracking pixels. We use Beam, a privacy-first analytics tool that collects anonymous page view counts without any personally identifiable information.',
      },
      {
        q: 'How do I clear my data from CardOptimizer?',
        a: (
          <>
            Your spending totals and wallet selections are stored in your browser's localStorage.
            To clear them, open your browser's developer tools (F12 → Application → Local Storage →
            your site URL) and delete the CardOptimizer entries, or simply clear all local storage for
            the site. Alternatively, clearing your browser's site data will remove all stored data.
          </>
        ),
        plain:
          "Your spending totals and wallet selections are stored in your browser's localStorage. To clear them, open your browser's developer tools and delete the CardOptimizer entries, or clear all local storage for the site.",
      },
    ],
  },
  {
    group: 'Card Strategy',
    items: [
      {
        q: 'How many credit cards should I have in my wallet?',
        a: (
          <>
            For most people, a 2–3 card wallet is the sweet spot. A typical optimal setup is:{' '}
            <strong>one premium travel card</strong> (e.g.,{' '}
            <Link to="/cards/chase-sapphire-preferred" className="text-blue-600 hover:underline">
              Chase Sapphire Preferred
            </Link>{' '}
            or{' '}
            <Link to="/cards/amex-gold" className="text-blue-600 hover:underline">
              Amex Gold
            </Link>
            ) for high-reward categories, plus{' '}
            <strong>one flat-rate catch-all card</strong> (e.g.,{' '}
            <Link to="/cards/citi-double-cash" className="text-blue-600 hover:underline">
              Citi Double Cash
            </Link>{' '}
            or{' '}
            <Link to="/cards/wells-fargo-active-cash" className="text-blue-600 hover:underline">
              Wells Fargo Active Cash
            </Link>
            ) for everything else. Adding a third card for a specific category you spend heavily in
            (groceries, gas) can boost rewards further.
          </>
        ),
        plain:
          'For most people, a 2–3 card wallet is the sweet spot. A typical optimal setup is: one premium travel card for high-reward categories, plus one flat-rate catch-all card for everything else. Adding a third card for a specific category you spend heavily in can boost rewards further.',
      },
      {
        q: 'Are annual fee credit cards worth it?',
        a: (
          <>
            It depends on your spending. A card like the{' '}
            <Link to="/cards/amex-gold" className="text-blue-600 hover:underline">
              Amex Gold
            </Link>{' '}
            ($250/yr fee) earns 4x on dining and groceries — if you spend $500/month in those
            categories, you earn $240/year in rewards just from dining at a 1¢/point valuation, which
            nearly offsets the fee before counting credits and sign-up bonuses. Use the{' '}
            <Link to="/upload" className="text-blue-600 hover:underline">
              spending analyzer
            </Link>{' '}
            to calculate your exact break-even for any card.
          </>
        ),
        plain:
          "It depends on your spending. Annual fee cards are worth it when the rewards and credits you earn exceed the fee. Use CardOptimizer's spending analyzer to calculate your exact break-even for any card based on your actual spending.",
      },
      {
        q: 'Should I get a cash back or travel rewards card?',
        a: (
          <>
            Cash back cards are simpler — 1 point = 1 cent, always. Travel cards offer higher
            potential value (1.5–2¢ per point through transfer partners) but require more effort to
            redeem optimally. If you travel at least twice a year and are willing to learn transfer
            partners, travel cards usually win. Otherwise, a cash back card like the{' '}
            <Link to="/cards/citi-double-cash" className="text-blue-600 hover:underline">
              Citi Double Cash
            </Link>{' '}
            or{' '}
            <Link to="/cards/chase-freedom-unlimited" className="text-blue-600 hover:underline">
              Chase Freedom Unlimited
            </Link>{' '}
            is hard to beat for simplicity. See our{' '}
            <Link to="/best-cards/travel" className="text-blue-600 hover:underline">
              best travel cards
            </Link>{' '}
            guide.
          </>
        ),
        plain:
          'Cash back cards are simpler — 1 point = 1 cent, always. Travel cards offer higher potential value through transfer partners but require more effort to redeem optimally. If you travel at least twice a year, travel cards usually win. Otherwise, a flat cash back card is hard to beat for simplicity.',
      },
      {
        q: 'What is a sign-up bonus and how should I factor it in?',
        a: (
          <>
            A sign-up bonus (also called a welcome offer) is a one-time reward earned after meeting
            a minimum spending requirement in the first 3 months. For example, the{' '}
            <Link to="/cards/chase-sapphire-preferred" className="text-blue-600 hover:underline">
              Chase Sapphire Preferred
            </Link>{' '}
            offers 60,000 bonus points after spending $4,000 in 3 months — worth ~$750 in travel.
            CardOptimizer amortizes sign-up bonuses over 2 years in its net annual value calculations,
            giving you an apples-to-apples comparison.
          </>
        ),
        plain:
          "A sign-up bonus is a one-time reward earned after meeting a minimum spending requirement in the first 3 months. CardOptimizer amortizes sign-up bonuses over 2 years in its net annual value calculations, giving you an apples-to-apples comparison between cards.",
      },
      {
        q: 'Which credit card is best for dining?',
        a: (
          <>
            The top cards for dining rewards are typically the{' '}
            <Link to="/cards/amex-gold" className="text-blue-600 hover:underline">
              American Express Gold Card
            </Link>{' '}
            (4x on dining worldwide, 4x on U.S. groceries) and the{' '}
            <Link to="/cards/capital-one-savor-one" className="text-blue-600 hover:underline">
              Capital One SavorOne
            </Link>{' '}
            (3% on dining and entertainment, no annual fee). See the full{' '}
            <Link to="/best-cards/dining" className="text-blue-600 hover:underline">
              best cards for dining
            </Link>{' '}
            ranked by net annual value for your spending level.
          </>
        ),
        plain:
          'The top cards for dining rewards are typically the American Express Gold Card (4x on dining worldwide, 4x on U.S. groceries) and the Capital One SavorOne (3% on dining and entertainment, no annual fee).',
      },
      {
        q: 'Which credit card is best for groceries?',
        a: (
          <>
            Top picks for grocery rewards include the{' '}
            <Link to="/cards/amex-blue-cash-preferred" className="text-blue-600 hover:underline">
              Blue Cash Preferred
            </Link>{' '}
            (6% on U.S. supermarkets up to $6,000/yr, then 1%) and the{' '}
            <Link to="/cards/amex-gold" className="text-blue-600 hover:underline">
              Amex Gold
            </Link>{' '}
            (4x Membership Rewards on U.S. supermarkets). See the{' '}
            <Link to="/best-cards/groceries" className="text-blue-600 hover:underline">
              best cards for groceries
            </Link>{' '}
            guide for a ranked comparison.
          </>
        ),
        plain:
          'Top picks for grocery rewards include the Blue Cash Preferred (6% on U.S. supermarkets up to $6,000/yr) and the Amex Gold (4x on U.S. supermarkets). See the best cards for groceries guide for a ranked comparison.',
      },
    ],
  },
  {
    group: 'Rewards Basics',
    items: [
      {
        q: 'What is the difference between cash back, points, and miles?',
        a: (
          <>
            <strong>Cash back</strong> cards return a percentage of spend as statement credits or
            deposits — simple and flexible. <strong>Points</strong> (like Chase Ultimate Rewards or
            Amex Membership Rewards) can be redeemed for travel, cash, or transferred to airline/hotel
            programs for potentially higher value. <strong>Miles</strong> are tied to specific airlines
            (Delta SkyMiles, United MileagePlus) and are best for booking award flights. Points
            generally offer the best flexibility; miles are best if you're loyal to one airline.
          </>
        ),
        plain:
          'Cash back cards return a percentage of spend as statement credits — simple and flexible. Points (like Chase Ultimate Rewards or Amex Membership Rewards) can be redeemed for travel or transferred to airline programs for higher value. Miles are tied to specific airlines and best for booking award flights.',
      },
      {
        q: 'How does CardOptimizer calculate reward value?',
        a: (
          <>
            CardOptimizer assigns a <strong>point value</strong> to each card's currency (e.g., 1¢
            for cash back, 1.5¢ for Chase Ultimate Rewards, 2¢ for Amex Membership Rewards at
            conservative transfer estimates). It then multiplies your spending in each category by the
            card's reward rate × point value to compute annual rewards. Annual fees are subtracted for
            net annual value. Sign-up bonuses are amortized over 2 years and added.
          </>
        ),
        plain:
          "CardOptimizer assigns a point value to each card's currency and multiplies your spending in each category by the card's reward rate to compute annual rewards. Annual fees are subtracted for net annual value. Sign-up bonuses are amortized over 2 years.",
      },
      {
        q: 'What is a credit card reward rate?',
        a: (
          <>
            A reward rate is the percentage of your spend returned as rewards. A 2% cash back card
            returns $2 for every $100 spent. A card that earns "3x points on dining" where points are
            worth 1.5¢ each effectively gives 4.5% back on dining. CardOptimizer normalizes all reward
            rates to a percentage for easy comparison — no mental math required.
          </>
        ),
        plain:
          "A reward rate is the percentage of your spend returned as rewards. A 2% cash back card returns $2 for every $100 spent. CardOptimizer normalizes all reward rates to a percentage for easy comparison — no mental math required.",
      },
      {
        q: 'What does "net annual value" mean?',
        a: (
          <>
            Net annual value (NAV) is what you actually pocket after paying the annual fee:{' '}
            <em>NAV = annual rewards earned − annual fee + (sign-up bonus ÷ 2)</em>. It's the most
            honest way to compare cards because a card with a $95 fee that earns $400 in rewards
            ($305 NAV) beats a no-fee card that earns $200 ($200 NAV). CardOptimizer uses NAV as the
            primary ranking metric for recommendations.
          </>
        ),
        plain:
          "Net annual value (NAV) is what you actually pocket after paying the annual fee: NAV = annual rewards earned minus annual fee plus sign-up bonus divided by 2. It's the most honest way to compare cards because it accounts for fees and bonuses.",
      },
    ],
  },
]

function AccordionItem({ item, open, onToggle }: {
  item: FaqItem
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 py-4 px-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-900 leading-snug">{item.q}</span>
        <span className="flex-shrink-0 mt-0.5 text-gray-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="text-sm text-gray-600 leading-relaxed pb-4 space-y-2" data-faq-answer>
          {item.a}
        </div>
      )}
    </div>
  )
}

export function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    document.title = 'Credit Card Rewards FAQ — CardOptimizer'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Answers to common questions about credit card rewards, how CardOptimizer works, data privacy, and card strategy. Learn how to maximize your rewards.'
      )
    }

    // Inject FAQPage JSON-LD structured data
    const existing = document.getElementById('faq-jsonld')
    if (existing) existing.remove()

    const allItems: FaqItem[] = FAQ_GROUPS.flatMap(g => g.items)
    const script = document.createElement('script')
    script.id = 'faq-jsonld'
    script.type = 'application/ld+json'
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allItems.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.plain,
        },
      })),
    }
    script.textContent = JSON.stringify(jsonld)
    document.head.appendChild(script)

    return () => {
      document.title = 'Card Optimizer — Maximize Your Rewards'
      const metaDescEl = document.querySelector('meta[name="description"]')
      if (metaDescEl)
        metaDescEl.setAttribute(
          'content',
          'Upload your transactions and discover which credit cards maximize your rewards based on your actual spending patterns.'
        )
      const jsonldEl = document.getElementById('faq-jsonld')
      if (jsonldEl) jsonldEl.remove()
    }
  }, [])

  const totalQuestions = FAQ_GROUPS.reduce((acc, g) => acc + g.items.length, 0)

  return (
    <div className="space-y-8 pb-8" data-faq-page>
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white px-6 py-10 sm:px-10 sm:py-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <HelpCircle size={24} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-blue-100 text-base max-w-md mx-auto leading-relaxed">
          Everything you need to know about credit card rewards and how CardOptimizer works —
          {totalQuestions} questions answered.
        </p>
      </section>

      {/* FAQ Groups */}
      {FAQ_GROUPS.map(group => (
        <section
          key={group.group}
          className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm"
          data-faq-group={group.group}
        >
          <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            {group.group}
          </h2>
          <div>
            {group.items.map((item, idx) => {
              const key = `${group.group}-${idx}`
              return (
                <AccordionItem
                  key={key}
                  item={item}
                  open={!!openItems[key]}
                  onToggle={() => toggle(key)}
                />
              )
            })}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section
        className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-8 text-center space-y-4"
        data-faq-cta
      >
        <h2 className="text-lg font-bold text-gray-900">Ready to optimize your wallet?</h2>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Upload your transactions and see exactly which cards would earn the most rewards for your
          spending.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[44px]"
        >
          Analyze My Spending →
        </Link>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
