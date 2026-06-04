import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/reports - list batches
router.get('/', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const batches = db.prepare(`
    SELECT rb.*, u.username as uploaded_by_name
    FROM report_batches rb
    LEFT JOIN users u ON rb.uploaded_by = u.id
    ORDER BY rb.created_at DESC
  `).all()
  res.json({ batches })
})

// POST /api/reports/upload - placeholder for multer upload
router.post('/upload', (req: AuthRequest, res) => {
  res.json({ message: 'Upload endpoint - to be implemented with multer' })
})

export default router
