import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// POST /api/analyses/start - start analysis
router.post('/start', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { asinId, batchIds, modelConfigId, targets } = req.body

  const result = db.prepare(`
    INSERT INTO analyses (asin_id, batch_ids, model_name, target_short_acos, target_long_acos, target_tacos, budget_cap_pct, risk_tolerance_pct, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    asinId,
    JSON.stringify(batchIds),
    targets?.modelName || 'deepseek-chat',
    targets?.shortAcos || 30,
    targets?.longAcos || 20,
    targets?.tacos || 10,
    targets?.budgetCap || 10,
    targets?.riskTolerance || 15,
    req.userId
  )

  res.json({ analysisId: result.lastInsertRowid, status: 'pending' })
})

// GET /api/analyses - list analyses
router.get('/', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const analyses = db.prepare(`
    SELECT a.*, asins.asin_code, asins.product_name
    FROM analyses a
    LEFT JOIN asins ON a.asin_id = asins.id
    ORDER BY a.created_at DESC
  `).all()
  res.json({ analyses })
})

// GET /api/analyses/:id - get analysis detail with action plans
router.get('/:id', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const analysis = db.prepare(`
    SELECT a.*, asins.asin_code, asins.product_name
    FROM analyses a
    LEFT JOIN asins ON a.asin_id = asins.id
    WHERE a.id = ?
  `).get(req.params.id)

  if (!analysis) return res.status(404).json({ error: '分析不存在' })

  const actionPlans = db.prepare(`
    SELECT * FROM action_plans WHERE analysis_id = ? ORDER BY priority, dimension
  `).all(req.params.id)

  res.json({ analysis, actionPlans })
})

export default router
