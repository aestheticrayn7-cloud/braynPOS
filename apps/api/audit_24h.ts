import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  const purchases = await prisma.purchase.findMany({
    where: { 
      createdAt: { gte: new Date(Date.now() - 24 * 6 * 60 * 60 * 1000) } // Last 24h
    },
    include: { lines: { include: { item: true } }, channel: true },
    orderBy: { createdAt: 'desc' }
  })
  
  console.log(`--- PURCHASES (LAST 24H) ---`)
  console.log(`Found: ${purchases.length}`)
  purchases.forEach(p => {
    console.log(`${p.createdAt.toISOString()} | No: ${p.purchaseNo} | Channel: ${p.channel?.name} | Item: ${p.lines[0]?.item?.name} | Total: ${p.totalCost}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
