import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize }    from '../../middleware/authorize.js'
import {
  calculateCommission,
  buildCommissionPayout,
  getCommissionSummary,
  getCommissionStats,
} from './commission.service.js'

const ruleSchema = z.object({
  name:             z.string().min(1),
  channelId:        z.string().optional().nullable(),
  userId:           z.string().optional().nullable(),
  role:             z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON']).optional().nullable(),
  ratePercent:      z.number().min(0).max(100),
  minMarginPercent: z.number().min(0).max(100).optional().nullable(),
  appliesTo:        z.array(z.enum(['WHOLESALE', 'RETAIL', 'CREDIT', 'PRE_ORDER', 'LAYAWAY'])).optional().default([]),
  isActive:         z.boolean().optional().default(true),
})

const payoutRequestSchema = z.object({
  userId:      z.string(),
  periodStart: z.string(),
  periodEnd:   z.string(),
  channelId:   z.string().optional(),
})

export const commissionRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  app.get('/stats', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      channelId: z.string().optional(),
      userId:    z.string().optional(),
      startDate: z.string().optional(),
      endDate:   z.string().optional(),
    }).parse(request.query)
    return getCommissionStats(query.channelId, query.userId, query.startDate, query.endDate)
  })

  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'CASHIER', 'SALES_PERSON', 'PROMOTER')],
  }, async (request) => {
    const query = z.object({
      userId:    z.string().optional(),
      channelId: z.string().optional(),
      status:    z.enum(['PENDING', 'APPROVED', 'PAID', 'VOIDED']).optional(),
      startDate: z.string().optional(),
      endDate:   z.string().optional(),
      page:      z.coerce.number().min(1).optional(),
      limit:     z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)
    return getCommissionSummary(query, request.user)
  })

  app.post('/rules', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request, reply) => {
    const body = ruleSchema.parse(request.body)
    const { prisma } = await import('../../lib/prisma.js')
    const rule = await prisma.commissionRule.create({ data: body as any })
    reply.status(201).send(rule)
  })

  app.get('/rules', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { channelId } = z.object({ channelId: z.string().optional() }).parse(request.query)
    const { prisma } = await import('../../lib/prisma.js')
    return prisma.commissionRule.findMany({
      where:   channelId ? { OR: [{ channelId }, { channelId: null }] } : {},
      orderBy: { createdAt: 'desc' },
    })
  })

  app.patch('/rules/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const body   = ruleSchema.partial().parse(request.body)
    const { prisma } = await import('../../lib/prisma.js')
    return prisma.commissionRule.update({ where: { id }, data: body as any })
  })

  app.delete('/rules/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { prisma } = await import('../../lib/prisma.js')
    await prisma.commissionRule.update({ where: { id }, data: { isActive: false } })
    return { message: 'Rule deactivated' }
  })

  app.patch('/:id/approve', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { prisma } = await import('../../lib/prisma.js')
    return prisma.commissionEntry.update({
      where: { id, status: 'PENDING' },
      data:  { status: 'APPROVED' },
    })
  })

  app.post('/payout', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const body   = payoutRequestSchema.parse(request.body)
    const result = await buildCommissionPayout(
      body.userId,
      new Date(body.periodStart),
      new Date(body.periodEnd),
      body.channelId
    )
    if (!result) {
      reply.status(404).send({ error: 'No approved commission entries found for this period' })
      return
    }
    reply.status(201).send(result)
  })

  // ── Single sale recalculation ─────────────────────────────────────
  app.post('/recalculate/:saleId', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { saleId } = request.params as { saleId: string }
    const result     = await calculateCommission(saleId)
    if (!result) return { message: 'No commission applicable for this sale' }
    return result
  })

  // ── Bulk recalculate entire month ─────────────────────────────────
  // Finds all sales in the given month that have no commission entry yet
  // and runs calculateCommission for each one using current active rules.
  // Safe to run multiple times — calculateCommission is idempotent.
  // After running this, delete the draft salary run and create a new one
  // — it will automatically include all newly calculated commissions.
  app.post('/recalculate-month', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { month, year } = z.object({
      month: z.number().int().min(1).max(12),
      year:  z.number().int().min(2020).max(2100),
    }).parse(request.body)

    const { prisma } = await import('../../lib/prisma.js')

    const periodStart = new Date(year, month - 1, 1)
    const periodEnd   = new Date(year, month, 0, 23, 59, 59, 999)

    const sales = await prisma.sale.findMany({
      where: {
        deletedAt:       null,
        createdAt:       { gte: periodStart, lte: periodEnd },
        commissionEntry: null,
      },
      select: { id: true, receiptNo: true },
    })

    if (sales.length === 0) {
      return {
        message:    'All sales for this period already have commission entries',
        processed:  0,
        calculated: 0,
        skipped:    0,
      }
    }

    let calculated = 0
    let skipped    = 0
    const details: string[] = []

    for (const sale of sales) {
      try {
        const result = await calculateCommission(sale.id)
        if (result) {
          calculated++
          details.push(`✓ ${sale.receiptNo}`)
        } else {
          skipped++
          details.push(`— ${sale.receiptNo} (no margin or no matching rule)`)
        }
      } catch (err: any) {
        skipped++
        details.push(`✗ ${sale.receiptNo}: ${err?.message ?? 'unknown error'}`)
      }
    }

    return {
      message:    `Commission recalculated for ${month}/${year}`,
      processed:  sales.length,
      calculated,
      skipped,
      details,
    }
  })
}
