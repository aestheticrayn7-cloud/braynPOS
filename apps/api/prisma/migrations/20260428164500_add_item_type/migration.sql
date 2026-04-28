-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('PRODUCT', 'SERVICE');

-- AlterTable
ALTER TABLE "items" ADD COLUMN "type" "ItemType" NOT NULL DEFAULT 'PRODUCT';
