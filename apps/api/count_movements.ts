import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function countMovements() {
  const itemId = '4489703b-bc1b-4185-bc92-064dcc530c49'
  const channelId = 'c7983e54-a3b0-4573-b26a-9398f6e8648c'

  const movements = await prisma.stockMovement.findMany({
    where: { itemId, channelId }
  })

  console.log('TOTAL_MOVEMENTS:', movements.length)
  let sum = 0
  movements.forEach(m => {
    console.log(`- Type: ${m.movementType}, Qty: ${m.quantityChange}, Ref: ${m.referenceType}`)
    sum += m.quantityChange
  })
  console.log('AGGREGATED_SUM:', sum)
}

countMovements().finally(() => prisma.$disconnect())
