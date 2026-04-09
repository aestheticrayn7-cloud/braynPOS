import type { FastifyPluginAsync } from 'fastify'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

// Shared instance - ideally would be in a service
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const aiRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // POST /ai/generate-description
  app.post('/generate-description', {
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const schema = z.object({
      name: z.string().min(1),
      category: z.string().optional(),
      brand: z.string().optional()
    })

    const { name, category, brand } = schema.parse(request.body)

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if no key is found
      return { 
        description: `This high-quality ${name} ${brand ? `by ${brand}` : ''} ${category ? `in the ${category} category` : ''} is designed for durability and performance in any retail environment.`,
        isMock: true
      }
    }

    try {
      const prompt = `You are a professional retail copywriter for a premium ERP system. 
      Generate a compelling, SEO-friendly product description (max 100 words) for the following item:
      Item Name: ${name}
      Category: ${category || 'General'}
      Brand: ${brand || 'Generic'}
      Focus on value, quality, and technical features if applicable. Return ONLY the description text.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return { description: response.text().trim() }
    } catch (error) {
       console.error('[AI Generation Error]:', error)
       throw app.httpErrors.internalServerError('Failed to generate AI description')
    }
  })

  // POST /ai/batch-generate
  app.post('/batch-generate', {
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const schema = z.object({
      items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string().optional(),
        brand: z.string().optional()
      }))
    })

    const { items } = schema.parse(request.body)
    
    // In a real production app, we would use a queue (BullMQ is in package.json)
    // For this ERP modernization, we'll do a limited batch or suggest queue migration
    const results = await Promise.all(items.slice(0, 10).map(async (item) => {
        try {
            const prompt = `Generate a 1-sentence product description for ${item.name} (${item.category || 'General'}).`
            const result = await model.generateContent(prompt)
            const text = (await result.response).text().trim()
            return { id: item.id, description: text }
        } catch (e) {
            return { id: item.id, error: 'Failed' }
        }
    }))

    return { results, note: items.length > 10 ? 'Limited to first 10 items for performance' : undefined }
  })
}
