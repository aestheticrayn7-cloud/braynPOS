import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const laptop = await prisma.item.findFirst({ where: { name: { contains: 'Generic Business Laptop' } } })
  const chuka = await prisma.channel.findFirst({ where: { name: { contains: 'Chuka' } } })
  const hq = await prisma.channel.findFirst({ where: { name: { contains: 'Headquarters' } } })

  console.log('Laptop:', laptop?.id, laptop?.name)
  console.log('Chuka:', chuka?.id, chuka?.name)
  console.log('HQ:', hq?.id, hq?.name)

  if (laptop && chuka) {
    const balance = await prisma.inventory_balances.findUnique({
      where: { itemId_channelId: { itemId: laptop.id, channelId: chuka.id } }
    })
    console.log('Balance in Chuka:', balance)

    const movements = await prisma.stockMovement.findMany({
      where: { itemId: laptop.id, channelId: chuka.id },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Movements in Chuka:', movements)
    
    const transfers = await prisma.transfer.findMany({
      where: { toChannelId: chuka.id },
      include: { lines: true }
    })
    console.log('Transfers to Chuka:', JSON.stringify(transfers, null, 2))
  }
}

debug().finally(() => prisma.$disconnect())
