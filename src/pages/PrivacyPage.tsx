import { Shield, Lock, Database, Eye, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <div className="space-y-8 pb-8" data-privacy>
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-green-700 via-green-600 to-teal-700 text-white px-6 py-10 sm:px-10 sm:py-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Shield size={24} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-green-100 text-base max-w-md mx-auto leading-relaxed">
          CardOptimizer is built on a simple promise: your financial data never leaves your device.
        </p>
        <p className="text-green-200 text-xs">Last updated: April 12, 2026</p>
      </section>

      {/* Key facts */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-privacy-highlights>
        {[
          {
            icon: <Lock size={20} className="text-green-700" />,
            title: 'No Data Sent to Servers',
            desc: 'All CSV parsing and analysis happens in your browser. Zero bytes of transaction data are transmitted.',
          },
          {
            icon: <Database size={20} className="text-blue-700" />,
            title: 'localStorage Only',
            desc: 'Your spending summary and wallet selections are stored locally on your device, never in our database.',
          },
          {
            icon: <Eye size={20} className="text-purple-700" />,
            title: 'No Tracking Pixels',
            desc: 'No third-party analytics, no tracking pixels, no advertising networks watch your behavior.',
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Full policy */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8" data-privacy-policy>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">1. What Data We Collect</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>We do not collect personal data.</strong> CardOptimizer operates entirely in
            your browser. When you upload a CSV file, it is read by JavaScript running on your
            device and is never transmitted to any server operated by Keylight Digital LLC or any
            third party.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            The only data that persists between sessions is stored in your browser's{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code>:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
            <li>Your spending category totals (aggregated, not individual transactions)</li>
            <li>The IDs of credit cards you've added to your wallet</li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            You can clear this data at any time by clearing your browser's local storage or using
            the "Clear Data" option in your browser settings.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">2. How Your Data Is Used</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            All computation — CSV parsing, spending categorization, card optimization, and wallet
            building — runs entirely in JavaScript on your device. The results you see are
            calculated locally and are never sent to our servers.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            The card catalog (rewards rates, fees, and perks) is fetched from our API at{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">/api/cards</code>. This request
            contains no personal information — it is a read-only request for public card data.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">3. Cookies and Tracking</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer does not use cookies. We do not embed tracking pixels, analytics scripts,
            or advertising tags. There is no third-party JavaScript on this site that could observe
            your behavior.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">4. Share Links</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you use the Share feature, a URL is generated containing a Base64-encoded summary
            of your spending category totals and wallet card IDs. This data is embedded in the URL
            hash (the part after <code className="bg-gray-100 px-1 rounded text-xs">#</code>) and
            is never sent to our servers. Individual transaction data is never included in share
            links.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">5. Third-Party Services</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer is hosted on Cloudflare Pages. Cloudflare may collect standard server
            access logs (IP address, request timestamp, HTTP status code) as part of normal CDN
            operation. These logs are governed by{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Cloudflare's Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">6. Children's Privacy</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer is not directed at children under 13. We do not knowingly collect
            information from children.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">7. Changes to This Policy</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may update this privacy policy from time to time. Any changes will be posted on
            this page with an updated date. Continued use of CardOptimizer after changes constitutes
            acceptance of the updated policy.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">8. Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Questions about this privacy policy? Contact us at{' '}
            <a
              href="mailto:ralph@keylightdigital.com"
              className="text-blue-600 hover:underline"
            >
              ralph@keylightdigital.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section
        className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-6 flex gap-4"
        data-privacy-disclaimer
      >
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle size={16} className="text-amber-700" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-amber-900 mb-2">Not Financial Advice</h2>
          <p className="text-xs text-amber-800 leading-relaxed">
            CardOptimizer is an informational tool only. The recommendations, reward calculations,
            and comparisons shown are estimates based on publicly available card data and your
            self-reported spending patterns. They do not constitute financial advice. Credit card
            terms, reward rates, and sign-up bonuses change frequently — always verify details
            directly with the card issuer before applying. Keylight Digital LLC is not a financial
            advisor and accepts no liability for decisions made based on this tool's output.
          </p>
        </div>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
