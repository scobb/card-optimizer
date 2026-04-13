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

export interface CardCategoryRate {
  category: string
  multiplier: number
}

export interface CardPerk {
  name: string
  annualValue: number
}

export interface SignUpBonus {
  amount: number
  spendRequired: number
  timeMonths: number
}

export interface Card {
  id: string
  name: string
  issuer: string
  annualFee: number
  firstYearFeeWaived: boolean
  rewardType: 'cashback' | 'points'
  baseRate: number
  pointValue: number
  categoryRates: CardCategoryRate[]
  signUpBonus: SignUpBonus | null
  perks: CardPerk[]
  url: string
}

export interface CategoryOptimization {
  category: RewardCategory
  categoryLabel: string
  bestCard: Card | null
  effectiveRate: number
  annualRewards: number
  annualSpend: number
}

export interface WalletOptimization {
  categoryBreakdown: CategoryOptimization[]
  totalAnnualRewards: number
  totalAnnualFees: number
  netAnnualValue: number
}
