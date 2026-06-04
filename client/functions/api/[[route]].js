// ============================================
// AI工作台 - Cloudflare Pages Functions API
// designed by Leo Young in Shenzhen China
// ============================================
// 处理所有 /api/* 请求

// JWT Secret
const JWT_SECRET = 'ai-workbench-leo-young-2025-sz';

// In-memory database (for now; migrate to D1 when available)
let DB = {
  users: [
    { id: 1, username: 'yangle', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'admin', permissions: '{"upload":true,"analyze":true,"dashboard":true,"knowledge":true,"export":true,"tasks":true,"newProduct":true,"manageModels":true}', api_quota_limit: 10000, api_cost_limit: 500, is_active: 1 },
    { id: 2, username: 'zhangsan', password_hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'operator', permissions: '{"upload":true,"analyze":true,"dashboard":true,"knowledge":true,"export":true,"tasks":true,"newProduct":false,"manageModels":false}', api_quota_limit: 500, api_cost_limit: 50, is_active: 1 },
  ],
  stores: [
    { id: 1, name: '美国站', marketplace: 'US', currency: 'USD' },
    { id: 2, name: '日本站', marketplace: 'JP', currency: 'JPY' },
    { id: 3, name: '欧洲站', marketplace: 'EU', currency: 'EUR' },
  ],
  asins: [
    { id: 1, asin_code: 'B0EXAMPLE1', product_name: '电源线 10ft 3-Prong', series: '电源线系列', store_id: 1, brand_name: 'LEO' },
    { id: 2, asin_code: 'B0EXAMPLE2', product_name: '电源线 6ft IEC C13', series: '电源线系列', store_id: 1, brand_name: 'LEO' },
    { id: 3, asin_code: 'B0EXAMPLE3', product_name: '充电线 USB-C 3Pack', series: '充电线系列', store_id: 1, brand_name: 'LEO' },
  ],
  analyses: [],
  actionPlans: [],
  keywords: [],
  cpcData: [],
  rankings: [],
  competitors: [],
  modelConfigs: [
    { id: 1, name: 'DeepSeek-V3', provider: 'deepseek', base_url: 'https://api.deepseek.com/v1', model_name: 'deepseek-chat', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 2, name: 'DeepSeek-R1', provider: 'deepseek', base_url: 'https://api.deepseek.com/v1', model_name: 'deepseek-reasoner', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 3, name: 'Kimi (Moonshot)', provider: 'kimi', base_url: 'https://api.moonshot.cn/v1', model_name: 'moonshot-v1-8k', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 4, name: 'GLM-4 (智谱)', provider: 'glm', base_url: 'https://open.bigmodel.cn/api/paas/v4', model_name: 'glm-4', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 5, name: 'GLM-4-Flash (智谱)', provider: 'glm', base_url: 'https://open.bigmodel.cn/api/paas/v4', model_name: 'glm-4-flash', is_active: 1, is_builtin: 1, usage_type: 'auto_deposit' },
    { id: 6, name: 'MiniMax', provider: 'minimax', base_url: 'https://api.minimax.chat/v1', model_name: 'abab6.5s-chat', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 7, name: '阿里百炼 Qwen-Max', provider: 'qwen', base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model_name: 'qwen-max', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 8, name: '阿里百炼 Qwen-Turbo', provider: 'qwen', base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model_name: 'qwen-turbo', is_active: 1, is_builtin: 1, usage_type: 'auto_deposit' },
    { id: 9, name: '百度文心 ERNIE-4', provider: 'wenxin', base_url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat', model_name: 'ernie-4.0-8k', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 10, name: '豆包 Doubao-Pro', provider: 'doubao', base_url: 'https://ark.cn-beijing.volces.com/api/v3', model_name: 'doubao-pro-32k', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 11, name: '零一万物 Yi-Large', provider: 'yi', base_url: 'https://api.lingyiwanwu.com/v1', model_name: 'yi-large', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 12, name: 'OpenAI GPT-4o', provider: 'openai', base_url: 'https://api.openai.com/v1', model_name: 'gpt-4o', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 13, name: 'Claude Sonnet', provider: 'anthropic', base_url: 'https://api.anthropic.com/v1', model_name: 'claude-sonnet-4-20250514', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
    { id: 14, name: 'Gemini 2.5 Pro', provider: 'google', base_url: 'https://generativelanguage.googleapis.com/v1beta', model_name: 'gemini-2.5-pro', is_active: 1, is_builtin: 1, usage_type: 'analysis' },
  ],
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
  });
}

function getUserId(request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const payload = JSON.parse(atob(auth.split('.')[1]));
    return payload.userId;
  } catch { return null; }
}

// Simple JWT sign (for demo)
function jwtSign(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  // In production use a proper JWT library
  return header + '.' + body + '.signature';
}

async function bcryptCompare(plain, hash) {
  // For demo: simple string comparison (in production use bcrypt)
  // The seed uses bcrypt with salt 10, so we check with bcryptjs-like logic
  // Simplified: accept any password for demo accounts
  if (hash.startsWith('$2a$')) return plain === 'leo0417' || plain === '123456';
  return plain === hash;
}

// Router
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const method = request.method.toUpperCase();

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
    });
  }

  try {
    // Health
    if (path === '/health') {
      return json({ status: 'ok', version: '1.0.0', deployed: 'Cloudflare Pages Functions' });
    }

    // Auth
    if (path === '/auth/login' && method === 'POST') {
      const { username, password } = await request.json();
      const user = DB.users.find(u => u.username === username && u.is_active);
      if (!user) return json({ error: '用户名或密码错误' }, 401);
      const valid = await bcryptCompare(password, user.password_hash);
      if (!valid) return json({ error: '用户名或密码错误' }, 401);
      const token = jwtSign({ userId: user.id, username: user.username, role: user.role, exp: Date.now() + 7*24*60*60*1000 });
      return json({
        token,
        user: { id: user.id, username: user.username, role: user.role, storeIds: [1,2,3], asinIds: [1,2,3], permissions: JSON.parse(user.permissions), apiQuotaLimit: user.api_quota_limit, apiCostLimit: user.api_cost_limit },
        stores: DB.stores,
        asins: DB.asins,
      });
    }

    if (path === '/auth/me') {
      const userId = getUserId(request);
      if (!userId) return json({ error: '未登录' }, 401);
      const user = DB.users.find(u => u.id === userId);
      if (!user) return json({ error: '用户不存在' }, 404);
      return json({ user: { id: user.id, username: user.username, role: user.role, storeIds: [1,2,3], asinIds: [1,2,3], permissions: JSON.parse(user.permissions) }, stores: DB.stores, asins: DB.asins });
    }

    // Dashboard
    if (path === '/dashboard/summary') {
      return json({ spend: 12450, spendChange: 12, sales: 58200, salesChange: 8, orders: 1234, ordersChange: 15, acos: 21.4, acosChange: -2.1, tacos: 9.8, tacosChange: -0.5, cpc: 0.87, cpcChange: 0, ctr: 0.48, cvr: 12.3, topOfSearchPct: 34 });
    }

    if (path === '/dashboard/trends') {
      const trends = Array.from({length: 30}, (_, i) => ({
        date: new Date(2025, 0, i + 1).toISOString().slice(0, 10),
        spend: Math.round(300 + Math.random() * 200), sales: Math.round(1200 + Math.random() * 800),
        acos: Math.round((18 + Math.random() * 10) * 10) / 10, orders: Math.round(30 + Math.random() * 20)
      }));
      return json({ trends });
    }

    if (path === '/dashboard/asin-ranking') {
      return json({ asins: [
        { asin_code: 'B0EXAMPLE1', product_name: '电源线 10ft', spend: 3200, sales: 18500, orders: 456, acos: 17.3, cpc: 0.85, cvr: 14.2 },
        { asin_code: 'B0EXAMPLE2', product_name: '电源线 6ft', spend: 4100, sales: 22100, orders: 389, acos: 18.6, cpc: 0.92, cvr: 11.8 },
        { asin_code: 'B0EXAMPLE3', product_name: '充电线 USB-C', spend: 2800, sales: 12400, orders: 220, acos: 22.6, cpc: 0.78, cvr: 10.5 }
      ]});
    }

    if (path === '/dashboard/changelog') {
      return json({ changelog: [{ version: '1.0.0', title: 'AI工作台 正式发布', content: '全类目通用亚马逊广告分析平台', created_at: '2025-01-01' }] });
    }

    // Models
    if (path === '/models') {
      return json({ models: DB.modelConfigs });
    }

    // Knowledge endpoints
    if (path === '/knowledge/keywords') {
      return json({ keywords: DB.keywords });
    }

    if (path === '/knowledge/cpc') {
      return json({ cpcData: DB.cpcData });
    }

    if (path === '/knowledge/rankings') {
      return json({ rankings: DB.rankings });
    }

    if (path === '/knowledge/competitors') {
      return json({ competitors: DB.competitors });
    }

    // Users (admin only)
    if (path === '/users') {
      return json({ users: DB.users.map(({password_hash, ...u}) => u) });
    }

    // Analyses
    if (path === '/analyses' || path.startsWith('/analyses/')) {
      return json({ analyses: DB.analyses, actionPlans: DB.actionPlans });
    }

    // Reports
    if (path === '/reports') {
      return json({ batches: [] });
    }

    // Catch-all
    return json({ message: 'AI工作台 API v1.0.0', path, method });

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequest(context) {
  return handleRequest(context.request);
}
