import { Worker } from 'bullmq'
import { createBullConnection } from '../lib/redis.js'
import { prisma } from '../lib/prisma.js'
import { eventBus } from '../lib/event-bus.js'
import { BACKOFF_OPTIONS } from '../lib/worker-backoff.js'
import pino from 'pino'

const logger = pino({ name: 'notification-worker' })

import { NotificationService } from '../modules/notifications/notifications.service.js'

/**
 * Notification Worker: processes domain events and stores notifications.
 * Listens to event bus and creates notification records for
 * low stock, session events, transfer disputes, etc.
 */
export function startNotificationWorker() {
  // Listen for low stock events
  eventBus.on('stock.low', async (data: any) => {
    await NotificationService.notify({
        type: 'LOW_STOCK',
        message: `Item ${data.itemId} is below reorder level. Current: ${data.currentQty}, Reorder: ${data.reorderLevel}`,
        channelId: data.channelId,
        metadata: data
    })
  })

  eventBus.on('stock.negative', async (data: any) => {
    await NotificationService.notify({
        type: 'NEGATIVE_STOCK',
        message: `Item ${data.itemId} has negative stock: ${data.currentQty}`,
        channelId: data.channelId,
        metadata: data
    })
  })

  eventBus.on('transfer.disputed', async (data: any) => {
    await NotificationService.notify({
        type: 'TRANSFER_DISPUTED',
        message: `Transfer ${data.transferId} has discrepancies`,
        channelId: data.toChannelId,
        metadata: data
    })
  })

  eventBus.on('approval.requested', async (data) => {
    await NotificationService.notify({
        type: 'SYSTEM',
        message: `New approval request: ${data.action.replace('_', ' ')} for ${data.notes || 'context ' + data.approvalId}`,
        channelId: data.channelId,
        metadata: { approvalId: data.approvalId, action: data.action }
    })
  })

  eventBus.on('sale.zero_cost', async (data: any) => {
    await NotificationService.notify({
        type: 'SYSTEM',
        message: `⚠️ MARGIN VULNERABILITY: Sale ${data.receiptNo} contains item ${data.itemSku} with ZERO cost. Commission was skipped. Please fix item cost immediately.`,
        channelId: data.channelId,
        metadata: data
    })
  })

  eventBus.on('transfer.zero_cost', async (data: any) => {
    await NotificationService.notify({
        type: 'SYSTEM',
        message: `⚠️ TRANSFER WARNING: Item ${data.itemSku} being transferred to ${data.toChannelId} has UNKNOWN/ZERO cost. This will break margin reporting at the destination.`,
        channelId: data.fromChannelId,
        metadata: data
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
