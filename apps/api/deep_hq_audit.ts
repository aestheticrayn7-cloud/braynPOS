import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqs = await prisma.channel.findMany({
    where: { name: 'Headquarters' }
  })
  
  console.log('--- HQ Audit ---')
  for (const hq of hqs) {
    console.log(`ID: ${hq.id}`)
    console.log(`Name: ${hq.name}`)
    console.log(`Code: [${hq.code}]`)
    console.log(`DeletedAt: ${hq.deletedAt}`)
    console.log('---')
  }
  
  const allCodes = await prisma.channel.findMany({ select: { code: true } })
  console.log('All Codes in DB:', allCodes.map(c => c.code))
}

main().catch(console.error).finally(() => prisma.$disconnect())
