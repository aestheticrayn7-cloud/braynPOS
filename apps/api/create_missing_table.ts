import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS receipt_sequences (
      seq_key TEXT PRIMARY KEY,
      last_seq INTEGER NOT NULL DEFAULT 0
    )
  `)
  console.log('Table receipt_sequences created successfully.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
