import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findRBT() {
  const items = await prisma.item.findMany({
    where: {
      OR: [
        { name: { contains: 'RBT', mode: 'insensitive' } },
        { name: { contains: 'speaker', mode: 'insensitive' } }
      ]
    },
    include: {
      inventory_balances: true
    }
  })

  console.log(`Found ${items.length} items matching RBT/speaker`)
  items.forEach(item => {
    console.log(`[${item.id}] SKU: ${item.sku}, Name: ${item.name}, Status: ${item.status}`)
    console.log(`  Balances: ${JSON.stringify(item.inventory_balances)}`)
  })
}

findRBT().finally(() => prisma.$disconnect())
