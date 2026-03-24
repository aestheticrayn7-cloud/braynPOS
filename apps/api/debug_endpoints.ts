import { prisma } from './src/lib/prisma'
import fs from 'fs'

async function debugEndpoints() {
  const channelId = '06382cf6-4e39-4ba4-8f7c-d3ad166527ac' // Son's channel
  
  // 1. Check balances
  const balances = await prisma.$queryRaw`
      SELECT i.name, ib."availableQty"
      FROM items i
      JOIN inventory_balances ib ON i.id = ib."itemId" AND ib."channelId" = ${channelId}
  `
  
  // 2. Check low stock
  const lowStock = await prisma.$queryRaw`
      SELECT i.name, COALESCE(ib."availableQty", 0) as "availableQty", i."reorderLevel"
      FROM items i
      JOIN inventory_balances ib ON ib."itemId" = i.id AND ib."channelId" = ${channelId}
      WHERE i."deletedAt" IS NULL AND i."isActive" = true
      AND COALESCE(ib."availableQty", 0) <= i."reorderLevel"
  `
  
  fs.writeFileSync('endpoint_debug.json', JSON.stringify({ balances, lowStock }, null, 2))
}

debugEndpoints().finally(() => prisma.$disconnect())
