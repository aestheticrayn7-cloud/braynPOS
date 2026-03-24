/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `allowance_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `deduction_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'APPROVAL_REQUESTED';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "successfulRepayments" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "manager_approvals" ALTER COLUMN "channelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "allowance_rules_name_key" ON "allowance_rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "deduction_rules_name_key" ON "deduction_rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "items_sku_key" ON "items"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");
