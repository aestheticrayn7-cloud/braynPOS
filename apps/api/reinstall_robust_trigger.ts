import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- REINSTALLING ROBUST INVENTORY TRIGGER ---')
  
  const statements = [
    // 1. DROPS
    `DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;`,
    `DROP FUNCTION IF EXISTS fn_sync_inventory_balance();`,

    // 2. FUNCTION
    `CREATE OR REPLACE FUNCTION fn_sync_inventory_balance()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Handle DELETED or OLD data (for Updates)
      IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
        IF OLD."movementType" = 'TRANSFER_IN_PENDING' THEN
          UPDATE inventory_balances 
          SET "incomingQty" = "incomingQty" - OLD."quantityChange",
              "lastMovementAt" = now()
          WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
        ELSE
          UPDATE inventory_balances 
          SET "availableQty" = "availableQty" - OLD."quantityChange",
              "lastMovementAt" = now()
          WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
        END IF;
      END IF;

      -- Handle NEW data (for Inserts or Updates)
      IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        -- Ensure isolation record exists
        INSERT INTO inventory_balances (
          "itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt"
        )
        VALUES (NEW."itemId", NEW."channelId", 0, 0, now())
        ON CONFLICT ("itemId", "channelId") DO NOTHING;

        IF NEW."movementType" = 'TRANSFER_IN_PENDING' THEN
          UPDATE inventory_balances 
          SET "incomingQty" = "incomingQty" + NEW."quantityChange",
              "lastMovementAt" = now()
          WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
        ELSE
          UPDATE inventory_balances 
          SET "availableQty" = "availableQty" + NEW."quantityChange",
              "lastMovementAt" = now()
          WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
        END IF;
      END IF;

      IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
      ELSE
        RETURN NEW;
      END IF;
    END;
    $$ LANGUAGE plpgsql;`,

    // 3. TRIGGER
    `CREATE TRIGGER trg_sync_inventory
      AFTER INSERT OR UPDATE OR DELETE ON stock_movements
      FOR EACH ROW
      EXECUTE FUNCTION fn_sync_inventory_balance();`,

    // 4. RE-AGGREGATE ALL STOCK (Full Reconciliation)
    `UPDATE inventory_balances ib
    SET 
      "availableQty" = sub.avail,
      "incomingQty"  = sub.inc
    FROM (
      SELECT 
        "itemId", 
        "channelId", 
        SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as avail,
        SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as inc
      FROM stock_movements
      GROUP BY "itemId", "channelId"
    ) sub
    WHERE ib."itemId" = sub."itemId" AND ib."channelId" = sub."channelId";`,
    
    // 5. Insert any missing balances
    `INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as avail,
      SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as inc
    FROM stock_movements
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO NOTHING;`
  ]

  for (const [i, stmt] of statements.entries()) {
    try {
      console.log(`Executing statement ${i + 1}...`)
      await prisma.$executeRawUnsafe(stmt)
    } catch (err: any) {
      console.error(`❌ Error in statement ${i + 1}:`, err.message)
    }
  }
  console.log('✅ Robust trigger installed and stock levels reconciled.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
