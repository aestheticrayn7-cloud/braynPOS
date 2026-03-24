// ══════════════════════════════════════════════════════════════════════
// FILE: apps/api/src/modules/support/proactive-monitor.ts
// Fixes:
//   1. (prisma as any).item.findUnique — unnecessary cast. Prisma types
//      item.findUnique natively, no cast needed.
//   2. console.log startup message removed — use structured logger.
//   3. Low stock alert threshold was `item.reorderLevel >= 50` which
//      means items with a reorderLevel < 50 (e.g. a high-value item
//      with reorderLevel = 2) would never trigger an alert even if at
//      zero stock. The threshold should be on the stock quantity, not
//      the reorder level. Fixed to alert whenever stock is critically
//      low regardless of what the reorderLevel is configured to.
// ══════════════════════════════════════════════════════════════════════

import { eventBus }       from '../../lib/event-bus.js'
import { WhatsAppService } from './whatsapp.service.js'
import { prisma }          from '../../lib/prisma.js'

export function startProactiveMonitor() {
  // FIX 2: Removed console.log — startup is already logged by the server

  // 1. Watch for Low Stock
  eventBus.on('stock.low', async (data: any) => {
    // FIX 1: Native Prisma call — no any cast needed
    const item = await prisma.item.findUnique({
      where:  { id: data.itemId },
      select: { name: true, reorderLevel: true },
    })

    if (!item) return

    // FIX 3: Alert based on stock quantity being critically low,
    // not on whether the reorderLevel is >= 50. The original condition
    // silently skipped items with reorderLevel < 50 (e.g. expensive
    // serialized items with reorderLevel = 1) even when they hit zero.
    if (data.currentQty <= item.reorderLevel) {
      await WhatsAppService.sendAlert(
        `📉 *LOW STOCK ALERT*\nItem: ${item.name}\nBranch: ${data.channelId}\nCurrent: ${data.currentQty} (Reorder at: ${item.reorderLevel})`
      )
    }
  })

  // 2. Watch for Urgent Support Tickets
  eventBus.on('ticket.created', async (data: any) => {
    if (data.priority === 'URGENT') {
      await WhatsAppService.sendAlert(
        `🆘 *URGENT TICKET*\nSubject: ${data.subject}\nRef: ${data.refCode}`
      )
    }
  })

  // 3. Watch for Large Voids or Adjustments
  eventBus.on('stock.adjustment', async (data: any) => {
    if (Math.abs(data.quantityChange) > 100) {
      await WhatsAppService.sendApprovalRequest(
        'Mass Stock Adjustment',
        `Item: ${data.itemId}, Change: ${data.quantityChange}`,
        data.ticketId || 'manual'
      )
    }
  })
}
