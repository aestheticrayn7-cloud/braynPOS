-- AlterEnum
ALTER TYPE "JournalRefType" ADD VALUE 'PAYROLL_REVERSAL';

-- AlterTable
ALTER TABLE "idempotency_records" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '7 days';

-- AlterTable
ALTER TABLE "journal_entries" ADD COLUMN     "reversedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "receipt_sequences" (
    "seq_key" TEXT NOT NULL,
    "last_seq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "receipt_sequences_pkey" PRIMARY KEY ("seq_key")
);

-- CreateIndex
CREATE INDEX "idempotency_records_expiresAt_idx" ON "idempotency_records"("expiresAt");

-- CreateIndex
CREATE INDEX "items_isActive_idx" ON "items"("isActive");