import { eventBus } from '../../lib/event-bus.js'
import { calculateCommission } from './commission.service.js'
import { logger } from '../../lib/logger.js'

/**
 * Commission Listener: automatically triggers commission calculation
 * on every sale commit. This ensures 'margins' are converted into
 * commission entries immediately without waiting for manual recalculations.
 */
export function startCommissionListener() {
  eventBus.on('sale.committed', async (data) => {
    try {
      // FIX: Commissions must be calculated instantly on sale commit
      // so they're visible in real-time dashboards and ready for the
      // next scheduled salary run.
      await calculateCommission(data.saleId)
    } catch (err) {
      logger.error(
        { err, saleId: data.saleId, event: 'sale.committed' },
        '[commission-listener] Failed to calculate commission for sale'
      )
    }
  })
}
