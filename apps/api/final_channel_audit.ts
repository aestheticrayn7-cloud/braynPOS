import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channels = await prisma.channel.findMany()
  console.log('--- ALL CHANNELS ---')
  channels.forEach(c => console.log(`Name: ${c.name}, ID: |${c.id}|, Code: ${c.code}, Deleted: ${c.deletedAt}`))
  
  const hq = channels.find(c => c.name === 'Headquarters')
  console.log('\nSelected HQ ID:', hq?.id)
}

main().catch(console.error).finally(() => prisma.$disconnect())
