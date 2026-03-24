import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findMicrowaves() {
  const items = await prisma.item.findMany({
    where: { name: { contains: 'microwave', mode: 'insensitive' } }
  })
  console.log('--- MICROWAVE ITEMS ---')
  console.log(JSON.stringify(items, null, 2))
}

findMicrowaves().finally(() => prisma.$disconnect())
