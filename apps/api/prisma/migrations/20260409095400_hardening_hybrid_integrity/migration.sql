-- Add device_date to sales
ALTER TABLE "sales" ADD COLUMN "device_date" TIMESTAMP(3);

-- Rename columns in stock_movements (based on recent schema alignment)
ALTER TABLE "stock_movements" RENAME COLUMN "quantity" TO "quantityChange";
ALTER TABLE "stock_movements" RENAME COLUMN "type" TO "movementType";

-- Create SyncConflict table
CREATE TABLE "sync_conflicts" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_conflicts_pkey" PRIMARY KEY ("id")
);

-- Add foreign key for SyncConflict
ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index to SyncConflict
CREATE INDEX "sync_conflicts_saleId_idx" ON "sync_conflicts"("saleId");
CREATE INDEX "sync_conflicts_resolved_idx" ON "sync_conflicts"("resolved");
