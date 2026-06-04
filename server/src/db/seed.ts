import { getDb } from './connection'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  const db = getDb()
  const adminCount = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE username = 'yangle'").get() as any
  
  if (adminCount.cnt > 0) {
    console.log('  Seed: admin already exists, skipping')
    return
  }

  console.log('  Seeding database...')

  // Admin user
  const hash = bcrypt.hashSync('leo0417', 10)
  db.prepare(`
    INSERT INTO users (username, password_hash, role, permissions, api_quota_limit, api_cost_limit)
    VALUES (?, ?, 'admin', '{"upload":true,"analyze":true,"dashboard":true,"knowledge":true,"export":true,"tasks":true,"newProduct":true,"manageModels":true}', 10000, 500.0)
  `).run('yangle', hash)

  // Sample operator
  const opHash = bcrypt.hashSync('123456', 10)
  db.prepare(`
    INSERT INTO users (username, password_hash, role, permissions, api_quota_limit, api_cost_limit)
    VALUES (?, ?, 'operator', '{"upload":true,"analyze":true,"dashboard":true,"knowledge":true,"export":true,"tasks":true,"newProduct":false,"manageModels":false}', 500, 50.0)
  `).run('zhangsan', opHash)

  // Sample stores
  db.prepare(`INSERT INTO stores (name, marketplace, currency, timezone) VALUES (?, ?, ?, ?)`)
    .run('美国站', 'US', 'USD', 'America/Los_Angeles')
  db.prepare(`INSERT INTO stores (name, marketplace, currency, timezone) VALUES (?, ?, ?, ?)`)
    .run('日本站', 'JP', 'JPY', 'Asia/Tokyo')
  db.prepare(`INSERT INTO stores (name, marketplace, currency, timezone) VALUES (?, ?, ?, ?)`)
    .run('欧洲站', 'EU', 'EUR', 'Europe/Berlin')

  // Give admin access to all stores
  db.prepare(`INSERT INTO user_store_access (user_id, store_id) VALUES (1, 1), (1, 2), (1, 3)`).run()
  db.prepare(`INSERT INTO user_store_access (user_id, store_id) VALUES (2, 1)`).run()

  // Sample ASINs
  db.prepare(`INSERT INTO asins (asin_code, product_name, series, store_id, brand_name, category) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('B0EXAMPLE1', '电源线 10ft 3-Prong', '电源线系列', 1, 'LEO', '3C电源线')
  db.prepare(`INSERT INTO asins (asin_code, product_name, series, store_id, brand_name, category) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('B0EXAMPLE2', '电源线 6ft IEC C13', '电源线系列', 1, 'LEO', '3C电源线')
  db.prepare(`INSERT INTO asins (asin_code, product_name, series, store_id, brand_name, category) VALUES (?, ?, ?, ?, ?, ?)`)
    .run('B0EXAMPLE3', '充电线 USB-C 3Pack', '充电线系列', 1, 'LEO', '3C充电线')

  // Admin access to all ASINs
  db.prepare(`INSERT INTO user_asin_access (user_id, asin_id) VALUES (1, 1), (1, 2), (1, 3)`).run()
  db.prepare(`INSERT INTO user_asin_access (user_id, asin_id) VALUES (2, 1), (2, 2)`).run()

  // Built-in model configs: 国产模型全量预置
  const builtinModels = [
    { name: 'DeepSeek-V3', provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', modelName: 'deepseek-chat', usageType: 'analysis' },
    { name: 'DeepSeek-R1', provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', modelName: 'deepseek-reasoner', usageType: 'analysis' },
    { name: 'Kimi (Moonshot)', provider: 'kimi', baseUrl: 'https://api.moonshot.cn/v1', modelName: 'moonshot-v1-8k', usageType: 'analysis' },
    { name: 'GLM-4 (智谱)', provider: 'glm', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', modelName: 'glm-4', usageType: 'analysis' },
    { name: 'GLM-4-Flash (智谱)', provider: 'glm', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', modelName: 'glm-4-flash', usageType: 'auto_deposit' },
    { name: 'MiniMax', provider: 'minimax', baseUrl: 'https://api.minimax.chat/v1', modelName: 'abab6.5s-chat', usageType: 'analysis' },
    { name: '阿里百炼 Qwen-Max', provider: 'qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', modelName: 'qwen-max', usageType: 'analysis' },
    { name: '阿里百炼 Qwen-Turbo', provider: 'qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', modelName: 'qwen-turbo', usageType: 'auto_deposit' },
    { name: '百度文心 ERNIE-4', provider: 'wenxin', baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat', modelName: 'ernie-4.0-8k', usageType: 'analysis' },
    { name: '豆包 (字节) Doubao-Pro', provider: 'doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', modelName: 'doubao-pro-32k', usageType: 'analysis' },
    { name: '豆包 (字节) Doubao-Lite', provider: 'doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', modelName: 'doubao-lite-32k', usageType: 'auto_deposit' },
    { name: '零一万物 Yi-Large', provider: 'yi', baseUrl: 'https://api.lingyiwanwu.com/v1', modelName: 'yi-large', usageType: 'analysis' },
    { name: 'OpenAI GPT-4o (需自填Key)', provider: 'openai', baseUrl: 'https://api.openai.com/v1', modelName: 'gpt-4o', usageType: 'analysis' },
    { name: 'Anthropic Claude (需自填Key)', provider: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', modelName: 'claude-sonnet-4-20250514', usageType: 'analysis' },
    { name: 'Google Gemini (需自填Key)', provider: 'google', baseUrl: 'https://generativelanguage.googleapis.com/v1beta', modelName: 'gemini-2.5-pro', usageType: 'analysis' },
  ]

  const insertModel = db.prepare(`
    INSERT INTO model_configs (name, provider, base_url, api_key, model_name, is_default, is_active, is_builtin, usage_type)
    VALUES (?, ?, ?, '', ?, 0, 1, 1, ?)
  `)

  for (const m of builtinModels) {
    insertModel.run(m.name, m.provider, m.baseUrl, m.modelName, m.usageType)
  }

  // Changelog
  db.prepare(`INSERT INTO changelog (version, title, content) VALUES (?, ?, ?)`)
    .run('1.0.0', 'AI工作台 正式发布',
      `🎉 首个版本发布\n
      ✨ 数据投喂三步向导：支持SP/SB/SD/BR/ABA报表自动识别\n
      ✨ 12维量化行动方案生成\n
      ✨ 4大知识库：关键词库/CPC竞价库/排名追踪/竞品库\n
      ✨ 新品冷启动向导\n
      ✨ BI看板：全指标筛选+多维度环比\n
      ✨ 管理员权限控制+API配额管理\n
      🔧 国产LLM全量预置：DeepSeek/Kimi/GLM/MiniMax/Qwen/文心/豆包/零一万物\n
      👤 designed by Leo Young in Shenzhen China`)

  console.log('  Seed complete: admin(yangle), operator(zhangsan), 3 stores, 3 ASINs, 15 models')
}
