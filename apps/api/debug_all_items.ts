import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAllInventory() {
  const items = await prisma.item.findMany({
    include: {
      inventory_balances: true
    }
  })

  console.log('--- ALL ITEMS INVENTORY ---')
  items.forEach(item => {
    console.log(`[${item.sku}] ${item.name}`)
    console.log(`  Balances: ${JSON.stringify(item.inventory_balances)}`)
  })
}

checkAllInventory().finally(() => prisma.$disconnect())
