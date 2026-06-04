import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)
router.use(adminOnly)

// GET /api/users
router.get('/', (_req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const users = db.prepare(`
    SELECT id, username, role, is_active, permissions, api_quota_limit, api_cost_limit, created_at
    FROM users ORDER BY created_at DESC
  `).all()
  res.json({ users })
})

// POST /api/users
router.post('/', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { username, password, role, storeIds, asinIds, permissions, apiQuotaLimit, apiCostLimit } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码必填' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) return res.status(409).json({ error: '用户名已存在' })

  const hash = bcrypt.hashSync(password, 10)
  const result = db.prepare(`
    INSERT INTO users (username, password_hash, role, permissions, api_quota_limit, api_cost_limit)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(username, hash, role || 'operator', JSON.stringify(permissions || {}), apiQuotaLimit || 500, apiCostLimit || 50)

  const userId = result.lastInsertRowid

  // Assign store access
  if (storeIds?.length) {
    const insert = db.prepare('INSERT OR IGNORE INTO user_store_access (user_id, store_id) VALUES (?, ?)')
    for (const sid of storeIds) insert.run(userId, sid)
  }
  if (asinIds?.length) {
    const insert = db.prepare('INSERT OR IGNORE INTO user_asin_access (user_id, asin_id) VALUES (?, ?)')
    for (const aid of asinIds) insert.run(userId, aid)
  }

  res.json({ id: userId, message: '创建成功' })
})

// PUT /api/users/:id
router.put('/:id', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { role, isActive, storeIds, asinIds, permissions, apiQuotaLimit, apiCostLimit } = req.body

  db.prepare(`
    UPDATE users SET role = ?, is_active = ?, permissions = ?, api_quota_limit = ?, api_cost_limit = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(role, isActive ? 1 : 0, JSON.stringify(permissions || {}), apiQuotaLimit, apiCostLimit, req.params.id)

  // Reassign access
  if (storeIds) {
    db.prepare('DELETE FROM user_store_access WHERE user_id = ?').run(req.params.id)
    const insert = db.prepare('INSERT OR IGNORE INTO user_store_access (user_id, store_id) VALUES (?, ?)')
    for (const sid of storeIds) insert.run(req.params.id, sid)
  }
  if (asinIds) {
    db.prepare('DELETE FROM user_asin_access WHERE user_id = ?').run(req.params.id)
    const insert = db.prepare('INSERT OR IGNORE INTO user_asin_access (user_id, asin_id) VALUES (?, ?)')
    for (const aid of asinIds) insert.run(req.params.id, aid)
  }

  res.json({ message: '更新成功' })
})

export default router
