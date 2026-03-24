import type { FastifyPluginAsync } from 'fastify'
import { purchaseService } from './purchase.service.js'
import { authenticate }    from '../../middleware/authenticate.js'
import { authorize }       from '../../middleware/authorize.js'
import { prisma }          from '../../lib/prisma.js'
import { z }               from 'zod'

export const purchaseRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // ── List purchases ──────────────────────────────────────────────────
  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      channelId:  z.string().optional(),
      supplierId: z.string().optional(),
      startDate:  z.string().optional(),
      endDate:    z.string().optional(),
      page:       z.coerce.number().min(1).optional(),
      limit:      z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      query.channelId = request.user.channelId || undefined
    }

    return purchaseService.findAll(query)
  })

  // ── Get purchase by ID ──────────────────────────────────────────────
  // FIX: authorize() was missing — any authenticated user (CASHIER,
  // PROMOTER, etc.) could read full purchase records including costs,
  // supplier details, and landed costs. Now restricted to managers.
  app.get('/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id }  = request.params as { id: string }
    const isHQ    = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    return purchaseService.findById(id, isHQ ? undefined : (channelId || undefined))
  })

  // ── Commit purchase ─────────────────────────────────────────────────
  app.post('/commit', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const body = z.object({
      supplierId:      z.string(),
      channelId:       z.string(),
      purchaseOrderId: z.string().optional(),
      lines: z.array(z.object({
        itemId:         z.string(),
        quantity:       z.number().int().positive(),
        unitCost:       z.number().positive(),
        retailPrice:    z.number().positive().optional(),
        wholesalePrice: z.number().positive().optional(),
        serialNumbers:  z.array(z.string()).optional(),
      })).min(1),
      landedCosts: z.array(z.object({
        description:      z.string(),
        amount:           z.number().positive(),
        allocationMethod: z.enum(['BY_VALUE', 'BY_QUANTITY']),
      })).optional(),
      paymentMethod: z.enum(['CASH', 'MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'CREDIT']).optional(),
      notes:         z.string().optional(),
    }).parse(request.body)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      if (body.channelId !== request.user.channelId) {
        throw { statusCode: 403, message: 'You can only commit purchases for your assigned channel' }
      }
    }

    const purchase = await purchaseService.create({ ...body, committedBy: request.user.sub })
    reply.status(201).send(purchase)
  })

  // ── Delete purchase ─────────────────────────────────────────────────
  app.delete('/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { id }           = request.params as { id: string }
    const { approvalToken } = z.object({ approvalToken: z.string().optional() }).parse(request.body)

    if (request.user.role === 'MANAGER') {
      if (!approvalToken) {
        // FIX: Use top-level prisma import — was re-importing inside the
        // handler via dynamic import(), risking a different module instance
        // and running the import resolution on every delete request.
        const approval = await (prisma as any).managerApproval.create({
          data: {
            action:      'purchase_delete',
            contextId:   id,
            channelId:   request.user.channelId!,
            requesterId: request.user.sub,
          },
        })
        return reply.status(403).send({
          error:      'Administrator Manager approval required for purchase deletion',
          approvalId: approval.id,
          message:    'An approval request has been sent to the Administrator Manager.',
        })
      }

      const { validateApprovalToken } = await import('../auth/manager-approve.routes.js')
      // FIX: Pass channelId so cross-channel token replay is blocked
      const approved = await validateApprovalToken(
        approvalToken, 'purchase_delete', id, request.user.channelId || undefined
      )
      if (!approved) {
        return reply.status(403).send({ error: 'Invalid or expired Administrator Manager approval' })
      }
    }

    const isHQ     = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    return purchaseService.softDelete(id, isHQ ? '' : (channelId || ''), request.user.sub)
  })
}
