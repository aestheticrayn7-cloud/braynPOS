-- Migration: Force-add reversedAt column (camelCase) to journal_entries
-- The previous migration 20260326150000 was already marked "applied" by Prisma
-- even though it added the wrong snake_case column "reversed_at".
-- This new migration runs fresh to correct it.

-- Drop incorrect snake_case version if it exists (from migration 20260326150000)
ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "reversed_at";

-- Add the correct camelCase "reversedAt" column that Prisma queries for
-- (Confirmed from server error: `journal_entries.reversedAt does not exist`)
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "reversedAt" TIMESTAMP(3);
