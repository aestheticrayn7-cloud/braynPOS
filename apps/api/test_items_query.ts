import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testQuery() {
  const channelId = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const where = {
    deletedAt: null,
    inventory_balances: {
      some: { channelId: channelId }
    }
  }

  const items = await prisma.item.findMany({
    where,
    include: {
      inventory_balances: {
        where: { channelId }
      }
    }
  })

  console.log(`QUERY RESULTS FOR CHANNEL ${channelId}:`)
  items.forEach(it => {
    console.log(`- ${it.name} (${it.sku}) Bal: ${it.inventory_balances[0]?.availableQty}`)
  })
}

testQuery().finally(() => prisma.$disconnect())
