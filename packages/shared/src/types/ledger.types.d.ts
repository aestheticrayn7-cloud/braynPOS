import type { AccountType, JournalRefType } from './enums';
export interface AccountResponse {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    parentId: string | null;
    isSystem: boolean;
    channelId: string | null;
    isActive: boolean;
    createdAt: string;
    children?: AccountResponse[];
}
export interface CreateAccountRequest {
    code: string;
    name: string;
    type: AccountType;
    parentId?: string;
    channelId?: string;
}
export interface UpdateAccountRequest {
    name?: string;
    isActive?: boolean;
}
export interface JournalEntryResponse {
    id: string;
    description: string;
    referenceId: string;
    referenceType: JournalRefType;
    channelId: string;
    postedAt: string;
    postedBy: string;
    lines: LedgerLineResponse[];
}
export interface LedgerLineResponse {
    id: string;
    journalEntryId: string;
    accountId: string;
    accountCode: string;
    accountName: string;
    debitAmount: number;
    creditAmount: number;
    memo: string | null;
    createdAt: string;
}
export interface TrialBalanceRow {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    totalDebit: number;
    totalCredit: number;
    balance: number;
}
export interface TrialBalanceResponse {
    rows: TrialBalanceRow[];
    totalDebit: number;
    totalCredit: number;
    variance: number;
    asOf: string;
}
export interface ProfitLossResponse {
    revenue: ProfitLossSection[];
    totalRevenue: number;
    expenses: ProfitLossSection[];
    totalExpenses: number;
    netProfit: number;
    startDate: string;
    endDate: string;
}
export interface ProfitLossSection {
    accountId: string;
    accountCode: string;
    accountName: string;
    amount: number;
}
export interface BalanceSheetResponse {
    assets: BalanceSheetSection[];
    totalAssets: number;
    liabilities: BalanceSheetSection[];
    totalLiabilities: number;
    equity: BalanceSheetSection[];
    totalEquity: number;
    asOf: string;
}
export interface BalanceSheetSection {
    accountId: string;
    accountCode: string;
    accountName: string;
    balance: number;
}
export interface JournalEntryQuery {
    channelId?: string;
    referenceType?: JournalRefType;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export interface AccountLedgerQuery {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export declare const SYSTEM_ACCOUNT_IDS: {
    readonly CASH_ON_HAND: "acc-1010";
    readonly ACCOUNTS_RECEIVABLE: "acc-1200";
    readonly INVENTORY_VALUE: "acc-1500";
    readonly ACCOUNTS_PAYABLE: "acc-2000";
    readonly RETAINED_EARNINGS: "acc-3000";
    readonly SALES_REVENUE: "acc-4000";
    readonly COGS: "acc-5000";
    readonly SHRINKAGE_LOSS: "acc-5100";
    readonly PAYROLL_EXPENSE: "acc-5200";
    readonly GENERAL_EXPENSE: "acc-5300";
};
//# sourceMappingURL=ledger.types.d.ts.map