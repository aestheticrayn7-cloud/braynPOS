import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function applyTriggers() {
  console.log('Applying inventory trigger...')
  try {
    const sqlPath = path.join(__dirname, 'prisma', 'sql', 'inventory_trigger.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split into individual statements if needed, but PostgreSQL usually handles multi-statement if sent correctly
    // or we can run them one by one.
    
    // We'll run the function and trigger creation
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
    
    // Test it now
    console.log('Testing trigger with a dummy movement...')
    // We'll use a real item but maybe a dummy quantity that we revert
    const item = await prisma.item.findFirst()
    const channel = await prisma.channel.findFirst()
    
    if (item && channel) {
       await prisma.stockMovement.create({
         data: {
           itemId: item.id,
           channelId: channel.id,
           movementType: 'ADJUSTMENT',
           quantityChange: 0,
           referenceId: 'test-trigger',
           referenceType: 'other',
           performedBy: (await prisma.user.findFirst())?.id || ''
         }
       })
       console.log('Dummy movement created.')
    }
    
    const check = await prisma.$queryRawUnsafe(`
      SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'stock_movements';
    `)
    console.log('Current triggers:', JSON.stringify(check, null, 2))

  } catch (err) {
    console.error('FAILED TO APPLY TRIGGER:', err)
  }
}

applyTriggers().finally(() => prisma.$disconnect())
