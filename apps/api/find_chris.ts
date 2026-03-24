import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function findChris() {
  const user = await prisma.user.findFirst({
    where: { username: { contains: 'chris', mode: 'insensitive' } },
    select: { id: true, username: true, email: true, role: true, channelId: true }
  })
  console.log('CHRIS_USER:' + JSON.stringify(user))
}

findChris().catch(console.error).finally(() => prisma.$disconnect())
