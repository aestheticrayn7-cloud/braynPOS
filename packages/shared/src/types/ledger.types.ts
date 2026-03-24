import type { AccountType, JournalRefType } from './enums'

// ── Chart of Accounts ────────────────────────────────────────────
export interface AccountResponse {
  id: string
  code: string
  name: string
  type: AccountType
  parentId: string | null
  isSystem: boolean
  channelId: string | null
  isActive: boolean
  createdAt: string
  children?: AccountResponse[]
}

export interface CreateAccountRequest {
  code: string
  name: string
  type: AccountType
  parentId?: string
  channelId?: string
}

export interface UpdateAccountRequest {
  name?: string
  isActive?: boolean
}

// ── Journal Entries ──────────────────────────────────────────────
export interface JournalEntryResponse {
  id: string
  description: string
  referenceId: string
  referenceType: JournalRefType
  channelId: string
  postedAt: string
  postedBy: string
  lines: LedgerLineResponse[]
}

export interface LedgerLineResponse {
  id: string
  journalEntryId: string
  accountId: string
  accountCode: string
  accountName: string
  debitAmount: number
  creditAmount: number
  memo: string | null
  createdAt: string
}

// ── Financial Statements ────────────────────────────────────────
export interface TrialBalanceRow {
  accountId: string
  accountCode: string
  accountName: string
  accountType: AccountType
  totalDebit: number
  totalCredit: number
  balance: number
}

export interface TrialBalanceResponse {
  rows: TrialBalanceRow[]
  totalDebit: number
  totalCredit: number
  variance: number
  asOf: string
}

export interface ProfitLossResponse {
  revenue: ProfitLossSection[]
  totalRevenue: number
  expenses: ProfitLossSection[]
  totalExpenses: number
  netProfit: number
  startDate: string
  endDate: string
}

export interface ProfitLossSection {
  accountId: string
  accountCode: string
  accountName: string
  amount: number
}

export interface BalanceSheetResponse {
  assets: BalanceSheetSection[]
  totalAssets: number
  liabilities: BalanceSheetSection[]
  totalLiabilities: number
  equity: BalanceSheetSection[]
  totalEquity: number
  asOf: string
}

export interface BalanceSheetSection {
  accountId: string
  accountCode: string
  accountName: string
  balance: number
}

// ── Journal Entry Filters ───────────────────────────────────────
export interface JournalEntryQuery {
  channelId?: string
  referenceType?: JournalRefType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// ── Ledger Query ────────────────────────────────────────────────
export interface AccountLedgerQuery {
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// ── System Account IDs (stable constants) ───────────────────────
export const SYSTEM_ACCOUNT_IDS = {
  CASH_ON_HAND: 'acc-1010',
  BANK_ACCOUNT: 'acc-1020',
  ACCOUNTS_RECEIVABLE: 'acc-1200',
  INVENTORY_VALUE: 'acc-1500',
  ACCOUNTS_PAYABLE: 'acc-2000',
  RETAINED_EARNINGS: 'acc-3000',
  SALES_REVENUE: 'acc-4000',
  COGS: 'acc-5000',
  SHRINKAGE_LOSS: 'acc-5100',
  PAYROLL_EXPENSE: 'acc-5200',
  GENERAL_EXPENSE: 'acc-5300',
  TAX_PAYABLE: 'acc-2100',
} as const
