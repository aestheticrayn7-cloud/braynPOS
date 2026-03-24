import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkMovementsRBT() {
  const item = await prisma.item.findFirst({
    where: { name: { contains: 'RBT', mode: 'insensitive' } }
  })

  if (!item) {
    console.log('RBT speaker not found')
    return
  }

  const movements = await prisma.stockMovement.findMany({
    where: { itemId: item.id }
  })

  console.log(`Found ${movements.length} movements for ${item.name}`)
  console.log(JSON.stringify(movements, null, 2))
}

checkMovementsRBT().finally(() => prisma.$disconnect())
