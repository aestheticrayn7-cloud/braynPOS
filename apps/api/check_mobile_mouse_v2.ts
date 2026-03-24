import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const mobileShop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const mouse = 'item-mouse-002'
  
  const moves = await prisma.stockMovement.findMany({
    where: { itemId: mouse, channelId: mobileShop },
    orderBy: { createdAt: 'desc' }
  })
  
  fs.writeFileSync('mobile_mouse_final.txt', JSON.stringify(moves, null, 2))
}

check().finally(() => prisma.$disconnect())
