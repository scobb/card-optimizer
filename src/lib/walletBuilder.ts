import type { Card, SpendingBreakdown, RewardCategory } from '../types'
import { ALL_CARDS, effectiveRate } from './cards'
import { CATEGORY_LABELS } from '../types'

export interface CardRole {
  card: Card
  categories: Array<{ category: RewardCategory; label: string; rate: number }>
  annualRewards: number
}

export interface OptimalWallet {
  cards: Card[]
  cardRoles: CardRole[]
  totalAnnualRewards: number
  totalAnnualFees: number
  netAnnualValue: number
  computeTimeMs: number
}

/**
 * Find the optimal K-card combination from the catalog that maximises
 * net annual value (rewards − fees) for the given spending breakdown.
 *
 * Uses brute-force enumeration: O(C(n,k) × categories).
 * With 50 cards and k=4 this is ~2M ops — well under 2 seconds.
 */
export function findOptimalWallet(
  breakdown: SpendingBreakdown[],
  maxCards: number,
): OptimalWallet | null {
  const t0 = performance.now()

  const cards = ALL_CARDS
  const n = cards.length

  if (n === 0 || breakdown.length === 0) return null

  // Pre-compute rate matrix: rates[i][j] = effectiveRate(cards[i], categories[j])
  const categories = breakdown.map((b) => b.category as RewardCategory)
  const annualSpends = breakdown.map((b) => b.annualTotal)

  const rates: number[][] = cards.map((card) =>
    categories.map((cat) => effectiveRate(card, cat)),
  )

  let bestValue = -Infinity
  let bestCombo: number[] = []

  // Enumerate all combinations of size maxCards
  function enumerate(start: number, combo: number[]) {
    if (combo.length === maxCards) {
      let rewards = 0
      let fees = 0

      for (let j = 0; j < categories.length; j++) {
        if (annualSpends[j] <= 0) continue
        let best = 0
        for (const i of combo) {
          if (rates[i][j] > best) best = rates[i][j]
        }
        rewards += (annualSpends[j] * best) / 100
      }

      for (const i of combo) fees += cards[i].annualFee

      const net = rewards - fees
      if (net > bestValue) {
        bestValue = net
        bestCombo = [...combo]
      }
      return
    }

    const remaining = maxCards - combo.length
    for (let i = start; i <= n - remaining; i++) {
      combo.push(i)
      enumerate(i + 1, combo)
      combo.pop()
    }
  }

  enumerate(0, [])

  if (bestCombo.length === 0) return null

  const computeTimeMs = performance.now() - t0

  // Build per-card roles
  const optimalCards = bestCombo.map((i) => cards[i])
  const cardRoles: CardRole[] = optimalCards.map((card, idx) => {
    const cardIdx = bestCombo[idx]
    const ownedCategories: CardRole['categories'] = []
    let cardRewards = 0

    for (let j = 0; j < categories.length; j++) {
      if (annualSpends[j] <= 0) continue
      // This card is "best" for this category within the combo
      const comboRates = bestCombo.map((i) => rates[i][j])
      const maxRate = Math.max(...comboRates)
      if (rates[cardIdx][j] === maxRate && maxRate > 0) {
        ownedCategories.push({
          category: categories[j],
          label: CATEGORY_LABELS[categories[j]],
          rate: maxRate,
        })
        cardRewards += (annualSpends[j] * maxRate) / 100
      }
    }

    return { card, categories: ownedCategories, annualRewards: cardRewards }
  })

  const totalAnnualRewards = cardRoles.reduce((s, r) => s + r.annualRewards, 0)
  const totalAnnualFees = optimalCards.reduce((s, c) => s + c.annualFee, 0)

  return {
    cards: optimalCards,
    cardRoles,
    totalAnnualRewards,
    totalAnnualFees,
    netAnnualValue: bestValue,
    computeTimeMs,
  }
}
