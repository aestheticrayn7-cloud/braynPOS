import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const receiptNo = 'RCP-20260317-0001'
  console.log(`Checking sale ${receiptNo}...`)

  const sale = await prisma.sale.findUnique({
    where: { receiptNo },
    include: {
      items: {
        include: {
          item: true
        }
      }
    }
  })

  if (!sale) {
    console.log('Sale not found.')
    return
  }

  for (const si of sale.items) {
    console.log(`Item: ${si.item.name} (${si.item.sku}). Qty Sold: ${si.quantity}`)
    
    const balance = await prisma.inventory_balances.findUnique({
      where: {
        itemId_channelId: {
          itemId: si.itemId,
          channelId: sale.channelId
        }
      }
    })
    console.log(`Current Balance in MB1: ${balance?.availableQty}`)

    const movements = await prisma.stockMovement.findMany({
      where: {
        itemId: si.itemId,
        channelId: sale.channelId,
        referenceId: sale.id
      }
    })
    console.log(`Movements for this sale: ${JSON.stringify(movements)}`)
  }
}

debug().catch(console.error).finally(() => prisma.$disconnect())
