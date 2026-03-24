import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  const shop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const mouse = 'item-mouse-002'
  const actor = (await prisma.user.findFirst())?.id || ''
  
  console.log('BEFORE:', (await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: mouse, channelId: shop } }
  }))?.availableQty)
  
  await prisma.stockMovement.create({
    data: {
      itemId: mouse,
      channelId: shop,
      movementType: 'ADJUSTMENT_IN',
      quantityChange: 5,
      referenceId: 'test-trigger-live',
      referenceType: 'other',
      performedBy: actor
    }
  })
  
  console.log('AFTER:', (await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: mouse, channelId: shop } }
  }))?.availableQty)
}

test().finally(() => prisma.$disconnect())
