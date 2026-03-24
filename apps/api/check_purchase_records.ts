import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  
  const purchases = await prisma.purchase.findMany({
    where: { lines: { some: { itemId: microwave.id } } },
    include: { lines: true }
  })
  
  console.log(`--- PURCHASES FOR ${microwave.name} ---`)
  console.log(JSON.stringify(purchases.map(p => ({
    no: p.purchaseNo,
    status: p.status,
    total: p.totalCost,
    date: p.createdAt,
    qty: p.lines.find(l => l.itemId === microwave.id)?.quantity
  })), null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
