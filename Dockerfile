FROM node:20-slim AS builder
# Force cache bust: 2026-03-24T22:00:00
ENV CACHE_BUST=2026-03-24T22:00:00
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all package.json files for installation
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

# Generate Prisma and build shared packages
COPY apps/api/prisma ./apps/api/prisma
RUN pnpm --filter api exec prisma generate

COPY packages/shared ./packages/shared
# (Add any shared build step here if needed, e.g., pnpm --filter shared build)

# Copy and build ALL apps
COPY apps/api ./apps/api
COPY apps/web ./apps/web
RUN pnpm --filter api build
RUN pnpm --filter web build

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN npm install -g pnpm

# Copy everything from builder (including all built dist folders)
COPY --from=builder /app ./

# Default fallback for the API (Railway will override for the web)
CMD ["node", "apps/api/dist/apps/api/src/server.js"]
