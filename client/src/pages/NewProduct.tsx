import { useState } from 'react'
import { Rocket, Check, ArrowRight, Download, Settings } from 'lucide-react'

const STEPS = ['选系列+站点+ASIN', '配置目标参数', '生成广告架构', '导出执行清单']

export default function NewProduct() {
  const [step, setStep] = useState(0)

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Rocket size={24} className="text-primary-600" /> 新品冷启动
      </h2>

      {/* Step Indicator */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{i < step ? <Check size={16} /> : i + 1}</div>
              <span className={`text-sm ${i <= step ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{label}</span>
              {i < 3 && <ArrowRight size={16} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="card"><div className="card-body space-y-4">
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium text-gray-600 mb-1">产品系列</label><select className="select-field"><option>电源线系列 (387词)</option><option>充电线系列 (256词)</option></select></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">站点</label><select className="select-field"><option>美国站</option><option>日本站</option></select></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">新品ASIN</label><input className="input-field" placeholder="B0NEW001" /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">预算/天</label><input className="input-field" defaultValue={80} type="number" /> USD</div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">对标品牌</label>
              <div className="flex gap-2"><select className="select-field"><option>CableMatters</option><option>Monoprice</option></select><button className="btn-secondary text-xs">+ 添加</button></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-600 mb-1">新品期(30天) ACOS允许</label><input className="input-field" defaultValue={35} />%</div>
            <div><label className="block text-sm text-gray-600 mb-1">稳定期(90天) ACOS目标</label><input className="input-field" defaultValue={20} />%</div>
            <div className="col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />前2周拓量优先</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />自动拆精准组</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />自动否定低效词</label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">自动生成广告架构预览</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm font-mono">
              <div className="text-primary-700 font-semibold">SP ─────</div>
              <div className="pl-4">├─ B0NEW001-SP-Auto-Prospecting-v1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 预算:$20/天 出价:$0.85</div>
              <div className="pl-4">├─ B0NEW001-SP-Broad-Prospecting-v1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 预算:$25/天 出价:$0.95 · 28个Broad词</div>
              <div className="pl-4">├─ B0NEW001-SP-Exact-Harvest-v1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 预算:$20/天 出价:$1.15 · 15个Exact词</div>
              <div className="pl-4">└─ B0NEW001-SP-ASIN-Competitor-v1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 预算:$15/天 出价:$0.65 · 8个竞品ASIN</div>
              <div className="text-primary-700 font-semibold">SB ─────</div>
              <div className="pl-4">└─ B0NEW001-SB-Keyword-Harvest-v1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 预算:$15/天 出价:$0.75</div>
              <div className="text-primary-700 font-semibold">SD ─────</div>
              <div className="pl-4">└─ B0NEW001-SD-Remarketing-Defense-v1 &nbsp; 预算:$10/天</div>
            </div>
            <div className="flex justify-between text-sm"><span>总预算: <strong>$105/天</strong></span><span>关键词: <strong>43</strong></span><span>竞品ASIN: <strong>8</strong></span></div>
            <div className="flex gap-2"><button className="btn-secondary text-xs flex items-center gap-1"><Settings size={12} />调整预算分配</button><button className="btn-secondary text-xs">增删关键词</button></div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <Check size={48} className="mx-auto text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">广告架构已生成！</h3>
            <p className="text-gray-500">可导出Excel执行清单供运营照搬操作</p>
            <div className="flex gap-2 justify-center">
              <button className="btn-primary flex items-center gap-2"><Download size={14} />导出Excel执行清单</button>
              <button className="btn-secondary">保存为模板</button>
            </div>
          </div>
        )}
      </div></div>

      <div className="flex justify-between">
        <button className="btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>上一步</button>
        {step < 3 && <button className="btn-primary" onClick={() => setStep(s => s + 1)}>下一步 →</button>}
      </div>
    </div>
  )
}
