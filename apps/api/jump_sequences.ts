import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.receiptSequence.updateMany({ data: { lastSeq: 5000 } })
  console.log('Jumped all receipt sequences to 5000 to clear conflicts.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
