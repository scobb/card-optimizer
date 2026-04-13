import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { UploadPage } from './pages/UploadPage'
import { WalletPage } from './pages/WalletPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { WalletBuilderPage } from './pages/WalletBuilderPage'
import { CatalogPage } from './pages/CatalogPage'
import { LandingPage } from './pages/LandingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { CardDetailPage } from './pages/CardDetailPage'
import { CategoryGuidePage } from './pages/CategoryGuidePage'
import { ComparisonPage } from './pages/ComparisonPage'
import { BeamPageview } from './lib/BeamPageview'

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
          </Routes>
        </main>
        <footer className="border-t border-gray-200 bg-white mt-8" data-footer>
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
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
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
