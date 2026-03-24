import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    const count = await prisma.$queryRaw`SELECT COUNT(*) FROM receipt_sequences`
    console.log('Table receipt_sequences exists. Row count:', count)
  } catch (e: any) {
    if (e.message.includes('does not exist')) {
       console.log('Table receipt_sequences DOES NOT EXIST. Re-creating...')
       await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS receipt_sequences (
            seq_key  TEXT    PRIMARY KEY,
            last_seq INTEGER NOT NULL DEFAULT 0
          );
       `)
    } else {
       console.error('Diagnostic failed:', e.message)
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
