import type { FastifyPluginAsync } from 'fastify'
import { accountsService } from './accounts.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { requireMfa } from '../../middleware/require-mfa.js'
import { z } from 'zod'

export const accountsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /accounting/accounts — chart of accounts (hierarchical tree)
  app.get('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async () => {
    return accountsService.getChartOfAccounts()
  })

  // GET /accounting/accounts/:id
  app.get('/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    return accountsService.findById(id)
  })

  // POST /accounting/accounts — requires MFA
  app.post('/', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'), requireMfa],
  }, async (request, reply) => {
    const body = z.object({
      code: z.string().min(1).max(20),
      name: z.string().min(1).max(200),
      type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']),
      parentId: z.string().uuid().optional(),
      channelId: z.string().uuid().optional(),
    }).parse(request.body)
    const account = await accountsService.create(body)
    reply.status(201).send(account)
  })

  // PATCH /accounting/accounts/:id — requires MFA
  app.patch('/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'), requireMfa],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const body = z.object({
      name: z.string().optional(),
      isActive: z.boolean().optional(),
    }).parse(request.body)
    return accountsService.update(id, body)
  })
}
