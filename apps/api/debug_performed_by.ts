import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sales = await prisma.sale.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      receiptNo: true,
      performedBy: true,
    }
  })
  console.log(JSON.stringify(sales, null, 2))
  
  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true }
  })
  console.log('Users:', JSON.stringify(users, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
