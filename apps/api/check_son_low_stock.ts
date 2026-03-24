import { prisma } from './src/lib/prisma'
import fs from 'fs'

async function checkSonLowStock() {
  const sonChannelId = '06382cf6-4e39-4ba4-8f7c-d3ad166527ac'
  
  const lowStock = await prisma.$queryRaw`
      SELECT
        i.id as "itemId",
        i.name as "itemName",
        COALESCE(ib."availableQty", 0) as "availableQty",
        i."reorderLevel"
      FROM items i
      JOIN inventory_balances ib
        ON ib."itemId" = i.id AND ib."channelId" = ${sonChannelId}
      WHERE i."deletedAt" IS NULL
        AND i."isActive" = true
        AND COALESCE(ib."availableQty", 0) <= i."reorderLevel"
  `
  
  fs.writeFileSync('son_low_stock_final.json', JSON.stringify(lowStock, null, 2))
}

checkSonLowStock().finally(() => prisma.$disconnect())
