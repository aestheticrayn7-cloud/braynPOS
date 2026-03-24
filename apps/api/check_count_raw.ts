import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count: any = await prisma.$queryRaw`SELECT count(*) FROM channels`
  console.log('Total Raw Count:', count)
  
  const all: any[] = await prisma.$queryRaw`SELECT id, name, code, "deletedAt" FROM channels`
  console.log('All Channels (Raw):')
  all.forEach(c => console.log(`- ${c.name} (${c.id}), Code: ${c.code}, DeletedAt: ${c.deletedAt}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
