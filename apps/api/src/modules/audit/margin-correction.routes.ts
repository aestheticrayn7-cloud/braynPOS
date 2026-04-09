import { FastifyInstance } from 'fastify'
import { marginCorrectionService } from './margin-correction.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'

export async function marginCorrectionRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate)

  // List "Ghost Items" (weightedAvgCost = 0)
  fastify.get('/ghost-items', {
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN')]
  }, async (request) => {
    const { channelId } = request.query as { channelId?: string }
    return marginCorrectionService.listGhostItems(channelId)
  })

  // Bulk Repair Margins
  fastify.post('/repair', {
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN')]
  }, async (request, reply) => {
    const body = request.body as {
      itemId:      string
      channelId:   string
      newCost:     number
      newRetail?:  number
      repairRecentSales?: boolean
    }
    
    if (!body.itemId || !body.channelId || !body.newCost) {
      return reply.code(400).send({ message: 'itemId, channelId and newCost are required' })
    }

    const actorId = (request as any).user.sub
    return marginCorrectionService.repairMargin({ ...body, actorId })
  })
}
