"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.PaymentMethod = exports.JournalRefType = exports.AccountType = exports.SalaryRunStatus = exports.DeductionType = exports.LoyaltyTxType = exports.CustomerTier = exports.SessionStatus = exports.TaxSyncStatus = exports.TaxClass = exports.SerialStatus = exports.TransferStatus = exports.ExpenseAllocationMethod = exports.PurchaseStatus = exports.LpoLineStatus = exports.LpoStatus = exports.PaymentStatus = exports.SaleType = exports.MovementType = exports.UserRole = exports.ChannelType = void 0;
// ── Channel & User ──────────────────────────────────────────────
var ChannelType;
(function (ChannelType) {
    ChannelType["RETAIL_SHOP"] = "RETAIL_SHOP";
    ChannelType["WHOLESALE_SHOP"] = "WHOLESALE_SHOP";
    ChannelType["WAREHOUSE"] = "WAREHOUSE";
    ChannelType["ONLINE"] = "ONLINE";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["CASHIER"] = "CASHIER";
    UserRole["STOREKEEPER"] = "STOREKEEPER";
    UserRole["PROMOTER"] = "PROMOTER";
})(UserRole || (exports.UserRole = UserRole = {}));
// ── Stock ────────────────────────────────────────────────────────
var MovementType;
(function (MovementType) {
    MovementType["PURCHASE"] = "PURCHASE";
    MovementType["SALE"] = "SALE";
    MovementType["TRANSFER_IN"] = "TRANSFER_IN";
    MovementType["TRANSFER_OUT"] = "TRANSFER_OUT";
    MovementType["ADJUSTMENT_IN"] = "ADJUSTMENT_IN";
    MovementType["ADJUSTMENT_OUT"] = "ADJUSTMENT_OUT";
    MovementType["RETURN"] = "RETURN";
    MovementType["SWAP"] = "SWAP";
    MovementType["WRITE_OFF"] = "WRITE_OFF";
})(MovementType || (exports.MovementType = MovementType = {}));
// ── Sales ────────────────────────────────────────────────────────
var SaleType;
(function (SaleType) {
    SaleType["WHOLESALE"] = "WHOLESALE";
    SaleType["RETAIL"] = "RETAIL";
    SaleType["CREDIT"] = "CREDIT";
    SaleType["PRE_ORDER"] = "PRE_ORDER";
    SaleType["LAYAWAY"] = "LAYAWAY";
})(SaleType || (exports.SaleType = SaleType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["CONFIRMED"] = "CONFIRMED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
// ── Purchases ────────────────────────────────────────────────────
var LpoStatus;
(function (LpoStatus) {
    LpoStatus["DRAFT"] = "DRAFT";
    LpoStatus["SENT"] = "SENT";
    LpoStatus["PARTIALLY_FULFILLED"] = "PARTIALLY_FULFILLED";
    LpoStatus["FULFILLED"] = "FULFILLED";
    LpoStatus["CANCELLED"] = "CANCELLED";
})(LpoStatus || (exports.LpoStatus = LpoStatus = {}));
var LpoLineStatus;
(function (LpoLineStatus) {
    LpoLineStatus["PENDING"] = "PENDING";
    LpoLineStatus["PARTIAL"] = "PARTIAL";
    LpoLineStatus["FULFILLED"] = "FULFILLED";
})(LpoLineStatus || (exports.LpoLineStatus = LpoLineStatus = {}));
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["DRAFT"] = "DRAFT";
    PurchaseStatus["COMMITTED"] = "COMMITTED";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
var ExpenseAllocationMethod;
(function (ExpenseAllocationMethod) {
    ExpenseAllocationMethod["BY_VALUE"] = "BY_VALUE";
    ExpenseAllocationMethod["BY_QUANTITY"] = "BY_QUANTITY";
})(ExpenseAllocationMethod || (exports.ExpenseAllocationMethod = ExpenseAllocationMethod = {}));
// ── Transfers ────────────────────────────────────────────────────
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["DRAFT"] = "DRAFT";
    TransferStatus["SENT"] = "SENT";
    TransferStatus["AWAITING_RECEIVER"] = "AWAITING_RECEIVER";
    TransferStatus["RECEIVED"] = "RECEIVED";
    TransferStatus["DISPUTED"] = "DISPUTED";
    TransferStatus["REJECTED"] = "REJECTED";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
// ── Serials ──────────────────────────────────────────────────────
var SerialStatus;
(function (SerialStatus) {
    SerialStatus["IN_STOCK"] = "IN_STOCK";
    SerialStatus["SOLD"] = "SOLD";
    SerialStatus["TRANSFERRED"] = "TRANSFERRED";
    SerialStatus["RETURNED"] = "RETURNED";
    SerialStatus["SWAPPED_OUT"] = "SWAPPED_OUT";
    SerialStatus["WRITTEN_OFF"] = "WRITTEN_OFF";
})(SerialStatus || (exports.SerialStatus = SerialStatus = {}));
// ── Tax ──────────────────────────────────────────────────────────
var TaxClass;
(function (TaxClass) {
    TaxClass["STANDARD"] = "STANDARD";
    TaxClass["ZERO_RATED"] = "ZERO_RATED";
    TaxClass["EXEMPT"] = "EXEMPT";
})(TaxClass || (exports.TaxClass = TaxClass = {}));
var TaxSyncStatus;
(function (TaxSyncStatus) {
    TaxSyncStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    TaxSyncStatus["QUEUED"] = "QUEUED";
    TaxSyncStatus["SYNCED"] = "SYNCED";
    TaxSyncStatus["FAILED"] = "FAILED";
})(TaxSyncStatus || (exports.TaxSyncStatus = TaxSyncStatus = {}));
// ── Sessions ─────────────────────────────────────────────────────
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["OPEN"] = "OPEN";
    SessionStatus["CLOSED"] = "CLOSED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
// ── Customers & Loyalty ─────────────────────────────────────────
var CustomerTier;
(function (CustomerTier) {
    CustomerTier["BRONZE"] = "BRONZE";
    CustomerTier["SILVER"] = "SILVER";
    CustomerTier["GOLD"] = "GOLD";
})(CustomerTier || (exports.CustomerTier = CustomerTier = {}));
var LoyaltyTxType;
(function (LoyaltyTxType) {
    LoyaltyTxType["EARN"] = "EARN";
    LoyaltyTxType["REDEEM"] = "REDEEM";
    LoyaltyTxType["EXPIRE"] = "EXPIRE";
    LoyaltyTxType["ADJUST"] = "ADJUST";
})(LoyaltyTxType || (exports.LoyaltyTxType = LoyaltyTxType = {}));
// ── Payroll ──────────────────────────────────────────────────────
var DeductionType;
(function (DeductionType) {
    DeductionType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    DeductionType["PERCENTAGE_OF_GROSS"] = "PERCENTAGE_OF_GROSS";
    DeductionType["BRACKET_TABLE"] = "BRACKET_TABLE";
    DeductionType["PERCENTAGE_OF_TAXABLE"] = "PERCENTAGE_OF_TAXABLE";
})(DeductionType || (exports.DeductionType = DeductionType = {}));
var SalaryRunStatus;
(function (SalaryRunStatus) {
    SalaryRunStatus["DRAFT"] = "DRAFT";
    SalaryRunStatus["FINALIZED"] = "FINALIZED";
})(SalaryRunStatus || (exports.SalaryRunStatus = SalaryRunStatus = {}));
// ── Accounting (NEW in Hybrid Edition) ──────────────────────────
var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["REVENUE"] = "REVENUE";
    AccountType["EXPENSE"] = "EXPENSE";
})(AccountType || (exports.AccountType = AccountType = {}));
var JournalRefType;
(function (JournalRefType) {
    JournalRefType["SALE"] = "SALE";
    JournalRefType["PURCHASE"] = "PURCHASE";
    JournalRefType["EXPENSE"] = "EXPENSE";
    JournalRefType["TRANSFER_DISPUTE"] = "TRANSFER_DISPUTE";
    JournalRefType["PAYROLL"] = "PAYROLL";
    JournalRefType["CREDIT_NOTE"] = "CREDIT_NOTE";
    JournalRefType["BANK_DEPOSIT"] = "BANK_DEPOSIT";
    JournalRefType["ADJUSTMENT"] = "ADJUSTMENT";
})(JournalRefType || (exports.JournalRefType = JournalRefType = {}));
// ── Payment Methods ─────────────────────────────────────────────
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["LOYALTY_POINTS"] = "LOYALTY_POINTS";
    PaymentMethod["CREDIT"] = "CREDIT";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// ── Notification Type ───────────────────────────────────────────
var NotificationType;
(function (NotificationType) {
    NotificationType["LOW_STOCK"] = "LOW_STOCK";
    NotificationType["NEGATIVE_STOCK"] = "NEGATIVE_STOCK";
    NotificationType["TRANSFER_RECEIVED"] = "TRANSFER_RECEIVED";
    NotificationType["TRANSFER_DISPUTED"] = "TRANSFER_DISPUTED";
    NotificationType["CREDIT_DUE"] = "CREDIT_DUE";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=enums.js.map