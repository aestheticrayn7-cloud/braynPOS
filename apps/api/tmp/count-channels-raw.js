const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  const count = await prisma.channel.count({ where: { deletedAt: null } })
  const all = await prisma.channel.findMany({ where: { deletedAt: null } })
  console.log(`TOTAL_CHANNELS:${count}`)
  all.forEach(c => console.log(`CHANNEL:${c.id}:${c.name}`))
}

test().catch(console.error).finally(() => prisma.$disconnect())
