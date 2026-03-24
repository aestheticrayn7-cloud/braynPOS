import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const shop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const items = ['item-laptop-001', 'item-mouse-002', '6f9539fe-20e0-403f-acd5-c1b804709487']
  
  let out = ''
  for (const id of items) {
    const m = await prisma.stockMovement.count({
      where: { itemId: id, channelId: shop }
    })
    out += `Item ${id} moves in Mobile Shop: ${m}\n`
  }
  fs.writeFileSync('moves_mobile.txt', out)
}

check().finally(() => prisma.$disconnect())
