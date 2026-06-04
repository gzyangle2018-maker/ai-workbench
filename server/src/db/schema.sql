-- ============================================================
-- AI工作台 数据库 Schema v1.0.0
-- designed by Leo Young in Shenzhen China
-- ============================================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'operator')),
  is_active INTEGER NOT NULL DEFAULT 1,
  -- 功能权限 (JSON)
  permissions TEXT NOT NULL DEFAULT '{"upload":true,"analyze":true,"dashboard":true,"knowledge":true,"export":true,"tasks":true,"newProduct":false,"manageModels":false}',
  api_quota_limit INTEGER DEFAULT 500,      -- 月调用次数上限
  api_cost_limit REAL DEFAULT 50.0,          -- 月费用上限(USD)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. 店铺表
CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                        -- e.g. "美国站", "日本站"
  marketplace TEXT NOT NULL,                 -- e.g. "US", "JP", "EU"
  currency TEXT NOT NULL DEFAULT 'USD',
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. 用户-店铺 可见权限
CREATE TABLE IF NOT EXISTS user_store_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE(user_id, store_id)
);

-- 4. ASIN 注册表
CREATE TABLE IF NOT EXISTS asins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asin_code TEXT NOT NULL,
  product_name TEXT,
  series TEXT,                               -- e.g. "电源线系列", "充电线系列"
  store_id INTEGER REFERENCES stores(id),
  brand_name TEXT,
  category TEXT,
  stage TEXT CHECK(stage IN ('new', 'growth', 'stable', 'decline')) DEFAULT 'stable',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. 用户-ASIN 可见权限
CREATE TABLE IF NOT EXISTS user_asin_access (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asin_id INTEGER NOT NULL REFERENCES asins(id) ON DELETE CASCADE,
  UNIQUE(user_id, asin_id)
);

-- 6. 数据投喂批次表
CREATE TABLE IF NOT EXISTS report_batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_label TEXT NOT NULL,                 -- e.g. "第1波"
  store_id INTEGER REFERENCES stores(id),
  asin_ids TEXT,                             -- JSON array of ASIN IDs
  report_types TEXT NOT NULL,                -- JSON: ["SP_SearchTerm","SB_Placement",...]
  time_range_start TEXT,
  time_range_end TEXT,
  campaign_count INTEGER,
  file_paths TEXT,                           -- JSON array of uploaded file paths
  uploaded_by INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','validated','analyzed','error')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. 关键词数据库 (核心知识库)
CREATE TABLE IF NOT EXISTS series_keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  series TEXT NOT NULL,                      -- 产品系列
  store_id INTEGER REFERENCES stores(id),
  intent_level INTEGER CHECK(intent_level BETWEEN 1 AND 6),  -- 意图层级
  word_level TEXT CHECK(word_level IN ('核心','1级','2级','长尾','小词')),
  match_type TEXT CHECK(match_type IN ('Broad','Phrase','Exact')),
  aba_rank INTEGER,
  monthly_search INTEGER,
  avg_cpc REAL,
  source TEXT,                               -- e.g. "SP搜索词", "ABA", "商机探测器"
  is_active INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. CPC 竞价库
CREATE TABLE IF NOT EXISTS cpc_bid_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  store_id INTEGER REFERENCES stores(id),
  date TEXT NOT NULL,
  avg_cpc REAL,
  suggested_bid_low REAL,
  suggested_bid_high REAL,
  actual_bid REAL,
  acos_range_low REAL,
  acos_range_high REAL,
  ad_rank INTEGER,
  organic_rank INTEGER,
  aba_rank INTEGER,
  impression_share REAL,
  click_share REAL,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 9. 关键词排名追踪
CREATE TABLE IF NOT EXISTS keyword_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asin_id INTEGER REFERENCES asins(id),
  keyword TEXT NOT NULL,
  store_id INTEGER REFERENCES stores(id),
  date TEXT NOT NULL,
  organic_rank INTEGER,
  ad_rank INTEGER,
  aba_rank INTEGER,
  share_of_clicks REAL,
  share_of_impressions REAL,
  event_note TEXT,                           -- e.g. "加精准组", "竞品降价"
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. 竞品库
CREATE TABLE IF NOT EXISTS competitor_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asin_code TEXT NOT NULL,
  brand_name TEXT,
  store_id INTEGER REFERENCES stores(id),
  category TEXT,
  product_title TEXT,
  price REAL,
  rating REAL,
  review_count INTEGER,
  best_seller_rank INTEGER,
  attack_strategy TEXT,                      -- e.g. "高价截流", "评分碾压"
  weaknesses TEXT,                            -- 竞品弱点关键词
  strengths TEXT,                             -- 竞品优势关键词
  source TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 11. 分析任务记录
CREATE TABLE IF NOT EXISTS analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asin_id INTEGER REFERENCES asins(id),
  batch_ids TEXT,                             -- JSON array of batch IDs used
  model_name TEXT,
  target_short_acos REAL,
  target_long_acos REAL,
  target_tacos REAL,
  budget_cap_pct REAL,
  risk_tolerance_pct REAL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','running','completed','error')),
  result_json TEXT,                           -- Full structured result
  diagnosis TEXT,                             -- Core diagnosis summary
  created_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

-- 12. 行动方案表 (12维)
CREATE TABLE IF NOT EXISTS action_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  analysis_id INTEGER NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  asin_id INTEGER REFERENCES asins(id),
  campaign_name TEXT,
  ad_group_name TEXT,
  dimension TEXT NOT NULL,                   -- 维度名称
  priority TEXT CHECK(priority IN ('P0','P1','P2')) DEFAULT 'P1',
  target_keyword_or_asin TEXT,
  current_data TEXT,
  suggested_action TEXT NOT NULL,
  adjustment_value TEXT,
  reason TEXT,
  expected_impact TEXT,
  execution_time TEXT,
  strategy TEXT CHECK(strategy IN ('conservative','balanced','aggressive')) DEFAULT 'balanced',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 13. LLM 模型配置表
CREATE TABLE IF NOT EXISTS model_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                        -- Display name
  provider TEXT NOT NULL,                    -- "openai"/"google"/"anthropic"/"deepseek"/"kimi"/"glm"/"minimax"/"qwen"/"wenxin"/"doubao"/"yi"
  base_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  model_name TEXT NOT NULL,                  -- e.g. "gpt-5.5", "gemini-3.1-pro"
  is_default INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  is_builtin INTEGER DEFAULT 0,              -- Pre-configured built-in model
  usage_type TEXT DEFAULT 'analysis' CHECK(usage_type IN ('analysis','auto_deposit')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 14. API 调用日志
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  model_config_id INTEGER REFERENCES model_configs(id),
  analysis_id INTEGER REFERENCES analyses(id),
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_estimate REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 15. 审计日志
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,                      -- e.g. "upload_report", "create_analysis", "export_plan"
  target_type TEXT,                          -- e.g. "report", "analysis", "user"
  target_id INTEGER,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 16. 更新日志
CREATE TABLE IF NOT EXISTS changelog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_keywords_series ON series_keywords(series, store_id);
CREATE INDEX IF NOT EXISTS idx_keywords_intent ON series_keywords(intent_level);
CREATE INDEX IF NOT EXISTS idx_cpc_keyword_date ON cpc_bid_library(keyword, store_id, date);
CREATE INDEX IF NOT EXISTS idx_rankings_asin ON keyword_rankings(asin_id, keyword, date);
CREATE INDEX IF NOT EXISTS idx_competitor_brand ON competitor_library(brand_name, store_id);
CREATE INDEX IF NOT EXISTS idx_analyses_asin ON analyses(asin_id, created_at);
CREATE INDEX IF NOT EXISTS idx_action_plans_analysis ON action_plans(analysis_id, priority);
CREATE INDEX IF NOT EXISTS idx_api_logs_user ON api_usage_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id, created_at);
