import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function sync() {
  console.log('Final synchronizing of balances...')
  
  // Create missing rows
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
    SELECT i.id, c.id, 0, 0, now()
    FROM items i, channels c
    ON CONFLICT ("itemId", "channelId") DO NOTHING;
  `)

  // Reset and Re-sum
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
  
  console.log('Synchronization complete.')
  
  const mobileShop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const mouse = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: 'item-mouse-002', channelId: mobileShop } }
  })
  console.log('MOBILE SHOP MOUSE BALANCE:', JSON.stringify(mouse))
}

sync().finally(() => prisma.$disconnect())
