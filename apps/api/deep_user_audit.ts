import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { username: true, channelId: true, role: true }
  })
  console.log('--- USERS ---')
  console.log(JSON.stringify(users, null, 2))
  
  const hqs = await prisma.channel.findMany({
    where: { name: 'Headquarters' }
  })
  console.log('\n--- HQS ---')
  console.log(JSON.stringify(hqs, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
