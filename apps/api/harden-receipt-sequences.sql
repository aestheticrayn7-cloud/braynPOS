-- ══════════════════════════════════════════════════════════════════
-- Run this once in your database (psql or Prisma Studio raw SQL)
-- Hardens the receipt_sequences table against race conditions
-- ══════════════════════════════════════════════════════════════════

-- 1. Ensure the table exists with the correct structure
CREATE TABLE IF NOT EXISTS receipt_sequences (
  seq_key   TEXT    PRIMARY KEY,
  last_seq  INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add a unique index on seq_key if not already primary key
--    (safe to run even if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'receipt_sequences'
    AND   indexname = 'receipt_sequences_pkey'
  ) THEN
    ALTER TABLE receipt_sequences ADD PRIMARY KEY (seq_key);
  END IF;
END $$;

-- 3. Add updated_at column if missing
ALTER TABLE receipt_sequences
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Jump today's sequence past any potentially used numbers
--    This ensures the NEXT sale is always > any manual sale you created
--    Change the channel IDs below to match your actual channels
--    Format: sales_{channelId}_{YYYYMMDD}
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

-- 5. Verify — should show all channels with last_seq >= 5000
SELECT seq_key, last_seq, updated_at
FROM   receipt_sequences
ORDER  BY updated_at DESC;
