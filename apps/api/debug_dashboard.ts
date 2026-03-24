import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- SIMULATING DASHBOARD SUMMARY ---')
  
  const evans = await prisma.user.findFirst({
    where: { name: { contains: 'Evans', mode: 'insensitive' } }
  })
  if (!evans) return console.log('Evans not found')

  const channelId = evans.channelId
  const role = evans.role
  const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(role || '')
  const effectiveChannelId = isHQ ? undefined : channelId

  console.log(`User: ${evans.name}, Role: ${role}, ChannelId: ${channelId}, isHQ: ${isHQ}`)

  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  
  console.log('Now (UTC):', now.toISOString())
  console.log('Today (UTC Filter):', today.toISOString())

  const todaySales = await prisma.sale.aggregate({
    where: {
      deletedAt: null,
      createdAt: { gte: today },
      ...(effectiveChannelId && { channelId: effectiveChannelId }),
    },
    _sum: { netAmount: true },
    _count: true,
  })

  console.log('Today Sales Match:', JSON.stringify(todaySales, null, 2))

  const activeChannels = await prisma.channel.count({ where: { deletedAt: null } })
  console.log('Active Channels (DB Count):', activeChannels)
  console.log('Dashboard activeChannels Response:', isHQ ? activeChannels : 1)

  // Check if any sale exists TODAY for this channel WITHOUT the UTC filter
  const localToday = new Date()
  localToday.setHours(0, 0, 0, 0)
  const localTodaySales = await prisma.sale.count({
    where: {
      channelId: channelId as string,
      createdAt: { gte: localToday }
    }
  })
  console.log('Sales using LOCAL Today filter:', localTodaySales)
}

main().catch(console.error).finally(() => prisma.$disconnect())
