/*
  Warnings:

  - The values [ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_ticketId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "manager_approvals" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "approvalToken" TEXT,
    "approvedById" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manager_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manager_approvals_approvalToken_key" ON "manager_approvals"("approvalToken");

-- CreateIndex
CREATE INDEX "manager_approvals_requesterId_idx" ON "manager_approvals"("requesterId");

-- CreateIndex
CREATE INDEX "manager_approvals_status_idx" ON "manager_approvals"("status");

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_approvals" ADD CONSTRAINT "manager_approvals_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_approvals" ADD CONSTRAINT "manager_approvals_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
