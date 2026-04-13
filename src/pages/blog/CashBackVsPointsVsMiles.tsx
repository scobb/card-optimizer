import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function ArticleCTA({ text = 'See which type is best for YOUR spending' }: { text?: string }) {
  return (
    <div className="not-prose my-6 rounded-xl bg-blue-50 border border-blue-200 px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-blue-900 font-medium text-sm text-center sm:text-left">
        Stop guessing — use your real transaction data to find the best reward type for you.
      </p>
      <Link
        to="/upload"
        className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
        data-article-cta
      >
        {text} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

/** Reusable comparison table for reward types */
function RewardTypeTable() {
  const rows = [
    {
      type: 'Cash Back',
      value: '1–6%',
      flexibility: 'Highest',
      complexity: 'Lowest',
      bestFor: 'Simple wallets, no travel plans',
    },
    {
      type: 'Points',
      value: '1–8%*',
      flexibility: 'High',
      complexity: 'Medium',
      bestFor: 'Frequent travelers, high dining/grocery spend',
    },
    {
      type: 'Miles',
      value: '1–5%*',
      flexibility: 'Low',
      complexity: 'High',
      bestFor: 'Loyal flyers, hotel brand devotees',
    },
  ]

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Reward Type', 'Effective Rate', 'Flexibility', 'Complexity', 'Best For'].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.type} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-gray-900">{row.type}</td>
              <td className="px-4 py-3 text-gray-700">{row.value}</td>
              <td className="px-4 py-3 text-gray-700">{row.flexibility}</td>
              <td className="px-4 py-3 text-gray-700">{row.complexity}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{row.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
        * Points and miles rates assume redemption at 1.5–2 cents per point/mile via transfer partners.
        Cash or statement credit redemptions yield rates closer to 1–4%.
      </p>
    </div>
  )
}

/** Per-scenario winner table */
function ScenarioTable() {
  const scenarios = [
    {
      scenario: 'High grocery + dining spend, no travel',
      cashBack: 'Strong (Amex BCP 6% groceries)',
      points: 'Excellent (Amex Gold 4x dining + 4x groceries)',
      miles: 'Poor (low rates on everyday spend)',
      winner: 'Points',
    },
    {
      scenario: 'Frequent domestic flyer',
      cashBack: 'Good (2% everything)',
      points: 'Excellent (3x travel, transfer to airlines)',
      miles: 'Excellent (co-brand perks, upgrades)',
      winner: 'Tie: Points/Miles',
    },
    {
      scenario: 'Simple all-in-one card user',
      cashBack: 'Excellent (2% no-category)',
      points: 'Good (need to track categories)',
      miles: 'Poor (locked to one program)',
      winner: 'Cash Back',
    },
    {
      scenario: 'International traveler',
      cashBack: 'Good (no FX fee cards)',
      points: 'Excellent (transfer to intl partners)',
      miles: 'Good (if right airline alliance)',
      winner: 'Points',
    },
    {
      scenario: 'Loyal to one hotel brand',
      cashBack: 'OK (no hotel perks)',
      points: 'Good (hotel transfer partners)',
      miles: 'Excellent (free nights, status)',
      winner: 'Miles (hotel co-brand)',
    },
  ]

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-gray-200" data-scenario-table>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Scenario', 'Cash Back', 'Points', 'Miles', 'Winner'].map((h) => (
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
          {scenarios.map((row) => (
            <tr key={row.scenario} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900 text-xs font-medium max-w-[140px]">
                {row.scenario}
              </td>
              <td className="px-4 py-3 text-gray-700 text-xs">{row.cashBack}</td>
              <td className="px-4 py-3 text-gray-700 text-xs">{row.points}</td>
              <td className="px-4 py-3 text-gray-700 text-xs">{row.miles}</td>
              <td className="px-4 py-3 text-xs font-semibold text-blue-700">{row.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CashBackVsPointsVsMiles() {
  return (
    <>
      <p>
        Ask ten financial bloggers "should I get a cash back or points card?" and you will get ten
        different answers. Most of them involve cherry-picked redemption examples, aspirational
        travel scenarios, or affiliate commissions that influence which card gets recommended.
      </p>
      <p>
        This guide takes a different approach: pure math, applied to real spending patterns. We will
        quantify each reward type with actual cards from the CardOptimizer database, run through
        five representative spending scenarios, and give you a clear framework for deciding which
        type is right for you — without the fluff.
      </p>

      <ArticleCTA text="Upload my spending to see which type wins for me" />

      <h2>The Three Reward Types: A Plain-English Summary</h2>

      <h3>Cash Back</h3>
      <p>
        Cash back is the simplest reward type: you earn a percentage of every purchase back as
        real money. It posts to your account as a statement credit or direct deposit, and there
        are no redemption charts, expiration dates, or program rules to navigate.
      </p>
      <p>
        The best flat-rate cash back cards today offer 2%: the{' '}
        <Link to="/cards/citi-double-cash">Citi Double Cash</Link> (1% on purchase + 1% on
        payment) and the{' '}
        <Link to="/cards/wells-fargo-active-cash">Wells Fargo Active Cash</Link> (flat 2%). Category
        specialists push higher: the{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> earns 6% on U.S.
        supermarkets and 6% on select streaming, making it one of the highest-rate grocery cards
        on the market.
      </p>
      <p>
        Cash back is worth exactly what it says. One percent cash back = one cent per dollar.
        No conversion needed. This transparency makes cash back the easiest reward type to
        evaluate and compare.
      </p>

      <h3>Points</h3>
      <p>
        Points-based rewards — Chase Ultimate Rewards, Amex Membership Rewards, Capital One
        Miles — earn a currency that can be redeemed in multiple ways. The value of a point
        varies based on how you redeem it:
      </p>
      <ul>
        <li>
          <strong>Statement credit:</strong> typically 0.6–1 cent per point (worst option)
        </li>
        <li>
          <strong>Travel portal booking:</strong> 1–1.5 cents per point (e.g., Chase Sapphire
          Preferred gets 1.25 cents/point in Chase Travel)
        </li>
        <li>
          <strong>Transfer to airline/hotel partners:</strong> 1.5–2.5+ cents per point with
          good redemptions (best option for travelers)
        </li>
      </ul>
      <p>
        The{' '}
        <Link to="/cards/chase-sapphire-preferred">Chase Sapphire Preferred</Link> earns 3x
        Ultimate Rewards on dining. At a conservative 1.5 cents per point, that is 4.5% effective
        cash back on dining — beating most cash back dining cards. The{' '}
        <Link to="/cards/amex-gold">American Express Gold Card</Link> earns 4x Membership Rewards
        on restaurants and U.S. supermarkets. At 1.5 cents/point: 6% effective rate. At 2 cents
        (premium travel): 8% effective rate.
      </p>
      <p>
        The caveat: these elevated valuations only materialize if you redeem for travel. If you
        cash out points as statement credits, most points cards underperform their cash back
        equivalents. The ceiling is higher; the floor is lower.
      </p>

      <h3>Miles</h3>
      <p>
        "Miles" refers to two distinct things. Flexible miles (Capital One Miles, Bilt Points)
        work like transferable points — they can go to multiple airline and hotel partners. Co-brand
        airline miles (Delta SkyMiles, United MileagePlus, Southwest Rapid Rewards) are locked to
        one program.
      </p>
      <p>
        Flexible miles cards like the{' '}
        <Link to="/cards/capital-one-venture-x">Capital One Venture X</Link> earn 2x on everything
        and allow transfers to 15+ travel partners. Co-brand cards trade flexibility for loyalty
        benefits: free checked bags, companion certificates, priority boarding, and upgrade
        opportunities that flexible cards cannot match.
      </p>
      <p>
        The value of airline miles varies wildly by program and redemption. Delta SkyMiles are
        famously poor for aspirational travel. United MileagePlus and American AAdvantage miles
        can be worth 1.5–2 cents in economy but 3–5 cents for business class on partner airlines.
        Hotel points (Marriott, Hilton, Hyatt) range from 0.5 cents (Hilton, poor value) to
        1.5–2.5 cents (Hyatt, excellent value in the right properties).
      </p>

      <h2>Side-by-Side Comparison</h2>
      <RewardTypeTable />

      <h2>Real Card Examples: Doing the Math</h2>
      <p>
        Let us apply actual numbers. Assume a household spending $800/month on dining,
        $500/month on groceries, $300/month on travel, and $900/month on everything else —
        $30,000/year total.
      </p>

      <h3>Scenario A: Single Flat-Rate Cash Back Card</h3>
      <p>
        Using the{' '}
        <Link to="/cards/wells-fargo-active-cash">Wells Fargo Active Cash</Link> (2% everywhere,
        no annual fee):
      </p>
      <ul>
        <li>Dining ($9,600/yr × 2%): $192</li>
        <li>Groceries ($6,000/yr × 2%): $120</li>
        <li>Travel ($3,600/yr × 2%): $72</li>
        <li>Other ($10,800/yr × 2%): $216</li>
        <li>
          <strong>Total: $600/year, zero annual fee, zero complexity</strong>
        </li>
      </ul>
      <p>
        This is the baseline. Simple, predictable, and actually competitive for households that do
        not want to think about category management.
      </p>

      <h3>Scenario B: Category Cash Back Optimization</h3>
      <p>
        Pairing the{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> ($95/yr, 6%
        groceries/streaming) with the{' '}
        <Link to="/cards/wells-fargo-active-cash">Wells Fargo Active Cash</Link> (2% everything else):
      </p>
      <ul>
        <li>Dining ($9,600/yr × 2%): $192</li>
        <li>Groceries ($6,000/yr × 6%): $360</li>
        <li>Travel ($3,600/yr × 2%): $72</li>
        <li>Other ($10,800/yr × 2%): $216</li>
        <li>Annual fee: −$95</li>
        <li>
          <strong>Total: $745/year — $145 more than the single card</strong>
        </li>
      </ul>

      <h3>Scenario C: Points Optimization</h3>
      <p>
        Using the{' '}
        <Link to="/cards/amex-gold">Amex Gold Card</Link> ($250/yr, 4x dining + 4x groceries) and
        the{' '}
        <Link to="/cards/capital-one-venture-x">Capital One Venture X</Link> ($395/yr, 2x everything,
        $300 travel credit, 10,000 annual bonus miles worth ~$100):
      </p>
      <ul>
        <li>
          Dining ($9,600/yr × 4 × 1.5¢): $576 (Amex Gold, points at 1.5¢)
        </li>
        <li>
          Groceries ($6,000/yr × 4 × 1.5¢): $360 (Amex Gold)
        </li>
        <li>
          Travel ($3,600/yr × 2 × 1.5¢): $108 (Venture X)
        </li>
        <li>
          Other ($10,800/yr × 2 × 1.5¢): $324 (Venture X)
        </li>
        <li>
          Venture X credits (travel credit $300 + bonus miles $100): +$400
        </li>
        <li>Annual fees: −$645</li>
        <li>
          <strong>Total: $1,123/year — $378 more than flat cash back</strong>
        </li>
      </ul>
      <p>
        The points scenario wins by a wide margin — but requires using $300 in travel credits
        and valuing points at 1.5 cents. If you only redeem for statement credits (0.6 cents/point),
        the math flips and points lose to cash back.
      </p>

      <ArticleCTA text="Calculate my actual reward total" />

      <h2>When Cash Back Wins</h2>
      <p>
        Cash back is the best choice in these situations:
      </p>
      <ul>
        <li>
          <strong>You do not travel.</strong> If you have no use for airline miles or hotel points,
          points cards offer no advantage over their cash equivalents. A points card redeemed for
          statement credits is almost always worse than a dedicated cash back card.
        </li>
        <li>
          <strong>You want simplicity.</strong> One 2% card eliminates all decisions about which
          card to use where. For people who value mental bandwidth over maximum optimization,
          cash back wins.
        </li>
        <li>
          <strong>Your spending is diffuse.</strong> If you spread spending evenly across many
          categories with no dominant one, category-bonus cards offer less lift. A flat 2% card
          captures the same rate everywhere.
        </li>
        <li>
          <strong>Your top category is already served by a no-fee cash back card.</strong> The{' '}
          <Link to="/cards/amex-blue-cash-everyday">Amex Blue Cash Everyday</Link> earns 3% at
          U.S. supermarkets with no annual fee. For households spending under $250/month on
          groceries, this outperforms many points alternatives after fee accounting.
        </li>
      </ul>

      <h2>When Points Win</h2>
      <p>
        Flexible points outperform cash back when:
      </p>
      <ul>
        <li>
          <strong>You travel at least 2–3 times per year</strong> and can use transfer partner
          redemptions. The gap between 1 cent (cash) and 1.5–2 cents (transfer partners) multiplies
          quickly at high earning rates.
        </li>
        <li>
          <strong>Your dominant spending is dining or groceries.</strong> The{' '}
          <Link to="/cards/amex-gold">Amex Gold</Link>'s 4x on dining and groceries produces
          6–8% effective rates with good redemptions — rates no cash back card matches in those
          categories. See our{' '}
          <Link to="/best-cards/dining">best cards for dining</Link> and{' '}
          <Link to="/best-cards/groceries">best cards for groceries</Link> guides.
        </li>
        <li>
          <strong>You can use premium card credits.</strong> Cards like the{' '}
          <Link to="/cards/amex-platinum">Amex Platinum</Link> ($695 fee) or Capital One Venture X
          ($395 fee) justify their fees through credits and perks — turning a high-fee card into
          a high-value card for the right user.
        </li>
        <li>
          <strong>You want one currency for both everyday and travel spending.</strong> Ultimate
          Rewards and Membership Rewards earned on grocery purchases can fund business-class flights.
          That cross-category flexibility is unique to points programs.
        </li>
      </ul>

      <h2>When Miles Win</h2>
      <p>
        Co-brand airline and hotel miles win in specific situations:
      </p>
      <ul>
        <li>
          <strong>You fly one airline frequently and value checked bags + upgrades.</strong> The
          Delta SkyMiles Platinum's free checked bags save $35–$70 per round trip — that alone can
          exceed a points card's value for frequent domestic travelers.
        </li>
        <li>
          <strong>You stay at one hotel chain regularly and want elite status.</strong> Marriott
          Bonvoy, World of Hyatt, and Hilton Honors cards accelerate elite qualification and offer
          free anniversary night certificates that can be worth $100–$400 per year.
        </li>
        <li>
          <strong>You want business or first-class flights at coach prices.</strong> The best mile
          redemptions are partner awards for premium cabin seats. United MileagePlus miles used to
          book ANA business class, for example, can yield 6–10 cents per mile in value. No cash
          back card comes close to this ceiling.
        </li>
      </ul>
      <p>
        The key caveat: co-brand miles are illiquid. If your travel patterns change, stranded miles
        in an airline program you no longer use are nearly worthless. Flexible points (transferable
        to multiple programs) are safer for most people.
      </p>

      <h2>The Scenario Decision Matrix</h2>
      <ScenarioTable />

      <h2>The Biggest Mistake: Optimizing for the Wrong Variable</h2>
      <p>
        Most people choose a reward type based on marketing — flashy sign-up bonuses, glamorous
        travel imagery, or influencer endorsements. The correct variable to optimize is:
      </p>
      <p>
        <strong>Your actual annual reward value, net of fees, based on your real spending.</strong>
      </p>
      <p>
        A $600 cash back return beats a $400 points return every time, regardless of whether the
        points came from a "premium" card. A $1,200 points return beats $600 cash back, regardless
        of how simple the latter is to manage. The math does not care about branding.
      </p>
      <p>
        CardOptimizer calculates this number for every card in its database against your actual
        transaction data. You do not have to estimate — you can see exact projections for each
        reward type within minutes of uploading your CSV.
      </p>

      <ArticleCTA text="See which reward type earns me the most" />

      <h2>A Simple Decision Framework</h2>
      <p>
        If you want to cut through the analysis and make a quick decision, use this framework:
      </p>
      <ol>
        <li>
          <strong>Do you travel 3+ times per year and would use transfer partners?</strong> Yes →
          Points or flexible miles are likely best. No → Cash back is probably fine.
        </li>
        <li>
          <strong>Is dining or groceries your largest monthly spend?</strong> Yes → A points card
          (Amex Gold, Chase Sapphire Preferred) likely outperforms cash back in those categories.
          No → A flat 2% cash back card is simpler and often competitive.
        </li>
        <li>
          <strong>Are you loyal to one airline or hotel chain?</strong> Yes → A co-brand card adds
          benefits (free bags, status, certificates) that points cards cannot replicate. No → Avoid
          locking your rewards into one program.
        </li>
        <li>
          <strong>Do you want one card, not a wallet?</strong> Yes → Flat 2% cash back. Simple,
          effective, and hard to beat at its own game.
        </li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>
        There is no universally best reward type. Cash back wins for simplicity and moderate
        spenders. Points win for travelers who can use transfer partners at higher valuations.
        Miles win for loyal airline and hotel customers who value program-specific benefits.
      </p>
      <p>
        The real answer — the one that tells you exactly which type adds the most value for your
        household — requires your actual spending data. CardOptimizer runs the full analysis in
        your browser, privately, in under two minutes.
      </p>

      <ArticleCTA text="Find my best reward type" />

      {/* Related content */}
      <div className="not-prose mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-base font-bold text-gray-900 mb-3">Related guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              to: '/blog/how-to-choose-best-credit-card',
              label: 'How to choose the best credit card',
            },
            { to: '/best-cards/dining', label: 'Best cards for dining' },
            { to: '/best-cards/groceries', label: 'Best cards for groceries' },
            { to: '/best-cards/travel', label: 'Best cards for travel' },
            {
              to: '/compare/chase-sapphire-preferred-vs-amex-gold',
              label: 'Chase Sapphire Preferred vs Amex Gold',
            },
            { to: '/catalog', label: 'Browse all 20+ cards' },
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
