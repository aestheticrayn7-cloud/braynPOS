import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  console.log('--- DB TEST START ---')
  try {
    const start = Date.now()
    const channels = await p.channel.findMany({ select: { id: true, name: true } })
    console.log(`FOUND ${channels.length} CHANNELS in ${Date.now() - start}ms`)
    console.log(channels)
  } catch (err) {
    console.error('DB TEST ERROR:', err)
  } finally {
    await p.$disconnect()
  }
}

main()
