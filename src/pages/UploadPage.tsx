import { useState, useRef, useCallback, useEffect, DragEvent } from 'react'
import { Upload, FileText, X, RefreshCw, CheckCircle, Zap, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { parseCsv, parseRawCsv, parseWithMapping, type ColumnMapping } from '../lib/csvParser'
import { saveSpendingData, loadSpendingData, clearSpendingData, clearWalletCards, hasAnalysis } from '../lib/storage'
import type { ParsedCsvResult, StoredSpendingData, SpendingBreakdown, RewardCategory } from '../types'
import { CATEGORY_LABELS } from '../types'

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  monarch: 'Monarch Money export detected.',
  copilot: 'Copilot export detected.',
  chase: 'Chase bank export detected.',
  amex: 'American Express export detected.',
  capital_one: 'Capital One export detected.',
  generic: 'Generic CSV format detected.',
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// ---------------------------------------------------------------------------
// Spending Presets
// ---------------------------------------------------------------------------
interface SpendingPreset {
  id: string
  name: string
  description: string
  monthlyTotal: number
  breakdown: SpendingBreakdown[]
}

// Monthly spending → annualTotal = monthlyAvg * 12
function makeBreakdown(monthlyAvg: number, transactionCount: number, category: RewardCategory): SpendingBreakdown {
  return { category, monthlyAvg, annualTotal: monthlyAvg * 12, transactionCount }
}

export const SPENDING_PRESETS: SpendingPreset[] = [
  {
    id: 'average-american',
    name: 'Average American',
    description: 'Based on BLS Consumer Expenditure data — $4,500/mo across all categories',
    monthlyTotal: 4500,
    breakdown: [
      makeBreakdown(600, 48, 'groceries'),
      makeBreakdown(400, 25, 'online_shopping'),
      makeBreakdown(350, 120, 'dining'),
      makeBreakdown(300, 16, 'gas'),
      makeBreakdown(200, 8, 'travel'),
      makeBreakdown(150, 12, 'entertainment'),
      makeBreakdown(100, 20, 'transit'),
      makeBreakdown(50, 5, 'streaming'),
      makeBreakdown(2350, 150, 'other'),
    ],
  },
  {
    id: 'frequent-traveler',
    name: 'Frequent Traveler',
    description: 'Heavy travel & dining spend — flights, hotels, restaurants — $6,000/mo',
    monthlyTotal: 6000,
    breakdown: [
      makeBreakdown(1500, 30, 'travel'),
      makeBreakdown(600, 80, 'dining'),
      makeBreakdown(500, 40, 'groceries'),
      makeBreakdown(500, 30, 'online_shopping'),
      makeBreakdown(300, 20, 'entertainment'),
      makeBreakdown(300, 60, 'transit'),
      makeBreakdown(150, 8, 'gas'),
      makeBreakdown(50, 5, 'streaming'),
      makeBreakdown(2100, 100, 'other'),
    ],
  },
  {
    id: 'online-shopper',
    name: 'Online Shopper',
    description: 'Amazon, subscriptions, and delivery-heavy spending — $3,500/mo',
    monthlyTotal: 3500,
    breakdown: [
      makeBreakdown(1200, 80, 'online_shopping'),
      makeBreakdown(500, 40, 'groceries'),
      makeBreakdown(250, 50, 'dining'),
      makeBreakdown(200, 15, 'entertainment'),
      makeBreakdown(200, 10, 'gas'),
      makeBreakdown(100, 8, 'streaming'),
      makeBreakdown(100, 4, 'travel'),
      makeBreakdown(50, 10, 'transit'),
      makeBreakdown(900, 70, 'other'),
    ],
  },
  {
    id: 'foodie',
    name: 'Foodie',
    description: 'Restaurants, groceries, and delivery dominate — $5,000/mo',
    monthlyTotal: 5000,
    breakdown: [
      makeBreakdown(1500, 150, 'dining'),
      makeBreakdown(800, 60, 'groceries'),
      makeBreakdown(300, 20, 'online_shopping'),
      makeBreakdown(250, 8, 'travel'),
      makeBreakdown(200, 15, 'entertainment'),
      makeBreakdown(200, 10, 'gas'),
      makeBreakdown(100, 15, 'transit'),
      makeBreakdown(50, 5, 'streaming'),
      makeBreakdown(1600, 80, 'other'),
    ],
  },
]

interface SpendingPresetsProps {
  onSelect: (preset: SpendingPreset) => void
}

function SpendingPresets({ onSelect }: SpendingPresetsProps) {
  return (
    <div data-spending-presets className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700">Try a spending preset — no CSV needed</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPENDING_PRESETS.map((preset) => (
          <button
            key={preset.id}
            data-preset-id={preset.id}
            onClick={() => onSelect(preset)}
            className="text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-gray-900 text-sm">{preset.name}</span>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                {fmt(preset.monthlyTotal)}/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{preset.description}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">Or upload your own transactions below for personalized results.</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Manual Column Mapping
// ---------------------------------------------------------------------------
interface ManualMappingProps {
  headers: string[]
  onApply: (mapping: ColumnMapping) => void
  onCancel: () => void
}

function ManualMapping({ headers, onApply, onCancel }: ManualMappingProps) {
  const [date, setDate] = useState('')
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [amountType, setAmountType] = useState<'signed' | 'debit_credit'>('signed')
  const [creditCol, setCreditCol] = useState('')

  const valid = date && merchant && amount

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 space-y-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-600 text-sm font-medium">
          We couldn't auto-detect this CSV format. Please map the columns manually.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date column */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date column</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Select…</option>
            {headers.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {/* Merchant column */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Merchant / Description column</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          >
            <option value="">Select…</option>
            {headers.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {/* Amount type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount format</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amountType}
            onChange={(e) => setAmountType(e.target.value as 'signed' | 'debit_credit')}
          >
            <option value="signed">Single amount column (positive or negative)</option>
            <option value="debit_credit">Separate Debit and Credit columns</option>
          </select>
        </div>

        {/* Amount / Debit column */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {amountType === 'debit_credit' ? 'Debit column' : 'Amount column'}
          </label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          >
            <option value="">Select…</option>
            {headers.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {amountType === 'debit_credit' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Credit column</label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={creditCol}
              onChange={(e) => setCreditCol(e.target.value)}
            >
              <option value="">Select…</option>
              {headers.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          disabled={!valid}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-blue-700 min-h-[44px]"
          onClick={() => {
            if (!valid) return
            onApply({
              date,
              merchant,
              amount,
              amountType,
              creditColumn: amountType === 'debit_credit' ? creditCol : undefined,
            })
          }}
        >
          Apply mapping
        </button>
        <button
          className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 min-h-[44px]"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Breakdown Table
// ---------------------------------------------------------------------------
interface BreakdownTableProps {
  breakdown: SpendingBreakdown[]
  formatLabel: string
  transactionCount: number
  onClear: () => void
}

function BreakdownTable({ breakdown, formatLabel, transactionCount, onClear }: BreakdownTableProps) {
  const totalAnnual = breakdown.reduce((s, b) => s + b.annualTotal, 0)

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">{transactionCount.toLocaleString()} transactions</span>
            {' '}from <span className="font-medium">{formatLabel}</span> — {fmt(totalAnnual)} annual spending
          </span>
        </div>
        <button
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 min-h-[44px] px-2"
          onClick={onClear}
        >
          <X className="w-3.5 h-3.5" />
          Clear data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-4 sm:px-2 font-medium text-gray-600">Category</th>
              <th className="text-right py-2 px-4 sm:px-2 font-medium text-gray-600">Monthly Avg</th>
              <th className="text-right py-2 px-4 sm:px-2 font-medium text-gray-600">Annual Total</th>
              <th className="text-right py-2 px-4 sm:px-2 font-medium text-gray-600">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((b) => (
              <tr key={b.category} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-4 sm:px-2 font-medium text-gray-800">
                  {CATEGORY_LABELS[b.category as RewardCategory]}
                </td>
                <td className="py-2 px-4 sm:px-2 text-right text-gray-700">{fmt(b.monthlyAvg)}</td>
                <td className="py-2 px-4 sm:px-2 text-right text-gray-700">{fmt(b.annualTotal)}</td>
                <td className="py-2 px-4 sm:px-2 text-right text-gray-500">{b.transactionCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td className="py-2 px-4 sm:px-2 font-semibold text-gray-800">Total</td>
              <td className="py-2 px-4 sm:px-2 text-right font-semibold">{fmt(totalAnnual / 12)}</td>
              <td className="py-2 px-4 sm:px-2 text-right font-semibold">{fmt(totalAnnual)}</td>
              <td className="py-2 px-4 sm:px-2 text-right font-semibold">
                {transactionCount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upload Zone
// ---------------------------------------------------------------------------
interface UploadZoneProps {
  onFile: (text: string, filename: string) => void
  isDragging: boolean
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
}

function UploadZone({ onFile, isDragging, onDragOver, onDragLeave, onDrop }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onFile(ev.target?.result as string, file.name)
    reader.readAsText(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload CSV file"
      className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p className="text-base font-medium text-gray-700">
        {isDragging ? 'Drop your CSV here' : 'Drag & drop your transaction CSV'}
      </p>
      <p className="text-sm text-gray-500 mt-1">or click to browse</p>
      <p className="text-xs text-gray-400 mt-3">
        Supports Monarch Money · Copilot · Chase · Amex · Capital One · Generic CSV
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={handleFileInput}
        data-testid="csv-file-input"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parseResult, setParseResult] = useState<ParsedCsvResult | null>(null)
  const [rawCsv, setRawCsv] = useState<string | null>(null)
  const [storedData, setStoredData] = useState<StoredSpendingData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null)
  const [showWelcomeBack, setShowWelcomeBack] = useState(() => hasAnalysis())

  // Load persisted data on mount
  useEffect(() => {
    const saved = loadSpendingData()
    if (saved) setStoredData(saved)
  }, [])

  const handlePresetSelect = useCallback((preset: SpendingPreset) => {
    setError(null)
    setRawCsv(null)
    setFileName(null)
    setParseResult(null)
    const totalTxns = preset.breakdown.reduce((s, b) => s + b.transactionCount, 0)
    const data: StoredSpendingData = {
      breakdown: preset.breakdown,
      format: 'generic',
      formatLabel: `${preset.name} spending profile`,
      uploadedAt: new Date().toISOString(),
      transactionCount: totalTxns,
    }
    saveSpendingData(data)
    setStoredData(data)
    setSelectedPresetName(preset.name)
  }, [])

  const processFile = useCallback((text: string, name: string) => {
    setError(null)
    setRawCsv(text)
    setFileName(name)
    const result = parseCsv(text)
    setParseResult(result)

    if (!result.needsManualMapping && result.transactions.length > 0) {
      const data: StoredSpendingData = {
        breakdown: result.breakdown,
        format: result.format,
        formatLabel: result.formatLabel,
        uploadedAt: new Date().toISOString(),
        transactionCount: result.transactions.length,
      }
      saveSpendingData(data)
      setStoredData(data)
    } else if (result.transactions.length === 0 && !result.needsManualMapping) {
      setError('No transactions found. Check that your CSV has valid data rows.')
    }
  }, [])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith('.csv')) {
      setError('Please drop a .csv file.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => processFile(ev.target?.result as string, file.name)
    reader.readAsText(file)
  }

  const handleManualApply = (mapping: ColumnMapping) => {
    if (!rawCsv || !parseResult) return
    const rows = parseRawCsv(rawCsv)
    const parsed = parseWithMapping(rows, mapping, 'generic', 'Custom mapping')
    setParseResult(parsed)
    if (parsed.transactions.length > 0) {
      const data: StoredSpendingData = {
        breakdown: parsed.breakdown,
        format: parsed.format,
        formatLabel: parsed.formatLabel,
        uploadedAt: new Date().toISOString(),
        transactionCount: parsed.transactions.length,
      }
      saveSpendingData(data)
      setStoredData(data)
    }
  }

  const handleCancelManual = () => {
    setParseResult(null)
    setRawCsv(null)
    setFileName(null)
  }

  const handleClearData = () => {
    clearSpendingData()
    clearWalletCards()
    setStoredData(null)
    setParseResult(null)
    setRawCsv(null)
    setFileName(null)
    setError(null)
    setSelectedPresetName(null)
    setShowWelcomeBack(false)
  }

  const handleStartFresh = useCallback(() => {
    clearSpendingData()
    clearWalletCards()
    setStoredData(null)
    setParseResult(null)
    setRawCsv(null)
    setFileName(null)
    setError(null)
    setSelectedPresetName(null)
    setShowWelcomeBack(false)
  }, [])

  // Decide what to show for breakdown
  const shownData: StoredSpendingData | null =
    parseResult && !parseResult.needsManualMapping && parseResult.transactions.length > 0
      ? {
          breakdown: parseResult.breakdown,
          format: parseResult.format,
          formatLabel: parseResult.formatLabel,
          uploadedAt: new Date().toISOString(),
          transactionCount: parseResult.transactions.length,
        }
      : storedData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Transactions</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Upload your transaction CSV to get personalized card recommendations. Your data never leaves your browser.
        </p>
      </div>

      {/* Welcome back banner — shown when a previous full analysis (spending + wallet) is saved */}
      {showWelcomeBack && (
        <div
          data-welcome-back
          className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-3"
        >
          <div>
            <p className="text-sm font-semibold text-blue-900">Welcome back!</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Your previous analysis is saved. Pick up where you left off or start fresh.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/wallet"
              data-view-results
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              View my results →
            </Link>
            <button
              data-start-fresh
              onClick={handleStartFresh}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-blue-300 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start fresh
            </button>
          </div>
        </div>
      )}

      {/* Spending presets (shown when no data loaded) */}
      {!shownData && (
        <SpendingPresets onSelect={handlePresetSelect} />
      )}

      {/* Divider between presets and upload */}
      {!shownData && (
        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">or upload CSV</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
      )}

      {/* Upload zone (always shown unless we have results) */}
      {!shownData && (
        <UploadZone
          onFile={processFile}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {/* Replace/reupload when data is present */}
      {shownData && (
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 min-h-[44px]"
            onClick={() => {
              setParseResult(null)
              setFileName(null)
              setRawCsv(null)
              setStoredData(null)
              setSelectedPresetName(null)
              clearSpendingData()
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try a different profile
          </button>
        </div>
      )}

      {/* Re-upload zone */}
      {shownData && !parseResult && (
        <UploadZone
          onFile={processFile}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* File detected indicator */}
      {fileName && parseResult && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium truncate">{fileName}</span>
          {!parseResult.needsManualMapping && (
            <span className="text-gray-400">
              — {FORMAT_DESCRIPTIONS[parseResult.format] ?? 'Format detected.'}
            </span>
          )}
        </div>
      )}

      {/* Manual column mapping */}
      {parseResult?.needsManualMapping && parseResult.headers && (
        <ManualMapping
          headers={parseResult.headers}
          onApply={handleManualApply}
          onCancel={handleCancelManual}
        />
      )}

      {/* Spending breakdown */}
      {shownData && shownData.breakdown.length > 0 && (
        <BreakdownTable
          breakdown={shownData.breakdown}
          formatLabel={shownData.formatLabel}
          transactionCount={shownData.transactionCount}
          onClear={handleClearData}
        />
      )}

      {/* Post-selection CTA: navigate to wallet optimizer */}
      {shownData && shownData.breakdown.length > 0 && (
        <div data-preset-cta className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-900">
              {selectedPresetName ? `${selectedPresetName} profile loaded` : 'Spending data loaded'}
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              See which cards maximize your rewards
            </p>
          </div>
          <Link
            to="/wallet"
            data-optimize-link
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors min-h-[44px] flex-shrink-0"
          >
            Optimize My Wallet →
          </Link>
        </div>
      )}

      {/* Persistent data notice */}
      {storedData && !parseResult && !shownData?.breakdown.length && (
        <p className="text-sm text-gray-500">Showing your previously uploaded spending data.</p>
      )}

      {/* How-to instructions */}
      {!shownData && (
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700 mb-2">How to export your transactions:</p>
          <ul className="space-y-1 list-disc pl-4">
            <li><span className="font-medium">Monarch Money:</span> Transactions → Export → CSV</li>
            <li><span className="font-medium">Copilot:</span> Transactions → Export</li>
            <li><span className="font-medium">Chase:</span> Accounts → Download → CSV</li>
            <li><span className="font-medium">Amex:</span> Statements → Download → CSV</li>
            <li><span className="font-medium">Capital One:</span> Activity → Download → CSV</li>
          </ul>
        </div>
      )}
    </div>
  )
}
