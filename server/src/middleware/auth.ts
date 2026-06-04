import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'ai-workbench-secret-leo-young-2025'

export interface AuthRequest extends Request {
  userId?: number
  userRole?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }
  try {
    const token = header.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as any
    req.userId = payload.userId
    req.userRole = payload.role
    next()
  } catch {
    return res.status(401).json({ error: '登录已过期' })
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: '仅管理员可操作' })
  }
  next()
}

export function checkApiQuota(req: AuthRequest, res: Response, next: NextFunction) {
  const db = require('../db/connection').getDb()
  const user = db.prepare('SELECT api_quota_limit, api_cost_limit FROM users WHERE id = ?').get(req.userId) as any
  if (!user) return res.status(404).json({ error: '用户不存在' })

  const currentMonth = new Date().toISOString().slice(0, 7)
  const usage = db.prepare(`
    SELECT COUNT(*) as call_count, COALESCE(SUM(cost_estimate), 0) as total_cost
    FROM api_usage_logs
    WHERE user_id = ? AND created_at LIKE ?
  `).get(req.userId, `${currentMonth}%`) as any

  if (usage.call_count >= user.api_quota_limit) {
    return res.status(429).json({ error: 'API调用次数已达月上限' })
  }
  if (usage.total_cost >= user.api_cost_limit) {
    return res.status(429).json({ error: 'API费用已达月上限' })
  }
  next()
}

export { JWT_SECRET }
