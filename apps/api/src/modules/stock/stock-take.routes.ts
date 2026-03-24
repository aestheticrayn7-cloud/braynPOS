import type { FastifyPluginAsync } from 'fastify'
import { stockTakeService } from './stock-take.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const stockTakeRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // POST /api/v1/stock/take
  app.post('/', {
    preHandler: [authorize('MANAGER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN')]
  }, async (request) => {
    const { channelId } = z.object({
      channelId: z.string().uuid()
    }).parse(request.body)
    
    return stockTakeService.start(channelId, request.user.id)
  })

  // GET /api/v1/stock/take
  app.get('/', async (request) => {
    const query = z.object({
      channelId: z.string().uuid().optional()
    }).parse(request.query)

    let cid = query.channelId
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)) {
      cid = request.user.channelId || undefined
    }
    
    return stockTakeService.list(cid)
  })

  // GET /api/v1/stock/take/:id
  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    return stockTakeService.getTakeDetails(id, request.user.role)
  })

  // POST /api/v1/stock/take/:id/record
  app.post('/:id/record', {
    preHandler: [authorize('STOREKEEPER', 'MANAGER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN')]
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { itemId, recordedQty } = z.object({
      itemId: z.string().uuid(),
      recordedQty: z.number().int().min(0)
    }).parse(request.body)
    
    return stockTakeService.recordCount(id, itemId, recordedQty)
  })

  // POST /api/v1/stock/take/:id/complete
  app.post('/:id/complete', {
    preHandler: [authorize('MANAGER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN')]
  }, async (request) => {
    const { id } = request.params as { id: string }
    return stockTakeService.complete(id, request.user.id)
  })
}
