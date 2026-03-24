import type { FastifyPluginAsync } from 'fastify'
import {
  commitSale, syncOfflineSale, findSales, findSaleById,
  reverseSale, findSaleItems,
} from './sales.service.js'
import { listSalesQuery } from './sales.schema.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize }    from '../../middleware/authorize.js'
import { z }            from 'zod'
import { RATE }         from '../../lib/rate-limit.plugin.js'

// ── FIX: Zod schema for commitSale body ──────────────────────────────
// Previously: `request.body as any` — no validation, any malformed body
// would throw an unstructured runtime error or corrupt data silently.
const commitSaleSchema = z.object({
  channelId:       z.string().uuid(),
  sessionId:       z.string().nullable().optional(),
  customerId:      z.string().nullable().optional(),
  saleType:        z.enum(['RETAIL', 'WHOLESALE', 'CREDIT']),
  discountAmount:  z.number().min(0).optional(),
  notes:           z.string().max(500).nullable().optional(),
  dueDate:         z.string().nullable().optional(),
  items: z.array(z.object({
    itemId:          z.string().min(1),
    serialId:        z.string().min(1).nullable().optional(),
    quantity:        z.number().int().positive(),
    unitPrice:       z.number().positive(),
    discountAmount:  z.number().min(0).optional(),
  })).min(1, 'Sale must have at least one item'),
  payments: z.array(z.object({
    method:    z.enum(['CASH', 'MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'LOYALTY_POINTS', 'CREDIT']),
    amount:    z.number().positive(),
    reference: z.string().max(100).optional(),
  })).min(1, 'Sale must have at least one payment'),
  approvalToken: z.string().nullable().optional(),
})

// ── FIX: Zod schema for syncOfflineSale body ─────────────────────────
const syncOfflineSchema = z.object({
  offlineReceiptNo: z.string().max(50).optional(),
  saleData:         commitSaleSchema,
})

export const salesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // ── List sales ──────────────────────────────────────────────────────
  app.get('/', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'PROMOTER', 'STOREKEEPER'
    )],
  }, async (request) => {
    const query = listSalesQuery.parse(request.query)
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(request.user.role)) {
      query.channelId   = request.user.channelId || undefined
      query.performedBy = request.user.sub
    }
    return findSales(query, request.user)
  })

  // ── Get sale by ID ──────────────────────────────────────────────────
  app.get('/:id', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'PROMOTER', 'STOREKEEPER'
    )],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const sale   = await findSaleById(id)

    if (
      !['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role) &&
      sale?.channelId !== request.user.channelId
    ) {
      reply.status(403).send({ error: 'Forbidden', message: 'You do not have access to this sale' })
      return
    }

    return sale
  })

  // ── Get sale line items ─────────────────────────────────────────────
  app.get('/:id/items', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'PROMOTER', 'STOREKEEPER'
    )],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      const sale = await findSaleById(id)
      if (sale?.channelId !== request.user.channelId) {
        reply.status(403).send({ error: 'Forbidden', message: 'You do not have access to this sale' })
        return
      }
    }
    return findSaleItems(id)
  })

  // ── Commit sale ─────────────────────────────────────────────────────
  app.post('/commit', {
    config:     RATE.SALE_COMMIT,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'PROMOTER'
    )],
  }, async (request, reply) => {
    // FIX: Zod parse replaces unsafe `request.body as any`
    const body = commitSaleSchema.parse(request.body)

    // Non-admin roles can only commit sales for their own channel
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      if (body.channelId !== request.user.channelId) {
        return reply.status(403).send({ error: 'You can only commit sales for your assigned channel' })
      }
    }

    const sale = await commitSale(body, request.user, {
      approvalToken: body.approvalToken,
    })
    reply.status(201).send(sale)
  })

  // ── Sync offline sale ───────────────────────────────────────────────
  app.post('/sync-offline', {
    config:     RATE.OFFLINE_SYNC,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'PROMOTER'
    )],
  }, async (request, reply) => {
    const idempotencyKey = request.headers['idempotency-key'] as string
    if (!idempotencyKey) {
      return reply.status(400).send({ error: 'Idempotency-Key header required' })
    }
    // FIX: Zod parse replaces unsafe `request.body as any`
    const body   = syncOfflineSchema.parse(request.body)
    const result = await syncOfflineSale(body, request.user, idempotencyKey)
    return reply.send(result)
  })

  // ── Reverse (void) a sale ───────────────────────────────────────────
  app.post('/:id/reverse', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id }       = request.params as { id: string }
    // FIX (from critical phase): use request.user.sub not request.user.id
    const { password } = z.object({ password: z.string().optional() }).parse(request.body)
    return reverseSale(id, request.user.sub, password)
  })
}
