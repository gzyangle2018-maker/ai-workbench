import { useParams } from 'react-router-dom'
import { Download, RefreshCw } from 'lucide-react'

export default function Analysis() {
  const { id } = useParams()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分析结果</h2>
          <p className="text-sm text-gray-500">B0EXAMPLE1 · {id === 'latest' ? '最新分析' : `#${id}`} · 2025-01-15</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><RefreshCw size={14} /> 重新分析</button>
          <button className="btn-primary flex items-center gap-2"><Download size={14} /> 导出Excel</button>
        </div>
      </div>

      {/* Data Directory */}
      <div className="card"><div className="card-header">📋 数据目录</div><div className="card-body text-sm text-gray-600">
        第1波: 2025-01-01~01-14 | SP搜索词/SB搜索词/Placement | ASIN:3 | 活动:12<br/>
        第2波: 2025-01-01~01-14 | Business Reports/ABA ASIN | ASIN:3
      </div></div>

      {/* ASIN Panel */}
      <div className="card"><div className="card-header">📊 ASIN总览面板</div><div className="card-body">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
          {['Spend:$4,200','Sales:$19,800','Orders:423','ACOS:21.2%','TACOS:9.1%','CPC:$0.92'].map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-center font-medium">{m}</div>
          ))}
        </div>
      </div></div>

      {/* Core Diagnosis */}
      <div className="card"><div className="card-header">🔍 核心诊断</div><div className="card-body text-sm space-y-1">
        <p>🔴 <strong>主问题：</strong>竞品ASIN吃预算</p>
        <p>🟡 <strong>次问题：</strong>词路由混乱、企业购可放大</p>
        <p>可信度：<span className="text-green-600 font-medium">高</span> | 页面优先：否 | 缺失：AMC报表、SBV视频数据</p>
      </div></div>

      {/* Action Plans */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>📋 12维行动方案</span>
          <div className="flex gap-2 text-sm">
            <select className="select-field w-auto text-xs"><option>全部优先级</option><option>🔴 P0</option><option>🟡 P1</option><option>🟢 P2</option></select>
            <select className="select-field w-auto text-xs"><option>全部维度</option><option>预算</option><option>竞价</option><option>加词</option></select>
            <input className="input-field w-40 text-xs" placeholder="🔍 搜索词/ASIN" />
          </div>
        </div>
        <div className="card-body space-y-4">
          {/* P0 */}
          <div>
            <h4 className="text-sm font-bold text-danger-600 mb-2">🔴 P0 - 立即执行</h4>
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 space-y-2 text-sm">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-danger-100"><td className="py-1 pr-4 text-gray-500 w-20">活动</td><td className="py-1">B0EXAMPLE1-SP-Broad-Prospecting-v1</td></tr>
                  <tr className="border-b border-danger-100"><td className="py-1 pr-4 text-gray-500">广告组</td><td className="py-1">Broad-01</td></tr>
                  <tr><td className="py-1 pr-4 text-gray-500">操作</td><td className="py-1 space-y-1">
                    <div><span className="badge-p0 mr-1">预算</span> $50/天 → <strong>$100/天</strong> · 近3天ACOS=18%&lt;20%，加100%</div>
                    <div><span className="badge-p0 mr-1">竞价</span> "power cord 10ft" +0.2 → <strong>$1.15</strong> · ACOS=8%</div>
                    <div><span className="badge-p0 mr-1">加词</span> +Exact: "NEMA 5-15P power cord" / +Phrase: "heavy duty"</div>
                    <div><span className="badge-p0 mr-1">否词</span> 否定: "power cord 100ft" (10点击0单)</div>
                  </td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* P1 */}
          <div>
            <h4 className="text-sm font-bold text-warning-600 mb-2">🟡 P1 - 本周执行</h4>
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 text-sm text-gray-500">
              (同上结构，其他活动/广告组的P1动作...)
            </div>
          </div>

          {/* P2 */}
          <div>
            <h4 className="text-sm font-bold text-success-600 mb-2">🟢 P2 - 观察后执行</h4>
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-sm text-gray-500">
              (同上结构，低优先级动作...)
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Comparison */}
      <div className="card"><div className="card-header">📐 三套方案对比</div><div className="card-body">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b">
            <th className="pb-2">方案</th><th className="pb-2">预估单量增幅</th><th className="pb-2">ACOS波动</th><th className="pb-2">回落周期</th><th className="pb-2">月预算</th><th className="pb-2">推荐</th>
          </tr></thead>
          <tbody>
            <tr className="border-b border-gray-50"><td className="py-2">保守</td><td>+30%~50%</td><td>18%~25%</td><td>2周</td><td>$5,200</td><td></td></tr>
            <tr className="border-b border-gray-50 bg-primary-50"><td className="py-2">平衡</td><td>+60%~90%</td><td>20%~32%</td><td>3周</td><td>$6,800</td><td>⭐推荐</td></tr>
            <tr><td className="py-2">激进</td><td>+100%~150%</td><td>25%~42%</td><td>5周</td><td>$9,200</td><td></td></tr>
          </tbody>
        </table>
      </div></div>

      {/* Knowledge Deposit */}
      <div className="card border-2 border-primary-200 bg-primary-50">
        <div className="card-body flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium text-primary-800">🆕 知识库沉淀</p>
            <p className="text-primary-600">本次发现 <strong>23个新词</strong> · <strong>5个竞品ASIN</strong> · CPC数据已自动写入</p>
          </div>
          <button className="btn-primary text-sm">一键加入知识库</button>
        </div>
      </div>
    </div>
  )
}
