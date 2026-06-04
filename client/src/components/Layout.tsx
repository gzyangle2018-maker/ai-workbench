import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import BrandBadge from './BrandBadge'
import {
  LayoutDashboard, Upload, FileSearch, Rocket, BookOpen,
  DollarSign, TrendingUp, Swords, Users, Shield, Brain,
  Settings, LogOut, ChevronDown, ChevronRight, Store,
  CheckSquare
} from 'lucide-react'

interface NavGroup {
  label: string
  icon: React.ReactNode
  children?: { to: string; label: string; icon?: React.ReactNode }[]
  to?: string
}

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    overview: true,
    analysis: true,
    knowledge: true,
    admin: true,
  })

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navGroups: NavGroup[] = [
    {
      label: '总览', icon: <LayoutDashboard size={18} />, to: undefined,
      children: [
        { to: '/dashboard', label: 'BI看板', icon: <TrendingUp size={16} /> },
        { to: '/tasks', label: '周任务', icon: <CheckSquare size={16} /> },
      ]
    },
    {
      label: '分析', icon: <FileSearch size={18} />, to: undefined,
      children: [
        { to: '/upload', label: '数据投喂', icon: <Upload size={16} /> },
        { to: '/analysis/latest', label: '分析结果', icon: <FileSearch size={16} /> },
        { to: '/new-product', label: '新品冷启', icon: <Rocket size={16} /> },
      ]
    },
    {
      label: '知识库', icon: <BookOpen size={18} />, to: undefined,
      children: [
        { to: '/knowledge/keywords', label: '关键词库' },
        { to: '/knowledge/cpc', label: 'CPC竞价', icon: <DollarSign size={16} /> },
        { to: '/knowledge/rankings', label: '排名追踪', icon: <TrendingUp size={16} /> },
        { to: '/knowledge/competitors', label: '竞品库', icon: <Swords size={16} /> },
      ]
    },
  ]

  const adminGroup: NavGroup = {
    label: '管理', icon: <Shield size={18} />, to: undefined,
    children: [
      { to: '/settings', label: '店铺设置', icon: <Store size={16} /> },
      { to: '/admin/users', label: '子账号', icon: <Users size={16} /> },
      { to: '/admin/quotas', label: 'API配额' },
      { to: '/admin/models', label: '模型配置', icon: <Brain size={16} /> },
    ]
  }

  const renderNavLink = (to: string, label: string, icon?: React.ReactNode) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      {icon && <span className="w-4 flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </NavLink>
  )

  const renderGroup = (group: NavGroup, groupKey: string) => {
    const isExpanded = expandedGroups[groupKey]
    return (
      <div key={groupKey} className="mb-1">
        <button
          onClick={() => toggleGroup(groupKey)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          {group.icon}
          <span className="flex-1 text-left">{group.label}</span>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {isExpanded && group.children && (
          <div className="ml-2 flex flex-col gap-0.5">
            {group.children.map((c) => renderNavLink(c.to, c.label, c.icon))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-primary-700 tracking-tight">
            🔵 AI工作台
          </h1>
          <BrandBadge />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navGroups.map((g, i) => renderGroup(g, `group-${i}`))}
          {user?.role === 'admin' && renderGroup(adminGroup, 'admin')}
        </nav>

        {/* Store Switcher */}
        <div className="px-3 py-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Store size={14} />
            <span>店铺切换</span>
          </div>
          <select className="select-field mt-1 text-xs">
            <option>美国站</option>
            <option>日本站</option>
            <option>欧洲站</option>
          </select>
        </div>

        {/* User Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">{user?.username}</div>
              <div className="text-xs text-gray-400">{user?.role === 'admin' ? '管理员' : '运营'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-danger-500 transition-colors" title="退出登录">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>

      {/* Version Footer */}
      <div className="fixed bottom-0 right-0 px-3 py-1 text-xs text-gray-400 z-50">
        v1.0.0 | <BrandBadge />
      </div>
    </div>
  )
}
