import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function applyTriggers() {
  console.log('Applying inventory trigger...')
  try {
    // Run the function and trigger creation
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
    
    console.log('Trigger created successfully.')
    
    const check = await prisma.$queryRawUnsafe(`
      SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'stock_movements';
    `)
    console.log('Current triggers:', JSON.stringify(check, null, 2))

  } catch (err) {
    console.error('FAILED TO APPLY TRIGGER:', err)
  }
}

applyTriggers().finally(() => prisma.$disconnect())
