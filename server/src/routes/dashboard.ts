import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/dashboard/summary
router.get('/summary', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  // Mock dashboard data
  res.json({
    spend: 12450,
    spendChange: 12,
    sales: 58200,
    salesChange: 8,
    orders: 1234,
    ordersChange: 15,
    acos: 21.4,
    acosChange: -2.1,
    tacos: 9.8,
    tacosChange: -0.5,
    cpc: 0.87,
    cpcChange: 0,
    ctr: 0.48,
    cvr: 12.3,
    topOfSearchPct: 34,
  })
})

// GET /api/dashboard/trends
router.get('/trends', (req: AuthRequest, res) => {
  // Mock trend data
  const days = 30
  const trends = Array.from({ length: days }, (_, i) => ({
    date: new Date(2025, 0, i + 1).toISOString().slice(0, 10),
    spend: 300 + Math.random() * 200,
    sales: 1200 + Math.random() * 800,
    acos: 18 + Math.random() * 10,
    tacos: 7 + Math.random() * 5,
    orders: 30 + Math.floor(Math.random() * 20),
  }))
  res.json({ trends })
})

// GET /api/dashboard/asin-ranking
router.get('/asin-ranking', (req: AuthRequest, res) => {
  res.json({
    asins: [
      { asin_code: 'B0EXAMPLE1', product_name: '电源线 10ft', spend: 3200, sales: 18500, orders: 456, acos: 17.3, cpc: 0.85, cvr: 14.2 },
      { asin_code: 'B0EXAMPLE2', product_name: '电源线 6ft', spend: 4100, sales: 22100, orders: 389, acos: 18.6, cpc: 0.92, cvr: 11.8 },
      { asin_code: 'B0EXAMPLE3', product_name: '充电线 USB-C', spend: 2800, sales: 12400, orders: 220, acos: 22.6, cpc: 0.78, cvr: 10.5 },
    ]
  })
})

// GET /api/dashboard/changelog
router.get('/changelog', (_req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const logs = db.prepare('SELECT * FROM changelog ORDER BY created_at DESC LIMIT 20').all()
  res.json({ changelog: logs })
})

export default router
