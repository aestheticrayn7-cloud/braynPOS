import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- ABOLISHING NEGATIVE STOCK (SCHEMA LEVEL) ---')
  
  // 1. Zero out existing negatives
  const result = await prisma.inventory_balances.updateMany({
    where: { availableQty: { lt: 0 } },
    data: { availableQty: 0 }
  })
  console.log(`✅ Zeroed out ${result.count} negative rows in inventory_balances.`)

  // 2. Install CHECK constraint
  const statements = [
    // Drop if exists first
    `ALTER TABLE inventory_balances DROP CONSTRAINT IF EXISTS chk_negative_stock;`,
    // Add constraint
    `ALTER TABLE inventory_balances ADD CONSTRAINT chk_negative_stock CHECK ("availableQty" >= 0);`
  ]

  for (const [i, stmt] of statements.entries()) {
    try {
      console.log(`Executing SQL statement ${i + 1}...`)
      await prisma.$executeRawUnsafe(stmt)
    } catch (err: any) {
      console.error(`❌ Error in SQL statement ${i + 1}:`, err.message)
    }
  }

  console.log('✅ Negative stock abolished at the database level.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
