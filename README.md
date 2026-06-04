# AI工作台 — 亚马逊PPC广告分析平台
### designed by Leo Young in Shenzhen China

全类目通用的亚马逊广告分析平台，支持数据投喂 → LLM分析 → 12维量化行动方案 → BI看板复盘 → 知识库沉淀 → 新品冷启动复用。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS + Recharts |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | SQLite (sql.js) |
| LLM | 多模型网关（OpenAI/DeepSeek/Kimi/GLM/Qwen/文心/豆包/Gemini/Claude） |
| 认证 | JWT |

## 快速启动

```bash
# 1. 安装依赖
npm --prefix . install
npm --prefix server install
npm --prefix client install

# 2. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 填入你的 LLM API Keys

# 3. 启动开发服务器
npm run dev
# 前端: http://localhost:5173
# 后端: http://localhost:3001

# 4. 生产构建
npm run build
```

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | `yangle` | `leo0417` |
| 运营 | `zhangsan` | `123456` |

## 项目结构

```
ai-workbench/
├── client/                # React 前端
│   ├── src/
│   │   ├── pages/         # 14个页面
│   │   ├── components/    # Layout + BrandBadge
│   │   ├── stores/        # Zustand 状态管理
│   │   └── services/      # Axios API 封装
│   └── vite.config.ts
├── server/                # Express 后端
│   ├── src/
│   │   ├── db/            # SQLite Schema + Seed
│   │   ├── middleware/     # JWT认证 + 配额
│   │   ├── routes/        # 7组API路由
│   │   └── services/      # 分析引擎 + LLM网关
│   └── data/              # SQLite数据库文件
└── package.json           # 根workspace
```

## 核心功能

- 📤 **数据投喂**：上传SP/SB/SD/BR/ABA报表，自动识别表类型
- 🤖 **LLM分析**：接入任意大模型，注入分析规则生成12维行动方案
- 📊 **BI看板**：全指标筛选（曝光/点击/CTR/CVR/花费/ACOS/TACOS…）
- 📚 **知识库**：关键词库 / CPC竞价库 / 排名追踪 / 竞品ASIN品牌库
- 🚀 **新品冷启动**：复用知识库一键生成广告架构
- 👥 **多用户管理**：管理员控制运营账号权限和API配额

## 国产LLM预置

DeepSeek(V3/R1) · Kimi(Moonshot) · GLM-4(智谱) · MiniMax · 阿里百炼(Qwen) · 百度文心 · 豆包(字节) · 零一万物

## License

Private — designed by Leo Young in Shenzhen China
