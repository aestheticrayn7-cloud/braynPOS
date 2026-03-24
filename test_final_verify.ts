import { prisma } from './apps/api/src/lib/prisma.js'

async function testFinal() {
  console.log('Testing final raw query compatibility...')
  try {
    // This replicates the most problematic query in sales.service.ts
    const itemIds = ['b496be02-aff7-4148-b53a-0be5de051b0a'] 
    const channelId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'

    console.log('Running query with explicit ::text casts...')
    const result = await prisma.$queryRaw`
      SELECT "itemId", "availableQty"
      FROM   inventory_balances
      WHERE  "itemId"    = ANY(${itemIds}::text[])
        AND  "channelId" = ${channelId}::text
      FOR UPDATE
    `
    console.log('Query successful! Result:', result)

    console.log('Testing inventory_balances accessor...')
    const balance = await prisma.inventory_balances.findFirst({
      where: { itemId: itemIds[0], channelId }
    })
    console.log('Accessor successful! Balance:', balance)

  } catch (err) {
    console.error('Test failed:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testFinal()
