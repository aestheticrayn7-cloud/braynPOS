import Redis from 'ioredis'
import { logger } from './logger.js'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000)
    return delay
  },
  lazyConnect: true,
})

redis.on('error', (err) => {
  logger.error({ err }, '[Redis] Connection error')
})

redis.on('connect', () => {
  logger.info('[Redis] Connected')
})

export const createBullConnection = () =>
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }) as any
