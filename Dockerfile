FROM node:20-slim AS builder
# Force cache bust: 2026-03-24T21:40:00
ENV CACHE_BUST=2026-03-24T21:40:00
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

# Use pnpm deploy to create a self-contained production bundle
# This handles all hoisting and symlinks correctly.
RUN pnpm --filter api --prod deploy /app/deployed

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Copy the self-contained bundle created by pnpm deploy
COPY --from=builder /app/deployed ./

# Copy the compiled dist folder (pnpm deploy copies source, we need the build)
# We flatten it to /app/dist to keep things simple
COPY --from=builder /app/apps/api/dist/apps/api/src ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 8080
ENV NODE_ENV=production

# The deployed folder has the package.json and its node_modules ready at the root
CMD ["node", "dist/server.js"]
