
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ChannelScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  type: 'type',
  isMainWarehouse: 'isMainWarehouse',
  featureFlags: 'featureFlags',
  address: 'address',
  phone: 'phone',
  email: 'email',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  mfaSecret: 'mfaSecret',
  mfaEnabled: 'mfaEnabled',
  channelId: 'channelId',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  type: 'type',
  parentId: 'parentId',
  isSystem: 'isSystem',
  channelId: 'channelId',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.JournalEntryScalarFieldEnum = {
  id: 'id',
  description: 'description',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  channelId: 'channelId',
  postedAt: 'postedAt',
  postedBy: 'postedBy'
};

exports.Prisma.LedgerLineScalarFieldEnum = {
  id: 'id',
  journalEntryId: 'journalEntryId',
  accountId: 'accountId',
  debitAmount: 'debitAmount',
  creditAmount: 'creditAmount',
  memo: 'memo',
  createdAt: 'createdAt'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  parentId: 'parentId',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contactName: 'contactName',
  phone: 'phone',
  email: 'email',
  address: 'address',
  taxPin: 'taxPin',
  paymentTerms: 'paymentTerms',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  barcode: 'barcode',
  name: 'name',
  description: 'description',
  categoryId: 'categoryId',
  brandId: 'brandId',
  supplierId: 'supplierId',
  unitOfMeasure: 'unitOfMeasure',
  retailPrice: 'retailPrice',
  wholesalePrice: 'wholesalePrice',
  minRetailPrice: 'minRetailPrice',
  weightedAvgCost: 'weightedAvgCost',
  reorderLevel: 'reorderLevel',
  isSerialized: 'isSerialized',
  taxClass: 'taxClass',
  imageUrl: 'imageUrl',
  isActive: 'isActive',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StockMovementScalarFieldEnum = {
  id: 'id',
  itemId: 'itemId',
  channelId: 'channelId',
  movementType: 'movementType',
  quantityChange: 'quantityChange',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  unitCostAtTime: 'unitCostAtTime',
  performedBy: 'performedBy',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.SerialScalarFieldEnum = {
  id: 'id',
  serialNo: 'serialNo',
  itemId: 'itemId',
  channelId: 'channelId',
  status: 'status',
  saleId: 'saleId',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SaleScalarFieldEnum = {
  id: 'id',
  receiptNo: 'receiptNo',
  channelId: 'channelId',
  sessionId: 'sessionId',
  customerId: 'customerId',
  saleType: 'saleType',
  totalAmount: 'totalAmount',
  discountAmount: 'discountAmount',
  taxAmount: 'taxAmount',
  netAmount: 'netAmount',
  taxSyncStatus: 'taxSyncStatus',
  offlineReceiptNo: 'offlineReceiptNo',
  dueDate: 'dueDate',
  notes: 'notes',
  performedBy: 'performedBy',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SaleItemScalarFieldEnum = {
  id: 'id',
  saleId: 'saleId',
  itemId: 'itemId',
  serialId: 'serialId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  minRetailPriceSnapshot: 'minRetailPriceSnapshot',
  costPriceSnapshot: 'costPriceSnapshot',
  markup: 'markup',
  lineTotal: 'lineTotal',
  discountAmount: 'discountAmount',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  saleId: 'saleId',
  method: 'method',
  amount: 'amount',
  reference: 'reference',
  status: 'status',
  idempotencyKey: 'idempotencyKey',
  createdAt: 'createdAt'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email',
  tier: 'tier',
  loyaltyPoints: 'loyaltyPoints',
  creditLimit: 'creditLimit',
  outstandingCredit: 'outstandingCredit',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoyaltyTransactionScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  type: 'type',
  points: 'points',
  referenceId: 'referenceId',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.CustomerPaymentScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  saleId: 'saleId',
  method: 'method',
  amount: 'amount',
  reference: 'reference',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.SalesSessionScalarFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  status: 'status',
  openingFloat: 'openingFloat',
  closingFloat: 'closingFloat',
  expectedFloat: 'expectedFloat',
  variance: 'variance',
  openedAt: 'openedAt',
  closedAt: 'closedAt',
  notes: 'notes'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  supplierId: 'supplierId',
  channelId: 'channelId',
  status: 'status',
  expectedDate: 'expectedDate',
  notes: 'notes',
  createdBy: 'createdBy',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LpoLineScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  itemId: 'itemId',
  quantity: 'quantity',
  unitCost: 'unitCost',
  receivedQty: 'receivedQty',
  status: 'status'
};

exports.Prisma.PurchaseScalarFieldEnum = {
  id: 'id',
  purchaseNo: 'purchaseNo',
  supplierId: 'supplierId',
  channelId: 'channelId',
  purchaseOrderId: 'purchaseOrderId',
  status: 'status',
  totalCost: 'totalCost',
  landedCostTotal: 'landedCostTotal',
  paymentMethod: 'paymentMethod',
  notes: 'notes',
  committedBy: 'committedBy',
  committedAt: 'committedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseLineScalarFieldEnum = {
  id: 'id',
  purchaseId: 'purchaseId',
  itemId: 'itemId',
  quantity: 'quantity',
  unitCost: 'unitCost',
  lineTotal: 'lineTotal'
};

exports.Prisma.LandedCostScalarFieldEnum = {
  id: 'id',
  purchaseId: 'purchaseId',
  description: 'description',
  amount: 'amount',
  allocationMethod: 'allocationMethod'
};

exports.Prisma.TransferScalarFieldEnum = {
  id: 'id',
  transferNo: 'transferNo',
  fromChannelId: 'fromChannelId',
  toChannelId: 'toChannelId',
  status: 'status',
  sentBy: 'sentBy',
  receivedBy: 'receivedBy',
  sentAt: 'sentAt',
  receivedAt: 'receivedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransferLineScalarFieldEnum = {
  id: 'id',
  transferId: 'transferId',
  itemId: 'itemId',
  sentQuantity: 'sentQuantity',
  receivedQuantity: 'receivedQuantity',
  disputeReason: 'disputeReason'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  description: 'description',
  amount: 'amount',
  category: 'category',
  receiptRef: 'receiptRef',
  notes: 'notes',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.BankDepositScalarFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  amount: 'amount',
  reference: 'reference',
  depositedBy: 'depositedBy',
  depositedAt: 'depositedAt',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.StaffProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobTitle: 'jobTitle',
  jobLevelId: 'jobLevelId',
  grossSalary: 'grossSalary',
  bankName: 'bankName',
  bankAccount: 'bankAccount',
  taxPin: 'taxPin',
  hireDate: 'hireDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeductionRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  rate: 'rate',
  isPreTaxDeduction: 'isPreTaxDeduction',
  minimumFloorAmount: 'minimumFloorAmount',
  maximumCapAmount: 'maximumCapAmount',
  calculationSequence: 'calculationSequence',
  isEmployerContribution: 'isEmployerContribution',
  isMandatory: 'isMandatory',
  appliesToJobLevelId: 'appliesToJobLevelId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeductionBracketScalarFieldEnum = {
  id: 'id',
  ruleId: 'ruleId',
  incomeFrom: 'incomeFrom',
  incomeTo: 'incomeTo',
  ratePercentage: 'ratePercentage',
  fixedDeduction: 'fixedDeduction',
  effectiveStartDate: 'effectiveStartDate',
  effectiveEndDate: 'effectiveEndDate'
};

exports.Prisma.AllowanceRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  amount: 'amount',
  appliesToJobLevelId: 'appliesToJobLevelId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalaryRunScalarFieldEnum = {
  id: 'id',
  month: 'month',
  year: 'year',
  channelId: 'channelId',
  status: 'status',
  runBy: 'runBy',
  runAt: 'runAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalaryRunLineScalarFieldEnum = {
  id: 'id',
  salaryRunId: 'salaryRunId',
  staffProfileId: 'staffProfileId',
  grossSalary: 'grossSalary',
  allowancesTotal: 'allowancesTotal',
  deductionsTotal: 'deductionsTotal',
  netSalary: 'netSalary',
  employerCost: 'employerCost',
  breakdown: 'breakdown',
  createdAt: 'createdAt'
};

exports.Prisma.TaxConnectorConfigScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  baseUrl: 'baseUrl',
  apiKey: 'apiKey',
  apiSecret: 'apiSecret',
  isActive: 'isActive',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  content: 'content',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  type: 'type',
  message: 'message',
  channelId: 'channelId',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.IdempotencyRecordScalarFieldEnum = {
  key: 'key',
  responseBody: 'responseBody',
  statusCode: 'statusCode',
  createdAt: 'createdAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  value: 'value',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.Inventory_balancesScalarFieldEnum = {
  itemId: 'itemId',
  channelId: 'channelId',
  availableQty: 'availableQty',
  incomingQty: 'incomingQty',
  lastMovementAt: 'lastMovementAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  actorId: 'actorId',
  actorRole: 'actorRole',
  approverId: 'approverId',
  channelId: 'channelId',
  targetType: 'targetType',
  targetId: 'targetId',
  oldValues: 'oldValues',
  newValues: 'newValues',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.ChannelOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  address: 'address',
  phone: 'phone',
  email: 'email'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  passwordHash: 'passwordHash',
  mfaSecret: 'mfaSecret',
  channelId: 'channelId'
};

exports.Prisma.AccountOrderByRelevanceFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  parentId: 'parentId',
  channelId: 'channelId'
};

exports.Prisma.JournalEntryOrderByRelevanceFieldEnum = {
  id: 'id',
  description: 'description',
  referenceId: 'referenceId',
  channelId: 'channelId',
  postedBy: 'postedBy'
};

exports.Prisma.LedgerLineOrderByRelevanceFieldEnum = {
  id: 'id',
  journalEntryId: 'journalEntryId',
  accountId: 'accountId',
  memo: 'memo'
};

exports.Prisma.BrandOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  parentId: 'parentId'
};

exports.Prisma.SupplierOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  contactName: 'contactName',
  phone: 'phone',
  email: 'email',
  address: 'address',
  taxPin: 'taxPin',
  paymentTerms: 'paymentTerms'
};

exports.Prisma.ItemOrderByRelevanceFieldEnum = {
  id: 'id',
  sku: 'sku',
  barcode: 'barcode',
  name: 'name',
  description: 'description',
  categoryId: 'categoryId',
  brandId: 'brandId',
  supplierId: 'supplierId',
  unitOfMeasure: 'unitOfMeasure',
  imageUrl: 'imageUrl'
};

exports.Prisma.StockMovementOrderByRelevanceFieldEnum = {
  id: 'id',
  itemId: 'itemId',
  channelId: 'channelId',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  performedBy: 'performedBy',
  notes: 'notes'
};

exports.Prisma.SerialOrderByRelevanceFieldEnum = {
  id: 'id',
  serialNo: 'serialNo',
  itemId: 'itemId',
  channelId: 'channelId',
  saleId: 'saleId'
};

exports.Prisma.SaleOrderByRelevanceFieldEnum = {
  id: 'id',
  receiptNo: 'receiptNo',
  channelId: 'channelId',
  sessionId: 'sessionId',
  customerId: 'customerId',
  offlineReceiptNo: 'offlineReceiptNo',
  notes: 'notes',
  performedBy: 'performedBy'
};

exports.Prisma.SaleItemOrderByRelevanceFieldEnum = {
  id: 'id',
  saleId: 'saleId',
  itemId: 'itemId',
  serialId: 'serialId'
};

exports.Prisma.PaymentOrderByRelevanceFieldEnum = {
  id: 'id',
  saleId: 'saleId',
  reference: 'reference',
  idempotencyKey: 'idempotencyKey'
};

exports.Prisma.CustomerOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email'
};

exports.Prisma.LoyaltyTransactionOrderByRelevanceFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  referenceId: 'referenceId',
  notes: 'notes'
};

exports.Prisma.CustomerPaymentOrderByRelevanceFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  saleId: 'saleId',
  reference: 'reference',
  notes: 'notes'
};

exports.Prisma.SalesSessionOrderByRelevanceFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  notes: 'notes'
};

exports.Prisma.PurchaseOrderOrderByRelevanceFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  supplierId: 'supplierId',
  channelId: 'channelId',
  notes: 'notes',
  createdBy: 'createdBy'
};

exports.Prisma.LpoLineOrderByRelevanceFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  itemId: 'itemId'
};

exports.Prisma.PurchaseOrderByRelevanceFieldEnum = {
  id: 'id',
  purchaseNo: 'purchaseNo',
  supplierId: 'supplierId',
  channelId: 'channelId',
  purchaseOrderId: 'purchaseOrderId',
  notes: 'notes',
  committedBy: 'committedBy'
};

exports.Prisma.PurchaseLineOrderByRelevanceFieldEnum = {
  id: 'id',
  purchaseId: 'purchaseId',
  itemId: 'itemId'
};

exports.Prisma.LandedCostOrderByRelevanceFieldEnum = {
  id: 'id',
  purchaseId: 'purchaseId',
  description: 'description'
};

exports.Prisma.TransferOrderByRelevanceFieldEnum = {
  id: 'id',
  transferNo: 'transferNo',
  fromChannelId: 'fromChannelId',
  toChannelId: 'toChannelId',
  sentBy: 'sentBy',
  receivedBy: 'receivedBy',
  notes: 'notes'
};

exports.Prisma.TransferLineOrderByRelevanceFieldEnum = {
  id: 'id',
  transferId: 'transferId',
  itemId: 'itemId',
  disputeReason: 'disputeReason'
};

exports.Prisma.ExpenseOrderByRelevanceFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  description: 'description',
  category: 'category',
  receiptRef: 'receiptRef',
  notes: 'notes',
  createdBy: 'createdBy'
};

exports.Prisma.BankDepositOrderByRelevanceFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  reference: 'reference',
  depositedBy: 'depositedBy',
  notes: 'notes'
};

exports.Prisma.StaffProfileOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  jobTitle: 'jobTitle',
  jobLevelId: 'jobLevelId',
  bankName: 'bankName',
  bankAccount: 'bankAccount',
  taxPin: 'taxPin'
};

exports.Prisma.DeductionRuleOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  appliesToJobLevelId: 'appliesToJobLevelId'
};

exports.Prisma.DeductionBracketOrderByRelevanceFieldEnum = {
  id: 'id',
  ruleId: 'ruleId'
};

exports.Prisma.AllowanceRuleOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  appliesToJobLevelId: 'appliesToJobLevelId'
};

exports.Prisma.SalaryRunOrderByRelevanceFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  runBy: 'runBy'
};

exports.Prisma.SalaryRunLineOrderByRelevanceFieldEnum = {
  id: 'id',
  salaryRunId: 'salaryRunId',
  staffProfileId: 'staffProfileId'
};

exports.Prisma.TaxConnectorConfigOrderByRelevanceFieldEnum = {
  id: 'id',
  provider: 'provider',
  baseUrl: 'baseUrl',
  apiKey: 'apiKey',
  apiSecret: 'apiSecret'
};

exports.Prisma.DocumentTemplateOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  content: 'content'
};

exports.Prisma.NotificationOrderByRelevanceFieldEnum = {
  id: 'id',
  message: 'message',
  channelId: 'channelId'
};

exports.Prisma.IdempotencyRecordOrderByRelevanceFieldEnum = {
  key: 'key'
};

exports.Prisma.SettingOrderByRelevanceFieldEnum = {
  id: 'id',
  updatedBy: 'updatedBy'
};

exports.Prisma.inventory_balancesOrderByRelevanceFieldEnum = {
  itemId: 'itemId',
  channelId: 'channelId'
};

exports.Prisma.AuditLogOrderByRelevanceFieldEnum = {
  id: 'id',
  action: 'action',
  actorId: 'actorId',
  actorRole: 'actorRole',
  approverId: 'approverId',
  channelId: 'channelId',
  targetType: 'targetType',
  targetId: 'targetId',
  ipAddress: 'ipAddress'
};
exports.ChannelType = exports.$Enums.ChannelType = {
  RETAIL_SHOP: 'RETAIL_SHOP',
  WHOLESALE_SHOP: 'WHOLESALE_SHOP',
  WAREHOUSE: 'WAREHOUSE',
  ONLINE: 'ONLINE'
};

exports.UserRole = exports.$Enums.UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  STOREKEEPER: 'STOREKEEPER',
  PROMOTER: 'PROMOTER'
};

exports.AccountType = exports.$Enums.AccountType = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
};

exports.JournalRefType = exports.$Enums.JournalRefType = {
  SALE: 'SALE',
  PURCHASE: 'PURCHASE',
  EXPENSE: 'EXPENSE',
  TRANSFER_DISPUTE: 'TRANSFER_DISPUTE',
  PAYROLL: 'PAYROLL',
  CREDIT_NOTE: 'CREDIT_NOTE',
  BANK_DEPOSIT: 'BANK_DEPOSIT',
  ADJUSTMENT: 'ADJUSTMENT'
};

exports.TaxClass = exports.$Enums.TaxClass = {
  STANDARD: 'STANDARD',
  ZERO_RATED: 'ZERO_RATED',
  EXEMPT: 'EXEMPT'
};

exports.MovementType = exports.$Enums.MovementType = {
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  TRANSFER_IN: 'TRANSFER_IN',
  TRANSFER_OUT: 'TRANSFER_OUT',
  ADJUSTMENT_IN: 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
  RETURN: 'RETURN',
  SWAP: 'SWAP',
  WRITE_OFF: 'WRITE_OFF',
  TRANSFER_IN_PENDING: 'TRANSFER_IN_PENDING'
};

exports.SerialStatus = exports.$Enums.SerialStatus = {
  IN_STOCK: 'IN_STOCK',
  SOLD: 'SOLD',
  TRANSFERRED: 'TRANSFERRED',
  RETURNED: 'RETURNED',
  SWAPPED_OUT: 'SWAPPED_OUT',
  WRITTEN_OFF: 'WRITTEN_OFF'
};

exports.SaleType = exports.$Enums.SaleType = {
  WHOLESALE: 'WHOLESALE',
  RETAIL: 'RETAIL',
  CREDIT: 'CREDIT',
  PRE_ORDER: 'PRE_ORDER',
  LAYAWAY: 'LAYAWAY'
};

exports.TaxSyncStatus = exports.$Enums.TaxSyncStatus = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  QUEUED: 'QUEUED',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  MOBILE_MONEY: 'MOBILE_MONEY',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  LOYALTY_POINTS: 'LOYALTY_POINTS',
  CREDIT: 'CREDIT'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED'
};

exports.CustomerTier = exports.$Enums.CustomerTier = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD'
};

exports.LoyaltyTxType = exports.$Enums.LoyaltyTxType = {
  EARN: 'EARN',
  REDEEM: 'REDEEM',
  EXPIRE: 'EXPIRE',
  ADJUST: 'ADJUST'
};

exports.SessionStatus = exports.$Enums.SessionStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
};

exports.LpoStatus = exports.$Enums.LpoStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED'
};

exports.LpoLineStatus = exports.$Enums.LpoLineStatus = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  FULFILLED: 'FULFILLED'
};

exports.PurchaseStatus = exports.$Enums.PurchaseStatus = {
  DRAFT: 'DRAFT',
  COMMITTED: 'COMMITTED'
};

exports.ExpenseAllocationMethod = exports.$Enums.ExpenseAllocationMethod = {
  BY_VALUE: 'BY_VALUE',
  BY_QUANTITY: 'BY_QUANTITY'
};

exports.TransferStatus = exports.$Enums.TransferStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  AWAITING_RECEIVER: 'AWAITING_RECEIVER',
  RECEIVED: 'RECEIVED',
  DISPUTED: 'DISPUTED',
  REJECTED: 'REJECTED'
};

exports.DeductionType = exports.$Enums.DeductionType = {
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  PERCENTAGE_OF_GROSS: 'PERCENTAGE_OF_GROSS',
  BRACKET_TABLE: 'BRACKET_TABLE',
  PERCENTAGE_OF_TAXABLE: 'PERCENTAGE_OF_TAXABLE'
};

exports.SalaryRunStatus = exports.$Enums.SalaryRunStatus = {
  DRAFT: 'DRAFT',
  FINALIZED: 'FINALIZED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  LOW_STOCK: 'LOW_STOCK',
  NEGATIVE_STOCK: 'NEGATIVE_STOCK',
  TRANSFER_RECEIVED: 'TRANSFER_RECEIVED',
  TRANSFER_DISPUTED: 'TRANSFER_DISPUTED',
  CREDIT_DUE: 'CREDIT_DUE',
  SYSTEM: 'SYSTEM'
};

exports.Prisma.ModelName = {
  Channel: 'Channel',
  User: 'User',
  Account: 'Account',
  JournalEntry: 'JournalEntry',
  LedgerLine: 'LedgerLine',
  Brand: 'Brand',
  Category: 'Category',
  Supplier: 'Supplier',
  Item: 'Item',
  StockMovement: 'StockMovement',
  Serial: 'Serial',
  Sale: 'Sale',
  SaleItem: 'SaleItem',
  Payment: 'Payment',
  Customer: 'Customer',
  LoyaltyTransaction: 'LoyaltyTransaction',
  CustomerPayment: 'CustomerPayment',
  SalesSession: 'SalesSession',
  PurchaseOrder: 'PurchaseOrder',
  LpoLine: 'LpoLine',
  Purchase: 'Purchase',
  PurchaseLine: 'PurchaseLine',
  LandedCost: 'LandedCost',
  Transfer: 'Transfer',
  TransferLine: 'TransferLine',
  Expense: 'Expense',
  BankDeposit: 'BankDeposit',
  StaffProfile: 'StaffProfile',
  DeductionRule: 'DeductionRule',
  DeductionBracket: 'DeductionBracket',
  AllowanceRule: 'AllowanceRule',
  SalaryRun: 'SalaryRun',
  SalaryRunLine: 'SalaryRunLine',
  TaxConnectorConfig: 'TaxConnectorConfig',
  DocumentTemplate: 'DocumentTemplate',
  Notification: 'Notification',
  IdempotencyRecord: 'IdempotencyRecord',
  Setting: 'Setting',
  inventory_balances: 'inventory_balances',
  AuditLog: 'AuditLog'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "fullTextSearch"
    ],
    "sourceFilePath": "C:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"fullTextSearch\"]\n  output          = \"../src/generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Channel {\n  id                 String               @id @default(uuid())\n  name               String\n  code               String               @unique\n  type               ChannelType\n  isMainWarehouse    Boolean              @default(false)\n  featureFlags       Json                 @default(\"{}\")\n  address            String?\n  phone              String?\n  email              String?\n  deletedAt          DateTime?\n  createdAt          DateTime             @default(now())\n  updatedAt          DateTime             @updatedAt\n  accounts           Account[]\n  bankDeposits       BankDeposit[]\n  expenses           Expense[]\n  inventory_balances inventory_balances[]\n  journalEntries     JournalEntry[]\n  notifications      Notification[]\n  purchaseOrders     PurchaseOrder[]\n  purchases          Purchase[]\n  sales              Sale[]\n  sessions           SalesSession[]\n  serials            Serial[]\n  stockMovements     StockMovement[]\n  transfersFrom      Transfer[]           @relation(\"FromChannel\")\n  transfersTo        Transfer[]           @relation(\"ToChannel\")\n  users              User[]\n\n  @@map(\"channels\")\n}\n\nmodel User {\n  id           String         @id @default(uuid())\n  username     String         @unique\n  email        String         @unique\n  passwordHash String\n  role         UserRole\n  mfaSecret    String?\n  mfaEnabled   Boolean        @default(false)\n  channelId    String?\n  isActive     Boolean        @default(true)\n  lastLoginAt  DateTime?\n  deletedAt    DateTime?\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  sessions     SalesSession[]\n  staffProfile StaffProfile?\n  channel      Channel?       @relation(fields: [channelId], references: [id])\n\n  @@index([channelId])\n  @@index([role])\n  @@map(\"users\")\n}\n\nmodel Account {\n  id          String       @id @default(uuid())\n  code        String       @unique\n  name        String\n  type        AccountType\n  parentId    String?\n  isSystem    Boolean      @default(false)\n  channelId   String?\n  isActive    Boolean      @default(true)\n  createdAt   DateTime     @default(now())\n  channel     Channel?     @relation(fields: [channelId], references: [id])\n  parent      Account?     @relation(\"AccountHierarchy\", fields: [parentId], references: [id])\n  children    Account[]    @relation(\"AccountHierarchy\")\n  ledgerLines LedgerLine[]\n\n  @@map(\"accounts\")\n}\n\nmodel JournalEntry {\n  id            String         @id @default(uuid())\n  description   String\n  referenceId   String\n  referenceType JournalRefType\n  channelId     String\n  postedAt      DateTime       @default(now())\n  postedBy      String\n  channel       Channel        @relation(fields: [channelId], references: [id])\n  lines         LedgerLine[]\n\n  @@index([referenceId])\n  @@index([channelId, postedAt])\n  @@map(\"journal_entries\")\n}\n\nmodel LedgerLine {\n  id             String       @id @default(uuid())\n  journalEntryId String\n  accountId      String\n  debitAmount    Decimal      @default(0) @db.Decimal(14, 4)\n  creditAmount   Decimal      @default(0) @db.Decimal(14, 4)\n  memo           String?\n  createdAt      DateTime     @default(now())\n  account        Account      @relation(fields: [accountId], references: [id])\n  journalEntry   JournalEntry @relation(fields: [journalEntryId], references: [id])\n\n  @@index([journalEntryId])\n  @@index([accountId])\n  @@map(\"ledger_lines\")\n}\n\nmodel Brand {\n  id        String    @id @default(uuid())\n  name      String\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  items     Item[]\n\n  @@map(\"brands\")\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String\n  parentId  String?\n  deletedAt DateTime?\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  parent    Category?  @relation(\"CategoryHierarchy\", fields: [parentId], references: [id])\n  children  Category[] @relation(\"CategoryHierarchy\")\n  items     Item[]\n\n  @@map(\"categories\")\n}\n\nmodel Supplier {\n  id             String          @id @default(uuid())\n  name           String\n  contactName    String?\n  phone          String?\n  email          String?\n  address        String?\n  taxPin         String?\n  paymentTerms   String?\n  deletedAt      DateTime?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  items          Item[]\n  purchaseOrders PurchaseOrder[]\n  purchases      Purchase[]\n\n  @@map(\"suppliers\")\n}\n\nmodel Item {\n  id                 String               @id @default(uuid())\n  sku                String\n  barcode            String?\n  name               String\n  description        String?\n  categoryId         String?\n  brandId            String?\n  supplierId         String?\n  unitOfMeasure      String               @default(\"PCS\")\n  retailPrice        Decimal              @db.Decimal(12, 4)\n  wholesalePrice     Decimal              @db.Decimal(12, 4)\n  minRetailPrice     Decimal              @db.Decimal(12, 4)\n  weightedAvgCost    Decimal              @default(0) @db.Decimal(12, 4)\n  reorderLevel       Int                  @default(10)\n  isSerialized       Boolean              @default(false)\n  taxClass           TaxClass             @default(STANDARD)\n  imageUrl           String?\n  isActive           Boolean              @default(true)\n  deletedAt          DateTime?\n  createdAt          DateTime             @default(now())\n  updatedAt          DateTime             @updatedAt\n  inventory_balances inventory_balances[]\n  brand              Brand?               @relation(fields: [brandId], references: [id])\n  category           Category?            @relation(fields: [categoryId], references: [id])\n  supplier           Supplier?            @relation(fields: [supplierId], references: [id])\n  lpoLines           LpoLine[]\n  purchaseLines      PurchaseLine[]\n  saleItems          SaleItem[]\n  serials            Serial[]\n  stockMovements     StockMovement[]\n  transferLines      TransferLine[]\n\n  @@index([categoryId])\n  @@index([brandId])\n  @@index([supplierId])\n  @@map(\"items\")\n}\n\nmodel StockMovement {\n  id             String       @id @default(uuid())\n  itemId         String\n  channelId      String\n  movementType   MovementType\n  quantityChange Int\n  referenceId    String\n  referenceType  String\n  unitCostAtTime Decimal      @default(0) @db.Decimal(12, 4)\n  performedBy    String\n  notes          String?\n  createdAt      DateTime     @default(now())\n  channel        Channel      @relation(fields: [channelId], references: [id])\n  item           Item         @relation(fields: [itemId], references: [id])\n\n  @@index([itemId, channelId])\n  @@index([createdAt])\n  @@map(\"stock_movements\")\n}\n\nmodel Serial {\n  id        String       @id @default(uuid())\n  serialNo  String\n  itemId    String\n  channelId String\n  status    SerialStatus @default(IN_STOCK)\n  saleId    String?\n  deletedAt DateTime?\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  channel   Channel      @relation(fields: [channelId], references: [id])\n  item      Item         @relation(fields: [itemId], references: [id])\n  sale      Sale?        @relation(fields: [saleId], references: [id])\n\n  @@index([itemId])\n  @@index([channelId])\n  @@map(\"serials\")\n}\n\nmodel Sale {\n  id               String        @id @default(uuid())\n  receiptNo        String        @unique\n  channelId        String\n  sessionId        String?\n  customerId       String?\n  saleType         SaleType      @default(RETAIL)\n  totalAmount      Decimal       @db.Decimal(14, 4)\n  discountAmount   Decimal       @default(0) @db.Decimal(14, 4)\n  taxAmount        Decimal       @default(0) @db.Decimal(14, 4)\n  netAmount        Decimal       @db.Decimal(14, 4)\n  taxSyncStatus    TaxSyncStatus @default(NOT_APPLICABLE)\n  offlineReceiptNo String?\n  dueDate          DateTime?     @db.Timestamptz(6)\n  notes            String?\n  performedBy      String\n  deletedAt        DateTime?\n  createdAt        DateTime      @default(now())\n  updatedAt        DateTime      @updatedAt\n  payments         Payment[]\n  items            SaleItem[]\n  channel          Channel       @relation(fields: [channelId], references: [id])\n  customer         Customer?     @relation(fields: [customerId], references: [id])\n  session          SalesSession? @relation(fields: [sessionId], references: [id])\n  serials          Serial[]\n\n  @@index([channelId, createdAt])\n  @@index([customerId])\n  @@index([sessionId])\n  @@map(\"sales\")\n}\n\nmodel SaleItem {\n  id                     String   @id @default(uuid())\n  saleId                 String\n  itemId                 String\n  serialId               String?\n  quantity               Int\n  unitPrice              Decimal  @db.Decimal(12, 4)\n  minRetailPriceSnapshot Decimal  @db.Decimal(12, 4)\n  costPriceSnapshot      Decimal  @db.Decimal(12, 4)\n  markup                 Decimal  @db.Decimal(12, 4)\n  lineTotal              Decimal  @db.Decimal(14, 4)\n  discountAmount         Decimal  @default(0) @db.Decimal(14, 4)\n  createdAt              DateTime @default(now())\n  item                   Item     @relation(fields: [itemId], references: [id])\n  sale                   Sale     @relation(fields: [saleId], references: [id])\n\n  @@index([saleId])\n  @@index([itemId])\n  @@map(\"sale_items\")\n}\n\nmodel Payment {\n  id             String        @id @default(uuid())\n  saleId         String\n  method         PaymentMethod\n  amount         Decimal       @db.Decimal(14, 4)\n  reference      String?\n  status         PaymentStatus @default(CONFIRMED)\n  idempotencyKey String?\n  createdAt      DateTime      @default(now())\n  sale           Sale          @relation(fields: [saleId], references: [id])\n\n  @@index([saleId])\n  @@map(\"payments\")\n}\n\nmodel Customer {\n  id                  String               @id @default(uuid())\n  name                String\n  phone               String?\n  email               String?\n  tier                CustomerTier         @default(BRONZE)\n  loyaltyPoints       Int                  @default(0)\n  creditLimit         Decimal              @default(0) @db.Decimal(14, 4)\n  outstandingCredit   Decimal              @default(0) @db.Decimal(14, 4)\n  deletedAt           DateTime?\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  customerPayments    CustomerPayment[]\n  loyaltyTransactions LoyaltyTransaction[]\n  sales               Sale[]\n\n  @@map(\"customers\")\n}\n\nmodel LoyaltyTransaction {\n  id          String        @id @default(uuid())\n  customerId  String\n  type        LoyaltyTxType\n  points      Int\n  referenceId String?\n  notes       String?\n  createdAt   DateTime      @default(now())\n  customer    Customer      @relation(fields: [customerId], references: [id])\n\n  @@index([customerId])\n  @@map(\"loyalty_transactions\")\n}\n\nmodel CustomerPayment {\n  id         String        @id @default(uuid())\n  customerId String\n  saleId     String?\n  method     PaymentMethod\n  amount     Decimal       @db.Decimal(14, 4)\n  reference  String?\n  notes      String?\n  createdAt  DateTime      @default(now())\n  customer   Customer      @relation(fields: [customerId], references: [id])\n\n  @@index([customerId])\n  @@map(\"customer_payments\")\n}\n\nmodel SalesSession {\n  id            String        @id @default(uuid())\n  channelId     String\n  userId        String\n  status        SessionStatus @default(OPEN)\n  openingFloat  Decimal       @db.Decimal(14, 4)\n  closingFloat  Decimal?      @db.Decimal(14, 4)\n  expectedFloat Decimal?      @db.Decimal(14, 4)\n  variance      Decimal?      @db.Decimal(14, 4)\n  openedAt      DateTime      @default(now())\n  closedAt      DateTime?\n  notes         String?\n  sales         Sale[]\n  channel       Channel       @relation(fields: [channelId], references: [id])\n  user          User          @relation(fields: [userId], references: [id])\n\n  @@index([channelId])\n  @@index([userId])\n  @@map(\"sales_sessions\")\n}\n\nmodel PurchaseOrder {\n  id           String     @id @default(uuid())\n  orderNo      String     @unique\n  supplierId   String\n  channelId    String\n  status       LpoStatus  @default(DRAFT)\n  expectedDate DateTime?\n  notes        String?\n  createdBy    String\n  deletedAt    DateTime?\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n  lines        LpoLine[]\n  channel      Channel    @relation(fields: [channelId], references: [id])\n  supplier     Supplier   @relation(fields: [supplierId], references: [id])\n  purchases    Purchase[]\n\n  @@index([supplierId])\n  @@index([channelId])\n  @@map(\"purchase_orders\")\n}\n\nmodel LpoLine {\n  id              String        @id @default(uuid())\n  purchaseOrderId String\n  itemId          String\n  quantity        Int\n  unitCost        Decimal       @db.Decimal(12, 4)\n  receivedQty     Int           @default(0)\n  status          LpoLineStatus @default(PENDING)\n  item            Item          @relation(fields: [itemId], references: [id])\n  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])\n\n  @@index([purchaseOrderId])\n  @@map(\"lpo_lines\")\n}\n\nmodel Purchase {\n  id              String         @id @default(uuid())\n  purchaseNo      String         @unique\n  supplierId      String\n  channelId       String\n  purchaseOrderId String?\n  status          PurchaseStatus @default(DRAFT)\n  totalCost       Decimal        @default(0) @db.Decimal(14, 4)\n  landedCostTotal Decimal        @default(0) @db.Decimal(14, 4)\n  paymentMethod   PaymentMethod?\n  notes           String?\n  committedBy     String?\n  committedAt     DateTime?\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n  landedCosts     LandedCost[]\n  lines           PurchaseLine[]\n  channel         Channel        @relation(fields: [channelId], references: [id])\n  purchaseOrder   PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])\n  supplier        Supplier       @relation(fields: [supplierId], references: [id])\n\n  @@index([supplierId])\n  @@index([channelId])\n  @@map(\"purchases\")\n}\n\nmodel PurchaseLine {\n  id         String   @id @default(uuid())\n  purchaseId String\n  itemId     String\n  quantity   Int\n  unitCost   Decimal  @db.Decimal(12, 4)\n  lineTotal  Decimal  @db.Decimal(14, 4)\n  item       Item     @relation(fields: [itemId], references: [id])\n  purchase   Purchase @relation(fields: [purchaseId], references: [id])\n\n  @@index([purchaseId])\n  @@map(\"purchase_lines\")\n}\n\nmodel LandedCost {\n  id               String                  @id @default(uuid())\n  purchaseId       String\n  description      String\n  amount           Decimal                 @db.Decimal(14, 4)\n  allocationMethod ExpenseAllocationMethod @default(BY_VALUE)\n  purchase         Purchase                @relation(fields: [purchaseId], references: [id])\n\n  @@index([purchaseId])\n  @@map(\"landed_costs\")\n}\n\nmodel Transfer {\n  id            String         @id @default(uuid())\n  transferNo    String         @unique\n  fromChannelId String\n  toChannelId   String\n  status        TransferStatus @default(DRAFT)\n  sentBy        String?\n  receivedBy    String?\n  sentAt        DateTime?\n  receivedAt    DateTime?\n  notes         String?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  lines         TransferLine[]\n  fromChannel   Channel        @relation(\"FromChannel\", fields: [fromChannelId], references: [id])\n  toChannel     Channel        @relation(\"ToChannel\", fields: [toChannelId], references: [id])\n\n  @@index([fromChannelId])\n  @@index([toChannelId])\n  @@map(\"transfers\")\n}\n\nmodel TransferLine {\n  id               String   @id @default(uuid())\n  transferId       String\n  itemId           String\n  sentQuantity     Int\n  receivedQuantity Int?\n  disputeReason    String?\n  item             Item     @relation(fields: [itemId], references: [id])\n  transfer         Transfer @relation(fields: [transferId], references: [id])\n\n  @@index([transferId])\n  @@map(\"transfer_lines\")\n}\n\nmodel Expense {\n  id          String   @id @default(uuid())\n  channelId   String\n  description String\n  amount      Decimal  @db.Decimal(14, 4)\n  category    String?\n  receiptRef  String?\n  notes       String?\n  createdBy   String\n  createdAt   DateTime @default(now())\n  channel     Channel  @relation(fields: [channelId], references: [id])\n\n  @@index([channelId])\n  @@index([createdAt])\n  @@map(\"expenses\")\n}\n\nmodel BankDeposit {\n  id          String   @id @default(uuid())\n  channelId   String\n  amount      Decimal  @db.Decimal(14, 4)\n  reference   String?\n  depositedBy String\n  depositedAt DateTime @default(now())\n  notes       String?\n  createdAt   DateTime @default(now())\n  channel     Channel  @relation(fields: [channelId], references: [id])\n\n  @@index([channelId])\n  @@map(\"bank_deposits\")\n}\n\nmodel StaffProfile {\n  id             String          @id @default(uuid())\n  userId         String          @unique\n  jobTitle       String\n  jobLevelId     String?\n  grossSalary    Decimal         @db.Decimal(12, 2)\n  bankName       String?\n  bankAccount    String?\n  taxPin         String?\n  hireDate       DateTime        @default(now())\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  salaryRunLines SalaryRunLine[]\n  user           User            @relation(fields: [userId], references: [id])\n\n  @@map(\"staff_profiles\")\n}\n\nmodel DeductionRule {\n  id                     String             @id @default(uuid())\n  name                   String\n  type                   DeductionType\n  rate                   Decimal?           @db.Decimal(8, 4)\n  isPreTaxDeduction      Boolean            @default(false)\n  minimumFloorAmount     Decimal?           @db.Decimal(12, 2)\n  maximumCapAmount       Decimal?           @db.Decimal(12, 2)\n  calculationSequence    Int                @default(100)\n  isEmployerContribution Boolean            @default(false)\n  isMandatory            Boolean            @default(true)\n  appliesToJobLevelId    String?\n  isActive               Boolean            @default(true)\n  createdAt              DateTime           @default(now())\n  updatedAt              DateTime           @updatedAt\n  brackets               DeductionBracket[]\n\n  @@map(\"deduction_rules\")\n}\n\nmodel DeductionBracket {\n  id                 String        @id @default(uuid())\n  ruleId             String\n  incomeFrom         Decimal       @db.Decimal(12, 2)\n  incomeTo           Decimal?      @db.Decimal(12, 2)\n  ratePercentage     Decimal       @db.Decimal(8, 4)\n  fixedDeduction     Decimal       @default(0) @db.Decimal(12, 2)\n  effectiveStartDate DateTime?\n  effectiveEndDate   DateTime?\n  rule               DeductionRule @relation(fields: [ruleId], references: [id])\n\n  @@index([ruleId])\n  @@map(\"deduction_brackets\")\n}\n\nmodel AllowanceRule {\n  id                  String        @id @default(uuid())\n  name                String\n  type                DeductionType\n  amount              Decimal       @db.Decimal(12, 4)\n  appliesToJobLevelId String?\n  isActive            Boolean       @default(true)\n  createdAt           DateTime      @default(now())\n  updatedAt           DateTime      @updatedAt\n\n  @@map(\"allowance_rules\")\n}\n\nmodel SalaryRun {\n  id        String          @id @default(uuid())\n  month     Int\n  year      Int\n  channelId String?\n  status    SalaryRunStatus @default(DRAFT)\n  runBy     String\n  runAt     DateTime        @default(now())\n  createdAt DateTime        @default(now())\n  updatedAt DateTime        @updatedAt\n  lines     SalaryRunLine[]\n\n  @@unique([month, year, channelId])\n  @@map(\"salary_runs\")\n}\n\nmodel SalaryRunLine {\n  id              String       @id @default(uuid())\n  salaryRunId     String\n  staffProfileId  String\n  grossSalary     Decimal      @db.Decimal(12, 2)\n  allowancesTotal Decimal      @default(0) @db.Decimal(12, 2)\n  deductionsTotal Decimal      @default(0) @db.Decimal(12, 2)\n  netSalary       Decimal      @db.Decimal(12, 2)\n  employerCost    Decimal      @default(0) @db.Decimal(12, 2)\n  breakdown       Json\n  createdAt       DateTime     @default(now())\n  salaryRun       SalaryRun    @relation(fields: [salaryRunId], references: [id])\n  staffProfile    StaffProfile @relation(fields: [staffProfileId], references: [id])\n\n  @@index([salaryRunId])\n  @@map(\"salary_run_lines\")\n}\n\nmodel TaxConnectorConfig {\n  id        String   @id @default(uuid())\n  provider  String\n  baseUrl   String\n  apiKey    String\n  apiSecret String?\n  isActive  Boolean  @default(false)\n  settings  Json     @default(\"{}\")\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map(\"tax_connector_configs\")\n}\n\nmodel DocumentTemplate {\n  id        String   @id @default(uuid())\n  name      String\n  type      String\n  content   String\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map(\"document_templates\")\n}\n\nmodel Notification {\n  id        String           @id @default(uuid())\n  type      NotificationType\n  message   String\n  channelId String?\n  isRead    Boolean          @default(false)\n  createdAt DateTime         @default(now())\n  channel   Channel?         @relation(fields: [channelId], references: [id])\n\n  @@index([channelId])\n  @@map(\"notifications\")\n}\n\nmodel IdempotencyRecord {\n  key          String   @id\n  responseBody Json\n  statusCode   Int\n  createdAt    DateTime @default(now())\n\n  @@map(\"idempotency_records\")\n}\n\nmodel Setting {\n  id        String   @id\n  value     Json\n  updatedAt DateTime @updatedAt\n  updatedBy String?\n\n  @@map(\"settings\")\n}\n\nmodel inventory_balances {\n  itemId         String\n  channelId      String\n  availableQty   Int      @default(0)\n  incomingQty    Int      @default(0)\n  lastMovementAt DateTime @default(now()) @db.Timestamptz(6)\n  channels       Channel  @relation(fields: [channelId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n  items          Item     @relation(fields: [itemId], references: [id], onDelete: NoAction, onUpdate: NoAction)\n\n  @@id([itemId, channelId])\n}\n\nenum ChannelType {\n  RETAIL_SHOP\n  WHOLESALE_SHOP\n  WAREHOUSE\n  ONLINE\n}\n\nenum UserRole {\n  SUPER_ADMIN\n  ADMIN\n  MANAGER\n  CASHIER\n  STOREKEEPER\n  PROMOTER\n}\n\nenum MovementType {\n  PURCHASE\n  SALE\n  TRANSFER_IN\n  TRANSFER_OUT\n  ADJUSTMENT_IN\n  ADJUSTMENT_OUT\n  RETURN\n  SWAP\n  WRITE_OFF\n  TRANSFER_IN_PENDING\n}\n\nenum SaleType {\n  WHOLESALE\n  RETAIL\n  CREDIT\n  PRE_ORDER\n  LAYAWAY\n}\n\nenum PaymentStatus {\n  PENDING\n  CONFIRMED\n  FAILED\n}\n\nenum LpoStatus {\n  DRAFT\n  SENT\n  PARTIALLY_FULFILLED\n  FULFILLED\n  CANCELLED\n}\n\nenum LpoLineStatus {\n  PENDING\n  PARTIAL\n  FULFILLED\n}\n\nenum PurchaseStatus {\n  DRAFT\n  COMMITTED\n}\n\nenum ExpenseAllocationMethod {\n  BY_VALUE\n  BY_QUANTITY\n}\n\nenum TransferStatus {\n  DRAFT\n  SENT\n  AWAITING_RECEIVER\n  RECEIVED\n  DISPUTED\n  REJECTED\n}\n\nenum SerialStatus {\n  IN_STOCK\n  SOLD\n  TRANSFERRED\n  RETURNED\n  SWAPPED_OUT\n  WRITTEN_OFF\n}\n\nenum TaxClass {\n  STANDARD\n  ZERO_RATED\n  EXEMPT\n}\n\nenum TaxSyncStatus {\n  NOT_APPLICABLE\n  QUEUED\n  SYNCED\n  FAILED\n}\n\nenum SessionStatus {\n  OPEN\n  CLOSED\n}\n\nenum CustomerTier {\n  BRONZE\n  SILVER\n  GOLD\n}\n\nenum LoyaltyTxType {\n  EARN\n  REDEEM\n  EXPIRE\n  ADJUST\n}\n\nenum DeductionType {\n  FIXED_AMOUNT\n  PERCENTAGE_OF_GROSS\n  BRACKET_TABLE\n  PERCENTAGE_OF_TAXABLE\n}\n\nenum SalaryRunStatus {\n  DRAFT\n  FINALIZED\n}\n\nenum AccountType {\n  ASSET\n  LIABILITY\n  EQUITY\n  REVENUE\n  EXPENSE\n}\n\nenum JournalRefType {\n  SALE\n  PURCHASE\n  EXPENSE\n  TRANSFER_DISPUTE\n  PAYROLL\n  CREDIT_NOTE\n  BANK_DEPOSIT\n  ADJUSTMENT\n}\n\nenum PaymentMethod {\n  CASH\n  MOBILE_MONEY\n  CARD\n  BANK_TRANSFER\n  LOYALTY_POINTS\n  CREDIT\n}\n\nenum NotificationType {\n  LOW_STOCK\n  NEGATIVE_STOCK\n  TRANSFER_RECEIVED\n  TRANSFER_DISPUTED\n  CREDIT_DUE\n  SYSTEM\n}\n\nmodel AuditLog {\n  id         String   @id @default(uuid())\n  action     String // 'sale.void' | 'sale.refund' | 'discount.override'\n  // 'price.edit' | 'stock.adjust' | 'user.role_change'\n  // 'payroll.access' | 'tax.config'\n  actorId    String // User who performed the action\n  actorRole  String // Role snapshot at time of action\n  approverId String? // Manager who approved (if PIN override used)\n  channelId  String?\n  targetType String? // 'sale' | 'item' | 'user' | 'transfer' | etc.\n  targetId   String?\n  oldValues  Json? // Snapshot before change\n  newValues  Json? // Snapshot after change\n  ipAddress  String?\n  createdAt  DateTime @default(now())\n\n  @@index([actorId])\n  @@index([channelId, createdAt])\n  @@index([action])\n  @@map(\"audit_logs\")\n}\n",
  "inlineSchemaHash": "48a54dd6eff4a7e8a1577142cb368052034572ba9fc72b458de14841b8b15b70",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Channel\":{\"dbName\":\"channels\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ChannelType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isMainWarehouse\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"featureFlags\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"accounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Account\",\"relationName\":\"AccountToChannel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankDeposits\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BankDeposit\",\"relationName\":\"BankDepositToChannel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expenses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Expense\",\"relationName\":\"ChannelToExpense\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inventory_balances\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"inventory_balances\",\"relationName\":\"ChannelToinventory_balances\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"journalEntries\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JournalEntry\",\"relationName\":\"ChannelToJournalEntry\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notifications\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Notification\",\"relationName\":\"ChannelToNotification\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseOrder\",\"relationName\":\"ChannelToPurchaseOrder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Purchase\",\"relationName\":\"ChannelToPurchase\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sales\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"ChannelToSale\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalesSession\",\"relationName\":\"ChannelToSalesSession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Serial\",\"relationName\":\"ChannelToSerial\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stockMovements\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StockMovement\",\"relationName\":\"ChannelToStockMovement\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transfersFrom\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transfer\",\"relationName\":\"FromChannel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transfersTo\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transfer\",\"relationName\":\"ToChannel\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ChannelToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserRole\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mfaSecret\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mfaEnabled\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastLoginAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalesSession\",\"relationName\":\"SalesSessionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StaffProfile\",\"relationName\":\"StaffProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToUser\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Account\":{\"dbName\":\"accounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AccountType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSystem\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"AccountToChannel\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Account\",\"relationName\":\"AccountHierarchy\",\"relationFromFields\":[\"parentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"children\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Account\",\"relationName\":\"AccountHierarchy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ledgerLines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LedgerLine\",\"relationName\":\"AccountToLedgerLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"JournalEntry\":{\"dbName\":\"journal_entries\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JournalRefType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToJournalEntry\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LedgerLine\",\"relationName\":\"JournalEntryToLedgerLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LedgerLine\":{\"dbName\":\"ledger_lines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"journalEntryId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accountId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"debitAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creditAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"memo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"account\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Account\",\"relationName\":\"AccountToLedgerLine\",\"relationFromFields\":[\"accountId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"journalEntry\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JournalEntry\",\"relationName\":\"JournalEntryToLedgerLine\",\"relationFromFields\":[\"journalEntryId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Brand\":{\"dbName\":\"brands\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"BrandToItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Category\":{\"dbName\":\"categories\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryHierarchy\",\"relationFromFields\":[\"parentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"children\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryHierarchy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"CategoryToItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Supplier\":{\"dbName\":\"suppliers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxPin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentTerms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToSupplier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseOrder\",\"relationName\":\"PurchaseOrderToSupplier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Purchase\",\"relationName\":\"PurchaseToSupplier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Item\":{\"dbName\":\"items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sku\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"barcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brandId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitOfMeasure\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"PCS\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retailPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wholesalePrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minRetailPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"weightedAvgCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reorderLevel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":10,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSerialized\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxClass\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaxClass\",\"default\":\"STANDARD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"inventory_balances\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"inventory_balances\",\"relationName\":\"ItemToinventory_balances\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brand\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brand\",\"relationName\":\"BrandToItem\",\"relationFromFields\":[\"brandId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryToItem\",\"relationFromFields\":[\"categoryId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Supplier\",\"relationName\":\"ItemToSupplier\",\"relationFromFields\":[\"supplierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lpoLines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LpoLine\",\"relationName\":\"ItemToLpoLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseLines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseLine\",\"relationName\":\"ItemToPurchaseLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaleItem\",\"relationName\":\"ItemToSaleItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Serial\",\"relationName\":\"ItemToSerial\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stockMovements\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StockMovement\",\"relationName\":\"ItemToStockMovement\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transferLines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransferLine\",\"relationName\":\"ItemToTransferLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StockMovement\":{\"dbName\":\"stock_movements\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"movementType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MovementType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantityChange\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitCostAtTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"performedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToStockMovement\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToStockMovement\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Serial\":{\"dbName\":\"serials\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serialNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SerialStatus\",\"default\":\"IN_STOCK\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToSerial\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToSerial\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sale\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"SaleToSerial\",\"relationFromFields\":[\"saleId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Sale\":{\"dbName\":\"sales\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiptNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SaleType\",\"default\":\"RETAIL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discountAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"netAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxSyncStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaxSyncStatus\",\"default\":\"NOT_APPLICABLE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"offlineReceiptNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"performedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"payments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"PaymentToSale\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaleItem\",\"relationName\":\"SaleToSaleItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToSale\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Customer\",\"relationName\":\"CustomerToSale\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalesSession\",\"relationName\":\"SaleToSalesSession\",\"relationFromFields\":[\"sessionId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serials\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Serial\",\"relationName\":\"SaleToSerial\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SaleItem\":{\"dbName\":\"sale_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serialId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minRetailPriceSnapshot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costPriceSnapshot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"markup\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lineTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discountAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToSaleItem\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sale\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"SaleToSaleItem\",\"relationFromFields\":[\"saleId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payment\":{\"dbName\":\"payments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PaymentStatus\",\"default\":\"CONFIRMED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"idempotencyKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sale\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"PaymentToSale\",\"relationFromFields\":[\"saleId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Customer\":{\"dbName\":\"customers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tier\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CustomerTier\",\"default\":\"BRONZE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loyaltyPoints\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creditLimit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outstandingCredit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"customerPayments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CustomerPayment\",\"relationName\":\"CustomerToCustomerPayment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"loyaltyTransactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoyaltyTransaction\",\"relationName\":\"CustomerToLoyaltyTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sales\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"CustomerToSale\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LoyaltyTransaction\":{\"dbName\":\"loyalty_transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LoyaltyTxType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"points\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Customer\",\"relationName\":\"CustomerToLoyaltyTransaction\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CustomerPayment\":{\"dbName\":\"customer_payments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"customer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Customer\",\"relationName\":\"CustomerToCustomerPayment\",\"relationFromFields\":[\"customerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SalesSession\":{\"dbName\":\"sales_sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SessionStatus\",\"default\":\"OPEN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openingFloat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingFloat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expectedFloat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"variance\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sales\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Sale\",\"relationName\":\"SaleToSalesSession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToSalesSession\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SalesSessionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PurchaseOrder\":{\"dbName\":\"purchase_orders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"LpoStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expectedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LpoLine\",\"relationName\":\"LpoLineToPurchaseOrder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToPurchaseOrder\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Supplier\",\"relationName\":\"PurchaseOrderToSupplier\",\"relationFromFields\":[\"supplierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Purchase\",\"relationName\":\"PurchaseToPurchaseOrder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LpoLine\":{\"dbName\":\"lpo_lines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedQty\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"LpoLineStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToLpoLine\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrder\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseOrder\",\"relationName\":\"LpoLineToPurchaseOrder\",\"relationFromFields\":[\"purchaseOrderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Purchase\":{\"dbName\":\"purchases\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrderId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PurchaseStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"landedCostTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"committedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"committedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"landedCosts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"LandedCost\",\"relationName\":\"LandedCostToPurchase\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseLine\",\"relationName\":\"PurchaseToPurchaseLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToPurchase\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseOrder\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PurchaseOrder\",\"relationName\":\"PurchaseToPurchaseOrder\",\"relationFromFields\":[\"purchaseOrderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supplier\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Supplier\",\"relationName\":\"PurchaseToSupplier\",\"relationFromFields\":[\"supplierId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PurchaseLine\":{\"dbName\":\"purchase_lines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lineTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToPurchaseLine\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchase\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Purchase\",\"relationName\":\"PurchaseToPurchaseLine\",\"relationFromFields\":[\"purchaseId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LandedCost\":{\"dbName\":\"landed_costs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allocationMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ExpenseAllocationMethod\",\"default\":\"BY_VALUE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchase\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Purchase\",\"relationName\":\"LandedCostToPurchase\",\"relationFromFields\":[\"purchaseId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Transfer\":{\"dbName\":\"transfers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transferNo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromChannelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toChannelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransferStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransferLine\",\"relationName\":\"TransferToTransferLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromChannel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"FromChannel\",\"relationFromFields\":[\"fromChannelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toChannel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ToChannel\",\"relationFromFields\":[\"toChannelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TransferLine\":{\"dbName\":\"transfer_lines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transferId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentQuantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receivedQuantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"disputeReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"item\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToTransferLine\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transfer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transfer\",\"relationName\":\"TransferToTransferLine\",\"relationFromFields\":[\"transferId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Expense\":{\"dbName\":\"expenses\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiptRef\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToExpense\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BankDeposit\":{\"dbName\":\"bank_deposits\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"BankDepositToChannel\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StaffProfile\":{\"dbName\":\"staff_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobTitle\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobLevelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"grossSalary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bankAccount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxPin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"hireDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"salaryRunLines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalaryRunLine\",\"relationName\":\"SalaryRunLineToStaffProfile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"StaffProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DeductionRule\":{\"dbName\":\"deduction_rules\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DeductionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPreTaxDeduction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minimumFloorAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maximumCapAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"calculationSequence\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":100,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isEmployerContribution\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isMandatory\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appliesToJobLevelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"brackets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DeductionBracket\",\"relationName\":\"DeductionBracketToDeductionRule\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DeductionBracket\":{\"dbName\":\"deduction_brackets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ruleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incomeFrom\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incomeTo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ratePercentage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fixedDeduction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveStartDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"effectiveEndDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rule\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DeductionRule\",\"relationName\":\"DeductionBracketToDeductionRule\",\"relationFromFields\":[\"ruleId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AllowanceRule\":{\"dbName\":\"allowance_rules\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DeductionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appliesToJobLevelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SalaryRun\":{\"dbName\":\"salary_runs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"month\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SalaryRunStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"runAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lines\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalaryRunLine\",\"relationName\":\"SalaryRunToSalaryRunLine\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"month\",\"year\",\"channelId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"month\",\"year\",\"channelId\"]}],\"isGenerated\":false},\"SalaryRunLine\":{\"dbName\":\"salary_run_lines\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"salaryRunId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffProfileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"grossSalary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowancesTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deductionsTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"netSalary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employerCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"breakdown\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"salaryRun\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SalaryRun\",\"relationName\":\"SalaryRunToSalaryRunLine\",\"relationFromFields\":[\"salaryRunId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"staffProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StaffProfile\",\"relationName\":\"SalaryRunLineToStaffProfile\",\"relationFromFields\":[\"staffProfileId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TaxConnectorConfig\":{\"dbName\":\"tax_connector_configs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"apiKey\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"apiSecret\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"settings\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DocumentTemplate\":{\"dbName\":\"document_templates\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Notification\":{\"dbName\":\"notifications\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NotificationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRead\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToNotification\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"IdempotencyRecord\":{\"dbName\":\"idempotency_records\",\"fields\":[{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responseBody\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Setting\":{\"dbName\":\"settings\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"updatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"inventory_balances\":{\"dbName\":null,\"fields\":[{\"name\":\"itemId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availableQty\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incomingQty\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastMovementAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channels\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Channel\",\"relationName\":\"ChannelToinventory_balances\",\"relationFromFields\":[\"channelId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Item\",\"relationName\":\"ItemToinventory_balances\",\"relationFromFields\":[\"itemId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"NoAction\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"itemId\",\"channelId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AuditLog\":{\"dbName\":\"audit_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorRole\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approverId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channelId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oldValues\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newValues\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"ChannelType\":{\"values\":[{\"name\":\"RETAIL_SHOP\",\"dbName\":null},{\"name\":\"WHOLESALE_SHOP\",\"dbName\":null},{\"name\":\"WAREHOUSE\",\"dbName\":null},{\"name\":\"ONLINE\",\"dbName\":null}],\"dbName\":null},\"UserRole\":{\"values\":[{\"name\":\"SUPER_ADMIN\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"MANAGER\",\"dbName\":null},{\"name\":\"CASHIER\",\"dbName\":null},{\"name\":\"STOREKEEPER\",\"dbName\":null},{\"name\":\"PROMOTER\",\"dbName\":null}],\"dbName\":null},\"MovementType\":{\"values\":[{\"name\":\"PURCHASE\",\"dbName\":null},{\"name\":\"SALE\",\"dbName\":null},{\"name\":\"TRANSFER_IN\",\"dbName\":null},{\"name\":\"TRANSFER_OUT\",\"dbName\":null},{\"name\":\"ADJUSTMENT_IN\",\"dbName\":null},{\"name\":\"ADJUSTMENT_OUT\",\"dbName\":null},{\"name\":\"RETURN\",\"dbName\":null},{\"name\":\"SWAP\",\"dbName\":null},{\"name\":\"WRITE_OFF\",\"dbName\":null},{\"name\":\"TRANSFER_IN_PENDING\",\"dbName\":null}],\"dbName\":null},\"SaleType\":{\"values\":[{\"name\":\"WHOLESALE\",\"dbName\":null},{\"name\":\"RETAIL\",\"dbName\":null},{\"name\":\"CREDIT\",\"dbName\":null},{\"name\":\"PRE_ORDER\",\"dbName\":null},{\"name\":\"LAYAWAY\",\"dbName\":null}],\"dbName\":null},\"PaymentStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"CONFIRMED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"LpoStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"PARTIALLY_FULFILLED\",\"dbName\":null},{\"name\":\"FULFILLED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"LpoLineStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PARTIAL\",\"dbName\":null},{\"name\":\"FULFILLED\",\"dbName\":null}],\"dbName\":null},\"PurchaseStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"COMMITTED\",\"dbName\":null}],\"dbName\":null},\"ExpenseAllocationMethod\":{\"values\":[{\"name\":\"BY_VALUE\",\"dbName\":null},{\"name\":\"BY_QUANTITY\",\"dbName\":null}],\"dbName\":null},\"TransferStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"AWAITING_RECEIVER\",\"dbName\":null},{\"name\":\"RECEIVED\",\"dbName\":null},{\"name\":\"DISPUTED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null},\"SerialStatus\":{\"values\":[{\"name\":\"IN_STOCK\",\"dbName\":null},{\"name\":\"SOLD\",\"dbName\":null},{\"name\":\"TRANSFERRED\",\"dbName\":null},{\"name\":\"RETURNED\",\"dbName\":null},{\"name\":\"SWAPPED_OUT\",\"dbName\":null},{\"name\":\"WRITTEN_OFF\",\"dbName\":null}],\"dbName\":null},\"TaxClass\":{\"values\":[{\"name\":\"STANDARD\",\"dbName\":null},{\"name\":\"ZERO_RATED\",\"dbName\":null},{\"name\":\"EXEMPT\",\"dbName\":null}],\"dbName\":null},\"TaxSyncStatus\":{\"values\":[{\"name\":\"NOT_APPLICABLE\",\"dbName\":null},{\"name\":\"QUEUED\",\"dbName\":null},{\"name\":\"SYNCED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":null},\"SessionStatus\":{\"values\":[{\"name\":\"OPEN\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null}],\"dbName\":null},\"CustomerTier\":{\"values\":[{\"name\":\"BRONZE\",\"dbName\":null},{\"name\":\"SILVER\",\"dbName\":null},{\"name\":\"GOLD\",\"dbName\":null}],\"dbName\":null},\"LoyaltyTxType\":{\"values\":[{\"name\":\"EARN\",\"dbName\":null},{\"name\":\"REDEEM\",\"dbName\":null},{\"name\":\"EXPIRE\",\"dbName\":null},{\"name\":\"ADJUST\",\"dbName\":null}],\"dbName\":null},\"DeductionType\":{\"values\":[{\"name\":\"FIXED_AMOUNT\",\"dbName\":null},{\"name\":\"PERCENTAGE_OF_GROSS\",\"dbName\":null},{\"name\":\"BRACKET_TABLE\",\"dbName\":null},{\"name\":\"PERCENTAGE_OF_TAXABLE\",\"dbName\":null}],\"dbName\":null},\"SalaryRunStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"FINALIZED\",\"dbName\":null}],\"dbName\":null},\"AccountType\":{\"values\":[{\"name\":\"ASSET\",\"dbName\":null},{\"name\":\"LIABILITY\",\"dbName\":null},{\"name\":\"EQUITY\",\"dbName\":null},{\"name\":\"REVENUE\",\"dbName\":null},{\"name\":\"EXPENSE\",\"dbName\":null}],\"dbName\":null},\"JournalRefType\":{\"values\":[{\"name\":\"SALE\",\"dbName\":null},{\"name\":\"PURCHASE\",\"dbName\":null},{\"name\":\"EXPENSE\",\"dbName\":null},{\"name\":\"TRANSFER_DISPUTE\",\"dbName\":null},{\"name\":\"PAYROLL\",\"dbName\":null},{\"name\":\"CREDIT_NOTE\",\"dbName\":null},{\"name\":\"BANK_DEPOSIT\",\"dbName\":null},{\"name\":\"ADJUSTMENT\",\"dbName\":null}],\"dbName\":null},\"PaymentMethod\":{\"values\":[{\"name\":\"CASH\",\"dbName\":null},{\"name\":\"MOBILE_MONEY\",\"dbName\":null},{\"name\":\"CARD\",\"dbName\":null},{\"name\":\"BANK_TRANSFER\",\"dbName\":null},{\"name\":\"LOYALTY_POINTS\",\"dbName\":null},{\"name\":\"CREDIT\",\"dbName\":null}],\"dbName\":null},\"NotificationType\":{\"values\":[{\"name\":\"LOW_STOCK\",\"dbName\":null},{\"name\":\"NEGATIVE_STOCK\",\"dbName\":null},{\"name\":\"TRANSFER_RECEIVED\",\"dbName\":null},{\"name\":\"TRANSFER_DISPUTED\",\"dbName\":null},{\"name\":\"CREDIT_DUE\",\"dbName\":null},{\"name\":\"SYSTEM\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

