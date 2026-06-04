# ============================================
# AI工作台 - 后端 Docker 部署
# designed by Leo Young in Shenzhen China
# ============================================
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY server/package*.json ./
RUN npm ci --production

# Copy source
COPY server/src ./src
COPY server/tsconfig.json ./

# Build
RUN npm install typescript && npx tsc

# Runtime
EXPOSE 3001
VOLUME ["/app/data"]
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/index.js"]
