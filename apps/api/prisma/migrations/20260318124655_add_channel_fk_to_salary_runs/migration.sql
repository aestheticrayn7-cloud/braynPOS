/*
  Warnings:

  - A unique constraint covering the columns `[channelId,name]` on the table `allowance_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,name]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,name]` on the table `deduction_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,name]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StockTakeStatus" AS ENUM ('OPEN', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'VOIDED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'VOIDED');

-- AlterEnum
ALTER TYPE "MovementType" ADD VALUE 'STOCK_TAKE_CORRECTION';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "inventory_balances" DROP CONSTRAINT "inventory_balances_channelId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_balances" DROP CONSTRAINT "inventory_balances_itemId_fkey";

-- DropIndex
DROP INDEX "allowance_rules_name_key";

-- DropIndex
DROP INDEX "brands_name_key";

-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "customers_phone_key";

-- DropIndex
DROP INDEX "deduction_rules_name_key";

-- DropIndex
DROP INDEX "inventory_balances_channelId_idx";

-- DropIndex
DROP INDEX "suppliers_name_key";

-- AlterTable
ALTER TABLE "allowance_rules" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "deduction_rules" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "document_templates" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "inventory_balances" ALTER COLUMN "lastMovementAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "minWholesalePrice" DECIMAL(12,4) NOT NULL DEFAULT 0,
ALTER COLUMN "reorderLevel" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "tax_connector_configs" ADD COLUMN     "channelId" TEXT;

-- CreateTable
CREATE TABLE "stock_takes" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "status" "StockTakeStatus" NOT NULL DEFAULT 'OPEN',
    "startedBy" TEXT NOT NULL,
    "completedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_takes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_take_items" (
    "id" TEXT NOT NULL,
    "stockTakeId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "expectedQty" INTEGER NOT NULL,
    "recordedQty" INTEGER,
    "discrepancy" INTEGER,

    CONSTRAINT "stock_take_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelId" TEXT,
    "userId" TEXT,
    "role" "UserRole",
    "ratePercent" DECIMAL(14,4) NOT NULL,
    "minMarginPercent" DECIMAL(14,4),
    "appliesTo" "SaleType"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_entries" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "ruleId" TEXT,
    "grossMargin" DECIMAL(14,4) NOT NULL,
    "marginPercent" DECIMAL(14,4) NOT NULL,
    "commissionAmount" DECIMAL(14,4) NOT NULL,
    "rateApplied" DECIMAL(14,4) NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_payouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalCommission" DECIMAL(14,4) NOT NULL,
    "entryCount" INTEGER NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "salaryRunId" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commission_entries_saleId_key" ON "commission_entries"("saleId");

-- CreateIndex
CREATE INDEX "commission_entries_userId_status_idx" ON "commission_entries"("userId", "status");

-- CreateIndex
CREATE INDEX "commission_entries_channelId_createdAt_idx" ON "commission_entries"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "allowance_rules_channelId_idx" ON "allowance_rules"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "allowance_rules_channelId_name_key" ON "allowance_rules"("channelId", "name");

-- CreateIndex
CREATE INDEX "audit_logs_targetId_targetType_idx" ON "audit_logs"("targetId", "targetType");

-- CreateIndex
CREATE INDEX "brands_channelId_idx" ON "brands"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "brands_channelId_name_key" ON "brands"("channelId", "name");

-- CreateIndex
CREATE INDEX "categories_channelId_idx" ON "categories"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_channelId_name_key" ON "categories"("channelId", "name");

-- CreateIndex
CREATE INDEX "customers_channelId_idx" ON "customers"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_channelId_phone_key" ON "customers"("channelId", "phone");

-- CreateIndex
CREATE INDEX "deduction_rules_channelId_idx" ON "deduction_rules"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "deduction_rules_channelId_name_key" ON "deduction_rules"("channelId", "name");

-- CreateIndex
CREATE INDEX "document_templates_channelId_idx" ON "document_templates"("channelId");

-- CreateIndex
CREATE INDEX "salary_runs_channelId_idx" ON "salary_runs"("channelId");

-- CreateIndex
CREATE INDEX "sale_items_createdAt_idx" ON "sale_items"("createdAt");

-- CreateIndex
CREATE INDEX "sale_items_itemId_createdAt_idx" ON "sale_items"("itemId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_referenceId_referenceType_idx" ON "stock_movements"("referenceId", "referenceType");

-- CreateIndex
CREATE INDEX "stock_movements_channelId_createdAt_idx" ON "stock_movements"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_movementType_idx" ON "stock_movements"("movementType");

-- CreateIndex
CREATE INDEX "suppliers_channelId_idx" ON "suppliers"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_channelId_name_key" ON "suppliers"("channelId", "name");

-- CreateIndex
CREATE INDEX "tax_connector_configs_channelId_idx" ON "tax_connector_configs"("channelId");

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deduction_rules" ADD CONSTRAINT "deduction_rules_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allowance_rules" ADD CONSTRAINT "allowance_rules_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_runs" ADD CONSTRAINT "salary_runs_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_connector_configs" ADD CONSTRAINT "tax_connector_configs_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_templates" ADD CONSTRAINT "document_templates_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_takes" ADD CONSTRAINT "stock_takes_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_takes" ADD CONSTRAINT "stock_takes_startedBy_fkey" FOREIGN KEY ("startedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_takes" ADD CONSTRAINT "stock_takes_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_take_items" ADD CONSTRAINT "stock_take_items_stockTakeId_fkey" FOREIGN KEY ("stockTakeId") REFERENCES "stock_takes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_take_items" ADD CONSTRAINT "stock_take_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_rules" ADD CONSTRAINT "commission_rules_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_rules" ADD CONSTRAINT "commission_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entries" ADD CONSTRAINT "commission_entries_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entries" ADD CONSTRAINT "commission_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entries" ADD CONSTRAINT "commission_entries_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entries" ADD CONSTRAINT "commission_entries_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "commission_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entries" ADD CONSTRAINT "commission_entries_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "commission_payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_payouts" ADD CONSTRAINT "commission_payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_payouts" ADD CONSTRAINT "commission_payouts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
