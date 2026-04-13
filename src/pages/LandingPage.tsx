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
} from 'lucide-react'
import { ALL_CARDS } from '../lib/cards'

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
