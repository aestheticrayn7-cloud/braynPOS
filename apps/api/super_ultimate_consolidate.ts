import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const targetId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  
  const hqs: any[] = await prisma.$queryRaw`SELECT id FROM channels WHERE name = 'Headquarters' AND id != ${targetId}`
  const sourceIds = hqs.map(h => h.id)
  
  if (sourceIds.length === 0) {
    console.log('No duplicate HQs found to merge.')
    return
  }
  
  console.log(`Consolidating ${sourceIds.length} HQs into ${targetId}`)

  await prisma.$transaction(async (tx) => {
    // Identify all tables with a channelId column
    const tables: any[] = await tx.$queryRaw`
      SELECT table_name 
      FROM information_schema.columns 
      WHERE column_name = 'channelId' 
      AND table_schema = 'public'
    `
    
    // 1. Bulk Update for standard foreign keys
    for (const { table_name } of tables) {
      if (table_name === 'inventory_balances') continue; // Handle separately due to compound PK
      
      console.log(`Updating table: ${table_name}...`)
      const sql = `UPDATE "${table_name}" SET "channelId" = '${targetId}' WHERE "channelId" IN (${sourceIds.map(id => `'${id}'`).join(',')})`
      await tx.$executeRawUnsafe(sql)
    }
    
    // 2. Specialized Update for inventory_balances (Compound PK)
    console.log('Consolidating inventory_balances...')
    const balances: any[] = await tx.$queryRawUnsafe(`SELECT * FROM inventory_balances WHERE "channelId" IN (${sourceIds.map(id => `'${id}'`).join(',')})`)
    
    for (const b of balances) {
      const exists: any[] = await tx.$queryRaw`SELECT * FROM inventory_balances WHERE "itemId" = ${b.itemId} AND "channelId" = ${targetId}`
      
      if (exists.length > 0) {
        // Merge qty
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "availableQty" = "availableQty" + ${b.availableQty}, "incomingQty" = "incomingQty" + ${b.incomingQty} WHERE "itemId" = '${b.itemId}' AND "channelId" = '${targetId}'`)
        // Delete source
        await tx.$executeRawUnsafe(`DELETE FROM inventory_balances WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      } else {
        // Move row (delete + insert to avoid PK constraint during move if needed, but update is cleaner if unique)
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "channelId" = '${targetId}' WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      }
    }

    // 3. Delete redundant channels
    console.log('Deleting redundant channels...')
    await tx.$executeRawUnsafe(`DELETE FROM channels WHERE id IN (${sourceIds.map(id => `'${id}'`).join(',')})`)
  })

  console.log('✅ SUPER ULTIMATE consolidation completed.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
