-- Add mfaRecoveryCodes and status columns that are in schema but missing from migrations
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mfaRecoveryCodes" TEXT[];
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- Ensure UserStatus enum type exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserStatus') THEN
    CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'LOCKED');
  END IF;
END$$;

-- Update the column type now that enum exists
ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."UserStatus" USING "status"::"public"."UserStatus";
