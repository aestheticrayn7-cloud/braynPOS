-- Fix Sales schema drift: Add missing columns
DO $$
BEGIN
    -- Add vatOverride
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'vatOverride'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "vatOverride" BOOLEAN DEFAULT false;
    END IF;

    -- Add manualVatAmount
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'manualVatAmount'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "manualVatAmount" DECIMAL(14, 4);
    END IF;

    -- Add selectedBankId
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'selectedBankId'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "selectedBankId" TEXT;
    END IF;

    -- Add bankSnapshot
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'bankSnapshot'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "bankSnapshot" JSONB;
    END IF;

    -- Add device_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'device_date'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "device_date" TIMESTAMP(3);
    END IF;

    -- Add dueDate
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'dueDate'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "dueDate" TIMESTAMPTZ(6);
    END IF;

    -- Add taxSyncStatus
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'taxSyncStatus'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "taxSyncStatus" TEXT DEFAULT 'NOT_APPLICABLE';
    END IF;

    -- Add offlineReceiptNo
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'offlineReceiptNo'
    ) THEN
        ALTER TABLE "sales" ADD COLUMN "offlineReceiptNo" TEXT;
    END IF;
END $$;
