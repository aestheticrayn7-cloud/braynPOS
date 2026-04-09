import type { FastifyPluginAsync } from 'fastify'
import { NotificationService } from './notifications.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { z } from 'zod'

export const notificationRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // Get notification history
  app.get('/', async (request) => {
    const { page, limit } = z.object({
      page: z.string().optional().transform(v => parseInt(v || '1', 10)),
      limit: z.string().optional().transform(v => parseInt(v || '20', 10)),
    }).parse(request.query)

    // Filter by channel if not super admin
    const channelId = ['SUPER_ADMIN', 'ADMIN'].includes(request.user.role) 
        ? null 
        : request.user.channelId

    return NotificationService.getHistory(channelId, page, limit)
  })

  // Mark as read
  app.post('/:id/read', async (request) => {
    const { id } = request.params as { id: string }
    return NotificationService.markAsRead(id)
  })
}
