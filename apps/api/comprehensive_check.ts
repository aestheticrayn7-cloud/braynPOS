import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- COMPREHENSIVE DATA CHECK ---')
  
  const evans = await prisma.user.findFirst({
    where: { username: { contains: 'evans', mode: 'insensitive' } }
  })
  if (!evans) return console.log('Evans not found (username: evans)')
  console.log(`User Evans: ID=${evans.id}, Role=${evans.role}, ChannelId=${evans.channelId}`)

  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  console.log('Dashboard Today Filter (UTC):', today.toISOString())

  const allSalesToday = await prisma.sale.findMany({
    where: { 
      createdAt: { gte: today },
      deletedAt: null
    },
    include: { channel: true }
  })

  console.log(`Found ${allSalesToday.length} sales TODAY.`)
  for (const s of allSalesToday) {
    console.log(`- Receipt: ${s.receiptNo}, Channel: ${s.channel?.name} (${s.channelId}), CreatedAt: ${s.createdAt.toISOString()}`)
    if (s.channelId === evans.channelId) {
      console.log('  -> MATCHES Evans channel!')
    } else {
      console.log('  -> DOES NOT MATCH Evans channel.')
    }
  }

  const channels = await prisma.channel.findMany()
  console.log('--- ALL CHANNELS ---')
  for (const c of channels) {
    console.log(`- ${c.name}: ${c.id}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
