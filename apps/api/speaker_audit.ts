import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const speaker = await prisma.item.findFirst({ where: { name: { contains: 'RBT' } } })
  if (!speaker) return console.log('RBT speaker not found!')
  
  console.log(`--- RBT SPEAKER AUDIT (${speaker.name}) ---`)
  const balances = await prisma.inventory_balances.findMany({ where: { itemId: speaker.id } })
  console.log('Balances:', JSON.stringify(balances, null, 2))
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: speaker.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log('Movements:', JSON.stringify(movements, null, 2))
  
  const purchases = await prisma.purchase.findMany({
    where: { lines: { some: { itemId: speaker.id } } },
    include: { channel: true },
    orderBy: { createdAt: 'desc' }
  })
  console.log('Purchases for Speaker:', JSON.stringify(purchases, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
