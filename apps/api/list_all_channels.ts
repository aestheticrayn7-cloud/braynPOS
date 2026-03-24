import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channels = await prisma.channel.findMany()
  console.log('--- ALL CHANNELS ---')
  channels.forEach(c => console.log(`${c.name} (${c.id}) - Code: ${c.code}, Type: ${c.type}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
