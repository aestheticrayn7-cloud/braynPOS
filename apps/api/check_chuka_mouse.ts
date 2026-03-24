import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const b = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { 
      itemId: 'item-mouse-002', 
      channelId: '4178970e-8042-4796-a6af-da7c8e85d5ba' 
    } }
  })
  console.log('CHUKA MOUSE BALANCE:', JSON.stringify(b))
}

check().finally(() => prisma.$disconnect())
