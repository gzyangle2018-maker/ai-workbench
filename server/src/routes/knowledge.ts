import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/knowledge/keywords
router.get('/keywords', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { series, store_id, intent_level } = req.query
  let sql = 'SELECT * FROM series_keywords WHERE is_active = 1'
  const params: any[] = []
  if (series) { sql += ' AND series = ?'; params.push(series) }
  if (store_id) { sql += ' AND store_id = ?'; params.push(store_id) }
  if (intent_level) { sql += ' AND intent_level = ?'; params.push(intent_level) }
  sql += ' ORDER BY word_level, aba_rank'
  const keywords = db.prepare(sql).all(...params)
  res.json({ keywords })
})

// POST /api/knowledge/keywords
router.post('/keywords', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { keyword, series, store_id, intent_level, word_level, aba_rank, monthly_search, avg_cpc, source } = req.body
  const result = db.prepare(`
    INSERT INTO series_keywords (keyword, series, store_id, intent_level, word_level, aba_rank, monthly_search, avg_cpc, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(keyword, series, store_id, intent_level, word_level, aba_rank, monthly_search, avg_cpc, source)
  res.json({ id: result.lastInsertRowid })
})

// GET /api/knowledge/cpc
router.get('/cpc', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { keyword, store_id } = req.query
  let sql = 'SELECT * FROM cpc_bid_library WHERE 1=1'
  const params: any[] = []
  if (keyword) { sql += ' AND keyword = ?'; params.push(keyword) }
  if (store_id) { sql += ' AND store_id = ?'; params.push(store_id) }
  sql += ' ORDER BY date DESC LIMIT 365'
  const cpcData = db.prepare(sql).all(...params)
  res.json({ cpcData })
})

// GET /api/knowledge/rankings
router.get('/rankings', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { asin_id, keyword } = req.query
  let sql = 'SELECT kr.*, a.asin_code FROM keyword_rankings kr LEFT JOIN asins a ON kr.asin_id = a.id WHERE 1=1'
  const params: any[] = []
  if (asin_id) { sql += ' AND kr.asin_id = ?'; params.push(asin_id) }
  if (keyword) { sql += ' AND kr.keyword = ?'; params.push(keyword) }
  sql += ' ORDER BY kr.date DESC LIMIT 180'
  const rankings = db.prepare(sql).all(...params)
  res.json({ rankings })
})

// GET /api/knowledge/competitors
router.get('/competitors', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { brand_name, store_id, asin_code } = req.query
  let sql = 'SELECT * FROM competitor_library WHERE is_active = 1'
  const params: any[] = []
  if (brand_name) { sql += ' AND brand_name = ?'; params.push(brand_name) }
  if (store_id) { sql += ' AND store_id = ?'; params.push(store_id) }
  if (asin_code) { sql += ' AND asin_code = ?'; params.push(asin_code) }
  sql += ' ORDER BY best_seller_rank'
  const competitors = db.prepare(sql).all(...params)
  res.json({ competitors })
})

// POST /api/knowledge/competitors
router.post('/competitors', (req: AuthRequest, res) => {
  const db = require('../db/connection').getDb()
  const { asin_code, brand_name, store_id, category, product_title, price, rating, review_count, best_seller_rank, attack_strategy, weaknesses, strengths } = req.body
  const result = db.prepare(`
    INSERT INTO competitor_library (asin_code, brand_name, store_id, category, product_title, price, rating, review_count, best_seller_rank, attack_strategy, weaknesses, strengths)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(asin_code, brand_name, store_id, category, product_title, price, rating, review_count, best_seller_rank, attack_strategy, weaknesses, strengths)
  res.json({ id: result.lastInsertRowid })
})

export default router
