import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const blocks = [
    `CREATE TABLE IF NOT EXISTS inventory_balances (
      "itemId"        TEXT NOT NULL REFERENCES items(id),
      "channelId"     TEXT NOT NULL REFERENCES channels(id),
      "availableQty"  INTEGER NOT NULL DEFAULT 0,
      "incomingQty"   INTEGER NOT NULL DEFAULT 0,
      "lastMovementAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY ("itemId", "channelId")
    )`,
    `CREATE OR REPLACE FUNCTION fn_sync_inventory_balance()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW."movementType" = 'TRANSFER_IN_PENDING' THEN
        INSERT INTO inventory_balances ("itemId", "channelId", "incomingQty", "lastMovementAt")
        VALUES (NEW."itemId", NEW."channelId", NEW."quantityChange", now())
        ON CONFLICT ("itemId", "channelId") DO UPDATE
          SET "incomingQty"    = inventory_balances."incomingQty" + NEW."quantityChange",
              "lastMovementAt" = now();
      ELSE
        INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "lastMovementAt")
        VALUES (NEW."itemId", NEW."channelId", NEW."quantityChange", now())
        ON CONFLICT ("itemId", "channelId") DO UPDATE
          SET "availableQty"    = inventory_balances."availableQty" + NEW."quantityChange",
              "lastMovementAt" = now();
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql`,
    `DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements`,
    `CREATE TRIGGER trg_sync_inventory
      AFTER INSERT ON stock_movements
      FOR EACH ROW
      EXECUTE FUNCTION fn_sync_inventory_balance()`,
    `INSERT INTO inventory_balances ("itemId", "channelId", "availableQty")
    SELECT "itemId", "channelId", SUM("quantityChange")
    FROM stock_movements
    WHERE "movementType" != 'TRANSFER_IN_PENDING'
    GROUP BY "itemId", "channelId"
    ON CONFLICT ("itemId", "channelId") DO UPDATE
      SET "availableQty" = EXCLUDED."availableQty"`
  ]
  
  for (const block of blocks) {
    console.log('Running block...')
    await prisma.$executeRawUnsafe(block)
  }
  
  console.log('SQL trigger applied successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
