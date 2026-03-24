
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
