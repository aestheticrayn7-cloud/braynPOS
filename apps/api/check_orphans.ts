import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOrphanedItems() {
  const allItemsCount = await prisma.item.count()
  const itemsWithBalancesCount = await prisma.item.count({
    where: {
      inventory_balances: { some: {} }
    }
  })

  console.log(`Total Items: ${allItemsCount}`)
  console.log(`Items with Balances: ${itemsWithBalancesCount}`)
  console.log(`Items with NO Balances: ${allItemsCount - itemsWithBalancesCount}`)

  if (allItemsCount > itemsWithBalancesCount) {
    const orphanedItems = await prisma.item.findMany({
      where: {
        inventory_balances: { none: {} }
      },
      select: { sku: true, name: true, createdAt: true },
      take: 5
    })
    console.log('\nTop 5 Items without Balances (New items):')
    orphanedItems.forEach(item => {
      console.log(`- ${item.sku}: ${item.name} (Created: ${item.createdAt})`)
    })
  }
}

checkOrphanedItems().finally(() => prisma.$disconnect())
