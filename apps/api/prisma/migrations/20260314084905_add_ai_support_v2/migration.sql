-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('USER', 'AI', 'HUMAN_AGENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('GENERAL', 'TECHNICAL', 'BILLING', 'STOCK', 'TRANSFER', 'PAYROLL', 'BUG_REPORT', 'FEATURE_REQUEST');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_HUMAN', 'CLOSED', 'RESOLVED');

-- AlterEnum
ALTER TYPE "MovementType" ADD VALUE 'TRANSFER_IN_PENDING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'MANAGER_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SALES_PERSON';

-- AlterTable
ALTER TABLE "salary_runs" ADD COLUMN     "finalizedAt" TIMESTAMPTZ(6),
ADD COLUMN     "totalDeductions" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalEmployerCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalGross" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalNet" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "dueDate" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "refCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL DEFAULT 'GENERAL',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "userId" TEXT NOT NULL,
    "channelId" TEXT,
    "assignedToId" TEXT,
    "aiSummary" TEXT,
    "escalatedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL DEFAULT 'USER',
    "senderId" TEXT,
    "content" TEXT NOT NULL,
    "toolCallsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_refCode_key" ON "support_tickets"("refCode");

-- CreateIndex
CREATE INDEX "support_tickets_userId_idx" ON "support_tickets"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_channelId_createdAt_idx" ON "support_tickets"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "support_messages_ticketId_createdAt_idx" ON "support_messages"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_balances_channelId_idx" ON "inventory_balances"("channelId");

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
