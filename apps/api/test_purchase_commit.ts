import 'dotenv/config'
import { prisma } from './src/lib/prisma.js'
import { purchaseService } from './src/modules/purchases/purchase.service.js'

async function run() {
  console.log('Testing Purchase Commit with ROLLBACK...')
  try {
    // We hack the prisma client locally to always throw at the end of the transaction
    // Or we just call the service, but since the service uses prisma directly, we can't easily mock it unless we modify the code?
    // Wait, the easiest way to test it without modifying production is to just run the code that the service runs manually here inside our own transaction that we roll back!

    // We will simulate the exact transaction payload based on the user's screenshot
    const data = {
      supplierId: "123", // Doesn't matter, we will find a real one
      channelId: "456",  // Doesn't matter, find real one
      lines: [
        {
          itemId: "789", // Real item
          quantity: 20,
          unitCost: 18500,
          retailPrice: 45000,
          wholesalePrice: 3650
        }
      ],
      committedBy: "test-user-id"
    }

    // Get real IDs to make the test valid
    const channel = await prisma.channel.findFirst()
    const supplier = await prisma.supplier.findFirst()
    const item = await prisma.item.findFirst()

    if (!channel || !supplier || !item) {
       console.log("Missing DB data to run test.", { channel: !!channel, supplier: !!supplier, item: !!item })
       return
    }

    data.channelId = channel.id
    data.supplierId = supplier.id
    data.lines[0].itemId = item.id

    console.log("Found real IDs. Running simulation...")

    await prisma.$transaction(async (tx) => {
      console.log('1. Creating Purchase...')
      const uniqueSuffix = Math.random().toString(36).slice(2, 8).toUpperCase()
      const purchaseNo   = `PUR-${Date.now()}-${uniqueSuffix}`
      const totalCost = 20 * 18500
      
      const purchase = await tx.purchase.create({
        data: {
          purchaseNo,
          supplierId: data.supplierId,
          channelId: data.channelId,
          status: 'COMMITTED',
          totalCost,
          landedCostTotal: 0,
          committedBy: data.committedBy,
          committedAt: new Date(),
          lines: {
            create: data.lines.map(l => ({
              itemId: l.itemId,
              quantity: l.quantity,
              unitCost: l.unitCost,
              lineTotal: l.quantity * l.unitCost,
            })),
          },
        },
      })
      console.log('Purchase created:', purchase.id)

      console.log('2. Creating Stock Movement...')
      await tx.stockMovement.createMany({
        data: data.lines.map(line => ({
          itemId:         line.itemId,
          channelId:      data.channelId,
          movementType:   'PURCHASE',
          quantityChange: Number(line.quantity),
          unitCostAtTime: Number(line.unitCost),
          referenceId:    purchase.id,
          referenceType:  'purchase',
          notes:          'Purchase Receipt',
          performedBy:    data.committedBy,
        })),
      })
      console.log('Stock movement created.')

      console.log('3. Updating WAC and InventoryBalance...')
      const existingBalances = await tx.inventoryBalance.findMany({
        where: {
          channelId: data.channelId,
          itemId:    { in: data.lines.map(l => l.itemId) },
        },
      })
      const balanceMap = Object.fromEntries(existingBalances.map((b: any) => [b.itemId, b]))

      await Promise.all(data.lines.map(async line => {
        let allocatedLandedCost = 0
        const effectiveUnitCost = line.unitCost

        const balance               = balanceMap[line.itemId]
        const currentQty            = balance?.availableQty || 0
        const qtyBeforeThisPurchase = Math.max(0, currentQty - line.quantity)
        const oldWAC                = Number(balance?.weightedAvgCost || 0)

        const totalValueBefore      = qtyBeforeThisPurchase * oldWAC
        const totalValueAfter       = totalValueBefore + (line.quantity * effectiveUnitCost)
        const totalQtyAfter         = qtyBeforeThisPurchase + line.quantity
        const newWAC                = totalQtyAfter > 0 ? totalValueAfter / totalQtyAfter : effectiveUnitCost

        await tx.inventoryBalance.upsert({
          where:  { itemId_channelId: { itemId: line.itemId, channelId: data.channelId } },
          create: {
            itemId:          line.itemId,
            channelId:       data.channelId,
            weightedAvgCost: newWAC,
            retailPrice:     line.retailPrice    ?? 0,
            wholesalePrice:  line.wholesalePrice ?? 0,
          },
          update: {
            weightedAvgCost: newWAC,
            ...(line.retailPrice    !== undefined && { retailPrice:    line.retailPrice }),
            ...(line.wholesalePrice !== undefined && { wholesalePrice: line.wholesalePrice }),
          },
        })
      }))
      console.log('InventoryBalance upserted.')

      console.log('4. Building Journal Entry...')
      // We will copy the ledger logic verbatim here so we can test it exactly
      const isCashPayment = false
      const je = await tx.journalEntry.create({
        data: {
          description:   `Purchase ${purchase.purchaseNo}`,
          referenceId:   purchase.id,
          referenceType: 'PURCHASE',
          channelId:     purchase.channelId,
          postedBy:      data.committedBy,
        },
      })

      const creditAccountId = isCashPayment ? 'acc-1010' : 'acc-2000'

      await tx.ledgerLine.createMany({
        data: [
          { journalEntryId: je.id, accountId: 'acc-1500', debitAmount: totalCost, creditAmount: 0 },
          { journalEntryId: je.id, accountId: creditAccountId, debitAmount: 0, creditAmount: totalCost },
        ],
      })
      console.log('Journal Entry created.')

      console.log('5. Triggering intentional rollback to avoid mutating production db...')
      throw new Error("INTENTIONAL_ROLLBACK")
    })

  } catch (err: any) {
    if (err.message === "INTENTIONAL_ROLLBACK") {
       console.log("✅ SIMULATION SUCCESSFUL - No code threw an error before rollback.")
    } else {
       console.error("❌ CRASHED DURING SIMULATION. Prisma Error message:")
       console.error(err.message)
    }
  }
}

run()
