import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  
  const step1 = "DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements; DROP FUNCTION IF EXISTS sync_inventory_balance();"
  
  const step2 = "CREATE OR REPLACE FUNCTION sync_inventory_balance() RETURNS TRIGGER AS \$BODY\$ DECLARE v_qty_delta INT; v_prev_available INT; v_prev_wac NUMERIC(12,4); BEGIN IF TG_OP = 'INSERT' THEN INSERT INTO inventory_balances (\"itemId\", \"channelId\", \"availableQty\", \"incomingQty\", \"retailPrice\", \"wholesalePrice\", \"minRetailPrice\", \"minWholesalePrice\", \"weightedAvgCost\", \"lastMovementAt\") VALUES (NEW.\"itemId\", NEW.\"channelId\", 0, 0, 0, 0, 0, 0, 0, NOW()) ON CONFLICT (\"itemId\", \"channelId\") DO NOTHING; IF NEW.\"movementType\" = 'TRANSFER_IN_PENDING' THEN UPDATE inventory_balances SET \"incomingQty\" = \"incomingQty\" + NEW.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; ELSE UPDATE inventory_balances SET \"availableQty\" = \"availableQty\" + NEW.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; END IF; IF NEW.\"movementType\" = 'PURCHASE' AND NEW.\"quantityChange\" > 0 AND NEW.\"unitCostAtTime\" > 0 THEN SELECT \"availableQty\", \"weightedAvgCost\" INTO v_prev_available, v_prev_wac FROM inventory_balances WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; UPDATE inventory_balances SET \"weightedAvgCost\" = (( GREATEST(v_prev_available - NEW.\"quantityChange\", 0) * COALESCE(v_prev_wac, 0) + NEW.\"quantityChange\" * NEW.\"unitCostAtTime\" ) / NULLIF(v_prev_available, 0)) WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; END IF; ELSIF TG_OP = 'UPDATE' THEN IF OLD.\"movementType\" = 'TRANSFER_IN_PENDING' THEN UPDATE inventory_balances SET \"incomingQty\" = \"incomingQty\" - OLD.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = OLD.\"itemId\" AND \"channelId\" = OLD.\"channelId\"; ELSE UPDATE inventory_balances SET \"availableQty\" = \"availableQty\" - OLD.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = OLD.\"itemId\" AND \"channelId\" = OLD.\"channelId\"; END IF; IF NEW.\"movementType\" = 'TRANSFER_IN_PENDING' THEN UPDATE inventory_balances SET \"incomingQty\" = \"incomingQty\" + NEW.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; ELSE UPDATE inventory_balances SET \"availableQty\" = \"availableQty\" + NEW.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = NEW.\"itemId\" AND \"channelId\" = NEW.\"channelId\"; END IF; ELSIF TG_OP = 'DELETE' THEN IF OLD.\"movementType\" = 'TRANSFER_IN_PENDING' THEN UPDATE inventory_balances SET \"incomingQty\" = \"incomingQty\" - OLD.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = OLD.\"itemId\" AND \"channelId\" = OLD.\"channelId\"; ELSE UPDATE inventory_balances SET \"availableQty\" = \"availableQty\" - OLD.\"quantityChange\", \"lastMovementAt\" = NOW() WHERE \"itemId\" = OLD.\"itemId\" AND \"channelId\" = OLD.\"channelId\"; END IF; END IF; RETURN COALESCE(NEW, OLD); END; \$BODY\$ LANGUAGE plpgsql;"
  
  const step3 = "CREATE TRIGGER trg_sync_inventory AFTER INSERT OR UPDATE OR DELETE ON stock_movements FOR EACH ROW EXECUTE FUNCTION sync_inventory_balance();"
  
  try {
    console.log('Step 1...')
    await prisma.$executeRawUnsafe(step1)
    console.log('Step 2...')
    await prisma.$executeRawUnsafe(step2)
    console.log('Step 3...')
    await prisma.$executeRawUnsafe(step3)
    console.log('Success.')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
