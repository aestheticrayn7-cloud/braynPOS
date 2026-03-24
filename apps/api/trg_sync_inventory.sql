-- Step 1: Drop the old broken trigger and function cleanly
DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;
DROP FUNCTION IF EXISTS sync_inventory_balance();

-- Step 2: Recreate the function with full INSERT / UPDATE / DELETE handling
CREATE OR REPLACE FUNCTION sync_inventory_balance()
RETURNS TRIGGER AS $$
DECLARE
  v_qty_delta      INT;
  v_prev_available INT;
  v_prev_wac       NUMERIC(12,4);
BEGIN

  -- ── INSERT ─────────────────────────────────────────────────────────────
  -- A new stock movement was recorded. Apply its quantityChange to the
  -- inventory_balances table. Create the balance row if it doesn't exist yet.
  IF TG_OP = 'INSERT' THEN

    -- Ensure the balance row exists for this item+channel combination
    INSERT INTO inventory_balances (
      "itemId", "channelId",
      "availableQty", "incomingQty",
      "retailPrice", "wholesalePrice",
      "minRetailPrice", "minWholesalePrice",
      "weightedAvgCost", "lastMovementAt"
    )
    VALUES (
      NEW."itemId", NEW."channelId",
      0, 0, 0, 0, 0, 0, 0, NOW()
    )
    ON CONFLICT ("itemId", "channelId") DO NOTHING;

    -- TRANSFER_IN_PENDING updates incomingQty (stock in transit, not yet available)
    IF NEW."movementType" = 'TRANSFER_IN_PENDING' THEN
      UPDATE inventory_balances
      SET
        "incomingQty"    = "incomingQty" + NEW."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";

    ELSE
      -- All other movement types update availableQty
      UPDATE inventory_balances
      SET
        "availableQty"   = "availableQty" + NEW."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
    END IF;

    -- Recalculate Weighted Average Cost on PURCHASE (when adding stock with a cost)
    IF NEW."movementType" = 'PURCHASE'
       AND NEW."quantityChange" > 0
       AND NEW."unitCostAtTime" > 0
    THEN
      SELECT "availableQty", "weightedAvgCost"
      INTO v_prev_available, v_prev_wac
      FROM inventory_balances
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";

      -- WAC = (old_qty_before_this_purchase * old_wac + new_qty * new_cost) / total_qty
      -- old_qty_before = current availableQty - quantityChange (we already added it above)
      UPDATE inventory_balances
      SET "weightedAvgCost" = (
        ( GREATEST(v_prev_available - NEW."quantityChange", 0) * COALESCE(v_prev_wac, 0)
          + NEW."quantityChange" * NEW."unitCostAtTime" )
        / NULLIF(v_prev_available, 0)
      )
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";

      -- ── SYNC GLOBAL ITEM COST ──────────────────────────────────────────
      -- Update the global Item table with the new WAC for default lookups.
      -- This ensures that SaleItem snapshots have a fallback if a branch
      -- balance record hasn't been initialized yet.
      UPDATE items
      SET "weightedAvgCost" = (
        SELECT "weightedAvgCost" 
        FROM inventory_balances 
        WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId"
      )
      WHERE id = NEW."itemId";
    END IF;

  -- ── UPDATE ─────────────────────────────────────────────────────────────
  -- A stock movement record was modified. Reverse the OLD value and apply
  -- the NEW value so the balance stays accurate.
  ELSIF TG_OP = 'UPDATE' THEN

    -- Reverse the OLD movement's effect
    IF OLD."movementType" = 'TRANSFER_IN_PENDING' THEN
      UPDATE inventory_balances
      SET
        "incomingQty"    = "incomingQty" - OLD."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
    ELSE
      UPDATE inventory_balances
      SET
        "availableQty"   = "availableQty" - OLD."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
    END IF;

    -- Apply the NEW movement's effect
    IF NEW."movementType" = 'TRANSFER_IN_PENDING' THEN
      UPDATE inventory_balances
      SET
        "incomingQty"    = "incomingQty" + NEW."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
    ELSE
      UPDATE inventory_balances
      SET
        "availableQty"   = "availableQty" + NEW."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = NEW."itemId" AND "channelId" = NEW."channelId";
    END IF;

  -- ── DELETE ─────────────────────────────────────────────────────────────
  -- A stock movement was deleted. Reverse its effect on the balance.
  ELSIF TG_OP = 'DELETE' THEN

    IF OLD."movementType" = 'TRANSFER_IN_PENDING' THEN
      UPDATE inventory_balances
      SET
        "incomingQty"    = "incomingQty" - OLD."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
    ELSE
      UPDATE inventory_balances
      SET
        "availableQty"   = "availableQty" - OLD."quantityChange",
        "lastMovementAt" = NOW()
      WHERE "itemId" = OLD."itemId" AND "channelId" = OLD."channelId";
    END IF;

  END IF;

  -- For INSERT and UPDATE return NEW; for DELETE return OLD (required by Postgres)
  RETURN COALESCE(NEW, OLD);

END;
$$ LANGUAGE plpgsql;

-- Step 3: Attach the trigger to the stock_movements table
-- AFTER ensures the row is fully written before the function reads it
CREATE TRIGGER trg_sync_inventory
AFTER INSERT OR UPDATE OR DELETE ON stock_movements
FOR EACH ROW EXECUTE FUNCTION sync_inventory_balance();
