import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const chris = await prisma.user.findFirst({ where: { username: 'chris' } })
  console.log(`Chris is in Channel: ${chris?.channelId}`)
  
  const hqs = await prisma.channel.findMany({ where: { name: 'Headquarters' } })
  console.log('HQs:', JSON.stringify(hqs, null, 2))
  
  const purchase = await prisma.purchase.findFirst({
    where: { lines: { some: { item: { name: { contains: 'RBT' } } } } },
    include: { channel: true },
    orderBy: { createdAt: 'desc' }
  })
  console.log('RBT Purchase Channel:', purchase?.channel?.name, purchase?.channel?.id)
}

main().catch(console.error).finally(() => prisma.$disconnect())
