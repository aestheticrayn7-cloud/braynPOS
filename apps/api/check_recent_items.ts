import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRecentItems() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      balances: true
    }
  })

  console.log('--- RECENT ITEMS ---')
  items.forEach(item => {
    console.log(`[${item.id}] ${item.sku}: ${item.name} (${item.status})`)
    console.log(`  CreatedAt: ${item.createdAt}`)
    console.log(`  Balances: ${item.balances.map(b => `${b.channelId}: ${b.availableQty}`).join(', ')}`)
  })
}

checkRecentItems().finally(() => prisma.$disconnect())
