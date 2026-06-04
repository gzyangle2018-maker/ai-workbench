import { useState } from 'react'
import { Plus, Flag } from 'lucide-react'

export default function RankingsKnowledge() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">排名追踪</h2>
        <div className="flex gap-2">
          <select className="select-field w-auto text-sm"><option>B0EXAMPLE1</option><option>B0EXAMPLE2</option></select>
          <button className="btn-primary text-sm flex items-center gap-1"><Plus size={14} />添加追踪</button>
        </div>
      </div>

      {/* Ranking Chart */}
      <div className="card"><div className="card-header">📈 "power cord" 排名趋势 - B0EXAMPLE1</div>
        <div className="card-body">
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm border rounded-lg">
            排名趋势图 (Recharts: 自然排名/广告排名双曲线 + 事件标记点)
          </div>
          <div className="mt-3 flex gap-4 text-xs text-gray-500">
            <span><Flag size={12} className="inline text-blue-500" /> 1/8 加精准组 → 排名18→12 ↑6</span>
            <span><Flag size={12} className="inline text-red-500" /> 1/15 竞品降价 → 排名12→15 ↓3</span>
            <span><Flag size={12} className="inline text-green-500" /> 1/25 企业购溢价 → 排名10→7 ↑3</span>
          </div>
        </div>
      </div>

      {/* Snapshot Table */}
      <div className="card"><div className="card-header">📊 排名快照表</div><div className="card-body">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">日期</th><th className="pb-2">自然排名</th><th className="pb-2">广告排名</th><th className="pb-2">ABA排名</th><th className="pb-2">点击份额</th><th className="pb-2">ACOS</th><th className="pb-2">变化</th></tr></thead>
          <tbody>
            {[['2025-02-05','#8','#3','#12','4.2%','18%','↑2'],['2025-02-04','#10','#4','#12','3.8%','19%','→'],['2025-02-03','#10','#5','#11','3.6%','20%','↓1']].map((r,i) => (
              <tr key={i} className="border-b border-gray-50"><td className="py-2">{r[0]}</td><td className="py-2 font-medium">{r[1]}</td><td className="py-2">{r[2]}</td><td className="py-2">{r[3]}</td><td className="py-2">{r[4]}</td><td className="py-2">{r[5]}</td><td className={`py-2 ${r[6].includes('↑') ? 'text-green-600' : r[6].includes('↓') ? 'text-red-600' : 'text-gray-400'}`}>{r[6]}</td></tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  )
}
