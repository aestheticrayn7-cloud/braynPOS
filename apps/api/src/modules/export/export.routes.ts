import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { exportService } from '../reports/export.service.js'
import { authenticate } from '../../middleware/authenticate.js'

export const exportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', authenticate)

  fastify.post('/sheets', async (request, reply) => {
    const schema = z.object({
      title: z.string(),
      headers: z.array(z.string()),
      data: z.array(z.array(z.any())),
    })
    
    const { title, headers, data } = schema.parse(request.body)

    try {
      const result = await exportService.exportToSheets(request.user.sub, title, data, headers)
      return reply.send(result)
    } catch (error: any) {
      if (error?.message?.includes('Google account not connected') || error?.statusCode === 400) {
        return reply.status(400).send({ error: 'Google account not connected. Please connect your Google account in settings.' })
      }
      request.log.error({ err: error }, 'Failed to export to Google Sheets')
      return reply.status(500).send({ error: 'Failed to export to Google Sheets.' })
    }
  })

  fastify.post('/docs', async (request, reply) => {
    const schema = z.object({
      title: z.string(),
      headers: z.array(z.string()),
      data: z.array(z.array(z.any())),
    })
    
    const { title, headers, data } = schema.parse(request.body)

    try {
      const result = await exportService.exportToDocs(request.user.sub, title, data, headers)
      return reply.send(result)
    } catch (error: any) {
      if (error?.message?.includes('Google account not connected') || error?.statusCode === 400) {
        return reply.status(400).send({ error: 'Google account not connected. Please connect your Google account in settings.' })
      }
      request.log.error({ err: error }, 'Failed to export to Google Docs')
      return reply.status(500).send({ error: 'Failed to export to Google Docs.' })
    }
  })
}
