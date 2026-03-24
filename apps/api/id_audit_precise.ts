import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqs = await prisma.channel.findMany({ where: { name: 'Headquarters' } })
  console.log('--- ALL HQ RECORDS ---')
  hqs.forEach(hq => console.log(`Name: ${hq.name}, ID: |${hq.id}|, Code: ${hq.code}`))

  const olivia = await prisma.user.findFirst({ where: { username: 'olivia' } })
  console.log(`\nOlivia Username: ${olivia?.username}`)
  console.log(`Olivia ChannelID: |${olivia?.channelId}|`)
  
  const hqMatch = hqs.find(h => h.id === olivia?.channelId)
  console.log(`Does Olivia's ChannelID match an HQ? ${!!hqMatch}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
