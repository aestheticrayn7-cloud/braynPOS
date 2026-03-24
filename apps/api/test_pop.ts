import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function pop() {
  const result = await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "availableQty",
      SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "incomingQty"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO UPDATE
      SET "availableQty" = EXCLUDED."availableQty",
          "incomingQty"  = EXCLUDED."incomingQty",
          "lastMovementAt" = now();
  `)
  console.log('Affected rows:', result)
}

pop().finally(() => prisma.$disconnect())
