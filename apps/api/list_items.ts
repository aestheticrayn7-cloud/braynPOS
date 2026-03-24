import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listItems() {
  console.log('--- ALL ITEMS ---')
  const items = await prisma.item.findMany({
    select: { id: true, name: true, sku: true }
  })
  console.log(JSON.stringify(items, null, 2))
}

listItems().finally(() => prisma.$disconnect())
