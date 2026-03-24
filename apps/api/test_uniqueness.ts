import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- TESTING CHANNEL UNIQUENESS ---')
  try {
    await prisma.channel.create({
      data: { name: 'Test Duplicate', code: 'HQ', type: 'WAREHOUSE' }
    })
    console.log('❌ FAIL: Created duplicate HQ channel code!')
  } catch (err: any) {
    console.log('✅ PASS: Caught duplicate channel code:', err.message)
  }

  console.log('\n--- TESTING USER UNIQUENESS ---')
  try {
    await prisma.user.create({
      data: { username: 'chris', passwordHash: 'test', role: 'ADMIN', email: 'duplicate@test.com' }
    })
    console.log('❌ FAIL: Created duplicate username!')
  } catch (err: any) {
    console.log('✅ PASS: Caught duplicate username:', err.message)
  }

  console.log('\n--- TESTING ITEM SKU UNIQUENESS ---')
  try {
    await prisma.item.create({
      data: { sku: 'LP-GEN-001', name: 'Test Duplicate', retailPrice: 100, wholesalePrice: 80, minRetailPrice: 90 }
    })
    console.log('❌ FAIL: Created duplicate SKU!')
  } catch (err: any) {
    console.log('✅ PASS: Caught duplicate SKU:', err.message)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
