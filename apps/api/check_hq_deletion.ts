import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channels = await prisma.channel.findMany({
    where: { name: 'Headquarters' }
  })
  console.log('--- HEADQUARTERS CHANNELS ---')
  channels.forEach(c => {
    console.log(`ID: ${c.id}, Code: ${c.code}, DeletedAt: ${c.deletedAt}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
