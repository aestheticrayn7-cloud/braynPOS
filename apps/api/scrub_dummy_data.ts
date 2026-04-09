import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Scrubbing dummy seed data from database...')

  const dummyIds = [
    'c0a80101-0000-4000-8000-000000000001', // Category
    'c0a80101-0000-4000-8000-000000000002', // Laptop
    'c0a80101-0000-4000-8000-000000000003', // Mouse
    'c0a80101-0000-4000-8000-000000000004', // Session
  ]

  // Delete inventory balances first
  const balances = await (prisma as any).inventoryBalance.deleteMany({
    where: { itemId: { in: dummyIds } }
  })
  console.log(`  ✓ Removed ${balances.count} dummy inventory balances.`)

  // Delete items
  const items = await prisma.item.deleteMany({
    where: { id: { in: dummyIds } }
  })
  console.log(`  ✓ Removed ${items.count} dummy items.`)

  // Delete Category
  const cats = await prisma.category.deleteMany({
    where: { id: { in: dummyIds } }
  })
  console.log(`  ✓ Removed ${cats.count} dummy categories.`)

  // Delete Session
  const sess = await prisma.salesSession.deleteMany({
    where: { id: { in: dummyIds } }
  })
  console.log(`  ✓ Removed ${sess.count} dummy sessions.`)

  console.log('✅ Scrubbing complete. Database is clean of test artifacts.')
}

main()
  .catch((e) => {
    console.error('❌ Scrub failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
