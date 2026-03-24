import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const c = await prisma.channel.findUnique({
    where: { id: '4979e2c6-d444-4860-9513-393282f1b4c9' }
  })
  console.log('Target Channel Details (findUnique):', c)
  
  const raw = await prisma.$queryRaw`SELECT * FROM channels WHERE id = '4979e2c6-d444-4860-9513-393282f1b4c9'`
  console.log('Target Channel Details (queryRaw):', raw)
}

main().catch(console.error).finally(() => prisma.$disconnect())
