import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  console.log('--- ALL USERS ---')
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, status: true, channelId: true },
    orderBy: { role: 'asc' }
  })
  console.log(JSON.stringify(users, null, 2))
}

check().catch(console.error).finally(() => prisma.$disconnect())
