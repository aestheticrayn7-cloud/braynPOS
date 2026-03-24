export declare enum ChannelType {
    RETAIL_SHOP = "RETAIL_SHOP",
    WHOLESALE_SHOP = "WHOLESALE_SHOP",
    WAREHOUSE = "WAREHOUSE",
    ONLINE = "ONLINE"
}
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CASHIER = "CASHIER",
    STOREKEEPER = "STOREKEEPER",
    PROMOTER = "PROMOTER"
}
export declare enum MovementType {
    PURCHASE = "PURCHASE",
    SALE = "SALE",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT",
    ADJUSTMENT_IN = "ADJUSTMENT_IN",
    ADJUSTMENT_OUT = "ADJUSTMENT_OUT",
    RETURN = "RETURN",
    SWAP = "SWAP",
    WRITE_OFF = "WRITE_OFF"
}
export declare enum SaleType {
    WHOLESALE = "WHOLESALE",
    RETAIL = "RETAIL",
    CREDIT = "CREDIT",
    PRE_ORDER = "PRE_ORDER",
    LAYAWAY = "LAYAWAY"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED"
}
export declare enum LpoStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
    FULFILLED = "FULFILLED",
    CANCELLED = "CANCELLED"
}
export declare enum LpoLineStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    FULFILLED = "FULFILLED"
}
export declare enum PurchaseStatus {
    DRAFT = "DRAFT",
    COMMITTED = "COMMITTED"
}
export declare enum ExpenseAllocationMethod {
    BY_VALUE = "BY_VALUE",
    BY_QUANTITY = "BY_QUANTITY"
}
export declare enum TransferStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    AWAITING_RECEIVER = "AWAITING_RECEIVER",
    RECEIVED = "RECEIVED",
    DISPUTED = "DISPUTED",
    REJECTED = "REJECTED"
}
export declare enum SerialStatus {
    IN_STOCK = "IN_STOCK",
    SOLD = "SOLD",
    TRANSFERRED = "TRANSFERRED",
    RETURNED = "RETURNED",
    SWAPPED_OUT = "SWAPPED_OUT",
    WRITTEN_OFF = "WRITTEN_OFF"
}
export declare enum TaxClass {
    STANDARD = "STANDARD",
    ZERO_RATED = "ZERO_RATED",
    EXEMPT = "EXEMPT"
}
export declare enum TaxSyncStatus {
    NOT_APPLICABLE = "NOT_APPLICABLE",
    QUEUED = "QUEUED",
    SYNCED = "SYNCED",
    FAILED = "FAILED"
}
export declare enum SessionStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}
export declare enum CustomerTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD"
}
export declare enum LoyaltyTxType {
    EARN = "EARN",
    REDEEM = "REDEEM",
    EXPIRE = "EXPIRE",
    ADJUST = "ADJUST"
}
export declare enum DeductionType {
    FIXED_AMOUNT = "FIXED_AMOUNT",
    PERCENTAGE_OF_GROSS = "PERCENTAGE_OF_GROSS",
    BRACKET_TABLE = "BRACKET_TABLE",
    PERCENTAGE_OF_TAXABLE = "PERCENTAGE_OF_TAXABLE"
}
export declare enum SalaryRunStatus {
    DRAFT = "DRAFT",
    FINALIZED = "FINALIZED"
}
export declare enum AccountType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
    EQUITY = "EQUITY",
    REVENUE = "REVENUE",
    EXPENSE = "EXPENSE"
}
export declare enum JournalRefType {
    SALE = "SALE",
    PURCHASE = "PURCHASE",
    EXPENSE = "EXPENSE",
    TRANSFER_DISPUTE = "TRANSFER_DISPUTE",
    PAYROLL = "PAYROLL",
    CREDIT_NOTE = "CREDIT_NOTE",
    BANK_DEPOSIT = "BANK_DEPOSIT",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    MOBILE_MONEY = "MOBILE_MONEY",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    LOYALTY_POINTS = "LOYALTY_POINTS",
    CREDIT = "CREDIT"
}
export declare enum NotificationType {
    LOW_STOCK = "LOW_STOCK",
    NEGATIVE_STOCK = "NEGATIVE_STOCK",
    TRANSFER_RECEIVED = "TRANSFER_RECEIVED",
    TRANSFER_DISPUTED = "TRANSFER_DISPUTED",
    CREDIT_DUE = "CREDIT_DUE",
    SYSTEM = "SYSTEM"
}
//# sourceMappingURL=enums.d.ts.map