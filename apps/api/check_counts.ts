import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const counts = await prisma.$queryRaw<any[]>`
    SELECT 
      "itemId", 
      "channelId", 
      COUNT(*) as cnt,
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "availableQty"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
  `
  console.log('Unique pairs:', counts.length)
  console.log(counts)
}

debug().finally(() => prisma.$disconnect())
