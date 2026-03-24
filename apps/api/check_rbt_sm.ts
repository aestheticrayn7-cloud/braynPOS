import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sm = await prisma.stockMovement.findMany({
    where: { item: { name: { contains: 'RBT', mode: 'insensitive' } } }
  })
  console.log('--- RBT MOVEMENTS ---')
  console.log(JSON.stringify(sm, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
