FROM node:20-slim AS builder
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
# Install OpenSSL (required for Prisma to run in production)
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Also copy prisma to the root level so 'npx prisma' finds it from anywhere
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

# Metadata update to force fresh Railway pull: 2026-03-24T20:31:00
CMD ["node", "apps/api/dist/server.js"]
