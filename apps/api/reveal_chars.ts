import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const all: any[] = await prisma.$queryRaw`SELECT id, name, code FROM channels`
  console.log('--- REVEAL INVISIBLE CHARS ---')
  all.forEach(c => {
    console.log(`ID: ${c.id}`)
    console.log(`Name: |${c.name}| (Length: ${c.name.length})`)
    console.log(`Code: |${c.code}| (Length: ${c.code.length})`)
    console.log('---')
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
