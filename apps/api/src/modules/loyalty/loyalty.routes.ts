import type { FastifyPluginAsync } from 'fastify'
import { loyaltyService } from './loyalty.service.js'
import { authenticate }   from '../../middleware/authenticate.js'
import { authorize }      from '../../middleware/authorize.js'
import { RATE }           from '../../lib/rate-limit.plugin.js'
import { prisma }         from '../../lib/prisma.js'
import { z }              from 'zod'
import type { UserRole }  from '@prisma/client'

export const loyaltyRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /loyalty/history/:customerId
  // FIX 6: Removed `as any` casts — use proper UserRole values
  // FIX 5: Added channel scoping — CASHIER was able to view any customer's
  // loyalty history regardless of channel
  // FIX 8: Added RATE.READ
  app.get('/history/:customerId', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN' as UserRole, 'MANAGER_ADMIN' as UserRole,
      'MANAGER'     as UserRole, 'CASHIER'       as UserRole,
      'SALES_PERSON' as UserRole,
    )],
  }, async (request, reply) => {
    const { customerId } = request.params as { customerId: string }
    const { page, limit } = z.object({
      page:  z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)

    // Non-admin roles may only view loyalty history for their channel's customers
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      const customer = await prisma.customer.findUnique({
        where:  { id: customerId },
        select: { channelId: true },
      })
      if (!customer) {
        return reply.status(404).send({ error: 'Customer not found' })
      }
      if (customer.channelId && customer.channelId !== request.user.channelId) {
        return reply.status(403).send({
          error:   'Forbidden',
          message: 'Customer does not belong to your channel',
        })
      }
    }

    return loyaltyService.getHistory(customerId, page, limit)
  })

  // POST /loyalty/redeem
  // FIX 8: Added RATE.SALE_COMMIT — financial write that modifies customer balance
  // FIX 5: Added channel scoping
  // FIX 6: Removed `as any` casts
  app.post('/redeem', {
    config:     RATE.SALE_COMMIT,
    preHandler: [authorize(
      'SUPER_ADMIN' as UserRole, 'MANAGER_ADMIN' as UserRole,
      'MANAGER'     as UserRole, 'CASHIER'       as UserRole,
    )],
  }, async (request, reply) => {
    const { customerId, points } = z.object({
      customerId: z.string().uuid(),
      points:     z.number().int().positive(),
    }).parse(request.body)

    // Non-admin roles may only redeem points for their channel's customers
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      const customer = await prisma.customer.findUnique({
        where:  { id: customerId },
        select: { channelId: true },
      })
      if (!customer) {
        return reply.status(404).send({ error: 'Customer not found' })
      }
      if (customer.channelId && customer.channelId !== request.user.channelId) {
        return reply.status(403).send({
          error:   'Forbidden',
          message: 'Customer does not belong to your channel',
        })
      }
    }

    return loyaltyService.redeemPoints(customerId, points)
  })
}
