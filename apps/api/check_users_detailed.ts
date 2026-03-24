import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  console.log('--- USER STATUS CHECK ---')
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true, status: true, deletedAt: true }
  })
  console.log(JSON.stringify(users, null, 2))
}

check().catch(console.error).finally(() => prisma.$disconnect())
