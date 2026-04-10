-- Add device_date to sales (safe: skip if already exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sales' AND column_name='device_date') THEN
    ALTER TABLE "sales" ADD COLUMN "device_date" TIMESTAMP(3);
  END IF;
END $$;

-- Rename columns in stock_movements (safe: skip if table or column does not exist)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stock_movements' AND column_name='quantity') THEN
    ALTER TABLE "stock_movements" RENAME COLUMN "quantity" TO "quantityChange";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stock_movements' AND column_name='type') THEN
    ALTER TABLE "stock_movements" RENAME COLUMN "type" TO "movementType";
  END IF;
END $$;

-- Create SyncConflict table (safe: skip if already exists)
CREATE TABLE IF NOT EXISTS "sync_conflicts" (
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

-- Add foreign key for SyncConflict (safe: skip if already exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sync_conflicts_saleId_fkey') THEN
    ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sync_conflicts_resolvedBy_fkey') THEN
    ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Add index to SyncConflict (safe: skip if already exists)
CREATE INDEX IF NOT EXISTS "sync_conflicts_saleId_idx" ON "sync_conflicts"("saleId");
CREATE INDEX IF NOT EXISTS "sync_conflicts_resolved_idx" ON "sync_conflicts"("resolved");
