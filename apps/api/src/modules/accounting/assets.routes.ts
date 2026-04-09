import type { FastifyPluginAsync } from 'fastify'
import { assetsService } from './assets.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const assetsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /accounting/assets
  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { channelId } = request.query as { channelId?: string }
    const targetChannel = channelId || (request.user as any).channelId
    
    if (!targetChannel) throw app.httpErrors.badRequest('Channel ID required')
    return assetsService.getAssets(targetChannel)
  })

  // POST /accounting/assets
  app.post('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const schema = z.object({
      name: z.string().min(1),
      code: z.string().min(1),
      category: z.string().min(1),
      purchaseDate: z.string(),
      purchasePrice: z.number().positive(),
      depreciationRate: z.number().min(0).max(100),
      channelId: z.string().uuid(),
      notes: z.string().optional()
    })
    
    const body = schema.parse(request.body)
    const asset = await assetsService.createAsset(body)
    reply.status(201).send(asset)
  })
}
