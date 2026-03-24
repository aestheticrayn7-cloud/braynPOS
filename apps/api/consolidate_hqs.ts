import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const targetId = '605831cd-dc31-47c1-8b39-dcd8dd493de2' // Primary HQ (HQ2)
  const sourceIds = [
    '4979e2c6-d444-4860-9513-393282f1b4c9', // HQ1
    '609bd625-a1c1-47c1-8f39-dcd8dd493de2'  // HQ3
  ]

  console.log(`--- CONSOLIDATING HQS INTO ${targetId} ---`)

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
        // Find if target balance exists
        const targetBalance = await (tx as any).inventory_balances.findUnique({
          where: { itemId_channelId: { itemId: sb.itemId, channelId: targetId } }
        })

        if (targetBalance) {
          // Add quantities to target
          await (tx as any).inventory_balances.update({
            where: { id: targetBalance.id },
            data: {
              availableQty: targetBalance.availableQty + sb.availableQty,
              incomingQty: targetBalance.incomingQty + sb.incomingQty,
              // Pick the best price
              retailPrice: Math.max(Number(targetBalance.retailPrice), Number(sb.retailPrice)),
              wholesalePrice: Math.max(Number(targetBalance.wholesalePrice), Number(sb.wholesalePrice)),
            }
          })
          // Delete source balance
          await (tx as any).inventory_balances.delete({ where: { id: sb.id } })
        } else {
          // Simply move the balance row to the target channel
          await (tx as any).inventory_balances.update({
            where: { id: sb.id },
            data: { channelId: targetId }
          })
        }
      }
    }

    // 7. Update Expenses
    console.log('Updating Expenses...')
    await (tx as any).expense.updateMany({
      where: { channelId: { in: sourceIds } },
      data: { channelId: targetId }
    })

    // 8. Delete redundant channels
    console.log('Deleting redundant channels...')
    await tx.channel.deleteMany({
      where: { id: { in: sourceIds } }
    })
  })

  console.log('✅ Consolidation completed successfully.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
