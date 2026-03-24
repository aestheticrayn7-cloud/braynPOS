import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const item = await prisma.item.findUnique({ where: { id: 'item-laptop-001' } })
  console.log('Laptop:', item?.name, 'SKU:', item?.sku)
}

debug().finally(() => prisma.$disconnect())
