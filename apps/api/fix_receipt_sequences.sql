CREATE TABLE IF NOT EXISTS receipt_sequences (
  seq_key TEXT PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);
