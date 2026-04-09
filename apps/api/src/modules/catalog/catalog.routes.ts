import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../../lib/prisma.js'
import { settingsService } from '../dashboard/settings.service.js'
import { RATE } from '../../lib/rate-limit.plugin.js'

export const catalogRoutes: FastifyPluginAsync = async (app) => {
  // GET /catalog/items — Fetch public items with images
  app.get('/items', { config: RATE.PUBLIC_CATALOG }, async () => {
    return prisma.item.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        imageUrl: { not: null }
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        retailPrice: true,
        category: { select: { name: true } }
      },
      take: 50 // Limit for public view
    })
  })

  // GET /catalog/branding — Fetch public business info
  app.get('/branding', { config: RATE.PUBLIC_CATALOG }, async () => {
    // Fetch settings without channel scoping to get global defaults or first channel match
    // NOTE: In a real multi-tenant setup, this would be scoped by the 'slug' from URL
    const branding = await settingsService.getByKey('brandingSettings', null)
    const business = await settingsService.getByKey('bizSettings', null)
    
    return {
      branding: branding || { logo: '', tagline: 'Welcome to our shop', primaryColor: '#0ea5e9' },
      business: business || { businessName: 'BraynPOS Retail' }
    }
  })
}
