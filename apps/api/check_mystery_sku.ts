import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const i = await prisma.item.findFirst({ where: { sku: 'LP-GLN-001' } })
  console.log('ITEM LP-GLN-001:', JSON.stringify(i))
}

check().finally(() => prisma.$disconnect())
