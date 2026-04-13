import { BrowserRouter, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import { clearSpendingData, clearWalletCards } from './lib/storage'
import { UploadPage } from './pages/UploadPage'
import { WalletPage } from './pages/WalletPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { WalletBuilderPage } from './pages/WalletBuilderPage'
import { CatalogPage } from './pages/CatalogPage'
import { LandingPage } from './pages/LandingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { CardDetailPage } from './pages/CardDetailPage'
import { CategoryGuidePage } from './pages/CategoryGuidePage'
import { ComparisonPage } from './pages/ComparisonPage'
import { FaqPage } from './pages/FaqPage'
import { BlogListingPage } from './pages/BlogListingPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { BestCards2026Page } from './pages/BestCards2026Page'
import { VsPage } from './pages/VsPage'
import { BeamPageview } from './lib/BeamPageview'

function ClearDataButton() {
  const navigate = useNavigate()
  function handleClear() {
    clearSpendingData()
    clearWalletCards()
    navigate('/upload')
  }
  return (
    <button
      onClick={handleClear}
      data-clear-saved-data
      className="hover:text-gray-900 transition-colors text-left"
    >
      Clear saved data
    </button>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <BeamPageview />
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-6 h-14 overflow-x-auto">
              <Link to="/" className="font-bold text-lg flex-shrink-0 text-gray-900 hover:text-blue-700 transition-colors min-h-[44px] flex items-center">CardOptimizer</Link>
              <div className="flex items-center gap-1 text-sm flex-shrink-0">
                <NavLink
                  to="/upload"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded transition-colors min-h-[44px] flex items-center ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  Upload
                </NavLink>
                <NavLink
                  to="/wallet"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded transition-colors min-h-[44px] flex items-center ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  Wallet
                </NavLink>
                <NavLink
                  to="/recommendations"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded transition-colors min-h-[44px] flex items-center ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  Recommendations
                </NavLink>
                <NavLink
                  to="/builder"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded transition-colors min-h-[44px] flex items-center ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  Builder
                </NavLink>
                <NavLink
                  to="/catalog"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded transition-colors min-h-[44px] flex items-center ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  Cards
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/builder" element={<WalletBuilderPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cards/:slug" element={<CardDetailPage />} />
            <Route path="/best-cards/:category" element={<CategoryGuidePage />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogListingPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/best-cards-2026" element={<BestCards2026Page />} />
            <Route path="/vs/:competitor" element={<VsPage />} />
          </Routes>
        </main>
        <footer className="border-t border-gray-200 bg-white mt-8" data-footer>
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>
                Built by{' '}
                <a
                  href="https://keylightdigital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Keylight Digital
                </a>
              </span>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-gray-900 transition-colors" data-footer-privacy>
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-gray-900 transition-colors" data-footer-terms>
                  Terms of Service
                </Link>
                <ClearDataButton />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3" data-footer-cross-promo>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Also from Keylight Digital</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <a
                  href="https://beam-privacy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                  data-footer-beam
                >
                  <span className="font-medium text-gray-600">Beam</span>
                  <span> — Privacy-first analytics</span>
                </a>
                <a
                  href="https://nexus.keylightdigital.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                  data-footer-nexus
                >
                  <span className="font-medium text-gray-600">Nexus</span>
                  <span> — AI command center</span>
                </a>
                <a
                  href="https://profittracker.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                  data-footer-profittracker
                >
                  <span className="font-medium text-gray-600">ProfitTracker</span>
                  <span> — Business profit analytics</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
