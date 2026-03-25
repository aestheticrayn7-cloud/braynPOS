FROM node:20-slim AS builder
# FORCE COMPLETE REBUILD: 2026-03-25T13:05:00
ENV CACHE_BUST=2026-03-25T13:05:00
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy ALL package.json files for installation
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# COPY ALL FOLDERS BEFORE INSTALL
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

RUN pnpm install --frozen-lockfile

# Generate Prisma and build
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build
RUN pnpm --filter web build

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy everything from builder
COPY --from=builder /app ./

# Default fallback for the API
CMD ["node", "apps/api/dist/apps/api/src/server.js"]
