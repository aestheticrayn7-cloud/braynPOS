import type { FastifyPluginAsync } from 'fastify'
import { lpoService } from './lpo.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const lpoRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER')],
  }, async (request) => {
    const query = z.object({
      channelId: z.string().optional(),
      status: z.string().optional(),
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(request.user.role)) {
      query.channelId = request.user.channelId || undefined
    }

    return lpoService.findAll(query)
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    return lpoService.findById(id, isHQ ? undefined : (channelId || undefined))
  })

  app.post('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const body = z.object({
      supplierId: z.string(),
      channelId: z.string(),
      lines: z.array(z.object({
        itemId: z.string(),
        quantity: z.number().int().positive(),
        unitCost: z.number().min(0),
      })).min(1),
      notes: z.string().optional(),
      expectedDate: z.string().optional(),
    }).parse(request.body)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(request.user.role) && body.channelId !== request.user.channelId) {
      throw { statusCode: 403, message: 'You can only create LPOs for your assigned channel' }
    }

    const lpo = await lpoService.create({ ...body, createdBy: request.user.sub })
    reply.status(201).send(lpo)
  })

  app.post('/:id/send', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const channelId = request.user.channelId!
    return lpoService.send(id, channelId)
  })

  app.post('/:id/cancel', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const channelId = request.user.channelId!
    return lpoService.cancel(id, channelId)
  })
}
