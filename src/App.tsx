import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { UploadPage } from './pages/UploadPage'
import { WalletPage } from './pages/WalletPage'
import { RecommendationsPage } from './pages/RecommendationsPage'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-6 h-14 overflow-x-auto">
              <span className="font-bold text-lg flex-shrink-0">CardOptimizer</span>
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
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/catalog" element={<div className="text-gray-500">Card catalog — coming in CO-006</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
