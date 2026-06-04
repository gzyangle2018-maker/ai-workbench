import { useState } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'

const COLUMNS = [
  { id: 'todo', title: '待执行', count: 5, color: 'bg-gray-100' },
  { id: 'doing', title: '执行中', count: 3, color: 'bg-blue-50' },
  { id: 'verify', title: '待验证', count: 2, color: 'bg-yellow-50' },
  { id: 'done', title: '已完成', count: 8, color: 'bg-green-50' },
]

const MOCK_TASKS = {
  todo: [
    { id: 1, priority: 'P0', title: '预算调整: B0XXX-SP-Broad $50→$100/天', assignee: '张三', due: '1.14', dimension: '预算' },
    { id: 2, priority: 'P0', title: '竞价调整: B0XXX-SP-Exact +0.2→$1.15', assignee: '张三', due: '1.14', dimension: '竞价' },
    { id: 3, priority: 'P1', title: '加精准词: +3个Exact词到B0YYY', assignee: '李四', due: '1.15', dimension: '加词' },
    { id: 4, priority: 'P1', title: '广告位溢价: Top位+30%', assignee: '李四', due: '1.16', dimension: '广告位' },
    { id: 5, priority: 'P2', title: 'SBV素材审核: 新视频脚本', assignee: '王五', due: '1.18', dimension: 'SBV' },
  ],
  doing: [
    { id: 6, priority: 'P1', title: '否词操作: B0ZZZ-SP-Auto 否定5个词', assignee: '李四', due: '1.15', dimension: '否词' },
    { id: 7, priority: 'P0', title: '拆精准: "power cord 6ft" 单拉Exact组', assignee: '张三', due: '1.13', dimension: '拆精准' },
  ],
  verify: [
    { id: 8, priority: 'P1', title: '检查ACOS回落: B0XXX 48h后 < 25%', assignee: '张三', due: '1.17', dimension: '监控' },
  ],
}

export default function Tasks() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">周任务</h2>
          <p className="text-sm text-gray-500">2025年第3周 (1.13-1.19)</p>
        </div>
        <div className="flex gap-2">
          <select className="select-field w-auto text-sm"><option>全部负责人</option><option>张三</option><option>李四</option></select>
          <button className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} /> 新建任务</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map(col => (
          <div key={col.id} className={`${col.color} rounded-xl p-4 min-h-[300px]`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">{col.title} ({col.count})</h3>
              <button><MoreHorizontal size={14} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {(MOCK_TASKS as any)[col.id]?.map((task: any) => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      task.priority === 'P0' ? 'bg-red-100 text-red-700' :
                      task.priority === 'P1' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>{task.priority}</span>
                    <span className="text-xs text-gray-400">{task.dimension}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{task.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>👤 {task.assignee}</span>
                    <span>📅 {task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
