import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { username: true, channelId: true }
  })
  console.log('--- USER CHANNELS ---')
  users.forEach(u => console.log(`${u.username}: |${u.channelId}|`))
  
  const hqs = await prisma.channel.findMany({ where: { name: 'Headquarters' } })
  console.log('\n--- ALL HQ RECORDS ---')
  hqs.forEach(hq => console.log(`${hq.name}: |${hq.id}|, Code: ${hq.code}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
