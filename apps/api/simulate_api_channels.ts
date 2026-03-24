import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Simulate ChannelsService.findAll
  const channels = await prisma.channel.findMany({
    where: {},
    orderBy: { name: 'asc' }
  })
  
  console.log('--- API SIMULATION ---')
  console.log(`Found ${channels.length} channels`)
  channels.forEach(c => {
    console.log(`- ${c.name} (${c.id})`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
