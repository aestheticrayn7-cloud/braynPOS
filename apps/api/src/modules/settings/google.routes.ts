import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { googleService } from './google.service.js'
import { authenticate } from '../../middleware/authenticate.js'

export const googleRoutes: FastifyPluginAsync = async (fastify) => {
  
  // 1. Initiate Google OAuth Flow
  fastify.get('/auth', { preHandler: [authenticate] }, async (request, reply) => {
    // We pass the user's ID in the state so we know who authorized the app when Google redirects back
    const url = googleService.getAuthUrl(request.user.sub)
    return { url }
  })

  // 2. Google OAuth Callback
  // This is where Google redirects the user after they consent
  fastify.get('/callback', async (request, reply) => {
    const querySchema = z.object({
      code: z.string(),
      state: z.string(), // This is the userId we passed earlier
    })

    const { code, state: userId } = querySchema.parse(request.query)

    try {
      await googleService.handleCallback(code, userId)
      return reply.redirect(`${process.env.CORS_ORIGIN?.[0] || 'http://localhost:3000'}/dashboard/settings?google=success`)
    } catch (error) {
      request.log.error({ err: error }, 'Google OAuth callback failed')
      return reply.redirect(`${process.env.CORS_ORIGIN?.[0] || 'http://localhost:3000'}/dashboard/settings?google=error`)
    }
  })
}
