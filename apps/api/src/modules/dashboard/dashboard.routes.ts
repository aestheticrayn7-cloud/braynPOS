import type { FastifyPluginAsync } from 'fastify'
import { Prisma }           from '@prisma/client'
import { prisma }           from '../../lib/prisma.js'
import { settingsService }  from './settings.service.js'
import { authenticate }     from '../../middleware/authenticate.js'
import { authorize }        from '../../middleware/authorize.js'
import { RATE }             from '../../lib/rate-limit.plugin.js'
import { diagnosticsService } from '../support/diagnostics.service.js'

const CRITICAL_STOCK_THRESHOLD = 0

export const dashboardRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /dashboard/settings
  // FIX 2: Added authorize() — was open to any authenticated user
  app.get('/settings', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'STOREKEEPER',
    )],
  }, async (request) => {
    return settingsService.getAll(request.user.channelId ?? null)
  })

  // GET /dashboard/summary
  // FIX 2: Added authorize() — was open to any authenticated user exposing
  // revenue, expenses, stock counts, and recent sale details.
  app.get('/summary', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'STOREKEEPER',
    )],
  }, async (request) => {
    const isHQ               = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    const effectiveChannelId = isHQ ? undefined : (request.user.channelId || undefined)

    const now   = new Date()
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    const [
      todaySalesRaw,
      todayExpenses,
      activeChannelsCount,
      criticalStock,
      suggestedReorder,
      pendingTransfersRaw,
      recentSales,
    ] = await Promise.all([
      // Sales Summary
      prisma.$queryRaw<Array<{ count: number; revenue: string | number | null }>>`
        SELECT
          COUNT(*)::int                 AS count,
          COALESCE(SUM("netAmount"), 0) AS revenue
        FROM sales
        WHERE "deletedAt" IS NULL
          AND "createdAt" >= ${today}
          ${effectiveChannelId
            ? Prisma.sql`AND "channelId" = ${effectiveChannelId}`
            : Prisma.empty}
      `,
      // Expenses
      prisma.expense.aggregate({
        where: {
          createdAt: { gte: today },
          ...(effectiveChannelId && { channelId: effectiveChannelId }),
        },
        _sum: { amount: true },
      }),
      // Active Channels
      prisma.channel.count({ where: { deletedAt: null } }),

      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM (
          SELECT i.id
          FROM items i
          LEFT JOIN inventory_balances ib ON ib."itemId" = i.id
          WHERE i."deletedAt" IS NULL AND i."isActive" = true
          ${effectiveChannelId 
            ? Prisma.sql`AND ib."channelId" = ${effectiveChannelId}` 
            : Prisma.empty}
          GROUP BY i.id, i."reorderLevel"
          HAVING COALESCE(SUM(ib."availableQty"), 0) <= ${CRITICAL_STOCK_THRESHOLD}
        ) as sub
      `,

      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM (
          SELECT i.id
          FROM items i
          LEFT JOIN inventory_balances ib ON ib."itemId" = i.id
          WHERE i."deletedAt" IS NULL AND i."isActive" = true
          ${effectiveChannelId 
            ? Prisma.sql`AND ib."channelId" = ${effectiveChannelId}` 
            : Prisma.empty}
          GROUP BY i.id, i."reorderLevel"
          HAVING COALESCE(SUM(ib."availableQty"), 0) > ${CRITICAL_STOCK_THRESHOLD}
             AND COALESCE(SUM(ib."availableQty"), 0) <= i."reorderLevel"
        ) as sub
      `,

      prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM transfers
        WHERE status IN ('SENT', 'AWAITING_RECEIVER')
          ${effectiveChannelId
            ? Prisma.sql`AND ("fromChannelId" = ${effectiveChannelId} OR "toChannelId" = ${effectiveChannelId})`
            : Prisma.empty}
      `,

      prisma.$queryRaw<Array<{
        id: string; receiptNo: string; netAmount: string
        channelId: string; customerId: string | null
        createdAt: Date; channelName: string | null; customerName: string | null
      }>>`
        SELECT
          s.id,
          s."receiptNo",
          s."netAmount",
          s."channelId",
          s."customerId",
          s."createdAt",
          ch.name  AS "channelName",
          cu.name  AS "customerName"
        FROM   sales s
        LEFT   JOIN channels  ch ON ch.id = s."channelId"
        LEFT   JOIN customers cu ON cu.id = s."customerId"
        WHERE  s."deletedAt" IS NULL
          AND  s."createdAt" >= ${today}
          ${effectiveChannelId
            ? Prisma.sql`AND s."channelId" = ${effectiveChannelId}`
            : Prisma.empty}
        ORDER  BY s."createdAt" DESC
        LIMIT  5
      `,
    ])
    // ── Safe Data Mapping ──────────────────────────────────────────
    const salesRow     = todaySalesRaw[0] || { count: 0, revenue: 0 }
    const salesCount   = Number(salesRow.count)
    const salesRevenue = Number(salesRow.revenue)
    const totalExpenses = Number(todayExpenses._sum.amount ?? 0)

    return {
      todaySales:            salesCount,
      todayRevenue:          salesRevenue,
      todayExpenses:         totalExpenses,
      activeChannels:        isHQ ? activeChannelsCount : 1,
      lowStockItems:         (criticalStock[0]?.count    ?? 0)
                           + (suggestedReorder[0]?.count ?? 0),
      criticalItemsCount:    criticalStock[0]?.count    ?? 0,
      suggestedReorderCount: suggestedReorder[0]?.count ?? 0,
      pendingTransfers:      pendingTransfersRaw[0]?.count ?? 0,
      recentSales: recentSales.map(s => ({
        id:         s.id,
        receiptNo:  s.receiptNo,
        netAmount:  Number(s.netAmount),
        channelId:  s.channelId,
        customerId: s.customerId,
        createdAt:  s.createdAt,
        channel:    s.channelName  ? { name: s.channelName  } : null,
        customer:   s.customerName ? { name: s.customerName } : null,
      })),
    }
  })

  // PATCH /dashboard/settings
  app.patch('/settings', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
    schema:     { body: { type: 'object' } },
  }, async (request) => {
    const body = request.body as Record<string, any>
    // FIX 3: Use .sub not .id — consistent with the rest of the codebase
    return settingsService.bulkUpdate(body, request.user.sub, request.user.channelId ?? null)
  })

  // GET /dashboard/health
  app.get('/health', {
    config:     RATE.READ,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN')],
  }, async (request) => {
    return diagnosticsService.runFullDiagnostic(request.user.channelId ?? undefined)
  })
}
