import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Tasks from './pages/Tasks'
import NewProduct from './pages/NewProduct'
import KeywordsKnowledge from './pages/knowledge/Keywords'
import CpcKnowledge from './pages/knowledge/Cpc'
import RankingsKnowledge from './pages/knowledge/Rankings'
import CompetitorsKnowledge from './pages/knowledge/Competitors'
import AdminUsers from './pages/admin/Users'
import AdminQuotas from './pages/admin/Quotas'
import AdminModels from './pages/admin/Models'
import Settings from './pages/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const token = useAuthStore((s) => s.token)

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="analysis/:id" element={<Analysis />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="new-product" element={<NewProduct />} />
        <Route path="knowledge/keywords" element={<KeywordsKnowledge />} />
        <Route path="knowledge/cpc" element={<CpcKnowledge />} />
        <Route path="knowledge/rankings" element={<RankingsKnowledge />} />
        <Route path="knowledge/competitors" element={<CompetitorsKnowledge />} />
        <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="admin/quotas" element={<AdminRoute><AdminQuotas /></AdminRoute>} />
        <Route path="admin/models" element={<AdminRoute><AdminModels /></AdminRoute>} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
