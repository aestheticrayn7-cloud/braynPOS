-- ══════════════════════════════════════════════════════════════════════
-- inventory_trigger.sql
-- Run this AFTER prisma migrate deploy
-- This trigger is the ONLY writer to inventory_balances
-- ══════════════════════════════════════════════════════════════════════

-- ── Create the inventory_balances physical table ────────────────────
CREATE TABLE IF NOT EXISTS inventory_balances (
  "itemId"        TEXT NOT NULL REFERENCES items(id),
  "channelId"     TEXT NOT NULL REFERENCES channels(id),
  "availableQty"  INTEGER NOT NULL DEFAULT 0,
  "incomingQty"   INTEGER NOT NULL DEFAULT 0,
  "lastMovementAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY ("itemId", "channelId")
);

-- ── Trigger function: synchronously updates inventory_balances ──────
-- on every INSERT into stock_movements. O(1) update, no full aggregate.
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
    -- Ensure a row exists first, inheriting prices from the Item master
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
$$ LANGUAGE plpgsql;

-- ── Attach trigger to stock_movements ───────────────────────────────
DROP TRIGGER IF EXISTS trg_sync_inventory ON stock_movements;
CREATE TRIGGER trg_sync_inventory
  AFTER INSERT OR UPDATE OR DELETE ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION fn_sync_inventory_balance();

-- ── Initial population ──────────────────────────────────────────────
-- Correctly aggregate existing movements and inherit master prices
INSERT INTO inventory_balances (
  "itemId", "channelId", "availableQty", "incomingQty",
  "retailPrice", "wholesalePrice", "minRetailPrice", "minWholesalePrice", "weightedAvgCost"
)
SELECT 
  sm."itemId", 
  sm."channelId", 
  SUM(CASE WHEN sm."movementType" != 'TRANSFER_IN_PENDING' THEN sm."quantityChange" ELSE 0 END) as "availableQty",
  SUM(CASE WHEN sm."movementType" = 'TRANSFER_IN_PENDING' THEN sm."quantityChange" ELSE 0 END) as "incomingQty",
  MAX(i."retailPrice"),
  MAX(i."wholesalePrice"),
  MAX(i."minRetailPrice"),
  MAX(i."minWholesalePrice"),
  MAX(i."weightedAvgCost")
FROM stock_movements sm
JOIN items i ON sm."itemId" = i.id
GROUP BY sm."itemId", sm."channelId"
ON CONFLICT ("itemId", "channelId") DO UPDATE
  SET "availableQty" = EXCLUDED."availableQty",
      "incomingQty"  = EXCLUDED."incomingQty",
      "retailPrice"  = EXCLUDED."retailPrice",
      "wholesalePrice" = EXCLUDED."wholesalePrice",
      "minRetailPrice" = EXCLUDED."minRetailPrice",
      "minWholesalePrice" = EXCLUDED."minWholesalePrice",
      "weightedAvgCost" = EXCLUDED."weightedAvgCost";
