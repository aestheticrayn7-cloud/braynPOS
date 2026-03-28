-- AlterEnum
ALTER TYPE "MovementType" ADD VALUE 'OPENING_STOCK';

-- AlterTable
ALTER TABLE "idempotency_records" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';
