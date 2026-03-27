FROM node:20-bookworm AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
# FORCE COMPLETE REBUILD: 2026-03-26T11:35:00
ENV CACHE_BUST=2026-03-26T11:35:00
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

# FIX: Fail fast if build produced no output — prevents broken images
RUN test -f apps/api/dist/server.js || (echo "FATAL: dist/server.js not found after build!" && exit 1)

FROM base AS runner
COPY --from=builder /app ./

# Switch start command based on SERVICE_TYPE (Cloud Run default is to use entrypoint/command overrides, but this is a fallback)
CMD ["sh", "-c", "if [ \"$SERVICE_TYPE\" = \"web\" ]; then cd apps/web && pnpm start -- -p ${PORT:-3000}; else cd apps/api && pnpm exec prisma migrate deploy && pnpm start:prod; fi"]
