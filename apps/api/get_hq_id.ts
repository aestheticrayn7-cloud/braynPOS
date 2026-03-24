import { prisma } from './src/lib/prisma'

async function getHqId() {
  const hq = await prisma.channel.findFirst({ where: { isMainWarehouse: true } })
  console.log('HQ_ID:', hq?.id)
}

getHqId().finally(() => prisma.$disconnect())
