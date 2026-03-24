import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- USER EVANS DETAILS ---')
  const users = await prisma.user.findMany({
    where: { name: { contains: 'Evans', mode: 'insensitive' } },
    include: { channel: true }
  })
  if (users.length === 0) {
    console.log('❌ Evans not found.')
  }
  for (const u of users) {
    console.log(`- User: ${u.name}, Role: ${u.role}, Channel: ${u.channel?.name} (${u.channelId})`)
    const salesCount = await prisma.sale.count({ where: { channelId: u.channelId } })
    console.log(`  -> Total Sales in this channel: ${salesCount}`)
  }

  const channels = await prisma.channel.findMany()
  console.log('--- ALL CHANNELS ---')
  for (const c of channels) {
    const sCount = await prisma.sale.count({ where: { channelId: c.id } })
    console.log(`- ${c.name} (${c.id}): ${sCount} sales`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
