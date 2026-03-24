import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testQuery() {
  const channelId = 'c7983e54-a3b0-4573-b26a-9398f6e8648c'
  const where = {
    deletedAt: null,
    OR: [
      { inventory_balances: { some: { channelId: channelId } } },
      { inventory_balances: { none: {} } }
    ]
  }

  const items = await prisma.item.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      name: true,
      sku: true
    }
  })

  console.log('--- ITEMS RETURNED BY QUERY ---')
  items.forEach(item => {
    console.log(`- ${item.name} (${item.sku})`)
  })
}

testQuery().finally(() => prisma.$disconnect())
