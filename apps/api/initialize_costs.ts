import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function initialize() {
  console.log('Initializing weightedAvgCost for items and balances...')
  
  // 1. Update items table
  const itemsUpdated = await prisma.$executeRawUnsafe(`
    UPDATE items 
    SET "weightedAvgCost" = "retailPrice" * 0.7 
    WHERE "weightedAvgCost" = 0 AND "retailPrice" > 0
  `)
  console.log(`Updated ${itemsUpdated} items with default cost (70% of retail).`)

  // 2. Update inventory_balances table
  const balancesUpdated = await prisma.$executeRawUnsafe(`
    UPDATE inventory_balances ib
    SET "weightedAvgCost" = i."retailPrice" * 0.7
    FROM items i
    WHERE ib."itemId" = i.id 
      AND (ib."weightedAvgCost" = 0 OR ib."weightedAvgCost" IS NULL)
      AND i."retailPrice" > 0
  `)
  console.log(`Updated ${balancesUpdated} inventory balance records with default cost.`)
}

initialize().catch(console.error).finally(() => prisma.$disconnect())
