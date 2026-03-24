import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqs = await prisma.channel.findMany({ where: { name: 'Headquarters' } })
  console.log('--- HQ ID AUDIT ---')
  for (const hq of hqs) {
    console.log(`ID: "${hq.id}"`)
    console.log(`Length: ${hq.id.length}`)
    console.log(`Chars: ${[...hq.id].map(c => c.charCodeAt(0).toString(16)).join(' ')}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
