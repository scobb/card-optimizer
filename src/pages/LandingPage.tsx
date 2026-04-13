import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload,
  Cpu,
  TrendingUp,
  Shield,
  CreditCard,
  Share2,
  Star,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { ALL_CARDS } from '../lib/cards'
import { recommendCards } from '../lib/recommender'
import type { SpendingBreakdown } from '../types'

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

const PREVIEW_BREAKDOWN: SpendingBreakdown[] = [
  { category: 'groceries', monthlyAvg: 600, annualTotal: 7200, transactionCount: 48 },
  { category: 'online_shopping', monthlyAvg: 400, annualTotal: 4800, transactionCount: 25 },
  { category: 'dining', monthlyAvg: 350, annualTotal: 4200, transactionCount: 120 },
  { category: 'gas', monthlyAvg: 300, annualTotal: 3600, transactionCount: 16 },
  { category: 'travel', monthlyAvg: 200, annualTotal: 2400, transactionCount: 8 },
  { category: 'entertainment', monthlyAvg: 150, annualTotal: 1800, transactionCount: 12 },
  { category: 'transit', monthlyAvg: 100, annualTotal: 1200, transactionCount: 20 },
  { category: 'streaming', monthlyAvg: 50, annualTotal: 600, transactionCount: 5 },
  { category: 'other', monthlyAvg: 2350, annualTotal: 28200, transactionCount: 150 },
]

const PREVIEW_TOTAL_SPEND = PREVIEW_BREAKDOWN.reduce((s, b) => s + b.annualTotal, 0)
const PREVIEW_RECS = recommendCards([], PREVIEW_BREAKDOWN).slice(0, 3)
const PREVIEW_BASELINE = PREVIEW_TOTAL_SPEND * 0.01
const PREVIEW_TOP_REWARDS = PREVIEW_RECS.reduce((s, r) => s + r.incrementalRewards, 0)
const PREVIEW_SAVINGS = PREVIEW_TOP_REWARDS - PREVIEW_BASELINE

export function LandingPage() {
  const [cardCount, setCardCount] = useState<number>(ALL_CARDS.length)

  useEffect(() => {
    fetch('/api/cards')
      .then((r) => r.json())
      .then((cards: unknown[]) => {
        if (Array.isArray(cards) && cards.length > 0) setCardCount(cards.length)
      })
      .catch(() => {
        // fallback to static count already set
      })
  }, [])

  return (
    <div className="space-y-16 pb-8" data-landing>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white px-6 py-10 sm:px-10 sm:py-14 text-center space-y-5"
        data-landing-hero
      >
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase">
          <Star size={12} />
          Free · No sign-up · Private
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Maximize Your<br />Credit Card Rewards
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Upload your transactions, discover the best cards for your spending, and build your
          optimal wallet — all in seconds, all in your browser.
        </p>
        <div className="pt-1">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl text-base hover:bg-blue-50 transition-colors min-h-[48px]"
            data-landing-cta
          >
            Optimize My Rewards
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="grid grid-cols-3 gap-4 text-center" data-landing-stats>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700" data-stat-cards>
            {cardCount}+
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Cards in catalog</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">100%</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Free to use</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">0</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Data uploaded</p>
        </div>
      </section>

      {/* ── See It In Action ─────────────────────────────────── */}
      <section className="space-y-5" data-landing-preview>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">See It In Action</h2>
          <p className="text-sm text-gray-500 mt-1">
            Example: Average American spending ($4,500/mo)
          </p>
        </div>

        {PREVIEW_RECS.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PREVIEW_RECS.map((rec, i) => (
                <div
                  key={rec.card.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2"
                  data-preview-card={rec.card.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {fmt(rec.netAnnualValue)}/yr
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight" data-preview-card-name>
                    {rec.card.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>

            {PREVIEW_SAVINGS > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    Est.{' '}
                    <span className="text-lg font-extrabold" data-preview-savings>
                      {fmt(PREVIEW_SAVINGS)}
                    </span>
                    /yr extra vs a 1% flat cashback card
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Based on Average American spending. Your results will vary.
                  </p>
                </div>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-1.5 bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-green-800 transition-colors min-h-[44px] whitespace-nowrap"
                  data-preview-cta
                >
                  Try with your spending
                  <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="space-y-6" data-landing-how>
        <h2 className="text-xl font-bold text-gray-900 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Upload size={22} className="text-blue-600" />,
              step: '1',
              title: 'Upload Your Transactions',
              desc: 'Drop a CSV from your bank, Monarch, Chase, Amex, or Capital One. Everything stays in your browser.',
            },
            {
              icon: <Cpu size={22} className="text-blue-600" />,
              step: '2',
              title: 'Analyze Your Spending',
              desc: 'We categorize your spending into dining, groceries, travel, and more to find where your money goes.',
            },
            {
              icon: <TrendingUp size={22} className="text-blue-600" />,
              step: '3',
              title: 'Optimize Your Wallet',
              desc: 'Get a personalized card stack that maximizes rewards for your actual spending patterns.',
            },
          ].map(({ icon, step, title, desc }) => (
            <div
              key={step}
              className="bg-white border border-gray-100 rounded-xl p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </span>
                {icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="space-y-6" data-landing-features>
        <h2 className="text-xl font-bold text-gray-900 text-center">What You Get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <CreditCard size={20} className="text-indigo-600" />,
              title: 'Wallet Optimizer',
              desc: "Enter the cards you already hold. We'll show exactly which card to use at every merchant category.",
            },
            {
              icon: <Star size={20} className="text-indigo-600" />,
              title: 'Card Recommendations',
              desc: 'Ranked list of new cards with net annual value, including sign-up bonus amortized over 2 years.',
            },
            {
              icon: <TrendingUp size={20} className="text-indigo-600" />,
              title: 'Wallet Builder',
              desc: 'Find the optimal 2–4 card combination for your spending pattern across our full catalog.',
            },
            {
              icon: <Share2 size={20} className="text-indigo-600" />,
              title: 'Share Your Results',
              desc: 'Generate a shareable link with your spending summary and wallet — no personal data included.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4 shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy callout ───────────────────────────────────── */}
      <section
        className="bg-green-50 border border-green-200 rounded-2xl px-6 py-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
        data-landing-privacy
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Lock size={26} className="text-green-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-green-900 mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Shield size={16} className="text-green-700" />
            Your Data Never Leaves Your Browser
          </h2>
          <p className="text-sm text-green-800 leading-relaxed">
            All transaction processing happens locally in JavaScript. No file is uploaded to any
            server. No account required. No tracking pixels. Your financial data stays yours —
            always.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Ready to maximize your rewards?</h2>
        <p className="text-sm text-gray-500">
          It takes under a minute. No sign-up, no credit card required.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-base hover:bg-blue-800 transition-colors min-h-[48px]"
        >
          Get Started Free
          <ChevronRight size={18} />
        </Link>
        <p className="text-xs text-gray-400">
          Or{' '}
          <Link to="/catalog" className="text-blue-600 hover:underline">
            browse the card catalog
          </Link>{' '}
          first
        </p>
      </section>
    </div>
  )
}
