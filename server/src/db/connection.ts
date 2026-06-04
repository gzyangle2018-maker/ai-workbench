import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

let SQL: SqlJsStatic | null = null
let db: SqlJsDatabase | null = null
let dbPath: string = ''

// Wrapper for sql.js to provide better-sqlite3-like API
class StatementWrapper {
  private db: SqlJsDatabase
  private sql: string

  constructor(db: SqlJsDatabase, sql: string) {
    this.db = db
    this.sql = sql
  }

  private bindParams(params: any[]): any[] {
    return params.map(p => (p === undefined || p === null ? null : p))
  }

  run(...params: any[]): { changes: number; lastInsertRowid: number } {
    const bound = this.bindParams(params)
    // Build the SQL with parameters
    const result = this.db.run(this.sql, bound)
    return {
      changes: this.db.getRowsModified(),
      lastInsertRowid: result ? this.db.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] as number : 0,
    }
  }

  get(...params: any[]): any {
    const bound = this.bindParams(params)
    const stmt = this.db.prepare(this.sql)
    if (bound.length > 0) stmt.bind(bound)
    if (stmt.step()) {
      const cols = stmt.getColumnNames()
      const vals = stmt.get()
      stmt.free()
      const obj: any = {}
      cols.forEach((c, i) => { obj[c] = vals[i] })
      return obj
    }
    stmt.free()
    return undefined
  }

  all(...params: any[]): any[] {
    const bound = this.bindParams(params)
    const results: any[] = []
    const stmt = this.db.prepare(this.sql)
    if (bound.length > 0) stmt.bind(bound)
    while (stmt.step()) {
      const cols = stmt.getColumnNames()
      const vals = stmt.get()
      const obj: any = {}
      cols.forEach((c, i) => { obj[c] = vals[i] })
      results.push(obj)
    }
    stmt.free()
    return results
  }
}

class DatabaseWrapper {
  private sqlDb: SqlJsDatabase

  constructor(sqlDb: SqlJsDatabase) {
    this.sqlDb = sqlDb
  }

  prepare(sql: string): StatementWrapper {
    return new StatementWrapper(this.sqlDb, sql)
  }

  exec(sql: string): void {
    this.sqlDb.exec(sql)
  }

  save(): Buffer {
    return Buffer.from(this.sqlDb.export())
  }
}

let dbWrapper: DatabaseWrapper | null = null

export function getDb(): DatabaseWrapper {
  if (!dbWrapper) throw new Error('Database not initialized. Call initDb() first.')
  return dbWrapper
}

async function doInit(load: any) {
  const dataDir = join(__dirname, '../../data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
  dbPath = join(dataDir, 'ai-workbench.db')

  // Try to load existing database
  let buffer: Uint8Array | undefined
  if (existsSync(dbPath)) {
    try {
      buffer = new Uint8Array(readFileSync(dbPath))
    } catch { /* start fresh */ }
  }

  db = new load.Database(buffer)
  db.run('PRAGMA foreign_keys = ON')

  dbWrapper = new DatabaseWrapper(db)

  // Run schema
  const schemaPath = join(__dirname, 'schema.sql')
  if (existsSync(schemaPath)) {
    const schema = readFileSync(schemaPath, 'utf-8')
    // Split by semicolons and execute each statement
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0)
    for (const stmt of statements) {
      try {
        db.run(stmt)
      } catch (err: any) {
        // Table already exists errors are OK
        if (!err.message?.includes('already exists')) {
          console.error('Schema error:', err.message, 'in:', stmt.slice(0, 80))
        }
      }
    }
  }
}

let initPromise: Promise<void> | null = null

export async function initDb(): Promise<void> {
  if (initPromise) return initPromise
  initPromise = initSqlJs().then(doInit)
  return initPromise
}

// Save database to disk periodically and on exit
export function saveDb(): void {
  if (db && dbPath) {
    const data = db.export()
    writeFileSync(dbPath, Buffer.from(data))
  }
}

// Auto-save every 60 seconds
setInterval(() => {
  try { saveDb() } catch { /* ignore */ }
}, 60000)

process.on('exit', saveDb)
process.on('SIGINT', () => { saveDb(); process.exit() })
process.on('SIGTERM', () => { saveDb(); process.exit() })
