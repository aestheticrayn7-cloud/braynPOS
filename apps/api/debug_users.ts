import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, channelId: true }
  })
  console.log(JSON.stringify(users, null, 2))
}

checkUsers().finally(() => prisma.$disconnect())
