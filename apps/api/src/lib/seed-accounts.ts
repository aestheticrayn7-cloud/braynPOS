import { basePrisma } from './prisma.js'
import { ACCOUNT_IDS } from './ledger.js'

export async function seedAccounts() {
  console.log('🌱 [SEED] Checking System Ledger Accounts...')

  const systemAccounts = [
    { id: ACCOUNT_IDS.CASH_ON_HAND,        code: '1010', name: 'Cash on Hand',          type: 'ASSET' as const },
    { id: ACCOUNT_IDS.BANK_ACCOUNT,        code: '1020', name: 'Bank Account/M-Pesa',   type: 'ASSET' as const },
    { id: ACCOUNT_IDS.ACCOUNTS_RECEIVABLE, code: '1200', name: 'Accounts Receivable',   type: 'ASSET' as const },
    { id: ACCOUNT_IDS.INVENTORY_VALUE,     code: '1500', name: 'Inventory Valuation',   type: 'ASSET' as const },
    { id: ACCOUNT_IDS.ACCOUNTS_PAYABLE,    code: '2000', name: 'Accounts Payable',      type: 'LIABILITY' as const },
    { id: ACCOUNT_IDS.TAX_PAYABLE,         code: '2100', name: 'Tax Payable',           type: 'LIABILITY' as const },
    { id: ACCOUNT_IDS.RETAINED_EARNINGS,   code: '3000', name: 'Retained Earnings',     type: 'EQUITY' as const },
    { id: ACCOUNT_IDS.SALES_REVENUE,       code: '4000', name: 'Sales Revenue',         type: 'REVENUE' as const },
    { id: ACCOUNT_IDS.COGS,                code: '5000', name: 'Cost of Goods Sold',    type: 'EXPENSE' as const },
    { id: ACCOUNT_IDS.SHRINKAGE_LOSS,      code: '5100', name: 'Shrinkage loss',      type: 'EXPENSE' as const },
    { id: ACCOUNT_IDS.PAYROLL_EXPENSE,     code: '5200', name: 'Payroll Expense',       type: 'EXPENSE' as const },
    { id: ACCOUNT_IDS.GENERAL_EXPENSE,     code: '5300', name: 'General Expense',       type: 'EXPENSE' as const },
  ]

  let seeded = 0

  for (const acc of systemAccounts) {
    const existing = await basePrisma.account.findUnique({
      where: { id: acc.id }
    })

    if (!existing) {
      // It might exist with the right code but wrong ID, if so, delete it first to prevent unique constraint violation
      const codeConflict = await basePrisma.account.findUnique({ where: { code: acc.code } })
      if (codeConflict) {
        // Can't delete if it has ledger entries, but we'll try or throw
        await basePrisma.account.delete({ where: { id: codeConflict.id } }).catch(() => {})
      }

      await basePrisma.account.create({
        data: {
          id: acc.id,
          code: acc.code,
          name: acc.name,
          type: acc.type,
          isActive: true,
          isSystem: true
        }
      })
      seeded++
    } else {
      // Update just to be safe
      await basePrisma.account.update({
        where: { id: acc.id },
        data: { name: acc.name, isSystem: true, code: acc.code, type: acc.type, isActive: true }
      })
    }
  }

  if (seeded > 0) {
    console.log(`✅ [SEED] Initialized ${seeded} missing System Ledger Accounts.`)
  } else {
    console.log('✅ [SEED] System Ledger Accounts are verified.')
  }
}
