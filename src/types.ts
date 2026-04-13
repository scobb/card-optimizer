export type RewardCategory =
  | 'dining'
  | 'groceries'
  | 'gas'
  | 'travel'
  | 'transit'
  | 'streaming'
  | 'online_shopping'
  | 'entertainment'
  | 'other'

export const CATEGORY_LABELS: Record<RewardCategory, string> = {
  dining: 'Dining',
  groceries: 'Groceries',
  gas: 'Gas',
  travel: 'Travel',
  transit: 'Transit',
  streaming: 'Streaming',
  online_shopping: 'Online Shopping',
  entertainment: 'Entertainment',
  other: 'Everything Else',
}

export interface Transaction {
  date: string
  merchant: string
  amount: number
  category: RewardCategory
  rawCategory?: string
}

export interface SpendingBreakdown {
  category: RewardCategory
  monthlyAvg: number
  annualTotal: number
  transactionCount: number
}

export type CsvFormat =
  | 'monarch'
  | 'copilot'
  | 'chase'
  | 'amex'
  | 'capital_one'
  | 'generic'

export interface ColumnMapping {
  date: string
  merchant: string
  amount: string
  amountType: 'signed' | 'debit_credit'
  creditColumn?: string
}

export interface ParsedCsvResult {
  format: CsvFormat
  formatLabel: string
  transactions: Transaction[]
  breakdown: SpendingBreakdown[]
  needsManualMapping: boolean
  headers?: string[]
}

export interface StoredSpendingData {
  breakdown: SpendingBreakdown[]
  format: CsvFormat
  formatLabel: string
  uploadedAt: string
  transactionCount: number
}
