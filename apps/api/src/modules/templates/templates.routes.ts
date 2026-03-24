import type { FastifyPluginAsync } from 'fastify'
import { templatesService } from './templates.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const templatesRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  app.get('/', async (request) => {
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    return templatesService.findAll(isHQ ? undefined : (channelId || undefined))
  })
  
  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    return templatesService.findById(id, isHQ ? undefined : (channelId || undefined))
  })

  app.post('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request, reply) => {
    const body = z.object({
      name: z.string().min(1),
      type: z.string().min(1),
      content: z.string(),
    }).parse(request.body)
    
    reply.status(201).send(await templatesService.create({
      ...body,
      channelId: request.user.channelId || undefined
    }))
  })

  app.patch('/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const body = z.object({
      name: z.string().optional(),
      content: z.string().optional(),
      isActive: z.boolean().optional(),
    }).parse(request.body)
    
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)
    const channelId = request.user.channelId
    
    return templatesService.update(id, isHQ ? '' : (channelId || ''), body)
  })
}
