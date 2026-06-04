import { Store, Plus } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Store size={22} />店铺设置</h2>
          <p className="text-sm text-gray-500">管理店铺、ASIN绑定和产品系列</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} />添加店铺</button>
      </div>

      {/* Stores */}
      <div className="card"><div className="card-header">已绑定店铺</div><div className="card-body">
        <div className="space-y-3">
          {[
            { name: '美国站', market: 'US', currency: 'USD', asins: 3, series: ['电源线系列','充电线系列'] },
            { name: '日本站', market: 'JP', currency: 'JPY', asins: 0, series: [] },
            { name: '欧洲站', market: 'EU', currency: 'EUR', asins: 0, series: [] },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{s.name} <span className="text-xs text-gray-400">({s.market})</span></div>
                <div className="text-xs text-gray-500 mt-1">{s.currency} · {s.asins}个ASIN · {s.series.length}个系列</div>
                {s.series.length > 0 && <div className="flex gap-1 mt-1">{s.series.map(ser => <span key={ser} className="text-xs bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded">{ser}</span>)}</div>}
              </div>
              <button className="text-sm text-primary-600 hover:underline">管理</button>
            </div>
          ))}
        </div>
      </div></div>
    </div>
  )
}
