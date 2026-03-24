FROM node:20-slim AS builder
# Force cache bust: 2026-03-24T21:25:00
ENV CACHE_BUST=2026-03-24T21:25:00
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile
COPY apps/api/prisma ./apps/api/prisma
RUN pnpm --filter api exec prisma generate
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter api build

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared ./packages/shared
# Flatten the nested dist into a cleaner location
COPY --from=builder /app/apps/api/dist/apps/api/src ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 8080
ENV NODE_ENV=production

# Healthcheck helper
CMD ["node", "dist/server.js"]
