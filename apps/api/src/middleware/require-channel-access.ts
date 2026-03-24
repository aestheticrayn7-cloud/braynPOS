import { FastifyRequest, FastifyReply } from 'fastify'
import { hasRole } from './authorize.js'

type Source = 'body' | 'params' | 'query'

export function requireChannelAccess(source: Source = 'body') {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const actor = request.user

    if (!actor) {
      reply.status(401).send({ error: 'Unauthorized' })
      return
    }

    // FIX: ADMIN added — all three global roles bypass channel restriction.
    // This now matches the bypass list in prisma-multi-tenant.extension.ts.
    if (
      hasRole(actor, 'SUPER_ADMIN') ||
      hasRole(actor, 'ADMIN') ||          // ← was missing
      hasRole(actor, 'MANAGER_ADMIN')
    ) return

    const req = request as any
    const channelId: string | undefined = req[source]?.channelId

    if (!channelId) return // route doesn't carry channelId — nothing to guard

    if (!actor.channelId) {
      reply.status(403).send({
        error:   'Forbidden',
        message: 'User has no channel assignment',
      })
      return
    }

    if (actor.channelId !== channelId) {
      reply.status(403).send({
        error:   'Forbidden',
        message: "You do not have access to this channel's data",
      })
    }
  }
}
