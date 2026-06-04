import { useState } from 'react'
import { Search, TrendingUp } from 'lucide-react'

export default function CpcKnowledge() {
  const [keyword, setKeyword] = useState('power cord')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">CPC竞价库</h2>
        <div className="flex gap-2">
          <select className="select-field w-auto text-sm"><option>美国站</option><option>日本站</option></select>
          <div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-gray-400" /><input className="input-field pl-9 text-sm" placeholder="搜索关键词..." value={keyword} onChange={e => setKeyword(e.target.value)} /></div>
        </div>
      </div>

      {/* CPC Trend */}
      <div className="card"><div className="card-header">📈 CPC趋势: "{keyword}"</div>
        <div className="card-body h-64 flex items-center justify-center text-gray-400 text-sm border rounded-lg">
          CPC趋势图 (Recharts渲染: 建议低出价/高出价/实际CPC曲线)
        </div>
      </div>

      {/* Bid Reference Card */}
      <div className="card"><div className="card-header">💡 出价参考卡</div><div className="card-body">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">当前市场CPC</span><div className="text-xl font-bold text-gray-800">$1.20</div></div>
          <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">近3月均值</span><div className="text-xl font-bold text-gray-800">$1.18</div></div>
          <div className="bg-blue-50 rounded-lg p-3"><span className="text-blue-600">保守出价</span><div className="text-xl font-bold text-blue-700">$0.95</div></div>
          <div className="bg-primary-50 rounded-lg p-3"><span className="text-primary-600">平衡出价</span><div className="text-xl font-bold text-primary-700">$1.15</div></div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
          <TrendingUp size={14} className="inline mr-1" />
          <strong>排名预测：</strong>出价 $1.15 → 预估广告排名 #3~5，自然排名 #8~12，ABA排名 #12
        </div>
      </div></div>

      {/* Cross-market CPC */}
      <div className="card"><div className="card-header">🌍 同类目CPC对比</div><div className="card-body">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">关键词</th><th className="pb-2">美国站</th><th className="pb-2">日本站</th><th className="pb-2">欧洲站</th><th className="pb-2">趋势</th></tr></thead>
          <tbody>
            {[['power cord','$1.20','¥85','€0.95','↑'],['ac power cable','$1.05','¥72','€0.82','→'],['computer power cord','$0.98','¥68','€0.78','↓']].map((r,i) => (
              <tr key={i} className="border-b border-gray-50"><td className="py-2">{r[0]}</td><td className="py-2">{r[1]}</td><td className="py-2">{r[2]}</td><td className="py-2">{r[3]}</td><td className="py-2">{r[4]}</td></tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  )
}
