import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  const printer = await prisma.item.findFirst({ where: { name: { contains: 'Printer' } } })
  if (!printer) return
  
  console.log(`--- PRINTER MOVEMENTS (${printer.name}) ---`)
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: printer.id, channelId: hqId },
    orderBy: { createdAt: 'desc' }
  })
  
  movements.forEach(m => {
    console.log(`${m.createdAt.toISOString()} | Type: ${m.movementType} | Change: ${m.quantityChange} | Ref: ${m.referenceType}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
