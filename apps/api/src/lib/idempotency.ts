import { redis } from './redis.js'
import { prisma } from './prisma.js'

const TTL_SECONDS  = parseInt(process.env.IDEMPOTENCY_TTL_SECONDS || '86400', 10)
const LOCK_TTL_SEC = 30  // max time a request is allowed to be in-flight

/**
 * Check if an idempotency key has already been processed.
 * Checks Redis first (fast path), then DB fallback (persistent).
 */
export async function checkIdempotency(
  key: string
): Promise<{ responseBody: unknown; statusCode: number } | null> {
  const cached = await redis.get(`idem:${key}`)
  if (cached) return JSON.parse(cached)

  const dbRecord = await prisma.idempotencyRecord.findUnique({ where: { key } })
  if (dbRecord) {
    await redis.setex(
      `idem:${key}`,
      TTL_SECONDS,
      JSON.stringify({ responseBody: dbRecord.responseBody, statusCode: dbRecord.statusCode })
    )
    return { responseBody: dbRecord.responseBody, statusCode: dbRecord.statusCode }
  }

  return null
}

/**
 * Acquire an atomic idempotency lock before processing a request.
 *
 * FIX: Without this, two concurrent requests with the same key both pass
 * checkIdempotency (returning null) and both execute the operation — the
 * whole point of idempotency is defeated.
 *
 * Uses Redis SET NX (set-if-not-exists) which is atomic at the Redis level.
 * Returns true if the lock was acquired (this request should proceed),
 * false if another request is already processing this key (caller should 409).
 */
export async function acquireIdempotencyLock(key: string): Promise<boolean> {
  const result = await redis.set(
    `idem-lock:${key}`,
    '1',
    'EX', LOCK_TTL_SEC,
    'NX'              // only set if key does not already exist
  )
  return result === 'OK'
}

/**
 * Release the idempotency lock early (e.g. on error, before TTL expires).
 * Not strictly required since the lock auto-expires, but speeds up retries.
 */
export async function releaseIdempotencyLock(key: string): Promise<void> {
  await redis.del(`idem-lock:${key}`)
}

/**
 * Store an idempotency result in Redis (TTL) and DB (permanent).
 * Also releases the lock so subsequent identical requests get the cached response.
 */
export async function storeIdempotencyResult(
  key:          string,
  responseBody: object,
  statusCode:   number
): Promise<void> {
  const payload = JSON.stringify({ responseBody, statusCode })

  await redis.setex(`idem:${key}`, TTL_SECONDS, payload)

  await prisma.idempotencyRecord.upsert({
    where:  { key },
    create: { key, responseBody, statusCode },
    update: {},  // No-op if already stored — first-write-wins
  })

  // Release the lock — subsequent requests now get the cached result
  await releaseIdempotencyLock(key)
}

/**
 * Validate that a string is a valid UUIDv4 format.
 */
export function isValidIdempotencyKey(key: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)
}
