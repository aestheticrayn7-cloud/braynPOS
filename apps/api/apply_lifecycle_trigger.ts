import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function applyTrigger() {
  console.log('Applying expanded inventory trigger in stages...')
  
  try {
    // Stage 1: Table
    console.log('1. Ensuring inventory_balances table exists...')
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS inventory_balances (
        "itemId"        TEXT NOT NULL REFERENCES items(id),
        "channelId"     TEXT NOT NULL REFERENCES channels(id),
        "availableQty"  INTEGER NOT NULL DEFAULT 0,
        "incomingQty"   INTEGER NOT NULL DEFAULT 0,
        "lastMovementAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY ("itemId", "channelId")
      );
    `)

    // Stage 2: Function
    console.log('2. Creating sync function...')
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION fn_sync_inventory_balance()
      RETURNS TRIGGER AS $$
      BEGIN
        -- 1. Handle Deletion or removal of old state (for UPDATE)
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

        -- 2. Handle Insertion or addition of new state (for UPDATE)
        IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
          -- Ensure a row exists first
          INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
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
      $$ LANGUAGE plpgsql;
    `)

    // Stage 3: Trigger
    console.log('3. Attaching trigger...')
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;`)
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER trg_sync_inventory
      AFTER INSERT OR UPDATE OR DELETE ON stock_movements
      FOR EACH ROW
      EXECUTE FUNCTION fn_sync_inventory_balance();
    `)

    // Stage 4: Sync
    console.log('4. Performing initial data sync...')
    await prisma.$executeRawUnsafe(`
      INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty")
      SELECT 
        "itemId", 
        "channelId", 
        SUM(CASE WHEN "movementType" != 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "availableQty",
        SUM(CASE WHEN "movementType" = 'TRANSFER_IN_PENDING' THEN "quantityChange" ELSE 0 END) as "incomingQty"
      FROM stock_movements
      GROUP BY "itemId", "channelId"
      ON CONFLICT ("itemId", "channelId") DO UPDATE
        SET "availableQty" = EXCLUDED."availableQty",
            "incomingQty"  = EXCLUDED."incomingQty";
    `)

    console.log('Trigger and data sync applied successfully.')
  } catch (err) {
    console.error('FAILED TO APPLY TRIGGER:', err)
  }
}

applyTrigger().finally(() => prisma.$disconnect())
