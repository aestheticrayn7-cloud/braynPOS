import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function sync() {
  console.log('Synchronizing all balances...')
  // Using a more robust aggregation
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "availableQty",
      SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "incomingQty",
      MAX("createdAt") as "lastMovementAt"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO UPDATE
      SET "availableQty" = EXCLUDED."availableQty",
          "incomingQty"  = EXCLUDED."incomingQty",
          "lastMovementAt" = EXCLUDED."lastMovementAt";
  `)
  console.log('Balance synchronization complete.')
  
  const mouseBal = await prisma.inventory_balances.findMany({
    where: { itemId: 'item-mouse-002' }
  })
  console.log('Mouse Balances now:', JSON.stringify(mouseBal, null, 2))
}

sync().finally(() => prisma.$disconnect())
