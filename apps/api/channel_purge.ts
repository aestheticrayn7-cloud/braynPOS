import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  console.log('--- FINAL CHANNEL PURGE ---')
  
  const deleted = await prisma.channel.deleteMany({
    where: { id: { not: hqId } }
  })
  
  console.log(`Deleted ${deleted.count} redundant channels.`)
  
  const remaining = await prisma.channel.findMany()
  console.log('Remaining channels:', remaining.map(c => c.name))
}

main().catch(console.error).finally(() => prisma.$disconnect())
