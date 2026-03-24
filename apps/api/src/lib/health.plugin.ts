import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { redis } from '../lib/redis.js'
import { logger } from '../lib/logger.js'

const DB_LATENCY_WARN_MS  = 200
const DB_LATENCY_FATAL_MS = 2000

// ── FIX: Internal-only secret for /ready endpoint ─────────────────────
// /ready exposes heap usage, DB latency, and uptime — useful for
// orchestrators (k8s, Docker) but gives attackers infrastructure
// profiling data if publicly accessible.
//
// Two-tier access:
//   - No header      → lightweight public /health (status + uptime only)
//   - X-Health-Token → full /ready with diagnostics (internal/infra only)
//
// Set HEALTH_TOKEN in your secrets manager. If unset, /ready is
// blocked entirely in production to fail safe.
const HEALTH_TOKEN = process.env.HEALTH_TOKEN

let startedAt:    Date
let lastReadyAt:  Date | null = null

interface CheckResult {
  ok:         boolean
  latencyMs?: number
  message?:   string
  detail?:    string
}

export const healthPlugin = fp(async (app: FastifyInstance) => {
  startedAt = new Date()

  // ── GET /health — public, lightweight ─────────────────────────────
  // Returns only status + uptime. Safe for public load balancer checks.
  app.get('/health', async (_request, reply) => {
    reply.status(200).send({
      status:      'ok',
      timestamp:   new Date().toISOString(),
      version:     process.env.npm_package_version ?? '2.0.0',
      uptime:      Math.floor(process.uptime()),
      uptimeSince: startedAt.toISOString(),
    })
  })

  // ── GET /ready — internal only, requires token ─────────────────────
  app.get('/ready', async (request, reply) => {
    // FIX: Require internal token in production to prevent infrastructure
    // profiling via publicly accessible diagnostic data.
    if (process.env.NODE_ENV === 'production') {
      if (!HEALTH_TOKEN) {
        // HEALTH_TOKEN not configured — block entirely to fail safe
        return reply.status(503).send({
          status:  'misconfigured',
          message: 'HEALTH_TOKEN env var not set. /ready is disabled until configured.',
        })
      }

      const provided = request.headers['x-health-token']
      if (provided !== HEALTH_TOKEN) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }
    }

    const checks: Record<string, CheckResult> = {}
    let overallReady = true

    checks.database = await checkDatabase()
    if (!checks.database.ok) overallReady = false

    checks.redis = await checkRedis()
    if (!checks.redis.ok) overallReady = false

    checks.memory = checkMemory()
    if (!checks.memory.ok) overallReady = false

    checks.eventBus = { ok: true, latencyMs: 0 }

    if (overallReady) lastReadyAt = new Date()

    const statusCode = overallReady ? 200 : 503

    if (!overallReady) {
      logger.error({ checks }, 'readiness check failed — returning 503')
    }

    reply.status(statusCode).send({
      status:      overallReady ? 'ready' : 'not_ready',
      timestamp:   new Date().toISOString(),
      uptime:      Math.floor(process.uptime()),
      lastReadyAt: lastReadyAt?.toISOString() ?? null,
      checks,
    })
  })

  app.log.info('[health] /health and /ready endpoints registered')
})

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    const latencyMs = Date.now() - start
    if (latencyMs > DB_LATENCY_FATAL_MS) {
      return { ok: false, latencyMs, message: 'database responding too slowly' }
    }
    if (latencyMs > DB_LATENCY_WARN_MS) {
      logger.warn({ latencyMs }, 'database latency above warning threshold')
    }
    return { ok: true, latencyMs }
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - start, message: 'database unreachable', detail: err.message }
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start = Date.now()
  try {
    await redis.ping()
    return { ok: true, latencyMs: Date.now() - start }
  } catch (err: any) {
    return { ok: false, message: 'redis unreachable', detail: err.message }
  }
}

function checkMemory(): CheckResult {
  const mem         = process.memoryUsage()
  const heapUsedMB  = Math.round(mem.heapUsed  / 1024 / 1024)
  const heapTotalMB = Math.round(mem.heapTotal  / 1024 / 1024)
  const usagePct    = Math.round((mem.heapUsed / mem.heapTotal) * 100)
  const ok          = usagePct < 95

  return {
    ok,
    message: ok ? undefined : `heap at ${usagePct}% — memory pressure`,
    detail:  `heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePct}%)`,
  }
}
