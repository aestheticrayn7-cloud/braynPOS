import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const targetId = '605831cd-dc31-47c1-8b39-dcd8dd493de2' // The one we want to keep
  
  // Get all IDs named Headquarters
  const hqs = await prisma.channel.findMany({
    where: { name: 'Headquarters' }
  })
  
  const sourceIds = hqs.map(h => h.id).filter(id => id !== targetId)
  
  console.log(`Target: ${targetId}`)
  console.log(`Sources to merge: ${JSON.stringify(sourceIds)}`)

  await prisma.$transaction(async (tx) => {
    // 1. Update Users
    console.log('Updating Users...')
    await tx.user.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })

    // 2. Update Purchases
    console.log('Updating Purchases...')
    await tx.purchase.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })

    // 3. Update Sales
    console.log('Updating Sales...')
    await tx.sale.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })

    // 4. Update Transfers
    console.log('Updating Transfers...')
    await tx.transfer.updateMany({
      where: { fromChannelId: { in: sourceIds } },
      data: { fromChannelId: targetId }
    })
    await tx.transfer.updateMany({
      where: { toChannelId: { in: sourceIds } },
      data: { toChannelId: targetId }
    })

    // 5. Update StockMovements
    console.log('Updating StockMovements...')
    await tx.stockMovement.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })

    // 6. Consolidate Inventory Balances
    console.log('Consolidating Inventory Balances...')
    for (const sourceId of sourceIds) {
      const sourceBalances = await (tx as any).inventory_balances.findMany({
        where: { channelId: sourceId }
      })

      for (const sb of sourceBalances) {
        const targetBalance = await (tx as any).inventory_balances.findUnique({
          where: { itemId_channelId: { itemId: sb.itemId, channelId: targetId } }
        })

        if (targetBalance) {
          await (tx as any).inventory_balances.update({
            where: { itemId_channelId: { itemId: sb.itemId, channelId: targetId } },
            data: {
              availableQty: targetBalance.availableQty + sb.availableQty,
              incomingQty: targetBalance.incomingQty + sb.incomingQty,
            }
          })
          await (tx as any).inventory_balances.delete({ 
            where: { itemId_channelId: { itemId: sb.itemId, channelId: sourceId } } 
          })
        } else {
          // Change channelId of the row
          // Since we can't update a PK field directly in findUnique, we must delete and create or use raw SQL
          await (tx as any).inventory_balances.delete({ 
            where: { itemId_channelId: { itemId: sb.itemId, channelId: sourceId } } 
          })
          await (tx as any).inventory_balances.create({
            data: {
              itemId: sb.itemId,
              channelId: targetId,
              availableQty: sb.availableQty,
              incomingQty: sb.incomingQty,
              retailPrice: sb.retailPrice,
              wholesalePrice: sb.wholesalePrice,
              lastMovementAt: sb.lastMovementAt,
            }
          })
        }
      }
    }

    // 7. Delete redundant channels
    console.log('Deleting redundant channels...')
    await tx.channel.deleteMany({
      where: { id: { in: sourceIds } }
    })
  })

  console.log('✅ ALL Headquarters consolidated.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
