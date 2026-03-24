import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DIAGNOSING MISSING SALES ---')
  
  const channels = await prisma.channel.findMany()
  console.log('Channels found:', channels.map(c => ({ id: c.id, name: c.name })))

  const mobileShop = channels.find(c => c.name.toLowerCase().includes('mobile'))
  if (!mobileShop) {
    console.log('❌ Mobile Shop channel not found.')
    return
  }
  console.log(`Checking sales for Channel: ${mobileShop.name} (${mobileShop.id})`)

  const sales = await prisma.sale.findMany({
    where: { channelId: mobileShop.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })
  console.log(`Found ${sales.length} sales.`)
  if (sales.length > 0) {
    console.log('Latest sale:', JSON.stringify(sales[0], null, 2))
  }

  const movements = await prisma.stockMovement.findMany({
    where: { channelId: mobileShop.id, movementType: 'SALE' },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log(`Found ${movements.length} SALE stock movements.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
