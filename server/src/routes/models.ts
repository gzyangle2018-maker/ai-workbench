import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/models
router.get('/', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  // Admin sees all, operator sees only models they're authorized for (or builtin)
  let models
  if (req.userRole === 'admin') {
    models = db.prepare('SELECT * FROM model_configs ORDER BY is_builtin DESC, provider').all()
  } else {
    // Check if operator has manageModels permission
    const user = db.prepare('SELECT permissions FROM users WHERE id = ?').get(req.userId) as any
    const perms = JSON.parse(user.permissions)
    if (perms.manageModels) {
      models = db.prepare('SELECT * FROM model_configs ORDER BY is_builtin DESC, provider').all()
    } else {
      models = db.prepare('SELECT * FROM model_configs WHERE is_builtin = 1 AND is_active = 1 ORDER BY provider').all()
    }
  }
  res.json({ models })
})

// POST /api/models
router.post('/', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { name, provider, baseUrl, apiKey, modelName, isDefault, usageType } = req.body

  if (isDefault) {
    db.prepare('UPDATE model_configs SET is_default = 0').run()
  }

  const result = db.prepare(`
    INSERT INTO model_configs (name, provider, base_url, api_key, model_name, is_default, is_builtin, usage_type)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(name, provider, baseUrl, apiKey, modelName, isDefault ? 1 : 0, usageType || 'analysis')

  res.json({ id: result.lastInsertRowid, message: '模型添加成功' })
})

// PUT /api/models/:id
router.put('/:id', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { apiKey, modelName, isActive, isDefault } = req.body

  if (isDefault) {
    db.prepare('UPDATE model_configs SET is_default = 0').run()
  }

  db.prepare(`
    UPDATE model_configs
    SET api_key = ?, model_name = ?, is_active = ?, is_default = ?
    WHERE id = ?
  `).run(apiKey, modelName, isActive ? 1 : 0, isDefault ? 1 : 0, req.params.id)

  res.json({ message: '模型更新成功' })
})

export default router
