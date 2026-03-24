FROM node:20-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile
COPY apps/api/prisma ./apps/api/prisma
RUN pnpm --filter api exec prisma generate
COPY apps/api ./apps/api
RUN pnpm --filter api build

FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "apps/api/dist/server.js"]
