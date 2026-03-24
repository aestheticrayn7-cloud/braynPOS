import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugPurchase() {
  const purchaseNo = 'PUR-1773854190903'
  const purchase = await prisma.purchase.findUnique({
    where: { purchaseNo },
    include: { lines: true }
  })

  if (!purchase) {
    console.log('Purchase not found')
    return
  }

  const movements = await prisma.stockMovement.findMany({
    where: { referenceId: purchase.id }
  })

  for (const m of movements) {
    console.log(`Movement ItemId: [${m.itemId}]`)
    const item = await prisma.item.findUnique({ where: { id: m.itemId } })
    console.log(`  Item Object: ${JSON.stringify(item)}`)
    
    const balance = await prisma.inventory_balances.findUnique({
      where: { itemId_channelId: { itemId: m.itemId, channelId: m.channelId } }
    })
    console.log(`  Balance: ${JSON.stringify(balance)}`)
  }
}

debugPurchase().finally(() => prisma.$disconnect())
