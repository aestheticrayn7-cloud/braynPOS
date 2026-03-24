import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const mobileShop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const mouse = 'item-mouse-002'
  
  const moves = await prisma.stockMovement.findMany({
    where: { itemId: mouse, channelId: mobileShop },
    orderBy: { createdAt: 'desc' }
  })
  
  console.log('MOBILE SHOP MOUSE MOVES:', JSON.stringify(moves, null, 2))
}

check().finally(() => prisma.$disconnect())
