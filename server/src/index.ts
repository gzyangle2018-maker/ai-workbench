import express from 'express'
import cors from 'cors'
import { join } from 'path'
import { existsSync } from 'fs'
import { initDb } from './db/connection'
import { seedDatabase } from './db/seed'
import authRoutes from './routes/auth'
import reportRoutes from './routes/reports'
import analysisRoutes from './routes/analyses'
import knowledgeRoutes from './routes/knowledge'
import userRoutes from './routes/users'
import modelRoutes from './routes/models'
import dashboardRoutes from './routes/dashboard'

const app = express()
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

// Middleware
app.use(cors({
  origin: isProduction
    ? ['https://ai-workbench.pages.dev', 'https://ai-workbench-api.yourdomain.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/analyses', analysisRoutes)
app.use('/api/knowledge', knowledgeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/models', modelRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

// In production, serve the built frontend
if (isProduction) {
  const distPath = join(__dirname, '../../client/dist')
  if (existsSync(distPath)) {
    app.use(express.static(distPath))
    app.get('*', (_req, res) => {
      res.sendFile(join(distPath, 'index.html'))
    })
  }
}

// Start
async function main() {
  try {
    await initDb()
    console.log('✓ Database initialized')
    
    await seedDatabase()
    console.log('✓ Seed data loaded')
    
    app.listen(PORT, () => {
      console.log(`\n🔵 AI工作台 Server running on http://localhost:${PORT}`)
      console.log('   designed by Leo Young in Shenzhen China\n')
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

main()
