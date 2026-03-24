import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkAll() {
  const channelId = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const items = await prisma.item.findMany({ where: { deletedAt: null, isActive: true } })
  const balances = await prisma.inventory_balances.findMany({ where: { channelId } })
  
  console.log(`TOTAL ITEMS: ${items.length}`)
  console.log(`TOTAL BALANCES IN CHUKA: ${balances.length}`)
  
  const balancingItemIds = new Set(balances.map(b => b.itemId))
  items.forEach(item => {
    if (!balancingItemIds.has(item.id)) {
      console.log(`MISSING BALANCE ROW: ${item.name} (${item.id})`)
    } else {
      console.log(`HAS BALANCE ROW: ${item.name} (${item.id})`)
    }
  })
}

checkAll().finally(() => prisma.$disconnect())
