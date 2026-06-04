import { useState } from 'react'
import { Plus, Download, Search } from 'lucide-react'

export default function KeywordsKnowledge() {
  const [series, setSeries] = useState('电源线系列')
  const [intent, setIntent] = useState('')

  const keywords = [
    { word: 'power cord', level: '核心', intent: '泛词', aba: 12, search: 85000, cpc: 1.20, source: 'SP+ABA' },
    { word: 'ac power cord', level: '1级', intent: '泛词', aba: 28, search: 42000, cpc: 1.05, source: 'SP' },
    { word: 'computer power cable', level: '1级', intent: '兼容', aba: 45, search: 28000, cpc: 0.98, source: 'SP+ABA' },
    { word: 'NEMA 5-15P power cord', level: '2级', intent: '兼容', aba: 89, search: 12000, cpc: 1.35, source: 'SP' },
    { word: 'iec c13 power cord', level: '2级', intent: '兼容', aba: 102, search: 8500, cpc: 1.42, source: 'SP' },
    { word: '10ft power cord heavy duty', level: '长尾', intent: '规格+痛点', aba: 156, search: 4200, cpc: 1.15, source: 'SP' },
    { word: '3 prong power cord 6ft', level: '长尾', intent: '规格+兼容', aba: 178, search: 3600, cpc: 1.08, source: 'SP+ABA' },
    { word: 'UL listed power cord 15ft', level: '小词', intent: '认证+规格', aba: 234, search: 1200, cpc: 1.55, source: 'SP' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">关键词库</h2>
          <p className="text-sm text-gray-500 mt-1">电源线系列: 387词 · 充电线系列: 256词 · 连接线系列: 142词</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm flex items-center gap-1"><Download size={14} />导出</button>
          <button className="btn-primary text-sm flex items-center gap-1"><Plus size={14} />添加关键词</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <select className="select-field w-auto text-sm" value={series} onChange={e => setSeries(e.target.value)}>
          <option>电源线系列</option><option>充电线系列</option><option>连接线系列</option>
        </select>
        <select className="select-field w-auto text-sm" value={intent} onChange={e => setIntent(e.target.value)}>
          <option value="">全部意图</option><option>兼容/适配</option><option>规格参数</option><option>场景/用途</option><option>痛点/价值</option><option>品牌/对标</option><option>防守</option>
        </select>
        <select className="select-field w-auto text-sm"><option>全部词级</option><option>核心</option><option>1级</option><option>2级</option><option>长尾</option><option>小词</option></select>
        <select className="select-field w-auto text-sm"><option>美国站</option><option>日本站</option></select>
        <div className="relative flex-1 min-w-[200px]"><Search size={14} className="absolute left-3 top-2.5 text-gray-400" /><input className="input-field pl-9 text-sm" placeholder="搜索关键词..." /></div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="px-4 py-3">词级</th><th className="px-4 py-3">关键词</th><th className="px-4 py-3">意图层</th><th className="px-4 py-3">ABA排名</th><th className="px-4 py-3">月搜量</th><th className="px-4 py-3">CPC</th><th className="px-4 py-3">来源</th><th className="px-4 py-3">操作</th>
          </tr></thead>
          <tbody>
            {keywords.map((k, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    k.level === '核心' ? 'bg-red-100 text-red-700' :
                    k.level === '1级' ? 'bg-orange-100 text-orange-700' :
                    k.level === '2级' ? 'bg-yellow-100 text-yellow-700' :
                    k.level === '长尾' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{k.level}</span>
                </td>
                <td className="px-4 py-2.5 font-medium">{k.word}</td>
                <td className="px-4 py-2.5">{k.intent}</td>
                <td className="px-4 py-2.5">#{k.aba}</td>
                <td className="px-4 py-2.5">{k.search.toLocaleString()}</td>
                <td className="px-4 py-2.5">${k.cpc}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{k.source}</td>
                <td className="px-4 py-2.5"><button className="text-xs text-primary-600 hover:underline">编辑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Intent Distribution */}
      <div className="card"><div className="card-header">意图层级分布</div><div className="card-body space-y-2 text-sm">
        {[{ name: '兼容/适配', pct: 42, count: 162 },{ name: '规格参数', pct: 24, count: 93 },{ name: '场景用途', pct: 15, count: 58 },{ name: '痛点价值', pct: 12, count: 46 },{ name: '品牌对标', pct: 5, count: 19 },{ name: '防守', pct: 2, count: 9 }].map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-20 text-gray-600">{d.name}</span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${['bg-blue-500','bg-green-500','bg-yellow-500','bg-orange-500','bg-purple-500','bg-gray-400'][i]}`} style={{ width: `${d.pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 w-24">{d.pct}% ({d.count}词)</span>
          </div>
        ))}
      </div></div>
    </div>
  )
}
