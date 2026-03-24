import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const sql = `
-- 1. Ensure the table exists with the correct structure
CREATE TABLE IF NOT EXISTS receipt_sequences (
  seq_key   TEXT    PRIMARY KEY,
  last_seq  INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add updated_at column if missing
ALTER TABLE receipt_sequences
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Jump today's sequence past any potentially used numbers
DO $$
DECLARE
  today_str TEXT := TO_CHAR(NOW() AT TIME ZONE 'Africa/Nairobi', 'YYYYMMDD');
  ch        TEXT;
  key_name  TEXT;
BEGIN
  -- Get all channel IDs from the channels table
  FOR ch IN SELECT id FROM channels WHERE "deletedAt" IS NULL LOOP
    key_name := 'sales_' || ch || '_' || today_str;

    INSERT INTO receipt_sequences (seq_key, last_seq)
    VALUES (key_name, 5000)
    ON CONFLICT (seq_key) DO UPDATE
      SET last_seq = GREATEST(receipt_sequences.last_seq, 5000),
          updated_at = NOW();
  END LOOP;
END $$;
`
  // executeRawUnsafe cannot run multiple statements easily in some drivers, 
  // so we'll try it as one block or split it.
  // Actually, PostgreSQL supports multiple statements in one execute call via many libraries.
  await prisma.$executeRawUnsafe(sql)
  console.log('Database hardened and sequences jumped.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
