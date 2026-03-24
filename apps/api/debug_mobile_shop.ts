import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debugMobileShop() {
  const channelId = 'e803051e-c9ca-46a4-9014-83075d6a3e13' // Mobile Shop
  
  const transfers = await prisma.transfer.findMany({
    where: { toChannelId: channelId },
    include: { lines: true }
  })
  
  const moves = await prisma.stockMovement.findMany({
    where: { channelId: channelId },
    orderBy: { createdAt: 'desc' }
  })
  
  const balances = await prisma.inventory_balances.findMany({
    where: { channelId: channelId }
  })
  
  const out = {
    transfers,
    moves,
    balances
  }
  
  fs.writeFileSync('debug_mobile_shop.json', JSON.stringify(out, null, 2))
}

debugMobileShop().finally(() => prisma.$disconnect())
