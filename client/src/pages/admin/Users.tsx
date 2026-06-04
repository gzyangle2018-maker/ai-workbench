import { useState } from 'react'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'

const MOCK_USERS = [
  { id: 1, username: 'zhangsan', role: 'operator', stores: '美国站,日本站', asins: 'B0AAA,B0BBB', quota: '500/1000', status: true },
  { id: 2, username: 'lisi', role: 'operator', stores: '美国站', asins: 'B0CCC', quota: '200/500', status: true },
  { id: 3, username: 'wangwu', role: 'operator', stores: '欧洲站', asins: 'B0DDD,B0EEE', quota: '100/300', status: false },
]

export default function AdminUsers() {
  const [showEdit, setShowEdit] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield size={22} />子账号管理</h2>
          <p className="text-sm text-gray-500">管理运营子账号、权限和配额</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => { setEditUser(null); setShowEdit(true); }}>
          <Plus size={14} />新建子账号
        </button>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="px-4 py-3">用户名</th><th className="px-4 py-3">角色</th><th className="px-4 py-3">负责店铺</th><th className="px-4 py-3">负责ASIN</th><th className="px-4 py-3">API配额</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">操作</th>
          </tr></thead>
          <tbody>
            {MOCK_USERS.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.username}</td>
                <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{u.role}</span></td>
                <td className="px-4 py-3">{u.stores}</td>
                <td className="px-4 py-3 font-mono text-xs">{u.asins}</td>
                <td className="px-4 py-3">{u.quota}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status ? '🟢启用' : '🔴禁用'}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-primary-600 hover:underline text-xs" onClick={() => { setEditUser(u); setShowEdit(true); }}><Edit size={12} />编辑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Panel (simplified) */}
      {showEdit && (
        <div className="card border-2 border-primary-200">
          <div className="card-header flex items-center justify-between">
            <span>{editUser ? `编辑: ${editUser.username}` : '新建子账号'}</span>
            <button className="text-gray-400 hover:text-red-500" onClick={() => setShowEdit(false)}>✕</button>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">用户名</label><input className="input-field" defaultValue={editUser?.username || ''} /></div>
              <div><label className="block text-sm text-gray-600 mb-1">密码</label><input className="input-field" type="password" placeholder="留空不修改" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">角色</label><select className="select-field"><option>operator</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">店铺权限</label>
                <div className="space-y-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />美国站</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" />日本站</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" />欧洲站</label></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">功能权限</label>
                <div className="space-y-1">
                  {['上传数据','执行分析','查看BI','查看知识库','导出方案','周任务','新品冷启动'].map(p => (
                    <label key={p} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />{p}</label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">月API调用上限</label><input className="input-field" type="number" defaultValue={500} /></div>
              <div><label className="block text-sm text-gray-600 mb-1">月费用上限(USD)</label><input className="input-field" type="number" defaultValue={50} /></div>
            </div>
            <div className="flex gap-2"><button className="btn-primary text-sm">保存</button><button className="btn-secondary text-sm" onClick={() => setShowEdit(false)}>取消</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
