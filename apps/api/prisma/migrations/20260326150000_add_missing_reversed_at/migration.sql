-- Migration: Add missing columns that exist in schema.prisma but not in production DB
-- Root cause: These columns were added to schema.prisma without generating migration files.
-- Prisma Client uses camelCase column names (e.g. "reversedAt" NOT "reversed_at").
-- This was causing P2022 crashes on any purchase commit operation touching journal_entries.

-- Clean up the wrongly-cased column added by the previous migration attempt
ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "reversed_at";

-- Add the correct camelCase column that Prisma actually queries for
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "reversedAt" TIMESTAMP(3);
