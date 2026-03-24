import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const i = await prisma.item.findFirst({ where: { sku: 'ITEM-1773680682143' } })
  console.log('ITEM KEHONG:', JSON.stringify(i))
}

check().finally(() => prisma.$disconnect())
