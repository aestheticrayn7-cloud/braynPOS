/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNo,itemId,channelId]` on the table `serials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelId` to the `customer_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `loyalty_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_payments" ADD COLUMN     "channelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "loyalty_transactions" ADD COLUMN     "channelId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "serials_serialNo_itemId_channelId_key" ON "serials"("serialNo", "itemId", "channelId");

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_payments" ADD CONSTRAINT "customer_payments_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sentBy_fkey" FOREIGN KEY ("sentBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
