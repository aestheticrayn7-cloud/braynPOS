import { ItemsService } from './src/modules/items/items.service'
import { prisma } from './src/lib/prisma'
import fs from 'fs'

async function verifyIsolationFinal() {
  const service = new ItemsService()
  
  const sonId = 'ecabdfe8-756e-4243-99ae-16ed9c12301c'
  const sonChannelId = '06382cf6-4e39-4ba4-8f7c-d3ad166527ac'
  
  // Find all items visible to Son
  const result = await service.findAll({ channelId: sonChannelId, limit: 100 }, 'MANAGER')
  
  const report = {
    totalItemsVisibleToSon: result.meta.total,
    items: result.data.map((it: any) => ({
      name: it.name,
      sku: it.sku
    }))
  }

  fs.writeFileSync('verification_son.json', JSON.stringify(report, null, 2))
}

verifyIsolationFinal().finally(() => prisma.$disconnect())
