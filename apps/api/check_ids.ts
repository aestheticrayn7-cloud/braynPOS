import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPurchaseLines() {
  const purchaseNo = 'PUR-1773854190903'
  const purchase = await prisma.purchase.findUnique({
    where: { purchaseNo },
    include: { lines: true }
  })

  if (!purchase) {
    console.log('Purchase not found')
    return
  }

  console.log('PURCHASE_ID:', purchase.id)
  for (const line of purchase.lines) {
    console.log('LINE_ITEM_ID:', line.itemId)
    const item = await prisma.item.findUnique({ where: { id: line.itemId } })
    console.log('ITEM_NAME:', item?.name)
    console.log('ITEM_SKU:', item?.sku)
  }

  const microwave = await prisma.item.findFirst({ where: { name: { contains: 'microwave', mode: 'insensitive' } } })
  console.log('ACTUAL_MICROWAVE_ID:', microwave?.id)
}

checkPurchaseLines().finally(() => prisma.$disconnect())
