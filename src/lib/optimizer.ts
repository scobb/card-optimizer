import type {
  Card,
  SpendingBreakdown,
  CategoryOptimization,
  WalletOptimization,
  RewardCategory,
} from '../types'
import { CATEGORY_LABELS } from '../types'
import { effectiveRate } from './cards'

/**
 * For a given spending category, find the card in the wallet with the best
 * effective rate and compute the annual rewards.
 */
function optimizeCategory(
  category: RewardCategory,
  annualSpend: number,
  wallet: Card[],
): CategoryOptimization {
  const categoryLabel = CATEGORY_LABELS[category]

  if (wallet.length === 0 || annualSpend === 0) {
    return {
      category,
      categoryLabel,
      bestCard: null,
      effectiveRate: 0,
      annualRewards: 0,
      annualSpend,
    }
  }

  let bestCard: Card = wallet[0]
  let bestRate = effectiveRate(wallet[0], category)

  for (const card of wallet.slice(1)) {
    const rate = effectiveRate(card, category)
    if (rate > bestRate) {
      bestRate = rate
      bestCard = card
    }
  }

  const annualRewards = (annualSpend * bestRate) / 100

  return {
    category,
    categoryLabel,
    bestCard,
    effectiveRate: bestRate,
    annualRewards,
    annualSpend,
  }
}

/**
 * Optimize the full spending breakdown across the user's wallet.
 * Returns per-category assignments and totals.
 */
export function optimizeWallet(
  wallet: Card[],
  breakdown: SpendingBreakdown[],
): WalletOptimization {
  const categoryBreakdown = breakdown.map((b) =>
    optimizeCategory(b.category, b.annualTotal, wallet),
  )

  const totalAnnualRewards = categoryBreakdown.reduce(
    (sum, c) => sum + c.annualRewards,
    0,
  )

  // Only charge fees for cards that are actually used
  const usedCardIds = new Set(
    categoryBreakdown
      .filter((c) => c.bestCard !== null)
      .map((c) => c.bestCard!.id),
  )

  // Include all selected cards' fees (user holds them regardless of spend)
  const totalAnnualFees = wallet.reduce((sum, card) => sum + card.annualFee, 0)

  const netAnnualValue = totalAnnualRewards - totalAnnualFees

  // suppress unused var warning
  void usedCardIds

  return {
    categoryBreakdown,
    totalAnnualRewards,
    totalAnnualFees,
    netAnnualValue,
  }
}
