import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const c = await prisma.channel.findUnique({ where: { id: 'e803051e-c9ca-46a4-9014-83075d6a3e13' } })
  console.log('Channel:', c?.name)
}

debug().finally(() => prisma.$disconnect())
