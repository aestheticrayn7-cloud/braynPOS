import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS receipt_sequences (
      seq_key   TEXT    PRIMARY KEY,
      last_seq  INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE receipt_sequences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    EXCEPTION WHEN OTHERS THEN NULL; END $$;
  `)
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE
      today_str TEXT := TO_CHAR(NOW() AT TIME ZONE 'Africa/Nairobi', 'YYYYMMDD');
      ch        TEXT;
      key_name  TEXT;
    BEGIN
      -- Get all channel IDs from the channels table
      FOR ch IN SELECT id FROM "channels" WHERE "deletedAt" IS NULL LOOP
        key_name := 'sales_' || ch || '_' || today_str;

        INSERT INTO receipt_sequences (seq_key, last_seq)
        VALUES (key_name, 5000)
        ON CONFLICT (seq_key) DO UPDATE
          SET last_seq = GREATEST(receipt_sequences.last_seq, 5000),
              updated_at = NOW();
      END LOOP;
    END $$;
  `)
  console.log('Database hardened and sequences jumped.')
}
main().catch(console.error).finally(() => prisma.$disconnect())
