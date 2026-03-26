import { EventEmitter } from 'events'
import pino from 'pino'

const log = pino({ name: 'redis' })

// ── In-memory mock (used when REDIS_URL is not set) ──────────────────
class RedisMock extends EventEmitter {
  constructor() { super() }
  async quit() { return 'OK' }
  async ping() { return 'PONG' }
  async get(_k: string) { return null }
  async set(_k: string, _v: string, ..._args: any[]) { return 'OK' }
  async del(..._keys: string[]) { return 1 }
  async exists(..._keys: string[]) { return 0 }
  async incr(_k: string) { return 1 }
  async expire(_k: string, _s: number) { return 1 }
  async setex(_k: string, _s: number, _v: string) { return 'OK' }
  async hset(..._args: any[]) { return 1 }
  async hget(_k: string, _f: string) { return null }
  duplicateOptions = {}
  duplicate() { return this }
  status = 'ready'
}

// ── Real Redis client (when REDIS_URL is set) ─────────────────────────
function createRealClient() {
  // Dynamic import to avoid requiring ioredis when not needed
  const Redis = require('ioredis')
  const client = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck:     false,
    lazyConnect:          true,
  })
  client.on('error', (err: Error) => log.warn({ err: err.message }, '[Redis] connection error'))
  client.on('connect', ()       => log.info('[Redis] connected'))
  return client
}

export const redis: any = process.env.REDIS_URL
  ? createRealClient()
  : (() => {
      log.warn('[Redis] REDIS_URL not set — using in-memory mock. Auth revocation and queues will NOT persist.')
      return new RedisMock()
    })()

/**
 * Returns a BullMQ-compatible connection.
 * When REDIS_URL is absent we return the mock, which silently no-ops queue operations.
 */
export const createBullConnection = (): any => {
  if (!process.env.REDIS_URL) return new RedisMock()
  const Redis = require('ioredis')
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck:     false,
  })
}

export default redis
