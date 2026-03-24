import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hq = await prisma.channel.findFirst({ where: { name: 'Headquarters' } })
  console.log(`Active HQ ID: ${hq?.id}`)
  
  const count = await (prisma as any).inventory_balances.count({
    where: { channelId: hq?.id }
  })
  console.log(`Prisma Count for HQ ID: ${count}`)
  
  const all = await (prisma as any).inventory_balances.findMany({
    take: 5
  })
  console.log('Sample IDs from DB:', all.map((b: any) => b.channelId))
}

main().catch(console.error).finally(() => prisma.$disconnect())
