import { useState, useRef, useCallback, useEffect, DragEvent } from 'react'
import { Upload, FileText, X, RefreshCw, CheckCircle } from 'lucide-react'
import { parseCsv, parseRawCsv, parseWithMapping, type ColumnMapping } from '../lib/csvParser'
import { saveSpendingData, loadSpendingData, clearSpendingData } from '../lib/storage'
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

  // Load persisted data on mount
  useEffect(() => {
    const saved = loadSpendingData()
    if (saved) setStoredData(saved)
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
    setStoredData(null)
    setParseResult(null)
    setRawCsv(null)
    setFileName(null)
    setError(null)
  }

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
        <button
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 min-h-[44px]"
          onClick={() => {
            setParseResult(null)
            setFileName(null)
            setRawCsv(null)
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Upload a different file
        </button>
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
