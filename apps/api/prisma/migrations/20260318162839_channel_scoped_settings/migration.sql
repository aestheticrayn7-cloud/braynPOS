/*
  Warnings:

  - A unique constraint covering the columns `[key,channelId]` on the table `settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "channelId" TEXT,
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_channelId_key" ON "settings"("key", "channelId");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
