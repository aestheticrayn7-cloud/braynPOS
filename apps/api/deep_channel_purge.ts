import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  console.log('--- CLEANING ORPHAN BALANCES ---')
  
  const balancesCount = await prisma.inventory_balances.count({
    where: { channelId: { not: hqId } }
  })
  console.log(`Found ${balancesCount} balances in other channels. DELETING...`)
  
  await prisma.inventory_balances.deleteMany({
    where: { channelId: { not: hqId } }
  })
  
  console.log('--- RETRYING CHANNEL PURGE ---')
  const deleted = await prisma.channel.deleteMany({
    where: { id: { not: hqId } }
  })
  
  console.log(`Deleted ${deleted.count} redundant channels.`)
  
  const remaining = await prisma.channel.findMany()
  console.log('Remaining channels:', remaining.map(c => c.name))
}

main().catch(console.error).finally(() => prisma.$disconnect())
