import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    console.log('Connecting to Prisma...')
    await prisma.$connect()
    console.log('Connected.')
    
    // Check if the table exists and has data
    const channels = await prisma.channel.findMany()
    console.log(`Found ${channels.length} channels.`)
    
    channels.forEach(hq => {
      console.log(`--- CHANNEL ---`)
      console.log(`Name:   "${hq.name}"`)
      console.log(`ID:     "${hq.id}"`)
      console.log(`Length: ${hq.id.length}`)
      console.log(`Chars:  ${[...hq.id].map(c => c.charCodeAt(0).toString(16)).join(' ')}`)
    })
  } catch (err) {
    console.error('FATAL ERROR:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
