import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) {
    console.log('Microwave not found')
    return
  }
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: microwave.id },
    orderBy: { createdAt: 'desc' }
  })
  
  console.log(`--- MOVEMENTS FOR ${microwave.name} (${microwave.sku}) ---`)
  console.log(JSON.stringify(movements.map(m => ({
    type: m.movementType,
    qty: m.quantityChange,
    ref: m.referenceType,
    date: m.createdAt
  })), null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
