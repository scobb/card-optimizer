import Papa from 'papaparse'
import { categorize } from './categories'
import type {
  CsvFormat,
  ColumnMapping,
  ParsedCsvResult,
  SpendingBreakdown,
  Transaction,
  RewardCategory,
} from '../types'
import { CATEGORY_LABELS } from '../types'

// Known format signatures — matched against the lowercase joined header string
const FORMAT_SIGNATURES: Array<{
  format: CsvFormat
  label: string
  match: (headers: string[]) => boolean
  mapping: ColumnMapping
}> = [
  {
    format: 'monarch',
    label: 'Monarch Money',
    match: (h) => h.includes('merchant') && h.includes('account') && h.includes('category') && h.includes('date'),
    mapping: {
      date: 'date',
      merchant: 'merchant',
      amount: 'amount',
      amountType: 'signed',
    },
  },
  {
    format: 'copilot',
    label: 'Copilot',
    match: (h) => h.includes('name') && h.includes('account') && h.includes('amount') && !h.includes('merchant'),
    mapping: {
      date: 'date',
      merchant: 'name',
      amount: 'amount',
      amountType: 'signed',
    },
  },
  {
    format: 'chase',
    label: 'Chase',
    match: (h) => h.includes('transaction date') || (h.includes('description') && h.includes('post date')),
    mapping: {
      date: 'transaction date',
      merchant: 'description',
      amount: 'amount',
      amountType: 'signed',
    },
  },
  {
    format: 'amex',
    label: 'American Express',
    match: (h) => h.includes('extended details') || h.includes('appears on your statement as'),
    mapping: {
      date: 'date',
      merchant: 'description',
      amount: 'amount',
      amountType: 'signed',
    },
  },
  {
    format: 'capital_one',
    label: 'Capital One',
    match: (h) => h.includes('debit') && h.includes('credit') && h.includes('card no.'),
    mapping: {
      date: 'transaction date',
      merchant: 'description',
      amount: 'debit',
      amountType: 'debit_credit',
      creditColumn: 'credit',
    },
  },
]

function normalizeHeaders(raw: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    normalized[key.toLowerCase().trim()] = value
  }
  return normalized
}

function parseAmount(value: string): number {
  if (!value) return 0
  // Remove currency symbols, spaces, commas
  const cleaned = value.replace(/[$,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parseRow(
  raw: Record<string, string>,
  mapping: ColumnMapping,
): Transaction | null {
  const row = normalizeHeaders(raw)
  const dateVal = row[mapping.date.toLowerCase()]
  const merchantVal = row[mapping.merchant.toLowerCase()]

  if (!dateVal || !merchantVal) return null

  let amount: number
  if (mapping.amountType === 'debit_credit') {
    const debit = parseAmount(row[mapping.amount.toLowerCase()])
    const credit = mapping.creditColumn ? parseAmount(row[mapping.creditColumn.toLowerCase()]) : 0
    // Debit = money spent (positive expense), credit = refund (skip or negative)
    amount = debit > 0 ? debit : -credit
  } else {
    amount = parseAmount(row[mapping.amount.toLowerCase()])
    // Monarch/Chase: negative = expense, Amex: positive = expense
    // Normalize: positive = expense
    // Heuristic: if the majority of values are negative, flip sign convention
    amount = Math.abs(amount)
  }

  if (amount <= 0) return null

  // Best-effort category from bank data
  const categoryCol = row['category']
  const category = categorize(merchantVal, categoryCol)

  return {
    date: dateVal,
    merchant: merchantVal,
    amount,
    category,
    rawCategory: categoryCol,
  }
}

function buildBreakdown(transactions: Transaction[]): SpendingBreakdown[] {
  const totals: Record<RewardCategory, { total: number; count: number }> = {} as any

  for (const tx of transactions) {
    if (!totals[tx.category]) {
      totals[tx.category] = { total: 0, count: 0 }
    }
    totals[tx.category].total += tx.amount
    totals[tx.category].count += 1
  }

  // Determine date range for monthly avg
  const dates = transactions
    .map((t) => new Date(t.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  let months = 12
  if (dates.length >= 2) {
    const first = dates[0]
    const last = dates[dates.length - 1]
    const diffMs = last.getTime() - first.getTime()
    const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44)
    months = Math.max(1, Math.round(diffMonths))
  }

  const allCategories = Object.keys(CATEGORY_LABELS) as RewardCategory[]
  return allCategories
    .map((cat) => {
      const data = totals[cat] ?? { total: 0, count: 0 }
      return {
        category: cat,
        annualTotal: data.total,
        monthlyAvg: data.total / months,
        transactionCount: data.count,
      }
    })
    .filter((b) => b.annualTotal > 0)
    .sort((a, b) => b.annualTotal - a.annualTotal)
}

function detectFormat(headers: string[]): (typeof FORMAT_SIGNATURES)[0] | null {
  const lower = headers.map((h) => h.toLowerCase().trim())
  return FORMAT_SIGNATURES.find((sig) => sig.match(lower)) ?? null
}

export function parseRawCsv(csvText: string): Record<string, string>[] {
  const result = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })
  return result.data
}

export function parseWithMapping(
  rows: Record<string, string>[],
  mapping: ColumnMapping,
  format: CsvFormat,
  formatLabel: string,
): ParsedCsvResult {
  const transactions = rows.flatMap((r) => {
    const tx = parseRow(r, mapping)
    return tx ? [tx] : []
  })
  return {
    format,
    formatLabel,
    transactions,
    breakdown: buildBreakdown(transactions),
    needsManualMapping: false,
  }
}

export function parseCsv(csvText: string): ParsedCsvResult {
  const result = Papa.parse<Record<string, string>>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  if (result.errors.length > 0 && result.data.length === 0) {
    return {
      format: 'generic',
      formatLabel: 'Unknown',
      transactions: [],
      breakdown: [],
      needsManualMapping: true,
      headers: [],
    }
  }

  const headers = result.meta.fields ?? []
  const detected = detectFormat(headers)

  if (!detected) {
    // Try generic fallback: look for common column names
    const lower = headers.map((h) => h.toLowerCase().trim())
    const dateCol = lower.find((h) => h.includes('date'))
    const merchantCol = lower.find(
      (h) => h.includes('merchant') || h.includes('description') || h.includes('name') || h.includes('payee'),
    )
    const amountCol = lower.find((h) => h.includes('amount') || h === 'debit')

    if (dateCol && merchantCol && amountCol) {
      const mapping: ColumnMapping = {
        date: dateCol,
        merchant: merchantCol,
        amount: amountCol,
        amountType: 'signed',
      }
      return parseWithMapping(result.data, mapping, 'generic', 'Generic CSV')
    }

    return {
      format: 'generic',
      formatLabel: 'Unknown',
      transactions: [],
      breakdown: [],
      needsManualMapping: true,
      headers,
    }
  }

  return parseWithMapping(result.data, detected.mapping, detected.format, detected.label)
}

export type { ColumnMapping }
