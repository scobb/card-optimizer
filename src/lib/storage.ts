import type { StoredSpendingData } from '../types'

const STORAGE_KEY = 'co_spending_data'

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
