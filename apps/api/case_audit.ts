import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const items = await prisma.item.findMany({
    where: { name: { contains: 'RBT', mode: 'insensitive' } }
  })
  console.log('Items found:', JSON.stringify(items, null, 2))
  
  const purchases = await prisma.purchase.findMany({
    where: { lines: { some: { item: { name: { contains: 'RBT', mode: 'insensitive' } } } } },
    include: { lines: true, channel: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log('Purchases found:', JSON.stringify(purchases, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
