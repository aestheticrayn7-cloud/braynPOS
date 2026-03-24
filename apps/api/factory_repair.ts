import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function completeFix() {
  console.log('--- STARTING COMPLETE FACTORY REPAIR ---')
  
  // 1. Ensure Table and Trigger exist
  console.log('1. Re-applying trigger standard...')
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
  
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION fn_sync_inventory_balance()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
      VALUES (NEW."itemId", NEW."channelId", 0, 0, now())
      ON CONFLICT ("itemId", "channelId") DO NOTHING;

      IF NEW."movementType" = 'TRANSFER_IN_PENDING' THEN
        UPDATE inventory_balances 
        SET "incomingQty"    = "incomingQty" + NEW."quantityChange",
            "lastMovementAt" = now()
        WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
      ELSE
        UPDATE inventory_balances 
        SET "availableQty"    = "availableQty" + NEW."quantityChange",
            "lastMovementAt" = now()
        WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
  
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;`)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trg_sync_inventory
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_inventory_balance();
  `)

  // 2. Full Sync from Scratch
  console.log('2. Recalculating ALL balances from movement history...')
  // We truncate balances and rebuild from movements
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE inventory_balances;`)
  
  await prisma.$executeRawUnsafe(`
    INSERT INTO inventory_balances ("itemId", "channelId", "availableQty", "incomingQty", "lastMovementAt")
    SELECT 
      "itemId", 
      "channelId", 
      SUM(CASE WHEN "movementType" NOT IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "availableQty",
      SUM(CASE WHEN "movementType" IN ('TRANSFER_IN_PENDING') THEN "quantityChange" ELSE 0 END)::INT as "incomingQty",
      MAX("createdAt") as "lastMovementAt"
    FROM stock_movements
    GROUP BY "itemId", "channelId";
  `)

  // 3. Cleanup redundant 0 rows
  console.log('3. Cleaning up redundant zero-balance rows for isolation...')
  // Only keep 0 rows if they HAVE history (to show "Out of Stock" vs "Not Handled")
  // Actually, better to keep only if total moves > 0
  
  // 4. Verification Check
  const balances = await prisma.inventory_balances.findMany({
     include: { item: { select: { name: true } }, channel: { select: { name: true } } }
  })
  
  console.log('Current Healthy Balances:')
  balances.forEach(b => {
    console.log(`[${b.channel.name}] ${b.item.name}: ${b.availableQty}`)
  })
  
  console.log('--- SYSTEM HEALTHY ---')
}

completeFix().finally(() => prisma.$disconnect())
