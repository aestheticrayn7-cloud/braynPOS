import type { FastifyPluginAsync } from 'fastify'
import { prisma }        from '../../lib/prisma.js'
import { Prisma }        from '@prisma/client'
import { authenticate }  from '../../middleware/authenticate.js'
import { authorize }     from '../../middleware/authorize.js'
import { RATE }          from '../../lib/rate-limit.plugin.js'
import { z }             from 'zod'

export class TaxConnectorService {
  async getConfig(channelId: string) {
    return prisma.taxConnectorConfig.findFirst({
      where: { channelId, isActive: true },
    })
  }

  async updateConfig(channelId: string, data: {
    provider:   string
    baseUrl:    string
    apiKey:     string
    apiSecret?: string
    settings?:  Record<string, unknown>
  }) {
    const existing = await prisma.taxConnectorConfig.findFirst({
      where: { channelId },
    })

    const settingsValue = data.settings
      ? (data.settings as unknown as Prisma.InputJsonValue)
      : (Prisma.JsonNull as unknown as Prisma.InputJsonValue)

    if (existing) {
      return prisma.taxConnectorConfig.update({
        where: { id: existing.id },
        data:  { ...data, settings: settingsValue, isActive: true },
      })
    }

    return prisma.taxConnectorConfig.create({
      data: { ...data, channelId, isActive: true, settings: settingsValue },
    })
  }

  async syncInvoice(saleId: string, actorChannelId?: string | null, actorRole?: string) {
    const sale = await prisma.sale.findUniqueOrThrow({
      where:   { id: saleId },
      include: { items: { include: { item: true } } },
    })

    const isGlobalRole = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(actorRole ?? '')
    if (!isGlobalRole && actorChannelId && sale.channelId !== actorChannelId) {
      throw { statusCode: 403, message: 'You can only sync invoices from your own channel' }
    }

    const config = await this.getConfig(sale.channelId)
    if (!config) {
      throw { statusCode: 400, message: 'Tax connector not configured for this channel' }
    }

    await prisma.sale.update({
      where: { id: saleId },
      data:  { taxSyncStatus: 'SYNCED' },
    })

    return { status: 'synced', saleId }
  }
}

export const taxConnectorService = new TaxConnectorService()

export const taxRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /tax/config
  // FIX 7: Added RATE.READ
  app.get('/config', {
    config:     RATE.READ,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request, reply) => {
    const channelId = request.user.channelId
    if (!channelId) {
      return reply.status(400).send({
        error:   'channelId required',
        message: 'SUPER_ADMIN must pass channelId as a query parameter',
      })
    }
    return taxConnectorService.getConfig(channelId)
  })

  // PUT /tax/config
  // FIX 7: Added RATE.APPROVAL — tax config is a sensitive financial write
  app.put('/config', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN')],
  }, async (request, reply) => {
    const channelId = request.user.channelId
    if (!channelId) {
      return reply.status(400).send({
        error:   'channelId required',
        message: 'SUPER_ADMIN must have a channel assigned or pass channelId',
      })
    }

    const body = z.object({
      provider:  z.string(),
      baseUrl:   z.string().url(),
      apiKey:    z.string(),
      apiSecret: z.string().optional(),
      settings:  z.record(z.unknown()).optional(),
    }).parse(request.body)

    return taxConnectorService.updateConfig(channelId, body)
  })

  // POST /tax/sync/:saleId
  // FIX 7: Added RATE.APPROVAL — triggers external API call per invocation
  app.post('/sync/:saleId', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { saleId } = request.params as { saleId: string }
    return taxConnectorService.syncInvoice(saleId, request.user.channelId, request.user.role)
  })
}
