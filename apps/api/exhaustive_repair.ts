import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function initAllBalances() {
  console.log('Initializing full inventory balance grid (Every Item x Every Channel)...')
  const items = await prisma.item.findMany({ select: { id: true } })
  const channels = await prisma.channel.findMany({ select: { id: true } })
  
  for (const item of items) {
    for (const channel of channels) {
      await prisma.inventory_balances.upsert({
        where: { itemId_channelId: { itemId: item.id, channelId: channel.id } },
        update: {},
        create: {
          itemId: item.id,
          channelId: channel.id,
          availableQty: 0,
          incomingQty: 0
        }
      })
    }
  }
  
  console.log('Grid initialized. Now re-calculating from moves...')
  
  await prisma.$executeRawUnsafe(`
    UPDATE inventory_balances SET "availableQty" = 0, "incomingQty" = 0;
  `)
  
  await prisma.$executeRawUnsafe(`
    UPDATE inventory_balances ib
    SET 
      "availableQty" = sub."avail",
      "incomingQty"  = sub."inc",
      "lastMovementAt" = sub."last"
    FROM (
      SELECT 
        "itemId", 
        "channelId", 
        SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "avail",
        SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END) as "inc",
        MAX("createdAt") as "last"
      FROM stock_movements
      GROUP BY "itemId", "channelId"
    ) sub
    WHERE ib."itemId" = sub."itemId" AND ib."channelId" = sub."channelId";
  `)
  
  console.log('Full repair complete.')
}

initAllBalances().finally(() => prisma.$disconnect())
