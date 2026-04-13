import type { Card, RewardCategory } from '../types'
import cardsData from '../../seed/cards.json'

export const ALL_CARDS: Card[] = cardsData as Card[]

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id)
}

export function getCardsByIssuer(): Map<string, Card[]> {
  const map = new Map<string, Card[]>()
  for (const card of ALL_CARDS) {
    const list = map.get(card.issuer) ?? []
    list.push(card)
    map.set(card.issuer, list)
  }
  return map
}

/**
 * Returns the effective annual percentage yield for spending in a given category.
 * Formula: (categoryMultiplier ?? baseRate) * pointValue
 * For cashback cards pointValue = 1.0, for points cards it reflects cents/point.
 */
export function effectiveRate(card: Card, category: RewardCategory): number {
  const catRate = card.categoryRates.find((r) => r.category === category)
  const multiplier = catRate ? catRate.multiplier : card.baseRate
  return multiplier * card.pointValue
}
