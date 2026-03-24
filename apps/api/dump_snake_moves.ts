import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const item = await prisma.item.findFirst({ where: { name: { contains: 'snakelight' } } })

  if (!item) return
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: item.id },
    orderBy: { createdAt: 'asc' }
  })

  fs.writeFileSync('snake_movements_all.txt', JSON.stringify(movements, null, 2))
}

debug().finally(() => prisma.$disconnect())
