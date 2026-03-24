import { PrismaClient } from '@prisma/client'
import { dataIsolationExtension } from '../src/lib/prisma-data-isolation.extension'
import { requestContext } from '../src/lib/request-context.plugin'

const prisma = new PrismaClient().$extends(dataIsolationExtension)

async function test() {
  console.log('--- Testing Channel FindAll for Manager ---')
  
  // Mock Chris (Manager at Headquarters)
  // We need to find the IDs first
  const headquarters = await (prisma as any).channel.findFirst({ where: { name: 'Headquarters' } })
  const chris = await (prisma as any).user.findFirst({ where: { username: 'chris' } })

  if (!headquarters || !chris) {
    console.error('Test data not found. Please ensure Headquarters and user chris exist.')
    return
  }

  console.log(`Headquarters ID: ${headquarters.id}`)
  
  await requestContext.run({ 
    sub: chris.id, 
    role: 'MANAGER', 
    channelId: headquarters.id 
  }, async () => {
    const channels = await (prisma as any).channel.findMany({ where: { deletedAt: null } })
    console.log(`Found ${channels.length} channels:`)
    channels.forEach((c: any) => console.log(`- ${c.name} (${c.id})`))
  })
}

test().catch(console.error).finally(() => (prisma as any).$disconnect())
