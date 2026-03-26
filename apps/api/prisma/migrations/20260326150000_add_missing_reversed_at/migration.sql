-- Migration: Add missing columns that exist in schema.prisma but not in production DB
-- Root cause: These columns were added to schema.prisma without generating migration files.
-- Prisma Client expects them, causing P2022 crashes on any operation touching journal_entries.

-- Add reversedAt column to journal_entries (was in schema.prisma but missing from DB)
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "reversed_at" TIMESTAMP(3);
