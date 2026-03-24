import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const olivia = await prisma.user.findFirst({ where: { username: 'olivia' } })
  const targetId = olivia?.channelId
  if (!targetId) return console.log('Could not find target channel for Olivia')
  
  // Find all Headquarters channels EXCEPT Olivia's
  const hqs = await prisma.channel.findMany({
    where: { name: 'Headquarters', id: { not: targetId } }
  })
  const sourceIds = hqs.map(h => h.id)
  
  console.log(`Target: ${targetId} (Olivia's Active Channel)`)
  console.log(`Merging from: ${JSON.stringify(sourceIds)}`)

  if (sourceIds.length === 0) {
    console.log('No other HQs to merge.')
    return
  }

  await prisma.$transaction(async (tx) => {
    // 1. Move/Merge Balances
    const balances: any[] = await tx.$queryRawUnsafe(`SELECT * FROM inventory_balances WHERE "channelId" IN (${sourceIds.map(id => `'${id}'`).join(',')})`)
    for (const b of balances) {
      const exists: any[] = await tx.$queryRaw`SELECT * FROM inventory_balances WHERE "itemId" = ${b.itemId} AND "channelId" = ${targetId}`
      if (exists.length > 0) {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "availableQty" = "availableQty" + ${b.availableQty}, "incomingQty" = "incomingQty" + ${b.incomingQty} WHERE "itemId" = '${b.itemId}' AND "channelId" = '${targetId}'`)
        await tx.$executeRawUnsafe(`DELETE FROM inventory_balances WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      } else {
        await tx.$executeRawUnsafe(`UPDATE inventory_balances SET "channelId" = '${targetId}' WHERE "itemId" = '${b.itemId}' AND "channelId" = '${b.channelId}'`)
      }
    }
    
    // 2. Move StockMovements
    await tx.stockMovement.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })
    
    // 3. Move Purchases
    await tx.purchase.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })
    
    // 4. Move Sales
    await tx.sale.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })
    
    // 5. Transfer logic (complex, but for now just update source/target)
    await tx.transfer.updateMany({
       where: { fromChannelId: { in: sourceIds } },
       data: { fromChannelId: targetId }
    })
    await tx.transfer.updateMany({
       where: { toChannelId: { in: sourceIds } },
       data: { toChannelId: targetId }
    })

    // 6. Fix any OTHER users in those HQs
    await tx.user.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })
  })

  console.log('✅ Stock merged to active channel.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
