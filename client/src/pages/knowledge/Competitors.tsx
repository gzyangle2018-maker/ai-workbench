import { useState } from 'react'
import { Plus, ExternalLink, Target } from 'lucide-react'

export default function CompetitorsKnowledge() {
  const [view, setView] = useState<'brand' | 'asin'>('brand')

  const brands = [
    { brand: 'CableMatters', asins: 8, avgPrice: 12.99, rating: 4.5, bsr: 2300, status: '🟢活跃', strategy: '对标攻击' },
    { brand: 'Monoprice', asins: 6, avgPrice: 10.50, rating: 4.3, bsr: 1800, status: '🟢活跃', strategy: '价格防守' },
    { brand: 'Amazon Basics', asins: 12, avgPrice: 9.99, rating: 4.4, bsr: 890, status: '🟡关注', strategy: '避免正面' },
    { brand: 'StarTech', asins: 5, avgPrice: 15.99, rating: 4.6, bsr: 4200, status: '🟡关注', strategy: '高价截流' },
    { brand: 'Cablelera', asins: 3, avgPrice: 8.99, rating: 4.1, bsr: 5600, status: '🔴衰落', strategy: '可攻击' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">竞品库</h2>
        <div className="flex gap-2">
          <select className="select-field w-auto text-sm"><option>美国站</option></select>
          <button className="btn-primary text-sm flex items-center gap-1"><Plus size={14} />添加竞品</button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'brand' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`} onClick={() => setView('brand')}>品牌视图</button>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'asin' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`} onClick={() => setView('asin')}>ASIN视图</button>
      </div>

      {view === 'brand' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3">品牌</th><th className="px-4 py-3">ASIN数</th><th className="px-4 py-3">均价</th><th className="px-4 py-3">评分</th><th className="px-4 py-3">BSR</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">策略</th><th className="px-4 py-3">操作</th>
            </tr></thead>
            <tbody>
              {brands.map((b, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.brand}</td>
                  <td className="px-4 py-3">{b.asins}</td>
                  <td className="px-4 py-3">${b.avgPrice}</td>
                  <td className="px-4 py-3">{b.rating}★</td>
                  <td className="px-4 py-3">#{b.bsr.toLocaleString()}</td>
                  <td className="px-4 py-3">{b.status}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{b.strategy}</span></td>
                  <td className="px-4 py-3"><button className="text-primary-600 hover:underline text-xs">详情</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-6 text-gray-400 text-sm">ASIN视图 - 展示单个竞品ASIN详情与打法分析</div>
      )}

      {/* Selected Competitor Detail */}
      <div className="card border-l-4 border-primary-500"><div className="card-header flex items-center gap-2"><Target size={16} className="text-primary-600" />CableMatters 打法分析</div>
        <div className="card-body text-sm space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg"><strong className="text-green-700">🟢 优势词（它排名高我们低）</strong>
              <p className="mt-1">"UL listed power cord" 它#3 我们#15 → <span className="text-primary-600 font-medium">加Exact打</span></p>
              <p>"3 pack power cord" 它#1 我们#22 → <span className="text-primary-600 font-medium">组合装差异化</span></p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg"><strong className="text-red-700">🔴 可攻击点</strong>
              <p className="mt-1">价格比我高 +$3 → <span className="text-primary-600 font-medium">广告位抢Top</span></p>
              <p>差评"插头松" → <span className="text-primary-600 font-medium">主打"no loose fit"痛点词</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
