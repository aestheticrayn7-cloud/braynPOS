import type {
  ChannelType, UserRole, MovementType, SaleType, PaymentStatus,
  LpoStatus, LpoLineStatus, PurchaseStatus, TransferStatus,
  SerialStatus, TaxClass, TaxSyncStatus, SessionStatus,
  CustomerTier, LoyaltyTxType, DeductionType, SalaryRunStatus,
  PaymentMethod, NotificationType, ExpenseAllocationMethod,
} from './enums'

// ── Pagination ──────────────────────────────────────────────────
export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ── Auth ─────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserResponse
  requiresMfa: boolean
}

export interface MfaVerifyRequest {
  code: string
  tempToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  username: string
  role: UserRole
  channelId: string | null
  mfaEnabled: boolean
}

// ── Users ────────────────────────────────────────────────────────
export interface UserResponse {
  id: string
  username: string
  email: string
  role: UserRole
  channelId: string | null
  isActive: boolean
  mfaEnabled: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: UserRole
  channelId?: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  role?: UserRole
  channelId?: string
  isActive?: boolean
}

// ── Channels ─────────────────────────────────────────────────────
export interface ChannelResponse {
  id: string
  name: string
  code: string
  type: ChannelType
  isMainWarehouse: boolean
  featureFlags: Record<string, boolean>
  address: string | null
  phone: string | null
  email: string | null
  createdAt: string
}

export interface CreateChannelRequest {
  name: string
  code: string
  type: ChannelType
  isMainWarehouse?: boolean
  address?: string
  phone?: string
  email?: string
}

// ── Items ────────────────────────────────────────────────────────
export interface ItemResponse {
  id: string
  sku: string
  barcode: string | null
  name: string
  description: string | null
  categoryId: string | null
  brandId: string | null
  supplierId: string | null
  unitOfMeasure: string
  retailPrice: number
  wholesalePrice: number
  minRetailPrice: number
  weightedAvgCost: number
  reorderLevel: number
  isSerialized: boolean
  taxClass: TaxClass
  isActive: boolean
  createdAt: string
}

export interface CreateItemRequest {
  sku: string
  barcode?: string
  name: string
  description?: string
  categoryId?: string
  brandId?: string
  supplierId?: string
  unitOfMeasure?: string
  retailPrice: number
  wholesalePrice: number
  minRetailPrice: number
  weightedAvgCost?: number
  reorderLevel?: number
  isSerialized?: boolean
  taxClass?: TaxClass
}

// ── Stock ────────────────────────────────────────────────────────
export interface StockBalanceResponse {
  itemId: string
  channelId: string
  availableQty: number
  lastMovementAt: string
}

export interface StockMovementResponse {
  id: string
  itemId: string
  channelId: string
  movementType: MovementType
  quantityChange: number
  referenceId: string
  referenceType: string
  unitCostAtTime: number
  performedBy: string
  notes: string | null
  createdAt: string
}

// ── Sales ────────────────────────────────────────────────────────
export interface CommitSaleRequest {
  channelId: string
  saleType: SaleType
  customerId?: string
  sessionId: string
  items: SaleLineInput[]
  payments: PaymentInput[]
  notes?: string
  discountAmount?: number
}

export interface SaleLineInput {
  itemId: string
  serialId?: string
  quantity: number
  unitPrice: number
  discountAmount?: number
}

export interface PaymentInput {
  method: PaymentMethod
  amount: number
  reference?: string
}

export interface SaleResponse {
  id: string
  receiptNo: string
  channelId: string
  saleType: SaleType
  customerId: string | null
  totalAmount: number
  discountAmount: number
  taxAmount: number
  netAmount: number
  status: string
  offlineReceiptNo: string | null
  createdAt: string
}

// ── Offline Sync ────────────────────────────────────────────────
export interface OfflineSalePayload {
  offlineReceiptNo: string
  saleData: CommitSaleRequest
}

export interface OfflineSyncResponse {
  status: 'synced' | 'synced_with_warning' | 'already_synced'
  receiptNo: string
  warnings: string[]
}

// ── Sessions ─────────────────────────────────────────────────────
export interface OpenSessionRequest {
  channelId: string
  openingFloat: number
}

export interface CloseSessionRequest {
  closingFloat: number
  notes?: string
}

export interface SessionResponse {
  id: string
  channelId: string
  userId: string
  status: SessionStatus
  openingFloat: number
  closingFloat: number | null
  expectedFloat: number | null
  variance: number | null
  openedAt: string
  closedAt: string | null
}

// ── Customers ────────────────────────────────────────────────────
export interface CustomerResponse {
  id: string
  name: string
  phone: string | null
  email: string | null
  tier: CustomerTier
  loyaltyPoints: number
  creditLimit: number
  outstandingCredit: number
  createdAt: string
}

export interface CreateCustomerRequest {
  name: string
  phone?: string
  email?: string
  tier?: CustomerTier
  creditLimit?: number
}

// ── Purchases ────────────────────────────────────────────────────
export interface CreateLpoRequest {
  supplierId: string
  channelId: string
  lines: LpoLineInput[]
  notes?: string
}

export interface LpoLineInput {
  itemId: string
  quantity: number
  unitCost: number
}

export interface CommitPurchaseRequest {
  lpoId?: string
  channelId: string
  supplierId: string
  lines: PurchaseLineInput[]
  landedCosts?: LandedCostInput[]
  paymentMethod?: PaymentMethod
}

export interface PurchaseLineInput {
  itemId: string
  quantity: number
  unitCost: number
  serialNumbers?: string[]
}

export interface LandedCostInput {
  description: string
  amount: number
  allocationMethod: ExpenseAllocationMethod
}

// ── Transfers ────────────────────────────────────────────────────
export interface CreateTransferRequest {
  fromChannelId: string
  toChannelId: string
  lines: TransferLineInput[]
  notes?: string
}

export interface TransferLineInput {
  itemId: string
  quantity: number
  serialIds?: string[]
}

export interface ReceiveTransferRequest {
  lines: TransferReceiveLineInput[]
  notes?: string
}

export interface TransferReceiveLineInput {
  itemId: string
  receivedQuantity: number
  disputeReason?: string
}

// ── Expenses ─────────────────────────────────────────────────────
export interface CreateExpenseRequest {
  channelId: string
  description: string
  amount: number
  category?: string
  receiptRef?: string
  notes?: string
}

export interface ExpenseResponse {
  id: string
  channelId: string
  description: string
  amount: number
  category: string | null
  receiptRef: string | null
  createdAt: string
}

// ── Credit ───────────────────────────────────────────────────────
export interface CreditPaymentRequest {
  saleId: string
  amount: number
  method: PaymentMethod
  reference?: string
}

// ── Payroll ──────────────────────────────────────────────────────
export interface StaffProfileResponse {
  id: string
  userId: string
  jobTitle: string
  jobLevelId: string | null
  grossSalary: number
  bankName: string | null
  bankAccount: string | null
  taxPin: string | null
  hireDate: string
}

export interface SalaryRunLineResponse {
  id: string
  staffProfileId: string
  userName: string
  grossSalary: number
  allowances: { name: string; amount: number }[]
  allowancesTotal: number
  grossWithAllowances: number
  taxableBase: number
  deductions: DeductionResult[]
  netSalary: number
  employerCostTotal: number
}

export interface DeductionResult {
  name: string
  amount: number
  isEmployerContribution: boolean
  isPreTax: boolean
}

export interface CreateSalaryRunRequest {
  month: number
  year: number
  channelId?: string
}

// ── Reports ──────────────────────────────────────────────────────
export interface DashboardSummary {
  todaySales: number
  todayRevenue: number
  todayExpenses: number
  activeChannels: number
  lowStockItems: number
  pendingTransfers: number
}

export interface SalesReportQuery {
  channelId?: string
  startDate: string
  endDate: string
  groupBy?: 'day' | 'week' | 'month'
}

// ── Notifications ────────────────────────────────────────────────
export interface NotificationResponse {
  id: string
  type: NotificationType
  message: string
  channelId: string | null
  isRead: boolean
  createdAt: string
}
