import { Worker } from 'bullmq'
import { createBullConnection } from '../lib/redis.js'
import { prisma } from '../lib/prisma.js'
import { eventBus } from '../lib/event-bus.js'
import { BACKOFF_OPTIONS } from '../lib/worker-backoff.js'
import pino from 'pino'

const logger = pino({ name: 'notification-worker' })

/**
 * Notification Worker: processes domain events and stores notifications.
 * Listens to event bus and creates notification records for
 * low stock, session events, transfer disputes, etc.
 */
export function startNotificationWorker() {
  // Listen for low stock events
  eventBus.on('stock.low', async (data: any) => {
    await prisma.notification.create({
      data: {
        type: 'LOW_STOCK',
        message: `Item ${data.itemId} is below reorder level. Current: ${data.currentQty}, Reorder: ${data.reorderLevel}`,
        channelId: data.channelId,
      },
    })
  })

  eventBus.on('stock.negative', async (data: any) => {
    await prisma.notification.create({
      data: {
        type: 'NEGATIVE_STOCK',
        message: `Item ${data.itemId} has negative stock: ${data.currentQty}`,
        channelId: data.channelId,
      },
    })
  })

  eventBus.on('transfer.disputed', async (data: any) => {
    await prisma.notification.create({
      data: {
        type: 'TRANSFER_DISPUTED',
        message: `Transfer ${data.transferId} has discrepancies`,
        channelId: data.toChannelId,
      },
    })
  })

  eventBus.on('approval.requested', async (data) => {
    await prisma.notification.create({
      data: {
        type: 'SYSTEM',
        message: `New approval request: ${data.action.replace('_', ' ')} for ${data.notes || 'context ' + data.approvalId}`,
        channelId: data.channelId,
      },
    })
  })

  // BullMQ worker for batched notification processing
  const worker = new Worker(
    'notifications',
    async (job) => {
      try {
        const { type } = job.data
        logger.debug({ type }, `[Notification] Processing job`)
      } catch (err) {
        logger.error({ err }, '[Notification Worker] Processing failed')
        throw err
      }
    },
    {
      connection: createBullConnection(),
      concurrency: 5,
      ...BACKOFF_OPTIONS,
    }
  )

  worker.on('failed', (_job, err) => {
    logger.error({ err: err.message }, '[Notification Worker] Failed')
  })

  return worker
}
