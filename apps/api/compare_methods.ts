import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channelId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  
  console.log('--- DB ADAPTER CHECK ---')
  const raw: any[] = await prisma.$queryRaw`SELECT count(*) FROM inventory_balances WHERE "channelId" = ${channelId}`
  console.log('QueryRaw Count:', raw)
  
  const prismaRes = await (prisma as any).inventory_balances.findMany({
    where: { channelId }
  })
  console.log('Prisma findMany Count:', prismaRes.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
