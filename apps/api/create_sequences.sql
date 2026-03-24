-- BraynPOS — Receipt Sequences Table
CREATE TABLE IF NOT EXISTS receipt_sequences (
  seq_key   TEXT         PRIMARY KEY,
  last_seq  INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clean up any old counter rows from previous approaches
DELETE FROM settings WHERE key LIKE 'receipt_counter_%';

-- Verify
SELECT 'receipt_sequences table ready' AS status;
