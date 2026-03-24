import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function completeFix() {
  let log = '--- FACTORY REPAIR LOG ---\n'
  
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE inventory_balances;`)
  
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "availableQty",
      SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "incomingQty",
      MAX("createdAt") as "lastMovementAt"
    FROM stock_movements
    GROUP BY "itemId", "channelId";
  `)

  const balances = await prisma.inventory_balances.findMany({
     include: { item: { select: { name: true } }, channel: { select: { name: true } } }
  })
  
  balances.forEach(b => {
    log += `[${b.channel.name}] ${b.item.name}: Avail=${b.availableQty}, Inc=${b.incomingQty}\n`
  })
  
  fs.writeFileSync('factory_repair_results.txt', log)
}

completeFix().finally(() => prisma.$disconnect())
