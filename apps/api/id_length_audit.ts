import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const all: any[] = await prisma.$queryRaw`SELECT itemId, "channelId", length("channelId") as len FROM inventory_balances`
  console.log('--- DB LEVEL ID AUDIT ---')
  all.forEach(b => {
    console.log(`- Item: ${b.itemid}, ID: |${b.channelId}|, Len: ${b.len}`)
  })
  
  const hq = await prisma.channel.findFirst({ where: { name: 'Headquarters' } })
  console.log('\n--- ACTIVE HQ IN DB ---')
  console.log(`ID: |${hq?.id}|, Len: ${hq?.id.length}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
