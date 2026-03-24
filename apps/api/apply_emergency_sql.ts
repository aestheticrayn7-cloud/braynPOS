import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS receipt_sequences (
      seq_key  TEXT    PRIMARY KEY,
      last_seq INTEGER NOT NULL DEFAULT 0
    );
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO receipt_sequences (seq_key, last_seq)
    SELECT
      'sales_' || id || '_' || TO_CHAR(NOW() AT TIME ZONE 'Africa/Nairobi', 'YYYYMMDD'),
      5000
    FROM channels
    WHERE "deletedAt" IS NULL
    ON CONFLICT (seq_key)
    DO UPDATE SET last_seq = GREATEST(receipt_sequences.last_seq, 5000);
  `)
  console.log('Emergency SQL Fix applied: Table ensured and sequences jumped to 5000.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
