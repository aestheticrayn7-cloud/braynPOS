import type { FastifyPluginAsync } from 'fastify'
import { settingsService } from './settings.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const settingsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /settings - Fetch all settings for the channel (with global fallbacks)
  app.get('/settings', async (request) => {
    return settingsService.getAll(request.user.channelId)
  })

  // PATCH /settings - Bulk update settings for the channel
  app.patch('/settings', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const body = z.record(z.any()).parse(request.body)
    return settingsService.bulkUpdate(body, request.user.sub, request.user.channelId)
  })

  // GET /settings/:key - Fetch specific setting
  app.get('/settings/:key', async (request) => {
    const { key } = request.params as { key: string }
    return settingsService.getByKey(key, request.user.channelId)
  })

  // PUT /settings/:key - Update specific setting
  app.put('/settings/:key', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { key } = request.params as { key: string }
    const { value } = z.object({ value: z.any() }).parse(request.body)
    return settingsService.update(key, value, request.user.sub, request.user.channelId)
  })
}
