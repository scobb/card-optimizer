import type { StoredSpendingData } from '../types'

const STORAGE_KEY = 'co_spending_data'
const WALLET_KEY = 'co_wallet_cards'

export function saveSpendingData(data: StoredSpendingData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors (private mode, quota exceeded)
  }
}

export function loadSpendingData(): StoredSpendingData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredSpendingData
  } catch {
    return null
  }
}

export function clearSpendingData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

export function saveWalletCards(cardIds: string[]): void {
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(cardIds))
  } catch {
    // Ignore storage errors
  }
}

export function loadWalletCards(): string[] {
  try {
    const raw = localStorage.getItem(WALLET_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}
