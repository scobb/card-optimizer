import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/** Inline CTA component reused throughout the article */
function ArticleCTA({ text = 'Try it with your spending' }: { text?: string }) {
  return (
    <div className="not-prose my-6 rounded-xl bg-blue-50 border border-blue-200 px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-blue-900 font-medium text-sm text-center sm:text-left">
        Stop guessing — use your real transaction data.
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

export function HowToChooseBestCreditCard() {
  return (
    <>
      <p>
        Choosing the right credit card is one of the highest-return personal finance decisions you
        can make. A well-matched card can return $500–$1,500 per year in rewards on spending you
        were already doing. A poorly matched card — or a wallet full of the wrong cards — can cost
        you that same amount in missed rewards and unnecessary annual fees.
      </p>
      <p>
        The problem: the credit card industry is deliberately confusing. Banks spend billions on
        marketing designed to make every card look like the best option. Annual fee cards are
        dressed up with flashy travel benefits. Cash back cards bury the real rates in footnotes.
        Sign-up bonuses inflate first-year value numbers to make mediocre long-term cards look
        great.
      </p>
      <p>
        This guide cuts through the noise with math. By the end, you will know exactly how to
        evaluate any credit card against your actual spending pattern, how to calculate whether an
        annual fee is worth it, and how to build a wallet that systematically captures the highest
        reward rate in every spending category.
      </p>

      <ArticleCTA text="Analyze my spending" />

      <h2>Understanding the Three Types of Credit Card Rewards</h2>
      <p>
        Before you can choose the best card, you need to understand what you are comparing. Credit
        card rewards come in three flavors, and the differences matter more than most people realize.
      </p>

      <h3>Cash Back: Simple, Predictable, No Traps</h3>
      <p>
        Cash back rewards are straightforward: every dollar you spend earns a percentage back as
        cash. A 2% cash back card earns two cents per dollar, period. No award charts, no transfer
        partners, no expiring points. You can think of cash back as a permanent, automatic discount
        on every purchase.
      </p>
      <p>
        The best flat-rate cash back cards today offer 1.5–2% on all purchases. The{' '}
        <Link to="/cards/citi-double-cash">Citi Double Cash</Link> effectively earns 2% (1% on
        purchase, 1% on payment). The{' '}
        <Link to="/cards/wells-fargo-active-cash">Wells Fargo Active Cash</Link> earns a flat 2%
        with no categories. These cards work best as a "catch-all" for spending that does not fall
        into any bonus category.
      </p>
      <p>
        Category-based cash back cards earn higher rates in specific areas. The{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> earns 6% on U.S.
        supermarkets (up to $6,000/year) and 6% on streaming services. The{' '}
        <Link to="/cards/chase-freedom-flex">Chase Freedom Flex</Link> earns 5% in rotating
        quarterly categories. These cards reward concentrated spending but require tracking categories.
      </p>

      <h3>Points: Higher Ceiling, Higher Complexity</h3>
      <p>
        Points-based cards (Chase Ultimate Rewards, Amex Membership Rewards, Capital One Miles)
        earn a currency that can be redeemed in multiple ways: travel portals, statement credits,
        transfer partners. The value of a "point" varies widely depending on how you redeem.
      </p>
      <p>
        A Chase Ultimate Rewards point is worth 1 cent as cash back, 1.25 cents through the Chase
        travel portal (with Sapphire Preferred), or potentially 2+ cents when transferred to
        partners like Hyatt or United and redeemed for premium travel. This variability is both the
        opportunity and the trap: if you only redeem for cash, a points card may underperform a
        simple cash back card.
      </p>
      <p>
        The{' '}
        <Link to="/cards/chase-sapphire-preferred">Chase Sapphire Preferred</Link> earns 3x on
        dining and 2x on travel. The{' '}
        <Link to="/cards/amex-gold">American Express Gold Card</Link> earns 4x on restaurants and
        4x at U.S. supermarkets. If you regularly redeem points for premium travel, these rates
        translate to effective cash back rates of 4–8%.
      </p>

      <h3>Miles: Best for Frequent Travelers, Tricky for Everyone Else</h3>
      <p>
        Airline and hotel co-branded cards (Delta SkyMiles, United MileagePlus, Marriott Bonvoy)
        earn miles or points redeemable only within that program. The value depends entirely on
        your travel patterns. If you fly Delta frequently, the Delta SkyMiles Platinum card can
        offer excellent value through free checked bags, companion certificates, and upgrade
        priority. If you fly multiple airlines, a flexible travel card like the{' '}
        <Link to="/cards/capital-one-venture-x">Capital One Venture X</Link> gives you more
        redemption freedom.
      </p>
      <p>
        For most people who do not have strong loyalty to one airline or hotel chain, flexible
        points cards offer better overall value than co-branded miles cards.
      </p>

      <h2>The Annual Fee Math: When Premium Cards Pay Off</h2>
      <p>
        Annual fee cards get a bad reputation for being expensive, but the math often works in their
        favor. A card with a $95 annual fee is not expensive if it earns you an extra $300 per year
        compared to a no-fee alternative. The question is always: does this card earn enough extra
        rewards to justify the cost?
      </p>

      <h3>How to Calculate Break-Even</h3>
      <p>
        The break-even calculation is simple. Find the incremental value the premium card adds over
        your best no-fee alternative, then see if your actual spending produces that much extra
        value.
      </p>
      <p>
        Formula: Annual fee ÷ (Premium rate − Base rate) = Break-even annual spend in that category
      </p>
      <p>
        Example: The{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> charges $95/year
        and earns 6% on U.S. supermarkets. The best no-fee alternative earns 2%. The incremental
        rate is 4 percentage points. Break-even: $95 ÷ 0.04 = $2,375 per year in grocery spending,
        or about $198 per month. If you spend more than $198/month at supermarkets, the card pays
        for itself. The average U.S. household spends $412/month on groceries — well above
        break-even.
      </p>

      <h3>Chase Sapphire Preferred: $95 Fee Case Study</h3>
      <p>
        The <Link to="/cards/chase-sapphire-preferred">Chase Sapphire Preferred</Link> charges $95
        per year and earns 3x on dining, 3x on online grocery, 2x on travel, and 1x elsewhere. The
        best no-fee dining card earns about 3% (Chase Freedom Flex in dining quarters). The
        Sapphire Preferred&apos;s primary advantage is the 1.25× travel portal multiplier and
        transfer partner access.
      </p>
      <p>
        If you spend $500/month on dining and $200/month on travel, and you redeem points at
        1.5–2 cents each through transfer partners, the annual value is approximately $300–$400 —
        easily covering the $95 fee with $200–$300 left over.
      </p>

      <h3>Amex Platinum: $695 Fee Case Study</h3>
      <p>
        The{' '}
        <Link to="/cards/amex-platinum">Amex Platinum</Link> has a $695 annual fee that generates
        sticker shock but includes $200 airline fee credit, $200 hotel credit, $240 digital
        entertainment credit, $155 Walmart+ credit, and lounge access valued at $400+ for frequent
        travelers. If you use all the credits, the effective fee is closer to $0–$100 — and the
        5x on flights and hotels adds significant value for heavy travelers.
      </p>
      <p>
        The Platinum is a case where the card&apos;s value is heavily dependent on your lifestyle.
        If you do not travel frequently and will not use the credits, you are paying $695 for very
        little. If you travel 6+ times per year, it can be one of the highest-value cards in
        existence.
      </p>

      <ArticleCTA text="See which annual fee cards pay off for my spending" />

      <h2>Sign-Up Bonus Strategy: The First-Year Math</h2>
      <p>
        Sign-up bonuses are the most significant driver of first-year card value. The Chase
        Sapphire Preferred often offers 60,000 points after $4,000 in spending in the first three
        months — worth $750 through the Chase travel portal or up to $1,200 with transfer partners.
        That is an 18.75% return on $4,000 of spending, just from the sign-up bonus.
      </p>

      <h3>Amortizing Bonuses Over Two Years</h3>
      <p>
        When comparing cards, it is tempting to include the full sign-up bonus in year-one value.
        But sign-up bonuses are a one-time event. To fairly compare cards on long-term value,
        amortize the bonus over two years: add half the bonus value to year one and half to year
        two. This prevents cards with huge bonuses but mediocre ongoing rates from looking better
        than they are.
      </p>
      <p>
        Example: 60,000 Chase points valued at 1.5 cents each = $900 bonus. Amortized over 2
        years: $450/year. Add that to the ongoing category earnings, and you get a more accurate
        picture of two-year total value.
      </p>

      <h3>Minimum Spend Requirements and Timing</h3>
      <p>
        Most premium cards require $3,000–$6,000 in spending within the first 3 months to earn the
        sign-up bonus. This is usually achievable for households that use credit cards for most
        purchases, but you should time applications around large planned purchases (home
        improvement, travel, holiday shopping) to hit the threshold comfortably without changing
        your spending behavior.
      </p>
      <p>
        Never spend money you would not otherwise spend just to earn a sign-up bonus. The math
        never works: even a $1,000 bonus does not justify $5,000 in unnecessary spending.
      </p>

      <h2>Category-Based Spending Analysis: The Core Method</h2>
      <p>
        The most important factor in choosing a credit card is matching reward rates to where you
        actually spend money. The average American household spends money very differently from
        the "typical" example used in card marketing materials.
      </p>
      <p>
        To optimize your wallet, you need your actual spending breakdown — not an estimate. This is
        why CardOptimizer asks you to upload a CSV from your bank or budgeting app. With real data,
        the recommendations are precise. Without it, they are guesses.
      </p>

      <ArticleCTA text="Upload my transactions" />

      <h3>Dining and Restaurants</h3>
      <p>
        Dining is one of the highest-value categories because multiple cards compete aggressively
        for it. Top rates include 4x Amex Membership Rewards points on the{' '}
        <Link to="/cards/amex-gold">Amex Gold Card</Link> (worth 4–8% depending on redemption),
        3x Chase Ultimate Rewards on the{' '}
        <Link to="/cards/chase-sapphire-preferred">Chase Sapphire Preferred</Link>, and 3% cash
        back on the Capital One SavorOne (no annual fee).
      </p>
      <p>
        If you spend $800/month on dining, the difference between a 1.5% flat-rate card and the
        Amex Gold (at 4x worth 6%) is $3,456/year in lost rewards. Dining is typically the highest
        ROI category to optimize. See our{' '}
        <Link to="/best-cards/dining">best cards for dining guide</Link> for a ranked comparison.
      </p>

      <h3>Groceries and Supermarkets</h3>
      <p>
        Grocery spending is high-volume and predictable, making it ideal for category optimization.
        The standout is the{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> at 6% on U.S.
        supermarkets (up to $6,000/year). The{' '}
        <Link to="/cards/amex-gold">Amex Gold</Link> earns 4x at U.S. supermarkets. For those who
        want no annual fee, the{' '}
        <Link to="/cards/amex-blue-cash-everyday">Amex Blue Cash Everyday</Link> earns 3% at U.S.
        supermarkets on up to $6,000/year.
      </p>
      <p>
        Note that most cards define "supermarkets" as standalone grocery stores. Warehouse clubs
        (Costco, Sam&apos;s Club) and superstores (Walmart, Target) typically do not qualify for
        grocery category bonuses. See our{' '}
        <Link to="/best-cards/groceries">best cards for groceries guide</Link> for details.
      </p>

      <h3>Travel: Flights, Hotels, and Rideshare</h3>
      <p>
        Travel is broadly defined on most premium cards and includes flights, hotels, rental cars,
        taxis, rideshare, parking, and tolls. The{' '}
        <Link to="/cards/chase-sapphire-reserve">Chase Sapphire Reserve</Link> earns 3x on all
        travel after a $300 annual travel credit. The{' '}
        <Link to="/cards/capital-one-venture-x">Capital One Venture X</Link> earns 2x on all
        travel, plus 10x on hotels and 5x on flights booked through Capital One Travel.
      </p>
      <p>
        For casual travelers (2–4 trips per year), a no-annual-fee card with 1.5–2x on travel
        may outperform premium cards after accounting for fees. For frequent travelers, the premium
        cards&apos; lounge access, travel credits, and bonus rates typically justify the higher
        fees. See our{' '}
        <Link to="/best-cards/travel">best cards for travel guide</Link>.
      </p>

      <h3>Gas and Fuel</h3>
      <p>
        Gas is a predictable monthly expense where targeted cards can meaningfully outperform flat
        cash back. The{' '}
        <Link to="/cards/bank-of-america-customized-cash">Bank of America Customized Cash</Link>{' '}
        lets you choose gas as your 3% category. The{' '}
        <Link to="/cards/us-bank-altitude-go">U.S. Bank Altitude Go</Link> earns 2x on gas. The
        Citi Custom Cash earns 5% in your top spending category each month — which often ends up
        being gas for households that fill up frequently.
      </p>
      <p>
        The average American spends about $2,400/year on gas. The difference between 1.5% and 5%
        back is $84/year — not life-changing, but meaningful. See our{' '}
        <Link to="/best-cards/gas">best cards for gas guide</Link>.
      </p>

      <h3>Online Shopping and Streaming</h3>
      <p>
        E-commerce spending has become a major category as more purchases move online. The{' '}
        <Link to="/cards/amex-blue-cash-preferred">Amex Blue Cash Preferred</Link> earns 6% on
        select U.S. streaming services. The{' '}
        <Link to="/cards/chase-freedom-flex">Chase Freedom Flex</Link> sometimes includes Amazon
        in rotating quarterly 5% categories. The Bank of America Customized Cash lets you select
        online shopping as your 3% category.
      </p>
      <p>
        With the average household spending $150–$300/month on Amazon and digital subscriptions,
        this category is increasingly important to optimize. See our{' '}
        <Link to="/best-cards/online-shopping">best cards for online shopping</Link> and{' '}
        <Link to="/best-cards/streaming">best cards for streaming</Link> guides.
      </p>

      <h2>Building Your Optimal Wallet: How Many Cards Do You Need?</h2>
      <p>
        The optimal credit card wallet for most people has 2–4 cards. More than that creates
        complexity without proportional reward gains. Fewer than two usually means leaving
        significant category bonuses on the table.
      </p>

      <h3>The 2-Card Foundation</h3>
      <p>
        The classic 2-card setup pairs a category-focused card with a flat-rate catch-all:
      </p>
      <ul>
        <li>
          <strong>Card 1 — Category bonus card:</strong> Amex Gold (4x dining/groceries), Amex
          Blue Cash Preferred (6% groceries/streaming), or Chase Sapphire Preferred (3x dining/travel)
        </li>
        <li>
          <strong>Card 2 — Flat-rate catch-all:</strong> Citi Double Cash (2%), Wells Fargo Active
          Cash (2%), or Chase Freedom Unlimited (1.5%)
        </li>
      </ul>
      <p>
        This combination captures high rates in your biggest spend categories while ensuring
        nothing earns less than 1.5–2% on the remainder.
      </p>

      <h3>The 3-4 Card Optimizer Setup</h3>
      <p>
        Adding a third or fourth card makes sense when you have significant spending across
        multiple high-bonus categories. A common 3-card setup:
      </p>
      <ul>
        <li>
          <strong>Card 1:</strong> Amex Gold — 4x dining, 4x U.S. supermarkets
        </li>
        <li>
          <strong>Card 2:</strong> Chase Sapphire Preferred — 3x dining (backup), 2x travel, 3x
          online grocery, good transfer partners
        </li>
        <li>
          <strong>Card 3:</strong> Citi Double Cash — 2% on everything else
        </li>
      </ul>
      <p>
        Note that both Amex Gold and Chase Sapphire Preferred have annual fees. The combined $315
        in fees needs to be justified by the incremental rewards over a 2-card setup. That
        typically requires $3,000+/month in total card spending with a good split across dining,
        groceries, and travel.
      </p>

      <h3>When Simple Beats Complex</h3>
      <p>
        A 2% flat-rate card used consistently beats a sophisticated multi-card setup that is
        poorly executed. If you do not want to think about which card to use at which merchant,
        the best strategy is a single high-quality flat-rate card. The Wells Fargo Active Cash
        earns 2% on everything with no categories to track and no annual fee. Over a $60,000/year
        in card spending, that is $1,200/year in rewards with zero optimization effort.
      </p>
      <p>
        The gains from category optimization are real but they require consistent execution. Use
        CardOptimizer&apos;s{' '}
        <Link to="/wallet">wallet optimizer</Link> to see exactly how much extra value a
        multi-card setup adds for your specific spending mix — and whether the complexity is
        worth it for you.
      </p>

      <ArticleCTA text="Build my optimal wallet" />

      <h2>How to Use CardOptimizer to Make This Decision</h2>
      <p>
        Reading about reward rates is useful, but the only number that matters is your number: how
        much will each card earn based on your actual spending pattern?
      </p>
      <p>Here is the process:</p>
      <ol>
        <li>
          <strong>Upload your transactions:</strong> Export a CSV from your bank (Chase, Amex,
          Capital One), budgeting app (Monarch, Copilot), or any tool that exports transaction
          history. CardOptimizer processes everything client-side — no data ever leaves your browser.
        </li>
        <li>
          <strong>Review your spending breakdown:</strong> The tool categorizes your transactions
          by reward category (dining, groceries, travel, gas, online shopping, streaming, other)
          and shows your monthly and annual totals.
        </li>
        <li>
          <strong>Run the wallet optimizer:</strong> Select the cards you already hold. The tool
          shows which card to use for each category and calculates your current annual reward.
        </li>
        <li>
          <strong>Check new card recommendations:</strong> See which cards would add the most
          value given your spending, ranked by net annual value (rewards minus annual fee, with
          sign-up bonus amortized over 2 years).
        </li>
        <li>
          <strong>Try the wallet builder:</strong> If you want to start fresh, the builder finds
          the optimal 2–4 card combination from the full catalog for your exact spending pattern.
        </li>
      </ol>

      <h2>Common Mistakes to Avoid</h2>

      <h3>Optimizing for the Sign-Up Bonus Only</h3>
      <p>
        Cards with large sign-up bonuses often have mediocre ongoing reward rates. The 80,000-mile
        bonus on an airline card looks impressive, but if the ongoing earning rate is only 1x and
        the card charges $150/year, you will lose value in years 2 and beyond.
      </p>

      <h3>Ignoring the Annual Fee After Year One</h3>
      <p>
        Many premium cards waive the annual fee for the first year. Year-one value looks great.
        Year two, the $250–$550 fee hits and many people cancel — having wasted the time and credit
        inquiry. Evaluate every card on its year-two value before applying.
      </p>

      <h3>Forgetting Foreign Transaction Fees</h3>
      <p>
        If you travel internationally, any card with a 3% foreign transaction fee is a poor choice
        for abroad spending. Most premium travel cards (Chase Sapphire, Capital One Venture,
        Amex Platinum) waive foreign transaction fees. Basic cash back cards like the Discover It
        also waive these fees. Check before traveling.
      </p>

      <h3>Treating All Points as Equal</h3>
      <p>
        Chase Ultimate Rewards, Amex Membership Rewards, and Capital One Miles each have different
        values depending on redemption. Do not compare "50,000 Chase points" to "50,000 Delta
        miles" without knowing the redemption value. CardOptimizer uses conservative 1-cent-per-point
        valuations for all points in its calculations, which is the reliable floor — actual value
        may be higher if you redeem for premium travel.
      </p>

      <h2>The Bottom Line</h2>
      <p>
        Choosing the best credit card is a math problem, not a marketing one. The right card
        depends entirely on where you spend money, how much you spend there, and what your
        redemption preferences are. A card with a $95 annual fee can easily generate $400+/year
        in value for the right spender. A zero-fee card can outperform a $695 premium card for
        someone with different spending habits.
      </p>
      <p>
        Stop reading listicles that rank cards by marketing-friendly metrics. Start with your
        spending, match it to reward rates, and do the math. If you want the math done for you,
        CardOptimizer handles it — for free, in your browser, with your own transaction data.
      </p>

      <ArticleCTA text="Optimize my credit card rewards" />

      {/* Related content */}
      <div className="not-prose mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-base font-bold text-gray-900 mb-3">Related guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { to: '/best-cards/dining', label: 'Best cards for dining' },
            { to: '/best-cards/groceries', label: 'Best cards for groceries' },
            { to: '/best-cards/travel', label: 'Best cards for travel' },
            { to: '/best-cards/gas', label: 'Best cards for gas' },
            { to: '/compare/chase-sapphire-preferred-vs-amex-gold', label: 'Chase Sapphire Preferred vs Amex Gold' },
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
