-- ── Partial Indexes ──────────────────────────────────────────────────
-- Every unique constraint on a soft-deletable column uses a partial index
-- (WHERE deleted_at IS NULL) to allow reuse of values after soft-delete.

CREATE UNIQUE INDEX IF NOT EXISTS items_sku_active
  ON items (sku) WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_username_active
  ON users (username) WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_active
  ON users (email) WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS serials_serialno_active
  ON serials ("serialNo") WHERE "deletedAt" IS NULL;

-- ── Stock Movements Permissions ─────────────────────────────────────
-- NEVER UPDATE or DELETE rows in stock_movements. INSERT and SELECT only.
-- (Role grants removed for local dev)
