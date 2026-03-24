FROM node:20-slim AS builder
# Force cache bust: 2026-03-24T21:16:00
ENV CACHE_BUST=2026-03-24T21:16:00
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
# Find exactly where server.js is
RUN find apps/api/dist -name "server.js"

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 8080
ENV NODE_ENV=production

# Find it again in the final stage to be sure
RUN find . -name "server.js"

# We will try to start from the most likely locations
CMD ["sh", "-c", "node apps/api/dist/server.js || node apps/api/dist/src/server.js || node dist/server.js"]
