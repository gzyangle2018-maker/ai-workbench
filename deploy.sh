#!/bin/bash
# ============================================
# AI工作台 - 部署脚本
# designed by Leo Young in Shenzhen China
# ============================================

set -e
CF_TOKEN="${CLOUDFLARE_API_TOKEN:-cfut_J07rEumJ3DPr7Y32gAPXwVo77ecOLjXV2pFLYhdf5c7b5dde}"
export CLOUDFLARE_API_TOKEN="$CF_TOKEN"

echo "🔵 AI工作台 部署脚本"
echo "   designed by Leo Young in Shenzhen China"

# 1. Build frontend
echo ""
echo "[1/3] 构建前端..."
cd client && npm run build && cd ..

# 2. Deploy to Cloudflare Pages
echo ""
echo "[2/3] 部署前端到 Cloudflare Pages..."
cd client && npx wrangler pages deploy dist --project-name ai-workbench --branch main && cd ..

# 3. Backend deployment note
echo ""
echo "[3/3] 后端部署选项："
echo "  - VPS: node server/dist/index.js"
echo "  - PM2: pm2 start server/dist/index.js --name ai-workbench-api"
echo "  - Docker: docker compose up -d"
echo ""
echo "✅ 部署完成!"
