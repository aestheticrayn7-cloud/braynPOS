import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verify() {
  const chukaId = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const balances = await prisma.inventory_balances.findMany({
    where: { channelId: chukaId },
    include: { item: { select: { name: true } } }
  })
  
  console.log('CHUKA STORE BALANCES:')
  for (const b of balances) {
    console.log(`- ${b.item.name}: Avail=${b.availableQty}`)
  }
}

verify().finally(() => prisma.$disconnect())
