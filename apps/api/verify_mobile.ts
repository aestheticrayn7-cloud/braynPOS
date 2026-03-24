import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verify() {
  const shop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const balances = await prisma.inventory_balances.findMany({
    where: { channelId: shop }
  })
  
  console.log('MOBILE SHOP BALANCES:')
  for (const b of balances) {
    const item = await prisma.item.findUnique({ where: { id: b.itemId } })
    console.log(`- ${item?.name}: Avail=${b.availableQty}, Inc=${b.incomingQty}`)
  }
}

verify().finally(() => prisma.$disconnect())
