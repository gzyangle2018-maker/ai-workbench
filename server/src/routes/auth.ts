import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from '../db/connection'
import { JWT_SECRET, authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名和密码' })
  }

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1').get(username) as any
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  // Get accessible stores
  const stores = db.prepare(`
    SELECT s.id, s.name, s.marketplace FROM stores s
    INNER JOIN user_store_access usa ON s.id = usa.store_id
    WHERE usa.user_id = ?
  `).all(user.id) as any[]

  // Get accessible ASINs
  const asins = db.prepare(`
    SELECT a.id, a.asin_code, a.product_name FROM asins a
    INNER JOIN user_asin_access uaa ON a.id = uaa.asin_id
    WHERE uaa.user_id = ?
  `).all(user.id) as any[]

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      storeIds: stores.map((s: any) => s.id),
      asinIds: asins.map((a: any) => a.id),
      permissions: JSON.parse(user.permissions),
      apiQuotaLimit: user.api_quota_limit,
      apiCostLimit: user.api_cost_limit,
    },
    stores,
    asins,
  })
})

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any
  if (!user) return res.status(404).json({ error: '用户不存在' })

  const stores = db.prepare(`
    SELECT s.id, s.name, s.marketplace FROM stores s
    INNER JOIN user_store_access usa ON s.id = usa.store_id WHERE usa.user_id = ?
  `).all(user.id)

  const asins = db.prepare(`
    SELECT a.id, a.asin_code, a.product_name FROM asins a
    INNER JOIN user_asin_access uaa ON a.id = uaa.asin_id WHERE uaa.user_id = ?
  `).all(user.id)

  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      storeIds: (stores as any[]).map((s: any) => s.id),
      asinIds: (asins as any[]).map((a: any) => a.id),
      permissions: JSON.parse(user.permissions),
      apiQuotaLimit: user.api_quota_limit,
      apiCostLimit: user.api_cost_limit,
    },
    stores,
    asins,
  })
})

export default router
