
import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const user = await p.user.findUnique({ where: { username: 'Amon' } })
  const channel = await p.channel.findUnique({ where: { id: '4178970e-8042-4796-a6af-da7c8e85d5ba' } })
  const allChannels = await p.channel.findMany({ select: { id: true, name: true } })

  console.log('--- DIAGNOSTIC ---')
  console.log('USER Amon:', JSON.stringify(user, null, 2))
  console.log('CHANNEL 4178...:', JSON.stringify(channel, null, 2))
  console.log('ALL CHANNELS:', JSON.stringify(allChannels, null, 2))
}

main().catch(console.error).finally(() => p.$disconnect())
