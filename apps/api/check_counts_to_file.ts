import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

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
  fs.writeFileSync('counts_out.txt', JSON.stringify(counts, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value, 2))
}

debug().finally(() => prisma.$disconnect())
