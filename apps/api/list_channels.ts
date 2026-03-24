import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listChannels() {
  const channels = await prisma.channel.findMany()
  console.log('TOTAL_CHANNELS:', channels.length)
  channels.forEach(ch => {
    console.log(`- ID: ${ch.id}, NAME: ${ch.name}, CODE: ${ch.code}`)
  })
}

listChannels().finally(() => prisma.$disconnect())
