import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- DETAILED INVENTORY BALANCES ---')
  const items = await prisma.item.findMany({
    select: { name: true, sku: true, id: true }
  })
  
  const channels = await prisma.channel.findMany({
    select: { name: true, id: true }
  })

  for (const item of items) {
    for (const channel of channels) {
      const balance = await (prisma as any).inventory_balances.findUnique({
        where: { itemId_channelId: { itemId: item.id, channelId: channel.id } }
      })
      if (balance && (balance.availableQty !== 0 || balance.incomingQty !== 0)) {
        console.log(`${item.name} (${item.sku}) at ${channel.name}: Avail=${balance.availableQty}, Incoming=${balance.incomingQty}`)
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
