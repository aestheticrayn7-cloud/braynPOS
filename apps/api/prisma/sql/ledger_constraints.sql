-- ══════════════════════════════════════════════════════════════════════
-- ledger_constraints.sql
-- Run this AFTER prisma migrate deploy
-- Enforces immutability on the double-entry ledger at DB role level
-- ══════════════════════════════════════════════════════════════════════

-- ── Prevent any UPDATE or DELETE on ledger_lines ────────────────────
-- (Role grants removed for local dev)

-- ── Prevent UPDATE or DELETE on journal_entries ─────────────────────
-- (Role grants removed for local dev)

-- ── CHECK constraint: each ledger line must have exactly one non-zero side
-- debit_amount and credit_amount are both >= 0
-- Exactly one must be > 0 (cannot have both debit and credit on same line)
ALTER TABLE ledger_lines ADD CONSTRAINT chk_one_side_nonzero
  CHECK (
    "debitAmount" >= 0
    AND "creditAmount" >= 0
    AND ("debitAmount" > 0 OR "creditAmount" > 0)
    AND NOT ("debitAmount" > 0 AND "creditAmount" > 0)
  );
