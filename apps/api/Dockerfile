# ── Stage 1: Build ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies needed for native modules (argon2, etc.)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm install

# Generate Prisma client for the target platform
RUN npx prisma generate

# Copy source and compile TypeScript
COPY . .
RUN npm run build

# ── Stage 2: Production image ───────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production native build tools
RUN apk add --no-cache python3 make g++

# Copy production deps
COPY package.json ./
RUN npm install --omit=dev

# Copy Prisma schema + generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
