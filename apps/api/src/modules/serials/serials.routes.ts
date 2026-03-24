import type { FastifyPluginAsync } from 'fastify'
import { serialsService } from './serials.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const serialsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /serials?itemId=xxx&channelId=xxx
  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER', 'CASHIER')],
  }, async (request) => {
    const query = z.object({
      itemId: z.string(),
      channelId: z.string().optional(),
    }).parse(request.query)
    return serialsService.findByItem(query.itemId, query.channelId)
  })

  // GET /serials/lookup/:serialNo
  app.get('/lookup/:serialNo', async (request) => {
    const { serialNo } = request.params as { serialNo: string }
    const serial = await serialsService.findBySerialNo(serialNo, request.user)
    if (!serial) throw { statusCode: 404, message: 'Serial not found' }
    return serial
  })

  // GET /serials/search?q=xxx
  app.get('/search', async (request) => {
    const { q } = z.object({ q: z.string().min(1) }).parse(request.query)
    return serialsService.searchSerials(q, request.user)
  })

  // GET /serials/available?itemId=xxx&channelId=xxx
  app.get('/available', async (request) => {
    const query = z.object({
      itemId: z.string(),
      channelId: z.string(),
    }).parse(request.query)
    return serialsService.findAvailableInChannel(query.itemId, query.channelId)
  })

  // POST /serials
  app.post('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER')],
  }, async (request, reply) => {
    const body = z.object({
      serialNo: z.string().min(1),
      itemId: z.string(),
      channelId: z.string(),
    }).parse(request.body)
    const serial = await serialsService.create(body)
    reply.status(201).send(serial)
  })

  // POST /serials/bulk
  app.post('/bulk', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER')],
  }, async (request, reply) => {
    const body = z.object({
      serials: z.array(z.object({
        serialNo: z.string().min(1),
        itemId: z.string(),
        channelId: z.string(),
      })),
    }).parse(request.body)
    const result = await serialsService.createMany(body.serials)
    reply.status(201).send(result)
  })

  // POST /serials/:id/write-off
  app.post('/:id/write-off', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    return serialsService.writeOff(id)
  })
}
