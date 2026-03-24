import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findChannelsDetail() {
  const channels = await prisma.channel.findMany()
  console.log('--- ALL CHANNELS ---')
  channels.forEach(ch => {
    console.log(`ID: "${ch.id}", Name: "${ch.name}"`)
  })

  const balances = await prisma.$queryRaw`SELECT * FROM inventory_balances`
  console.log('\n--- ALL BALANCES (RAW) ---')
  console.log(JSON.stringify(balances, null, 2))
}

findChannelsDetail().finally(() => prisma.$disconnect())
