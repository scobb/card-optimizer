import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function ArticleCTA({ text = 'Find your optimal wallet' }: { text?: string }) {
  return (
    <div className="not-prose my-6 rounded-xl bg-blue-50 border border-blue-200 px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-blue-900 font-medium text-sm text-center sm:text-left">
        Use your real spending data to see if annual-fee cards pay off for you.
      </p>
      <Link
        to="/builder"
        className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
        data-article-cta
      >
        {text} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

interface BreakEvenRow {
  card: string
  cardId: string
  annualFee: number
  topCategory: string
  topRate: number
  noFeeAlt: string
  noFeeAltId: string
  noFeeRate: number
  incrementalRate: number
  breakEvenMonthly: number
  breakEvenAnnual: number
}

const BREAK_EVEN_CARDS: BreakEvenRow[] = [
  {
    card: 'Chase Sapphire Preferred',
    cardId: 'chase-sapphire-preferred',
    annualFee: 95,
    topCategory: 'Dining',
    topRate: 3,
    noFeeAlt: 'Capital One SavorOne',
    noFeeAltId: 'capital-one-savor-one',
    noFeeRate: 3,
    incrementalRate: 1.5, // portal multiplier + transfer partners
    breakEvenMonthly: Math.round(95 / 0.015 / 12),
    breakEvenAnnual: Math.round(95 / 0.015),
  },
  {
    card: 'Amex Gold Card',
    cardId: 'amex-gold',
    annualFee: 250,
    topCategory: 'Dining + Groceries',
    topRate: 4,
    noFeeAlt: 'Amex Blue Cash Everyday',
    noFeeAltId: 'amex-blue-cash-everyday',
    noFeeRate: 3,
    incrementalRate: 1, // 4x vs 3% = 1 pp incremental at 1x value
    breakEvenMonthly: Math.round(250 / 0.01 / 12),
    breakEvenAnnual: Math.round(250 / 0.01),
  },
  {
    card: 'Amex Blue Cash Preferred',
    cardId: 'amex-blue-cash-preferred',
    annualFee: 95,
    topCategory: 'U.S. Supermarkets',
    topRate: 6,
    noFeeAlt: 'Amex Blue Cash Everyday',
    noFeeAltId: 'amex-blue-cash-everyday',
    noFeeRate: 3,
    incrementalRate: 3,
    breakEvenMonthly: Math.round(95 / 0.03 / 12),
    breakEvenAnnual: Math.round(95 / 0.03),
  },
  {
    card: 'Capital One Venture X',
    cardId: 'capital-one-venture-x',
    annualFee: 395,
    topCategory: 'Travel (portal)',
    topRate: 10,
    noFeeAlt: 'Capital One Venture',
    noFeeAltId: 'capital-one-venture',
    noFeeRate: 5,
    incrementalRate: 5,
    breakEvenMonthly: Math.round((395 - 400) / 0.05 / 12), // $300 credit + $100 miles = $400 value
    breakEvenAnnual: 0, // credits cover the fee
  },
  {
    card: 'Chase Sapphire Reserve',
    cardId: 'chase-sapphire-reserve',
    annualFee: 550,
    topCategory: 'Travel + Dining',
    topRate: 3,
    noFeeAlt: 'Chase Sapphire Preferred',
    noFeeAltId: 'chase-sapphire-preferred',
    noFeeRate: 3,
    incrementalRate: 1, // 1.5x portal vs 1.25x + lounge + $300 credit
    breakEvenMonthly: Math.round((550 - 300) / 0.01 / 12), // $300 travel credit offsets most
    breakEvenAnnual: Math.round((550 - 300) / 0.01),
  },
]

function BreakEvenTable() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-gray-200" data-break-even-table>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {[
              'Card',
              'Annual Fee',
              'Top Rate',
              'Best No-Fee Alt',
              'Alt Rate',
              'Incremental',
              'Break-Even/Mo',
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {BREAK_EVEN_CARDS.map((row) => (
            <tr key={row.card} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                <Link to={`/cards/${row.cardId}`} className="text-blue-700 hover:underline">
                  {row.card}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-700">${row.annualFee}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                {row.topRate}× ({row.topCategory})
              </td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                <Link to={`/cards/${row.noFeeAltId}`} className="text-blue-700 hover:underline">
                  {row.noFeeAlt}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.noFeeRate}%</td>
              <td className="px-4 py-3 text-gray-700">
                {row.incrementalRate > 0 ? `+${row.incrementalRate}%` : '—'}
              </td>
              <td className="px-4 py-3 font-semibold text-blue-700">
                {row.breakEvenAnnual <= 0
                  ? 'Credits cover fee'
                  : `$${row.breakEvenMonthly.toLocaleString()}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
        Break-even monthly spend = Annual fee ÷ incremental rate ÷ 12. Credits (travel, dining) reduce the effective fee before calculating.
      </p>
    </div>
  )
}

export function AnnualFeeWorthIt() {
  return (
    <>
      <p>
        The words "annual fee" make most people instinctively reach for the no-fee alternative.
        That instinct costs money. Some of the highest-value credit cards in existence charge
        $95–$695 per year — and for the right spender, they return two to five times that amount
        in rewards.
      </p>
      <p>
        The question is never "is the fee too high?" The correct question is: "does this card earn
        enough extra rewards to more than cover the fee?" That is a math problem, not a preference.
        This article walks through the break-even calculation for five popular annual-fee cards and
        shows you exactly how much you need to spend in each category for the fee to make sense.
      </p>

      <ArticleCTA text="Find my optimal wallet" />

      <h2>The Break-Even Framework</h2>
      <p>
        The break-even calculation is straightforward:
      </p>
      <ol>
        <li>
          <strong>Find the best no-annual-fee alternative</strong> for your spending pattern.
          This is your baseline.
        </li>
        <li>
          <strong>Calculate the incremental rate</strong>: how much more does the premium card earn
          per dollar in its best category, compared to the no-fee baseline?
        </li>
        <li>
          <strong>Subtract the value of any included credits</strong> from the annual fee to get the
          effective fee. A card with a $395 fee and a $300 travel credit has an effective fee of
          $95 — if you use the credit.
        </li>
        <li>
          <strong>Divide the effective fee by the incremental rate</strong> to get the break-even
          annual spend in that category.
        </li>
      </ol>
      <p>
        Formula: Break-even annual spend = Effective fee ÷ Incremental rate
      </p>
      <p>
        Example: A card with a $95 fee earning 6% on groceries versus a no-fee alternative at 3%
        has an incremental rate of 3%. Break-even: $95 ÷ 3% = $3,167/year, or $264/month in
        grocery spending. Spend more than that, and the premium card wins.
      </p>

      <h2>Break-Even Table: Five Popular Annual-Fee Cards</h2>
      <BreakEvenTable />

      <h2>Card-by-Card Analysis</h2>

      <h3>Chase Sapphire Preferred ($95/year)</h3>
      <p>
        The <Link to="/cards/chase-sapphire-preferred">Chase Sapphire Preferred</Link> is the most
        popular entry-level travel card for good reason. It earns 3x Ultimate Rewards on dining
        and online groceries, 2x on all other travel, and comes with a $50 annual hotel credit
        through Chase Travel.
      </p>
      <p>
        The best no-annual-fee comparison for dining is the{' '}
        <Link to="/cards/capital-one-savor-one">Capital One SavorOne</Link> at 3% cash back on
        dining and entertainment (no fee). In raw cash back terms, both earn the same rate on
        dining. The Sapphire Preferred's advantage is in the redemption: Ultimate Rewards points
        can be transferred to partners like Hyatt, United, and Southwest, where values of 1.5–2
        cents per point turn that 3x into 4.5–6% effective rates.
      </p>
      <p>
        For the Sapphire Preferred fee to pay off purely through the dining bonus over the SavorOne,
        you need to actually realize the higher point value through travel redemptions. If you only
        redeem for cash back, the SavorOne is free and equivalent. The $50 hotel credit reduces
        the effective fee to $45 for those who use it.
      </p>
      <p>
        <strong>Verdict:</strong> Worth it if you travel 2+ times per year and will use transfer
        partners. Questionable for pure cash-back seekers who can get the same dining rate for free.
      </p>

      <h3>American Express Gold Card ($250/year)</h3>
      <p>
        The <Link to="/cards/amex-gold">Amex Gold Card</Link> earns 4x Membership Rewards on
        dining and U.S. supermarkets — rates that no no-annual-fee card matches. It also includes
        up to $120/year in dining credits ($10/month at Grubhub, Cheesecake Factory, Goldbelly,
        and other partners) and $120/year in Uber Cash.
      </p>
      <p>
        With credits fully used, the effective fee drops to $10/year. At that effective fee, the
        break-even is trivially low — any household spending $50/month on dining or groceries
        more than covers it. The challenge: many cardholders do not fully use the credits,
        especially the $10/month Grubhub allotment which requires an enrolled account and
        qualifying purchase each month.
      </p>
      <p>
        Compared against the no-fee{' '}
        <Link to="/cards/amex-blue-cash-everyday">Amex Blue Cash Everyday</Link> (3% at U.S.
        supermarkets, no fee), the Amex Gold earns an extra 1 point per dollar on groceries —
        worth roughly 1.5 cents at typical redemption rates. Break-even without credits: $250 ÷
        1.5% = $16,667/year in grocery spending, or $1,389/month. That is a high bar. With full
        credit usage reducing the effective fee to $10, the math reverses: $10 ÷ 1.5% = $667/year
        in grocery spending, easily met by most households.
      </p>
      <p>
        <strong>Verdict:</strong> Excellent value if you use both credit allotments every month.
        Poor value if credits go unused — the base fee is genuinely high for those not maximizing it.
      </p>

      <ArticleCTA text="See how Amex Gold performs for my spending" />

      <h3>Amex Blue Cash Preferred ($95/year)</h3>
      <p>
        The <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> earns 6%
        on U.S. supermarkets (up to $6,000/year) and 6% on select streaming services. No other
        mainstream card earns 6% cash back on groceries. The fee is waived in the first year.
      </p>
      <p>
        Compared against the no-fee{' '}
        <Link to="/cards/amex-blue-cash-everyday">Amex Blue Cash Everyday</Link> (3% supermarkets),
        the incremental rate is 3%. Break-even: $95 ÷ 3% = $3,167/year in supermarket spending,
        or $264/month. The average U.S. household spends approximately $400–$500/month on groceries
        — well above break-even for most families.
      </p>
      <p>
        The streaming bonus (6% on Netflix, Spotify, Hulu, and others, up to $6,000/year combined
        with groceries) adds additional value. A household with $50/month in streaming and $400/month
        in groceries earns approximately $540/year at 6% — a $445/year net after the $95 fee,
        compared to $270/year on the no-fee Everyday card. The premium card earns $175/year more.
      </p>
      <p>
        Note: The 6% grocery rate is capped at $6,000/year ($500/month). Above that cap, both the
        Preferred and Everyday cards revert to 1%. Very high grocery spenders may hit this cap
        and need a second card for overflow spending.
      </p>
      <p>
        <strong>Verdict:</strong> One of the clearest "yes" cases in all of credit card optimization.
        Most households with meaningful grocery spending will earn significantly more than the $95
        fee. Often the single best value in the market for supermarket spending.
      </p>

      <h3>Capital One Venture X ($395/year)</h3>
      <p>
        The{' '}
        <Link to="/cards/capital-one-venture-x">Capital One Venture X</Link> includes a $300
        annual travel credit (applied automatically to Capital One Travel bookings), 10,000 bonus
        miles on each card anniversary (worth approximately $100), and Priority Pass lounge
        access for you and authorized users.
      </p>
      <p>
        The credits alone — $300 travel + $100 anniversary miles — total $400 in value, exceeding
        the $395 annual fee before you earn a single reward mile. For any traveler who books at
        least $300 in flights or hotels per year, the Venture X is effectively a free card.
      </p>
      <p>
        Compared against the standard{' '}
        <Link to="/cards/capital-one-venture">Capital One Venture</Link> ($95/year, 2x everywhere,
        no lounge access, no $300 credit), the Venture X costs $300 more annually but provides
        $400 in credits and lounge access valued at $400+/year for heavy travelers. For travelers
        who use lounges even occasionally, the Venture X is the better value despite the higher
        nominal fee.
      </p>
      <p>
        <strong>Verdict:</strong> Exceptional value for regular travelers who will book at least
        $300 through Capital One Travel. The credits make this a net-positive fee card before
        any earning is considered.
      </p>

      <h3>Chase Sapphire Reserve ($550/year)</h3>
      <p>
        The{' '}
        <Link to="/cards/chase-sapphire-reserve">Chase Sapphire Reserve</Link> includes a $300
        annual travel credit (applied automatically to any travel purchase), Priority Pass lounge
        access, 3x on travel and dining, and 1.5x redemption value through Chase Travel (versus
        1.25x on the Sapphire Preferred).
      </p>
      <p>
        After the $300 travel credit, the effective fee is $250. The incremental advantage over
        the $95 Sapphire Preferred is the higher travel portal multiplier and lounge access. The
        1.5x vs 1.25x portal difference adds approximately 0.25 cents per point — meaningful for
        high-volume travel spenders but modest for most.
      </p>
      <p>
        Break-even versus the Sapphire Preferred (after accounting for the $300 credit on both
        versions): the Reserve costs $155/year more in effective fees. At 0.25 cents incremental
        per point on travel spending: $155 ÷ 0.25% = $62,000/year in travel spending to justify
        the upgrade on points value alone. Lounge access changes this calculus dramatically for
        frequent flyers — Priority Pass is worth $400–$600/year to travelers who use it heavily.
      </p>
      <p>
        <strong>Verdict:</strong> Worth it for travelers flying 20+ times per year who use the
        lounge access regularly. The $300 credit keeps the effective fee reasonable, but the
        upgrade from Sapphire Preferred requires significant travel volume to justify on points
        math alone.
      </p>

      <ArticleCTA text="Calculate which cards pay off for my spending" />

      <h2>The Hidden Cost of the Wrong No-Fee Card</h2>
      <p>
        Annual fees get attention because they are explicit costs. The implicit cost — using the
        wrong no-fee card — is invisible and often larger. A household earning 1% on $40,000 in
        annual card spending with a basic rewards card is leaving $400–$800/year on the table
        compared to a well-chosen card strategy.
      </p>
      <p>
        The question is not "free versus fee." The question is: which combination of cards
        maximizes net annual rewards for my spending? Sometimes that includes a $95 fee card.
        Sometimes it includes a $250 fee card. Sometimes the optimal answer is entirely no-fee.
        It depends entirely on where you spend your money.
      </p>

      <h2>When to Avoid Annual-Fee Cards</h2>
      <p>
        Annual-fee cards are the wrong choice when:
      </p>
      <ul>
        <li>
          <strong>You will not hit break-even spending.</strong> If you spend $150/month on
          groceries, the Amex Blue Cash Preferred's $95 fee makes no sense — you would earn only
          $27 more per year than the free Everyday card.
        </li>
        <li>
          <strong>You will not use the credits.</strong> An Amex Gold with $250 in credits you
          never redeem is a $250 annual fee card with no offsetting benefit. Credits only count
          if you actually collect them.
        </li>
        <li>
          <strong>You are consolidating to one simple card.</strong> A flat 2% no-fee card is an
          entirely legitimate strategy. Simplicity has real value. A{' '}
          <Link to="/cards/citi-double-cash">Citi Double Cash</Link> or{' '}
          <Link to="/cards/wells-fargo-active-cash">Wells Fargo Active Cash</Link> requires zero
          category tracking and zero annual fee math.
        </li>
        <li>
          <strong>You are new to credit cards and building credit.</strong> No-fee cards eliminate
          the risk of forgetting a fee and the temptation to overspend to "earn the fee back."
          Build good habits first.
        </li>
      </ul>

      <h2>Maximizing Annual-Fee Card Value</h2>
      <p>
        If you decide an annual-fee card makes sense for your spending, maximize it:
      </p>
      <ul>
        <li>
          <strong>Set up credit reminders for monthly credits.</strong> The Amex Gold's $10/month
          dining credit requires you to actually purchase something each month. Calendar reminders
          prevent forgetting.
        </li>
        <li>
          <strong>Always book travel through the portal to unlock credits.</strong> The Venture X
          $300 credit and Sapphire Reserve $300 credit are automatic on portal bookings — the
          simplest way to capture value.
        </li>
        <li>
          <strong>Evaluate annually.</strong> Spending patterns change. A card that was worth its
          fee when you were commuting may no longer justify the cost after moving closer to work.
          Reassess each year at renewal.
        </li>
        <li>
          <strong>Call to waive fees or downgrade.</strong> If a card is marginal, call and ask.
          Retention offers (bonus points, fee waiver) are common for cards on the bubble. If
          no offer is made, downgrade to a no-fee version rather than canceling — canceling can
          impact credit history.
        </li>
      </ul>

      <h2>Use the Wallet Builder to Find Your Optimal Mix</h2>
      <p>
        Reading this analysis is useful, but the only number that matters is yours. CardOptimizer's
        wallet builder evaluates every card in its database — fee and no-fee — against your actual
        spending data. Upload your transaction history once, and the builder instantly shows you
        the optimal 2–4 card combination, with and without annual fees, ranked by net annual value.
      </p>
      <p>
        You will see exactly which annual-fee cards pay off for your household, by how much, and
        whether a free alternative comes close enough to make simplicity the better choice.
      </p>

      <ArticleCTA text="Find my optimal wallet combination" />

      {/* Related content */}
      <div className="not-prose mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-base font-bold text-gray-900 mb-3">Related guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { to: '/blog/how-to-choose-best-credit-card', label: 'How to choose the best credit card' },
            { to: '/blog/cash-back-vs-points-vs-miles', label: 'Cash back vs points vs miles' },
            { to: '/cards/amex-blue-cash-preferred', label: 'Amex Blue Cash Preferred review' },
            { to: '/cards/amex-gold', label: 'American Express Gold Card review' },
            { to: '/compare/chase-sapphire-preferred-vs-chase-sapphire-reserve', label: 'Sapphire Preferred vs Sapphire Reserve' },
            { to: '/builder', label: 'Find my optimal wallet combination' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <ArrowRight size={12} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
