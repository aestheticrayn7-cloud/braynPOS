FROM node:20-slim AS builder
# Force cache bust: 2026-03-24T21:42:00
ENV CACHE_BUST=2026-03-24T21:42:00
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

# Copy EVERYTHING from builder. This is heavy but GUARANTEED to work.
# We'll prune later if needed.
COPY --from=builder /app ./

# The real path we found earlier:
# apps/api/dist/apps/api/src/server.js
CMD ["node", "apps/api/dist/apps/api/src/server.js"]
