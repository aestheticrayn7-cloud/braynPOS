import type { FastifyPluginAsync } from 'fastify'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { prisma } from '../../lib/prisma.js'
import { mobileMoneyProvider } from './providers/mobile-money.provider.js'
import { z } from 'zod'

export const paymentsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /payments?saleId=xxx
  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'SALES_PERSON')],
  }, async (request) => {
    const { saleId } = z.object({ saleId: z.string().uuid() }).parse(request.query)
    const { basePrisma } = await import('../../lib/prisma.js')

    const sale = await basePrisma.sale.findUnique({
      where: { id: saleId },
      select: { channelId: true },
    })

    if (!sale) return [] // If it truly doesn't exist, return empty list

    // Isolation check
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)) {
      if (sale.channelId !== request.user.channelId) {
        throw { statusCode: 403, message: 'Access denied: Sale belongs to another channel' }
      }
    }

    return prisma.payment.findMany({
      where: { saleId },
      orderBy: { createdAt: 'desc' },
    })
  })

  // POST /payments/webhook — mobile money webhook (no auth required)
  app.post('/webhook', { config: { rawBody: true } }, async (request) => {
    const result = await mobileMoneyProvider.handleWebhook(request.body as Record<string, unknown>)

    if (result.status === 'CONFIRMED') {
      await prisma.payment.updateMany({
        where: { reference: result.transactionId, status: 'PENDING' },
        data: { status: 'CONFIRMED' },
      })
    } else {
      await prisma.payment.updateMany({
        where: { reference: result.transactionId, status: 'PENDING' },
        data: { status: 'FAILED' },
      })
    }

    return { received: true }
  })
}
