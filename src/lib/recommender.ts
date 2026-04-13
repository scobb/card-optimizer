import type { Card, SpendingBreakdown, RewardCategory } from '../types'
import { ALL_CARDS, effectiveRate } from './cards'

export interface CategoryGain {
  category: RewardCategory
  categoryLabel: string
  annualSpend: number
  currentRate: number
  newRate: number
  incrementalRewards: number
}

export interface CardRecommendation {
  card: Card
  incrementalRewards: number
  bonusAmortized: number
  netAnnualValue: number
  categoryGains: CategoryGain[]
  reason: string
}

/**
 * Given the user's current wallet and spending, find the best rate per
 * category from cards the user already holds. Returns 0 if wallet is empty.
 */
function currentBestRate(
  category: RewardCategory,
  walletCards: Card[],
): number {
  if (walletCards.length === 0) return 0
  return Math.max(...walletCards.map((c) => effectiveRate(c, category)))
}

/**
 * Calculate how much incremental annual value a new card would add
 * on top of what the user's current wallet already earns.
 */
export function recommendCards(
  walletCards: Card[],
  breakdown: SpendingBreakdown[],
): CardRecommendation[] {
  const walletIds = new Set(walletCards.map((c) => c.id))
  const candidateCards = ALL_CARDS.filter((c) => !walletIds.has(c.id))

  const recommendations: CardRecommendation[] = []

  for (const card of candidateCards) {
    const categoryGains: CategoryGain[] = []
    let incrementalRewards = 0

    for (const b of breakdown) {
      if (b.annualTotal <= 0) continue

      const currentRate = currentBestRate(b.category, walletCards)
      const newRate = effectiveRate(card, b.category)
      const delta = newRate - currentRate

      if (delta > 0) {
        const gain = (b.annualTotal * delta) / 100
        incrementalRewards += gain
        categoryGains.push({
          category: b.category,
          categoryLabel: b.category.charAt(0).toUpperCase() + b.category.slice(1).replace('_', ' '),
          annualSpend: b.annualTotal,
          currentRate,
          newRate,
          incrementalRewards: gain,
        })
      }
    }

    // Sign-up bonus amortized over 2 years
    const bonusAmortized = card.signUpBonus ? card.signUpBonus.amount / 2 : 0

    const netAnnualValue = incrementalRewards + bonusAmortized - card.annualFee

    if (netAnnualValue <= 0) continue

    // Build a human-readable reason
    let reason: string
    if (categoryGains.length === 0) {
      reason = `${bonusAmortized > 0 ? `$${Math.round(bonusAmortized)}/yr sign-up bonus` : 'flat rate rewards'} offset its $${card.annualFee} annual fee`
    } else {
      const topGain = [...categoryGains].sort(
        (a, b) => b.incrementalRewards - a.incrementalRewards,
      )[0]
      reason = `${topGain.newRate.toFixed(1)}% on ${topGain.categoryLabel} beats your current ${topGain.currentRate.toFixed(1)}%`
      if (bonusAmortized > 0) {
        reason += ` + $${Math.round(bonusAmortized)}/yr sign-up bonus`
      }
    }

    recommendations.push({
      card,
      incrementalRewards,
      bonusAmortized,
      netAnnualValue,
      categoryGains: categoryGains.sort((a, b) => b.incrementalRewards - a.incrementalRewards),
      reason,
    })
  }

  // Sort by net annual value descending
  return recommendations.sort((a, b) => b.netAnnualValue - a.netAnnualValue)
}
