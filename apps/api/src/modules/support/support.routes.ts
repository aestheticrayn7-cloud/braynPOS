import type { FastifyPluginAsync } from 'fastify'
import { supportService } from './support.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'
import { SupportCategory, TicketPriority, TicketStatus } from '@prisma/client'

export const supportRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // POST /support/tickets — Create a new ticket (Managers)
  app.post('/tickets', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const body = z.object({
      subject: z.string().min(1).max(200),
      category: z.nativeEnum(SupportCategory),
      priority: z.nativeEnum(TicketPriority),
      content: z.string().min(1),
    }).parse(request.body)

    const ticket = await supportService.createTicket(request.user.sub, {
      ...body,
      channelId: request.user.channelId || undefined,
    })
    reply.status(201).send(ticket)
  })

  // GET /support/tickets — List tickets (Filters for Admins vs Managers)
  app.get('/tickets', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      status: z.nativeEnum(TicketStatus).optional(),
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)

    const baseFilters: any = { ...query }
    let creatorRole: any = undefined
    let channelId: string | undefined = undefined

    // Hierarchy logic for which OTHER tickets can be seen
    if (request.user.role === 'SUPER_ADMIN') {
      creatorRole = 'MANAGER_ADMIN'
    } else if (request.user.role === 'MANAGER_ADMIN') {
      creatorRole = { in: ['MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON', 'MANAGER_ADMIN'] }
    } else if (request.user.role === 'MANAGER') {
      channelId = request.user.channelId || undefined
    }

    // Final "OR" filter: (Your own tickets) OR (Tickets you oversee)
    const filters = {
      ...baseFilters,
      OR: [
        { userId: request.user.sub },
        ...(creatorRole || channelId ? [{
          AND: [
             ...(creatorRole ? [{ user: { role: creatorRole } }] : []),
             ...(channelId ? [{ channelId }] : [])
          ]
        }] : [])
      ]
    }

    return supportService.getTickets(filters)
  })

  // GET /support/tickets/:id — Get ticket details
  app.get('/tickets/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const ticket = await supportService.getTicketDetails(id)

    // Security check
    if (['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      // Access granted
    } else if (request.user.role === 'MANAGER') {
      if (ticket.channelId !== request.user.channelId) {
        throw { statusCode: 403, message: 'You do not have permission to view this branch ticket' }
      }
    } else if (ticket.userId !== request.user.sub) {
      throw { statusCode: 403, message: 'You do not have permission to view this ticket' }
    }

    return ticket
  })

  // POST /support/tickets/:id/messages — Reply to a ticket
  app.post('/tickets/:id/messages', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { content } = z.object({ content: z.string().min(1) }).parse(request.body)

    const ticket = await supportService.getTicketDetails(id)

    // Security check
    if (['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      // Access granted
    } else if (request.user.role === 'MANAGER') {
      if (ticket.channelId !== request.user.channelId) {
        throw { statusCode: 403, message: 'You do not have permission to reply to this branch ticket' }
      }
    } else if (ticket.userId !== request.user.sub) {
      throw { statusCode: 403, message: 'You do not have permission to reply to this ticket' }
    }

    const message = await supportService.handleUserMessage(id, request.user.sub, content, (chunk) => {
      // Stream AI response if needed (future implementation with socket.io)
    })
    reply.status(201).send(message)
  })

  // PATCH /support/tickets/:id/status — Update ticket status (Admins only)
  app.patch('/tickets/:id/status', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const { status } = z.object({ status: z.nativeEnum(TicketStatus) }).parse(request.body)
    return supportService.updateTicketStatus(id, status)
  })

  // DELETE /support/tickets/:id — Delete a ticket (if Resolved/Closed)
  app.delete('/tickets/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const ticket = await supportService.getTicketDetails(id)

    // Security check (same as GET)
    if (['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      // Access granted
    } else if (request.user.role === 'MANAGER') {
      if (ticket.channelId !== request.user.channelId) {
        throw { statusCode: 403, message: 'You do not have permission to delete this branch ticket' }
      }
    } else if (ticket.userId !== request.user.sub) {
      throw { statusCode: 403, message: 'You do not have permission to delete this ticket' }
    }

    await supportService.deleteTicket(id)
    reply.status(204).send()
  })

  // POST /support/ai-portal/chat — Direct chat with BraynAI (No ticket)
  app.post('/ai-portal/chat', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'ADMIN')],
  }, async (request, reply) => {
    const { message } = z.object({ message: z.string().min(1) }).parse(request.body)
    
    // We return the full string for consistency with the support chat session logic.
    const fullReply = await supportService.handleStandaloneChat(
      request.user.sub,
      request.user.role,
      request.user.username,
      message,
      () => {}
    )
    
    return { reply: fullReply }
  })
}
