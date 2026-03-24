-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('RETAIL_SHOP', 'WHOLESALE_SHOP', 'WAREHOUSE', 'ONLINE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('PURCHASE', 'SALE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'RETURN', 'SWAP', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('WHOLESALE', 'RETAIL', 'CREDIT', 'PRE_ORDER', 'LAYAWAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "LpoStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LpoLineStatus" AS ENUM ('PENDING', 'PARTIAL', 'FULFILLED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('DRAFT', 'COMMITTED');

-- CreateEnum
CREATE TYPE "ExpenseAllocationMethod" AS ENUM ('BY_VALUE', 'BY_QUANTITY');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('DRAFT', 'SENT', 'AWAITING_RECEIVER', 'RECEIVED', 'DISPUTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SerialStatus" AS ENUM ('IN_STOCK', 'SOLD', 'TRANSFERRED', 'RETURNED', 'SWAPPED_OUT', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "TaxClass" AS ENUM ('STANDARD', 'ZERO_RATED', 'EXEMPT');

-- CreateEnum
CREATE TYPE "TaxSyncStatus" AS ENUM ('NOT_APPLICABLE', 'QUEUED', 'SYNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "CustomerTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "LoyaltyTxType" AS ENUM ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST');

-- CreateEnum
CREATE TYPE "DeductionType" AS ENUM ('FIXED_AMOUNT', 'PERCENTAGE_OF_GROSS', 'BRACKET_TABLE', 'PERCENTAGE_OF_TAXABLE');

-- CreateEnum
CREATE TYPE "SalaryRunStatus" AS ENUM ('DRAFT', 'FINALIZED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "JournalRefType" AS ENUM ('SALE', 'PURCHASE', 'EXPENSE', 'TRANSFER_DISPUTE', 'PAYROLL', 'CREDIT_NOTE', 'BANK_DEPOSIT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'LOYALTY_POINTS', 'CREDIT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LOW_STOCK', 'NEGATIVE_STOCK', 'TRANSFER_RECEIVED', 'TRANSFER_DISPUTED', 'CREDIT_DUE', 'SYSTEM');

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "isMainWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "featureFlags" JSONB NOT NULL DEFAULT '{}',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "mfaSecret" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "channelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "parentId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "channelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "referenceType" "JournalRefType" NOT NULL,
    "channelId" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postedBy" TEXT NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_lines" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debitAmount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "taxPin" TEXT,
    "paymentTerms" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "brandId" TEXT,
    "supplierId" TEXT,
    "unitOfMeasure" TEXT NOT NULL DEFAULT 'PCS',
    "retailPrice" DECIMAL(12,4) NOT NULL,
    "wholesalePrice" DECIMAL(12,4) NOT NULL,
    "minRetailPrice" DECIMAL(12,4) NOT NULL,
    "weightedAvgCost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 10,
    "isSerialized" BOOLEAN NOT NULL DEFAULT false,
    "taxClass" "TaxClass" NOT NULL DEFAULT 'STANDARD',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "movementType" "MovementType" NOT NULL,
    "quantityChange" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,
    "referenceType" TEXT NOT NULL,
    "unitCostAtTime" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "performedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serials" (
    "id" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "status" "SerialStatus" NOT NULL DEFAULT 'IN_STOCK',
    "saleId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "sessionId" TEXT,
    "customerId" TEXT,
    "saleType" "SaleType" NOT NULL DEFAULT 'RETAIL',
    "totalAmount" DECIMAL(14,4) NOT NULL,
    "discountAmount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(14,4) NOT NULL,
    "taxSyncStatus" "TaxSyncStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "offlineReceiptNo" TEXT,
    "notes" TEXT,
    "performedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "serialId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,4) NOT NULL,
    "minRetailPriceSnapshot" DECIMAL(12,4) NOT NULL,
    "costPriceSnapshot" DECIMAL(12,4) NOT NULL,
    "markup" DECIMAL(12,4) NOT NULL,
    "lineTotal" DECIMAL(14,4) NOT NULL,
    "discountAmount" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "reference" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CONFIRMED',
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "tier" "CustomerTier" NOT NULL DEFAULT 'BRONZE',
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "creditLimit" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "outstandingCredit" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "LoyaltyTxType" NOT NULL,
    "points" INTEGER NOT NULL,
    "referenceId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_payments" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "saleId" TEXT,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_sessions" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'OPEN',
    "openingFloat" DECIMAL(14,4) NOT NULL,
    "closingFloat" DECIMAL(14,4),
    "expectedFloat" DECIMAL(14,4),
    "variance" DECIMAL(14,4),
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "sales_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "status" "LpoStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lpo_lines" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,4) NOT NULL,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,
    "status" "LpoLineStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "lpo_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "purchaseNo" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'DRAFT',
    "totalCost" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "landedCostTotal" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "paymentMethod" "PaymentMethod",
    "notes" TEXT,
    "committedBy" TEXT,
    "committedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_lines" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,4) NOT NULL,
    "lineTotal" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "purchase_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landed_costs" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "allocationMethod" "ExpenseAllocationMethod" NOT NULL DEFAULT 'BY_VALUE',

    CONSTRAINT "landed_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "transferNo" TEXT NOT NULL,
    "fromChannelId" TEXT NOT NULL,
    "toChannelId" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'DRAFT',
    "sentBy" TEXT,
    "receivedBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_lines" (
    "id" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "sentQuantity" INTEGER NOT NULL,
    "receivedQuantity" INTEGER,
    "disputeReason" TEXT,

    CONSTRAINT "transfer_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "category" TEXT,
    "receiptRef" TEXT,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_deposits" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "reference" TEXT,
    "depositedBy" TEXT NOT NULL,
    "depositedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobLevelId" TEXT,
    "grossSalary" DECIMAL(12,2) NOT NULL,
    "bankName" TEXT,
    "bankAccount" TEXT,
    "taxPin" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deduction_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeductionType" NOT NULL,
    "rate" DECIMAL(8,4),
    "isPreTaxDeduction" BOOLEAN NOT NULL DEFAULT false,
    "minimumFloorAmount" DECIMAL(12,2),
    "maximumCapAmount" DECIMAL(12,2),
    "calculationSequence" INTEGER NOT NULL DEFAULT 100,
    "isEmployerContribution" BOOLEAN NOT NULL DEFAULT false,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "appliesToJobLevelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deduction_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deduction_brackets" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "incomeFrom" DECIMAL(12,2) NOT NULL,
    "incomeTo" DECIMAL(12,2),
    "ratePercentage" DECIMAL(8,4) NOT NULL,
    "fixedDeduction" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "effectiveStartDate" TIMESTAMP(3),
    "effectiveEndDate" TIMESTAMP(3),

    CONSTRAINT "deduction_brackets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allowance_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeductionType" NOT NULL,
    "amount" DECIMAL(12,4) NOT NULL,
    "appliesToJobLevelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allowance_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_runs" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "channelId" TEXT,
    "status" "SalaryRunStatus" NOT NULL DEFAULT 'DRAFT',
    "runBy" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_run_lines" (
    "id" TEXT NOT NULL,
    "salaryRunId" TEXT NOT NULL,
    "staffProfileId" TEXT NOT NULL,
    "grossSalary" DECIMAL(12,2) NOT NULL,
    "allowancesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductionsTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "netSalary" DECIMAL(12,2) NOT NULL,
    "employerCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "breakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_run_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_connector_configs" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_connector_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "channelId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_records" (
    "key" TEXT NOT NULL,
    "responseBody" JSONB NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_code_key" ON "channels"("code");

-- CreateIndex
CREATE INDEX "users_channelId_idx" ON "users"("channelId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_code_key" ON "accounts"("code");

-- CreateIndex
CREATE INDEX "journal_entries_referenceId_idx" ON "journal_entries"("referenceId");

-- CreateIndex
CREATE INDEX "journal_entries_channelId_postedAt_idx" ON "journal_entries"("channelId", "postedAt");

-- CreateIndex
CREATE INDEX "ledger_lines_journalEntryId_idx" ON "ledger_lines"("journalEntryId");

-- CreateIndex
CREATE INDEX "ledger_lines_accountId_idx" ON "ledger_lines"("accountId");

-- CreateIndex
CREATE INDEX "items_categoryId_idx" ON "items"("categoryId");

-- CreateIndex
CREATE INDEX "items_brandId_idx" ON "items"("brandId");

-- CreateIndex
CREATE INDEX "items_supplierId_idx" ON "items"("supplierId");

-- CreateIndex
CREATE INDEX "stock_movements_itemId_channelId_idx" ON "stock_movements"("itemId", "channelId");

-- CreateIndex
CREATE INDEX "stock_movements_createdAt_idx" ON "stock_movements"("createdAt");

-- CreateIndex
CREATE INDEX "serials_itemId_idx" ON "serials"("itemId");

-- CreateIndex
CREATE INDEX "serials_channelId_idx" ON "serials"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_receiptNo_key" ON "sales"("receiptNo");

-- CreateIndex
CREATE INDEX "sales_channelId_createdAt_idx" ON "sales"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "sales_customerId_idx" ON "sales"("customerId");

-- CreateIndex
CREATE INDEX "sales_sessionId_idx" ON "sales"("sessionId");

-- CreateIndex
CREATE INDEX "sale_items_saleId_idx" ON "sale_items"("saleId");

-- CreateIndex
CREATE INDEX "sale_items_itemId_idx" ON "sale_items"("itemId");

-- CreateIndex
CREATE INDEX "payments_saleId_idx" ON "payments"("saleId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_customerId_idx" ON "loyalty_transactions"("customerId");

-- CreateIndex
CREATE INDEX "customer_payments_customerId_idx" ON "customer_payments"("customerId");

-- CreateIndex
CREATE INDEX "sales_sessions_channelId_idx" ON "sales_sessions"("channelId");

-- CreateIndex
CREATE INDEX "sales_sessions_userId_idx" ON "sales_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNo_key" ON "purchase_orders"("orderNo");

-- CreateIndex
CREATE INDEX "purchase_orders_supplierId_idx" ON "purchase_orders"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_orders_channelId_idx" ON "purchase_orders"("channelId");

-- CreateIndex
CREATE INDEX "lpo_lines_purchaseOrderId_idx" ON "lpo_lines"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_purchaseNo_key" ON "purchases"("purchaseNo");

-- CreateIndex
CREATE INDEX "purchases_supplierId_idx" ON "purchases"("supplierId");

-- CreateIndex
CREATE INDEX "purchases_channelId_idx" ON "purchases"("channelId");

-- CreateIndex
CREATE INDEX "purchase_lines_purchaseId_idx" ON "purchase_lines"("purchaseId");

-- CreateIndex
CREATE INDEX "landed_costs_purchaseId_idx" ON "landed_costs"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_transferNo_key" ON "transfers"("transferNo");

-- CreateIndex
CREATE INDEX "transfers_fromChannelId_idx" ON "transfers"("fromChannelId");

-- CreateIndex
CREATE INDEX "transfers_toChannelId_idx" ON "transfers"("toChannelId");

-- CreateIndex
CREATE INDEX "transfer_lines_transferId_idx" ON "transfer_lines"("transferId");

-- CreateIndex
CREATE INDEX "expenses_channelId_idx" ON "expenses"("channelId");

-- CreateIndex
CREATE INDEX "expenses_createdAt_idx" ON "expenses"("createdAt");

-- CreateIndex
CREATE INDEX "bank_deposits_channelId_idx" ON "bank_deposits"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_profiles_userId_key" ON "staff_profiles"("userId");

-- CreateIndex
CREATE INDEX "deduction_brackets_ruleId_idx" ON "deduction_brackets"("ruleId");

-- CreateIndex
CREATE UNIQUE INDEX "salary_runs_month_year_channelId_key" ON "salary_runs"("month", "year", "channelId");

-- CreateIndex
CREATE INDEX "salary_run_lines_salaryRunId_idx" ON "salary_run_lines"("salaryRunId");

-- CreateIndex
CREATE INDEX "notifications_channelId_idx" ON "notifications"("channelId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_lines" ADD CONSTRAINT "ledger_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_lines" ADD CONSTRAINT "ledger_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serials" ADD CONSTRAINT "serials_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serials" ADD CONSTRAINT "serials_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serials" ADD CONSTRAINT "serials_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sales_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_payments" ADD CONSTRAINT "customer_payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_sessions" ADD CONSTRAINT "sales_sessions_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_sessions" ADD CONSTRAINT "sales_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lpo_lines" ADD CONSTRAINT "lpo_lines_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lpo_lines" ADD CONSTRAINT "lpo_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lines" ADD CONSTRAINT "purchase_lines_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lines" ADD CONSTRAINT "purchase_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landed_costs" ADD CONSTRAINT "landed_costs_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_fromChannelId_fkey" FOREIGN KEY ("fromChannelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_toChannelId_fkey" FOREIGN KEY ("toChannelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_lines" ADD CONSTRAINT "transfer_lines_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "transfers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_lines" ADD CONSTRAINT "transfer_lines_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_deposits" ADD CONSTRAINT "bank_deposits_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deduction_brackets" ADD CONSTRAINT "deduction_brackets_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "deduction_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_run_lines" ADD CONSTRAINT "salary_run_lines_salaryRunId_fkey" FOREIGN KEY ("salaryRunId") REFERENCES "salary_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_run_lines" ADD CONSTRAINT "salary_run_lines_staffProfileId_fkey" FOREIGN KEY ("staffProfileId") REFERENCES "staff_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
