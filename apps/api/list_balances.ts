import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listAllBalances() {
  console.log('--- ALL INVENTORY BALANCES ---')
  const balances = await prisma.inventory_balances.findMany({
    include: {
      item: { select: { name: true, sku: true } }
    }
  })
  console.log(JSON.stringify(balances, null, 2))

  console.log('\n--- ALL PURCHASES ---')
  const purchases = await prisma.purchase.findMany({
    select: { id: true, purchaseNo: true, status: true, channelId: true }
  })
  console.log(JSON.stringify(purchases, null, 2))
}

listAllBalances().finally(() => prisma.$disconnect())
