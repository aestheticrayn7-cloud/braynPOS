import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function sync() {
  console.log('Synchronizing...')
  await prisma.$executeRawUnsafe(`
    UPDATE inventory_balances SET "availableQty" = 0, "incomingQty" = 0;
  `)
  
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "availableQty",
      SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "incomingQty",
      MAX("createdAt") as "lastMovementAt"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO UPDATE
      SET "availableQty" = EXCLUDED."availableQty",
          "incomingQty"  = EXCLUDED."incomingQty",
          "lastMovementAt" = EXCLUDED."lastMovementAt";
  `)
  
  const chuka = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const laptop = await prisma.inventory_balances.findUnique({ where: { itemId_channelId: { itemId: 'item-laptop-001', channelId: chuka } } })
  const mouse = await prisma.inventory_balances.findUnique({ where: { itemId_channelId: { itemId: 'item-mouse-002', channelId: chuka } } })
  const snake = await prisma.inventory_balances.findUnique({ where: { itemId_channelId: { itemId: '6f9539fe-20e0-403f-acd5-c1b804709487', channelId: chuka } } })

  console.log('LAPTOP:', laptop?.availableQty)
  console.log('MOUSE:', mouse?.availableQty)
  console.log('SNAKE:', snake?.availableQty)
}

sync().finally(() => prisma.$disconnect())
