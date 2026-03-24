import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  
  // 1. Find all other channels
  const otherChannels = await prisma.channel.findMany({
    where: { id: { not: hqId } }
  })
  const otherIds = otherChannels.map(c => c.id)
  
  if (otherIds.length === 0) {
    console.log('No other channels to consolidate.')
    return
  }
  
  console.log(`Consolidating from ${otherIds.length} channels into HQ (${hqId})...`)

  await prisma.$transaction(async (tx) => {
    // A. Move Users
    await tx.user.updateMany({
      data: { channelId: hqId }
    })
    
    // B. Move ALL data in ALL tables that have channelId (except HQ)
    const tables: any[] = await tx.$queryRaw`SELECT table_name FROM information_schema.columns WHERE column_name = 'channelId' AND table_schema = 'public'`
    for (const { table_name } of tables) {
       if (table_name === 'inventory_balances' || table_name === 'channels') continue;
       console.log(`Updating ${table_name}...`)
       await tx.$executeRawUnsafe(`UPDATE "${table_name}" SET "channelId" = '${hqId}' WHERE "channelId" != '${hqId}'`)
    }

    // C. Special Merge for inventory_balances
    console.log('Merging balances...')
    const others = await tx.$queryRawUnsafe(`SELECT * FROM inventory_balances WHERE "channelId" != '${hqId}'`)
    for (const b of others as any[]) {
      const exists = await tx.$queryRaw`SELECT * FROM inventory_balances WHERE "itemId" = ${b.itemId} AND "channelId" = ${hqId}`
      if ((exists as any[]).length > 0) {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "availableQty" = "availableQty" + ${b.availableQty}, "incomingQty" = "incomingQty" + ${b.incomingQty} WHERE "itemId" = '${b.itemId}' AND "channelId" = '${hqId}'`)
        await tx.$executeRawUnsafe(`DELETE FROM inventory_balances WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      } else {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "channelId" = '${hqId}' WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      }
    }
  })

  console.log('✅ GLOBAL CONSOLIDATION COMPLETE.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
