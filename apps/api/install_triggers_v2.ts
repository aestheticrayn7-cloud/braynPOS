import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
  const content = fs.readFileSync(sqlPath, 'utf8')
  
  // Very simplistic split for this specific file
  // Statements are separated by ; and newline
  // We need to keep the function definition together
  
  const statements = [
    // 1. Create table
    `CREATE TABLE IF NOT EXISTS inventory_balances (
      "itemId"        TEXT NOT NULL REFERENCES items(id),
      "channelId"     TEXT NOT NULL REFERENCES channels(id),
      "availableQty"  INTEGER NOT NULL DEFAULT 0,
      "incomingQty"   INTEGER NOT NULL DEFAULT 0,
      "retailPrice"   DECIMAL(12, 4) DEFAULT 0,
      "wholesalePrice" DECIMAL(12, 4) DEFAULT 0,
      "minRetailPrice" DECIMAL(12, 4) DEFAULT 0,
      "minWholesalePrice" DECIMAL(12, 4) DEFAULT 0,
      "weightedAvgCost" DECIMAL(12, 4) DEFAULT 0,
      "lastMovementAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY ("itemId", "channelId")
    );`,
    // 2. Create Function
    `CREATE OR REPLACE FUNCTION fn_sync_inventory_balance()
    RETURNS TRIGGER AS $$
    BEGIN
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

      IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        INSERT INTO inventory_balances (
          "itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt",
          "retailPrice", "wholesalePrice", "minRetailPrice", "minWholesalePrice", "weightedAvgCost"
        )
        SELECT 
          NEW."itemId", NEW."channelId", 0, 0, now(),
          i."retailPrice", i."wholesalePrice", i."minRetailPrice", i."minWholesalePrice", i."weightedAvgCost"
        FROM items i
        WHERE i.id = NEW."itemId"
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
    // 3. Drop Trigger
    `DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;`,
    // 4. Create Trigger
    `CREATE TRIGGER trg_sync_inventory
      AFTER INSERT OR UPDATE OR DELETE ON stock_movements
      FOR EACH ROW
      EXECUTE FUNCTION fn_sync_inventory_balance();`,
    // 5. Initial population
    `INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "availableQty",
      SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "incomingQty"
    FROM stock_movements
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO UPDATE
      SET "availableQty" = EXCLUDED."availableQty",
          "incomingQty"  = EXCLUDED."incomingQty";`
  ]

  for (const [i, stmt] of statements.entries()) {
    try {
      console.log(`Executing statement ${i + 1}...`)
      await prisma.$executeRawUnsafe(stmt)
    } catch (err: any) {
      console.error(`❌ Error in statement ${i + 1}:`, err.message)
    }
  }
  console.log('✅ Installation finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
