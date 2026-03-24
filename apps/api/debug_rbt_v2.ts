import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugRBT() {
  const item = await prisma.item.findFirst({
    where: { name: { contains: 'RBT', mode: 'insensitive' } },
    include: { inventory_balances: true }
  })

  console.log('--- RBT SPEAKER RECORD ---')
  console.log(JSON.stringify(item, null, 2))
}

debugRBT().finally(() => prisma.$disconnect())
