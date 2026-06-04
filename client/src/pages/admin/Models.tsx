import { useState } from 'react'
import { Brain, Plus, Check, Star, Edit } from 'lucide-react'

const MOCK_MODELS = [
  { name: 'DeepSeek-V3', provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'DeepSeek-R1', provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-reasoner', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'Kimi (Moonshot)', provider: 'kimi', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'GLM-4 (智谱)', provider: 'glm', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'GLM-4-Flash (智谱)', provider: 'glm', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash', active: true, builtin: true, usage: 'auto_deposit', hasKey: false },
  { name: 'MiniMax', provider: 'minimax', baseUrl: 'https://api.minimax.chat/v1', model: 'abab6.5s-chat', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: '阿里百炼 Qwen-Max', provider: 'qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-max', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: '阿里百炼 Qwen-Turbo', provider: 'qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo', active: true, builtin: true, usage: 'auto_deposit', hasKey: false },
  { name: '百度文心 ERNIE-4', provider: 'wenxin', baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat', model: 'ernie-4.0-8k', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: '豆包 Doubao-Pro', provider: 'doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: 'doubao-pro-32k', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: '豆包 Doubao-Lite', provider: 'doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: 'doubao-lite-32k', active: true, builtin: true, usage: 'auto_deposit', hasKey: false },
  { name: '零一万物 Yi-Large', provider: 'yi', baseUrl: 'https://api.lingyiwanwu.com/v1', model: 'yi-large', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'OpenAI GPT-4o', provider: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'Claude Sonnet', provider: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-20250514', active: true, builtin: true, usage: 'analysis', hasKey: false },
  { name: 'Gemini 2.5 Pro', provider: 'google', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-2.5-pro', active: true, builtin: true, usage: 'analysis', hasKey: false },
]

export default function AdminModels() {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Brain size={22} />LLM模型配置</h2>
          <p className="text-sm text-gray-500">管理分析模型底座，内置国产+海外全量预置</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} />添加模型
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="px-4 py-3">名称</th><th className="px-4 py-3">提供商</th><th className="px-4 py-3">Base URL</th><th className="px-4 py-3">Model</th><th className="px-4 py-3">用途</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">API Key</th><th className="px-4 py-3">操作</th>
          </tr></thead>
          <tbody>
            {MOCK_MODELS.map((m, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium flex items-center gap-1">{m.name} {m.builtin && <span className="text-xs bg-gray-100 text-gray-500 px-1 rounded">内置</span>}</td>
                <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{m.provider}</span></td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[200px] truncate">{m.baseUrl}</td>
                <td className="px-4 py-3 font-mono text-xs">{m.model}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${m.usage === 'auto_deposit' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{m.usage === 'auto_deposit' ? '自动沉淀' : '分析'}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${m.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.active ? '🟢' : '🔴'}</span></td>
                <td className="px-4 py-3">{m.hasKey ? <Check size={14} className="text-green-500" /> : <span className="text-xs text-yellow-600">待填写</span>}</td>
                <td className="px-4 py-3"><button className="text-primary-600 hover:underline text-xs flex items-center gap-1"><Edit size={12} />配置Key</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Model Form */}
      {showAdd && (
        <div className="card border-2 border-primary-200">
          <div className="card-header flex items-center justify-between"><span>添加模型</span><button className="text-gray-400 hover:text-red-500" onClick={() => setShowAdd(false)}>✕</button></div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">显示名称</label><input className="input-field" placeholder="e.g. GPT-5.5" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">提供商</label><select className="select-field"><option>openai</option><option>google</option><option>anthropic</option><option>deepseek</option><option>kimi</option><option>glm</option></select></div>
              <div><label className="block text-sm text-gray-600 mb-1">Base URL</label><input className="input-field" placeholder="https://api.openai.com/v1" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">Model Name</label><input className="input-field" placeholder="gpt-5.5" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">API Key</label><input className="input-field" type="password" placeholder="sk-..." /></div>
              <div><label className="block text-sm text-gray-600 mb-1">用途</label><select className="select-field"><option>analysis</option><option>auto_deposit</option></select></div>
            </div>
            <div className="flex gap-2"><button className="btn-primary text-sm">保存</button><button className="btn-secondary text-sm" onClick={() => setShowAdd(false)}>取消</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
