// ── Channel & User ──────────────────────────────────────────────
export enum ChannelType {
  RETAIL_SHOP = 'RETAIL_SHOP',
  WHOLESALE_SHOP = 'WHOLESALE_SHOP',
  WAREHOUSE = 'WAREHOUSE',
  ONLINE = 'ONLINE',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  STOREKEEPER = 'STOREKEEPER',
  PROMOTER = 'PROMOTER',
}

// ── Stock ────────────────────────────────────────────────────────
export enum MovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ADJUSTMENT_IN = 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT = 'ADJUSTMENT_OUT',
  RETURN = 'RETURN',
  SWAP = 'SWAP',
  WRITE_OFF = 'WRITE_OFF',
}

// ── Sales ────────────────────────────────────────────────────────
export enum SaleType {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
  CREDIT = 'CREDIT',
  PRE_ORDER = 'PRE_ORDER',
  LAYAWAY = 'LAYAWAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

// ── Purchases ────────────────────────────────────────────────────
export enum LpoStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export enum LpoLineStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  FULFILLED = 'FULFILLED',
}

export enum PurchaseStatus {
  DRAFT = 'DRAFT',
  COMMITTED = 'COMMITTED',
}

export enum ExpenseAllocationMethod {
  BY_VALUE = 'BY_VALUE',
  BY_QUANTITY = 'BY_QUANTITY',
}

// ── Transfers ────────────────────────────────────────────────────
export enum TransferStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  AWAITING_RECEIVER = 'AWAITING_RECEIVER',
  RECEIVED = 'RECEIVED',
  DISPUTED = 'DISPUTED',
  REJECTED = 'REJECTED',
}

// ── Serials ──────────────────────────────────────────────────────
export enum SerialStatus {
  IN_STOCK = 'IN_STOCK',
  SOLD = 'SOLD',
  TRANSFERRED = 'TRANSFERRED',
  RETURNED = 'RETURNED',
  SWAPPED_OUT = 'SWAPPED_OUT',
  WRITTEN_OFF = 'WRITTEN_OFF',
}

// ── Tax ──────────────────────────────────────────────────────────
export enum TaxClass {
  STANDARD = 'STANDARD',
  ZERO_RATED = 'ZERO_RATED',
  EXEMPT = 'EXEMPT',
}

export enum TaxSyncStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  QUEUED = 'QUEUED',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
}

// ── Sessions ─────────────────────────────────────────────────────
export enum SessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

// ── Customers & Loyalty ─────────────────────────────────────────
export enum CustomerTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
}

export enum LoyaltyTxType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUST = 'ADJUST',
}

// ── Payroll ──────────────────────────────────────────────────────
export enum DeductionType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE_OF_GROSS = 'PERCENTAGE_OF_GROSS',
  BRACKET_TABLE = 'BRACKET_TABLE',
  PERCENTAGE_OF_TAXABLE = 'PERCENTAGE_OF_TAXABLE',
}

export enum SalaryRunStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED',
}

// ── Accounting (NEW in Hybrid Edition) ──────────────────────────
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum JournalRefType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  EXPENSE = 'EXPENSE',
  TRANSFER_DISPUTE = 'TRANSFER_DISPUTE',
  PAYROLL = 'PAYROLL',
  CREDIT_NOTE = 'CREDIT_NOTE',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  ADJUSTMENT = 'ADJUSTMENT',
}

// ── Payment Methods ─────────────────────────────────────────────
export enum PaymentMethod {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
  CREDIT = 'CREDIT',
}

// ── Notification Type ───────────────────────────────────────────
export enum NotificationType {
  LOW_STOCK = 'LOW_STOCK',
  NEGATIVE_STOCK = 'NEGATIVE_STOCK',
  TRANSFER_RECEIVED = 'TRANSFER_RECEIVED',
  TRANSFER_DISPUTED = 'TRANSFER_DISPUTED',
  CREDIT_DUE = 'CREDIT_DUE',
  SYSTEM = 'SYSTEM',
}
