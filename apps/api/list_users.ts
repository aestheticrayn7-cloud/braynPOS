import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function listUsers() {
  const users = await prisma.user.findMany({
    select: { username: true, email: true, role: true, channel: { select: { name: true, code: true } } }
  })
  console.log('USERS_LIST:' + JSON.stringify(users))
}

listUsers().catch(console.error).finally(() => prisma.$disconnect())
