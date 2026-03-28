-- AlterEnum
ALTER TYPE "JournalRefType" ADD VALUE 'PAYROLL_REVERSAL';

-- AlterTable
ALTER TABLE "idempotency_records" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '7 days';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleEmail" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "receipt_sequences" (
    "seq_key" TEXT NOT NULL,
    "last_seq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "receipt_sequences_pkey" PRIMARY KEY ("seq_key")
);

-- CreateIndex
CREATE INDEX "items_isActive_idx" ON "items"("isActive");
