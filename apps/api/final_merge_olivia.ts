import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const fromId = '609bd625-a121-47c1-8f39-dcd8dd493de2' // Olivia's current channel
  const toId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'   // Primary HQ
  
  console.log(`--- MERGING ${fromId} INTO ${toId} ---`)

  await prisma.$transaction(async (tx) => {
    // 1. Move Users
    await tx.user.updateMany({
      where: { channelId: fromId },
      data: { channelId: toId }
    })
    
    // 2. Move Stock (Balances)
    const balances: any[] = await tx.$queryRawUnsafe(`SELECT * FROM inventory_balances WHERE "channelId" = '${fromId}'`)
    for (const b of balances) {
      const exists: any[] = await tx.$queryRaw`SELECT * FROM inventory_balances WHERE "itemId" = ${b.itemId} AND "channelId" = ${toId}`
      if (exists.length > 0) {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "availableQty" = "availableQty" + ${b.availableQty}, "incomingQty" = "incomingQty" + ${b.incomingQty} WHERE "itemId" = '${b.itemId}' AND "channelId" = '${toId}'`)
        await tx.$executeRawUnsafe(`DELETE FROM inventory_balances WHERE "itemId" = '${b.itemId}' AND "channelId" = '${fromId}'`)
      } else {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "channelId" = '${toId}' WHERE "itemId" = '${b.itemId}' AND "channelId" = '${fromId}'`)
      }
    }
    
    // 3. Move other critical records to primary ID IF necessary, but for now just move the user and stock
    // to avoid FK issues with delete for a moment.
    
    // Actually, I'll update EVERY table that references it to avoid P2003
    const tables: any[] = await tx.$queryRaw`SELECT table_name FROM information_schema.columns WHERE column_name = 'channelId' AND table_schema = 'public'`
    for (const { table_name } of tables) {
       if (table_name === 'inventory_balances' || table_name === 'channels') continue;
       await tx.$executeRawUnsafe(`UPDATE "${table_name}" SET "channelId" = '${toId}' WHERE "channelId" = '${fromId}'`)
    }
  })
  
  // 4. Finally Delete the channel outside transaction or inside if safe
  try {
     await prisma.channel.delete({ where: { id: fromId } })
     console.log('✅ Redundant channel deleted.')
  } catch (err) {
     console.log('⚠️ Could not delete channel (some FKs might still exist), but data is merged.')
  }

  console.log('✅ SUCCESS: Olivia and stock merged to Primary HQ.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
