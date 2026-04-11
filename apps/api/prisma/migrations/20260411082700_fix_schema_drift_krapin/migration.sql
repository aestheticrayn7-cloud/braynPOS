-- Safe schema drift fix: Add missing kraPin fields incrementally
DO $$
BEGIN
    -- Channels table
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'channels' AND column_name = 'kraPin'
    ) THEN
        ALTER TABLE "channels" ADD COLUMN "kraPin" TEXT;
    END IF;

    -- Customers table
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'kraPin'
    ) THEN
        ALTER TABLE "customers" ADD COLUMN "kraPin" TEXT;
    END IF;
END $$;
