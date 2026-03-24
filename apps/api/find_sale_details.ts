import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- FINDING SALE DETAILS ---')
  
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  console.log('Current Time (Local):', now.toString())
  console.log('Current Time (UTC):', now.toISOString())
  console.log('Dashboard "Today" start (UTC):', today.toISOString())

  const sales = await prisma.sale.findMany({
    include: { channel: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  console.log(`Found ${sales.length} recent sales across ALL channels.`)
  for (const s of sales) {
    console.log(`- ID: ${s.id}, Channel: ${s.channel?.name}, CreatedAt: ${s.createdAt.toISOString()}, DeletedAt: ${s.deletedAt}`)
    if (s.createdAt >= today) {
      console.log('  -> This sale is TODAY (UTC)')
    } else {
      console.log('  -> This sale is NOT TODAY (UTC)')
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
