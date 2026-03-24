import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const all: any[] = await prisma.$queryRaw`SELECT id, name, "code", "deletedAt" FROM channels ORDER BY name`
  console.log('--- ALL CHANNELS (TRULY ALL) ---')
  all.forEach(c => {
    console.log(`Name: ${c.name}, ID: ${c.id}, Code: ${c.code}, Deleted: ${c.deletedAt}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
