import { useState, useEffect } from 'react'
import api from '../services/api'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Target, Percent, MousePointer, Eye, BarChart3, AlertTriangle
} from 'lucide-react'

interface Summary {
  spend: number; spendChange: number
  sales: number; salesChange: number
  orders: number; ordersChange: number
  acos: number; acosChange: number
  tacos: number; tacosChange: number
  cpc: number; cpcChange: number
  ctr: number; cvr: number; topOfSearchPct: number
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [asins, setAsins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [sRes, tRes, aRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/trends'),
          api.get('/dashboard/asin-ranking'),
        ])
        setSummary(sRes.data)
        setTrends(tRes.data.trends)
        setAsins(aRes.data.asins)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-gray-400">加载中...</div>

  const cards = summary ? [
    { label: '总花费', value: `$${summary.spend.toLocaleString()}`, change: summary.spendChange, icon: <DollarSign size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '总销售额', value: `$${summary.sales.toLocaleString()}`, change: summary.salesChange, icon: <ShoppingCart size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '总订单', value: summary.orders.toLocaleString(), change: summary.ordersChange, icon: <BarChart3 size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'ACOS', value: `${summary.acos}%`, change: summary.acosChange, icon: <Target size={20} />, color: 'text-orange-600', bg: 'bg-orange-50', invert: true },
    { label: 'TACOS', value: `${summary.tacos}%`, change: summary.tacosChange, icon: <Percent size={20} />, color: 'text-teal-600', bg: 'bg-teal-50', invert: true },
    { label: 'CPC均值', value: `$${summary.cpc}`, change: summary.cpcChange, icon: <MousePointer size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ] : []

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">BI看板</h2>
          <p className="text-sm text-gray-500 mt-1">美国站 · 全部系列</p>
        </div>
        <div className="flex gap-2">
          <select className="select-field w-auto text-sm">
            <option>本周</option><option>本月</option><option>近30天</option><option>近90天</option>
          </select>
          <button className="btn-secondary text-sm">导出</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${c.bg} ${c.color}`}>{c.icon}</div>
              <span className="text-xs text-gray-500">{c.label}</span>
            </div>
            <div className="text-xl font-bold text-gray-800">{c.value}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${(c.invert ? -c.change : c.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {c.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {c.change > 0 ? '↑' : '↓'}{Math.abs(c.change)}% vs上周
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="flex gap-4">
        {summary && summary.acos > 25 && (
          <div className="flex-1 bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-danger-500" />
            <span className="text-sm text-danger-700 font-medium">ACOS预警：B0EXAMPLE3 当前ACOS 38%，已超标！</span>
          </div>
        )}
      </div>

      {/* Trends + ASIN Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">📈 ACOS/TACOS 日趋势 (近30天)</div>
          <div className="card-body h-64 flex items-center justify-center text-gray-400 text-sm">
            趋势图区域 (Recharts集成后可渲染)
          </div>
        </div>
        <div className="card">
          <div className="card-header">🏆 ASIN广告效率排行</div>
          <div className="card-body">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">ASIN</th><th className="pb-2">产品</th><th className="pb-2">ACOS</th><th className="pb-2">花费</th><th className="pb-2">订单</th>
                </tr>
              </thead>
              <tbody>
                {asins.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 font-mono text-xs">{a.asin_code}</td>
                    <td className="py-2">{a.product_name}</td>
                    <td className={`py-2 font-medium ${a.acos > 30 ? 'text-danger-600' : a.acos > 20 ? 'text-warning-600' : 'text-success-600'}`}>{a.acos}%</td>
                    <td className="py-2">${a.spend.toLocaleString()}</td>
                    <td className="py-2">{a.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="card">
        <div className="card-header">📊 全指标筛选</div>
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {['曝光','点击','CTR','CVR','花费','ACOS','TACOS','广告销售额','订单','CPC','SP','SB','SD','Top位占比','ROAS'].map(m => (
              <label key={m} className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-primary-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">designed by Leo Young in Shenzhen China</p>
    </div>
  )
}
