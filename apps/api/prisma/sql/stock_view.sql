-- ══════════════════════════════════════════════════════════════════════
-- stock_view.sql — REPORTING ONLY
-- ══════════════════════════════════════════════════════════════════════
--
-- ⚠️  DO NOT use stock_levels for sale validation.
--     For validation: use inventory_balances with SELECT FOR UPDATE.
--
-- This materialized view is ONLY for:
--   • Stock flow reports
--   • ABC analysis
--   • Sell-through rate calculations
--   • Dashboard stock summary widgets
--
-- Refresh: BullMQ worker, every 5 MINUTES (not 30 seconds).
-- ══════════════════════════════════════════════════════════════════════

CREATE MATERIALIZED VIEW IF NOT EXISTS stock_levels AS
SELECT
  "itemId",
  "channelId",
  SUM("quantityChange") AS "availableQty"
FROM stock_movements
GROUP BY "itemId", "channelId";

CREATE UNIQUE INDEX IF NOT EXISTS stock_levels_item_channel
  ON stock_levels ("itemId", "channelId");
