import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center h-14">
              <span className="font-bold text-lg">CardOptimizer</span>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<div>Upload page — CO-002</div>} />
            <Route path="/wallet" element={<div>Wallet page — CO-003</div>} />
            <Route path="/recommendations" element={<div>Recommendations — CO-004/005</div>} />
            <Route path="/catalog" element={<div>Card catalog — CO-006</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
