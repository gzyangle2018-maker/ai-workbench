import { useState } from 'react'
import { Upload as UploadIcon, Check, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react'

const STEPS = ['选择店铺+ASIN', '上传报表文件', '设定目标 & 确认']

export default function Upload() {
  const [step, setStep] = useState(0)

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">数据投喂</h2>

      {/* Step Indicator */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <ArrowRight size={16} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        <div className="card-body space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Step 1: 选择目标</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">店铺</label>
                  <select className="select-field"><option>美国站</option><option>日本站</option><option>欧洲站</option></select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">产品系列</label>
                  <select className="select-field"><option>电源线系列</option><option>充电线系列</option></select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">ASIN</label>
                  <select className="select-field"><option>B0EXAMPLE1 - 电源线 10ft</option><option>B0EXAMPLE2 - 电源线 6ft</option></select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Step 2: 上传报表</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <UploadIcon size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">拖拽Excel文件到此处或点击上传</p>
                <p className="text-xs text-gray-400 mt-1">支持 .xlsx / .xls / .csv，最多10个文件</p>
              </div>

              {/* File List */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-sm">SP搜索词报告.xlsx</span>
                    <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">已识别：SP Search Term</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500">✕</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-yellow-600" />
                    <span className="text-sm">未命名文件.xlsx</span>
                    <span className="text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">未识别 → 手动选择 ↓</span>
                  </div>
                  <select className="select-field w-auto text-xs"><option>选择类型...</option><option>SP搜索词</option><option>SB搜索词</option><option>Business Report</option></select>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} /> 缺失提醒：未上传 Business Reports → 无法判断页面转化优先级
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Step 3: 设定目标</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">短期目标(15天) - 允许ACOS ≤</label>
                  <input type="number" className="input-field" defaultValue={30} placeholder="30" />%
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">短期目标(15天) - 允许TACOS ≤</label>
                  <input type="number" className="input-field" defaultValue={15} placeholder="15" />%
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">长期目标(3月) - 目标ACOS ≤</label>
                  <input type="number" className="input-field" defaultValue={20} placeholder="20" />%
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">长期目标(3月) - 目标TACOS ≤</label>
                  <input type="number" className="input-field" defaultValue={10} placeholder="10" />%
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">预算上限 (销售额%)</label>
                  <input type="number" className="input-field" defaultValue={10} />%
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">前2周ACOS容忍上浮</label>
                  <input type="number" className="input-field" defaultValue={15} />%
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">LLM模型</label>
                <select className="select-field w-auto">
                  <option>DeepSeek-V3 (默认)</option>
                  <option>GPT-4o</option>
                  <option>Claude Sonnet</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button className="btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>上一步</button>
        {step < 2 ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)}>下一步 →</button>
        ) : (
          <button className="btn-primary flex items-center gap-2">
            <FileSpreadsheet size={16} /> 开始分析
          </button>
        )}
      </div>
    </div>
  )
}
