import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function cleanup() {
  console.log('Cleaning up 0-balance rows with no movement history...')
  
  // We want to delete balance rows where:
  // 1. availableQty = 0
  // 2. incomingQty = 0
  // 3. There are NO stock movements for this item+channel
  
  const count = await prisma.$executeRawUnsafe(`
    DELETE FROM inventory_balances ib
    WHERE ib."availableQty" = 0 
      AND ib."incomingQty" = 0
      AND NOT EXISTS (
        SELECT 1 FROM stock_movements sm
        WHERE sm."itemId" = ib."itemId" AND sm."channelId" = ib."channelId"
      );
  `)
  
  console.log(`Deleted ${count} redundant balance rows.`)
}

cleanup().finally(() => prisma.$disconnect())
