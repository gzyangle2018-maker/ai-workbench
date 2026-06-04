import { BarChart3 } from 'lucide-react'

export default function AdminQuotas() {
  const logs = [
    { user: 'zhangsan', month: '2025-01', calls: 542, cost: 27.10, limit: 1000, costLimit: 50 },
    { user: 'lisi', month: '2025-01', calls: 189, cost: 9.45, limit: 500, costLimit: 50 },
    { user: 'wangwu', month: '2025-01', calls: 98, cost: 4.90, limit: 300, costLimit: 30 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BarChart3 size={22} />API配额管理</h2>
          <p className="text-sm text-gray-500">监控各子账号API调用量与费用</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="px-4 py-3">用户</th><th className="px-4 py-3">月份</th><th className="px-4 py-3">调用次数</th><th className="px-4 py-3">费用(USD)</th><th className="px-4 py-3">次数上限</th><th className="px-4 py-3">费用上限</th><th className="px-4 py-3">使用率</th>
          </tr></thead>
          <tbody>
            {logs.map((l, i) => {
              const pct = Math.round(l.calls / l.limit * 100)
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{l.user}</td>
                  <td className="px-4 py-3">{l.month}</td>
                  <td className="px-4 py-3">{l.calls}</td>
                  <td className="px-4 py-3">${l.cost}</td>
                  <td className="px-4 py-3">{l.limit}</td>
                  <td className="px-4 py-3">${l.costLimit}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full"><div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} /></div>
                      <span className="text-xs text-gray-500">{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
