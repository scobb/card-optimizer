import { FileText, AlertCircle, ShieldCheck, Ban } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <div className="space-y-8 pb-8" data-terms>
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white px-6 py-10 sm:px-10 sm:py-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-blue-100 text-base max-w-md mx-auto leading-relaxed">
          CardOptimizer is a free informational tool operated by Keylight Digital LLC. Please read these terms before using the service.
        </p>
        <p className="text-blue-200 text-xs">Last updated: April 13, 2026</p>
      </section>

      {/* Key highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-terms-highlights>
        {[
          {
            icon: <ShieldCheck size={20} className="text-blue-700" />,
            title: 'Free to Use',
            desc: 'CardOptimizer is provided at no cost. All core features — upload, optimize, and compare — are free forever.',
          },
          {
            icon: <FileText size={20} className="text-indigo-700" />,
            title: 'Informational Only',
            desc: 'Results are estimates for informational purposes. Always verify details with the card issuer before applying.',
          },
          {
            icon: <Ban size={20} className="text-red-600" />,
            title: 'No Abuse',
            desc: 'You may not use this tool to scrape data, send spam, or violate any applicable laws or regulations.',
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

      {/* Full terms */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8" data-terms-policy>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">1. Service Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer is a web-based credit card rewards optimization tool operated by{' '}
            <strong>Keylight Digital LLC</strong>. The service allows users to analyze their
            spending patterns and receive personalized credit card recommendations based on publicly
            available card reward data.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            All spending analysis is performed entirely within your browser. No transaction data
            is transmitted to Keylight Digital LLC's servers. The card catalog data (reward rates,
            fees, sign-up bonuses) is served from our API and updated periodically.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">2. Data Handling</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer processes all financial data client-side in your browser. When you upload
            a CSV file, it is parsed by JavaScript running on your device and is never transmitted
            to any server operated by Keylight Digital LLC or any third party.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your spending summary and wallet selections may be stored in your browser's{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> to persist
            between sessions. This data remains entirely on your device and can be cleared at any
            time via your browser settings.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you use the optional email results feature, you voluntarily provide your email
            address to receive a summary of your results. This email is sent via a server-side
            endpoint and your address may be stored in our database subject to our{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">3. No Financial Advice</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer is an <strong>informational tool only</strong>. The recommendations,
            reward calculations, and card comparisons provided by this service are estimates based
            on publicly available card data and your self-reported spending patterns.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nothing on this site constitutes financial, legal, or tax advice. Keylight Digital LLC
            is not a registered financial advisor, broker-dealer, or financial planner. Credit card
            terms, reward rates, annual fees, and sign-up bonuses change frequently — always verify
            current details directly with the card issuer before applying.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            You are solely responsible for any financial decisions you make based on information
            provided by this tool.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">4. Acceptable Use</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You agree to use CardOptimizer only for lawful personal purposes. You may not:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
            <li>Attempt to scrape, copy, or systematically download the card catalog data</li>
            <li>Use the service to send unsolicited communications or spam</li>
            <li>Attempt to reverse engineer, decompile, or access non-public parts of the service</li>
            <li>Use the service in any way that violates applicable laws or regulations</li>
            <li>Interfere with or disrupt the service or its underlying infrastructure</li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            Keylight Digital LLC reserves the right to terminate or restrict access to the service
            for any user who violates these terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">5. Limitation of Liability</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To the maximum extent permitted by applicable law, Keylight Digital LLC and its
            officers, employees, and agents shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of — or inability
            to use — CardOptimizer.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer is provided <strong>"as is"</strong> without warranties of any kind,
            express or implied, including but not limited to warranties of merchantability, fitness
            for a particular purpose, or non-infringement. We do not warrant that the service will
            be uninterrupted, error-free, or that card data is current or accurate.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            In jurisdictions that do not allow the exclusion of implied warranties or limitation of
            liability, liability is limited to the fullest extent permitted by law.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">6. Intellectual Property</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The CardOptimizer source code is open source and available on{' '}
            <a
              href="https://github.com/scobb/card-optimizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>{' '}
            under the MIT license. Card names, issuer names, and reward program names are
            trademarks of their respective owners. CardOptimizer is not affiliated with, endorsed
            by, or sponsored by any card issuer.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">7. Third-Party Links</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            CardOptimizer provides links to card issuer application pages as a convenience.
            These links are affiliate links or direct issuer links — Keylight Digital LLC may
            receive a referral fee if you apply for and are approved for a card through these
            links. This does not affect our recommendations, which are based solely on reward
            rate calculations against your spending data.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are not responsible for the content, accuracy, or practices of any third-party
            websites linked from this service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">8. Modifications to These Terms</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Keylight Digital LLC reserves the right to modify these Terms of Service at any time.
            Changes will be posted on this page with an updated "Last updated" date. Continued use
            of CardOptimizer after changes are posted constitutes your acceptance of the revised
            terms.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            If we make material changes, we will make reasonable efforts to notify users (e.g., via
            a notice on the site). We encourage you to review these terms periodically.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">9. Governing Law</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            These Terms of Service are governed by the laws of the state in which Keylight Digital
            LLC is registered, without regard to its conflict of law provisions. Any disputes
            arising from these terms or your use of CardOptimizer shall be resolved in the courts
            of that jurisdiction.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">10. Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Questions about these Terms of Service? Contact Keylight Digital LLC at{' '}
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
        data-terms-disclaimer
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
